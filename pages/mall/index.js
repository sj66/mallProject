// pages/mall/index.js
//获取应用实例
const app = getApp()
let that,token='',last_id=0,is_login=false;
Page({
  data: {
    slide_list: [],
    list: [],
    openid:'',
    loading_status:true,
    car_num:1,
    // 倒计时
    time: 30 * 60 * 60 * 1000,
  },
  onLoad: function () {
    that=this;
    last_id=0;
    that.getSlide();
    that.getData();
    // wx.navigateTo({
    //     url: '/pages/pay/index?orderno='+'20200601495799565&price='+'0.01'
    // });
    // console.log(wx.getAccountInfoSync());
    // console.log('2.10.2'.replace('.','').replace('.',''))
    var v=wx.getAccountInfoSync().miniProgram.version.replace('.','').replace('.','');
    if(v<1011){
      wx.removeStorage({
        key: 'car',
        success (res) {
          console.log(res)
        }
      })
    }
  },
  onShow(){
    try {
      token=wx.getStorageSync('token')
      if(token){
        if(!is_login){
          wx.pageScrollTo({
            scrollTop: 0,
            duration: 0
          })
          is_login=true;
          last_id=0;
          that.getData();
        }
      }else{
        if(is_login){
          wx.pageScrollTo({
            scrollTop: 0,
            duration: 0
          })
          is_login=false;
          last_id=0;
          that.getData();
        }
      }
    } catch (e) { }
    
  },
  getSlide:()=>{
    app.axios(app.globalData.apiBaseUrl+'slide.php', {cate_id:1},'POST').then(res => {
      let res_data=res.data;
        // console.log(res_data)
        if(res_data.status==1){
          that.setData({
            slide_list: res_data.items
          });
        }else{
          app.dialog.tip({msg: res_data.info});
        }
    });
  },
  getData:()=>{
    if(that.data.loading_status){
      app.dialog.loding({msg: '加载中...'});
    }
    app.axios(app.globalData.apiBaseUrl+'index_goods_list.php', {last_id:last_id},'POST').then(res => {
      wx.stopPullDownRefresh();
      app.dialog.loding_close();
      let res_data=res.data;
        // console.log(res_data)
        if(res_data.status==1){
          let list=res_data.items;
          list.forEach((item)=>{
            if (!item.promote.content || !item.promote.end_time) {
              return;
            }
            item.promote.content=item.promote.content;
            item.promote.end_time=new Date(item.promote.end_time.replace(/\-/g, "/")).getTime()-new Date().getTime();
            item.qty=parseFloat(item.qty).toFixed(0);
          })
          if(res_data.items){
            for(var i=0;i<res_data.items.length;i++){
              if(res_data.items[i].user_status==2&&res_data.items[i].retail_price>0){
                res_data.items[i].price_ratio=((res_data.items[i].retail_price-res_data.items[i].price) / res_data.items[i].retail_price *100).toFixed(0);
                res_data.items[i].retail_price=parseFloat(res_data.items[i].retail_price).toFixed(1);
              }
            }
            var lists=that.data.list;
            if(!that.data.loading_status){
              for(var i=0;i<res_data.items.length;i++){
                lists.push(res_data.items[i]);
              }
            }else{
              lists=res_data.items;
            }
            that.setData({
              list: lists,
              loading_status:true
            });
            last_id=res_data.items[res_data.items.length-1].id;
            // console.log(last_id);
          }else{
            app.dialog.tip({msg: '更多商品请使用搜索'});
            if(!that.data.loading_status){
              that.setData({
                loading_status:true
              });
            }
          }
        }else{
          app.dialog.tip({msg: res_data.info});
          if(!that.data.loading_status){
            that.setData({
              loading_status:true
            });
          }
        }
    });
  },
  goDetail: function(e) {
    // console.log(e)
    wx.navigateTo({
      url: '/pages/goods_detail/index?goods_id='+e.currentTarget.dataset.gid+'&qty='+e.currentTarget.dataset.qty
    })
  },
  goCar: function() {
    // console.log(e)
    wx.navigateTo({
      url: '/pages/shop_car/index'
    })
  },
  openSearch(){
    wx.navigateTo({
        url: '/pages/search/index'
    });
  },
  scanHandle(){
    wx.scanCode({
        success: function (res) {
            // console.log('条码类型：' + res.scanType);
            // console.log('条码内容：' + res.result);
        if(res.result){
          wx.navigateTo({
            url:"/pages/search/index?val="+res.result
          });
        }
        }
    });
  },
  onPullDownRefresh(){
    last_id=0;
    that.getSlide();
    that.getData();
  },
  onReachBottom(){
    this.setData({
      loading_status:false
    });
    that.getData();
  },
  onShareAppMessage(res) {
    // if (res.from === 'button') {
    //   // 来自页面内转发按钮
    //   console.log(res.target)
    // }
    // return {
    //   path: '/pages/goods_detail/index?is_share=1&goods_id='+goods_id
    // }
  },
  onShareTimeline(){
    
  },
    // 下单
    showPopup(e){
      if(e.currentTarget.dataset.qty==0){
        wx.showToast({
          title: '此商品无货，去挑选其他？',
          icon: 'none',
          duration: 2000
        })
        return
      }
      var data=that.data.list;
      var index = e.currentTarget.dataset.index
      console.log('商品信息',that.data.list,e.currentTarget.dataset.index)
      this.setData({
        order:data[index],
        show:true,
        car_num:1
      })
    },
    closePopup(){
      this.setData({
        show:false
      })
    },
    numChange(val){
      // that.data.car_num=val.detail;
      that.setData({
        car_num:val.detail
      })
      if(that.data.car_num>that.data.order.qty){
        let qty=parseFloat(that.data.order.qty).toFixed(0);
        that.data.car_num=qty
      }
    },
    addToCar(){
      console.log('加入购物车',that.data.car_num,that)
      if(!that.data.car_num){
        // that.data.car_num=1;
        return
      }
      try{
        var car=wx.getStorageSync('car')||{};
        if (!car[that.data.order.goods_id]) {
          car[that.data.order.goods_id] = that.data.car_num;
        } else {
          car[that.data.order.goods_id] += parseInt(car[that.data.order.goods_id])+parseInt(that.data.car_num);
        }
        wx.setStorageSync('car',car);
        that.closePopup();
      }catch(e){
        //TODO handle the exception
      }
    },
    goBuy() {
      if(!that.data.car_num){
        return;
        // that.data.car_num=1;
      }
      that.closePopup();
      wx.navigateTo({
          url: '/pages/order/index?order_ids='+that.data.order.goods_id+'&goods_num='+that.data.car_num
      });
    },
})