// pages/search/index.js
const app = getApp()
let that,token='',car,search_token,p
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchVal: '',
    search_list:[],
    list:[],
    filter_list:[],
    goods_data:{},
    car_num:1,
    is_recommend:true,
    isLogin:false,
    defailt_focus:true,
    is_auth_sub:0,
    loading_status:true,
    // 倒计时
    // countDownDay: '',
    // countDownHour: '',
    // countDownMinute: '',
    // countDownSecond: '',
    time: 30 * 60 * 60 * 1000,
    // 有货  无货
    stockSort:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
    if(options.val){
      this.setData({
        searchVal:options.val,
        defailt_focus:false
      }, () => {
        this.search();
        })
      // wx.nextTick(() => {
        
      // })
    }
    search_token=Date.parse(new Date())/1000;
    // console.log(search_token);
    p=1;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    try{
      var isLogin=false;
      car=wx.getStorageSync('car')||{};
      var token=wx.getStorageSync('token');
      if(token){
        isLogin=true;
      }
      var search_list=wx.getStorageSync('search_list');
      if(search_list){
        search_list=JSON.parse(search_list);
        search_list.reverse();
        this.setData({
          search_list:search_list,
          isLogin:isLogin
        })
      }else{
        this.setData({
          isLogin:isLogin
        })
      }
    }catch(e){
      console.log(e);
    }
    setTimeout(()=>{
      that.setData({
        defailt_focus:false
      })
    },500);
  },
  goCar: function() {
    // console.log(e)
    wx.navigateTo({
      url: '/pages/shop_car/index'
    })
  },
  search() {
    if(this.data.searchVal.length>0){
      if(this.data.search_list.indexOf(this.data.searchVal)==-1){
        var search_list=this.data.search_list;
        if(search_list.length>8){
          search_list.splice(9);
        }
        search_list.reverse();
        search_list.push(this.data.searchVal);
        var search_list_txt=JSON.stringify(that.data.search_list);
        search_list.reverse();
        this.setData({
          search_list:search_list
        },()=>{
          try{
            wx.setStorageSync('search_list',search_list_txt);
          }catch(e){
            //TODO handle the exception
          }	
        })
      }
    }else{
      app.dialog.tip({msg:'没有查询结果'});
      return false;
    }
    app.dialog.loding({msg: '搜索中...'});
    app.axios(app.globalData.apiBaseUrl+'search.php', {value: this.data.searchVal,search_token:search_token,p:p},'POST').then(res => {
      app.dialog.loding_close();
      var data=res.data;
      // slide_status=true;
      // that.closeLoading();
      if(data.status===1){
        console.log("res.items",res);
        let list=res.data.items;
        list.forEach((item)=>{
          if (!item.promote||!item.promote.content || !item.promote.end_time) {
            return;
          }
          item.promote.content=item.promote.content;
          item.promote.end_time=new Date(item.promote.end_time.replace(/\-/g, "/")).getTime()-new Date().getTime();
          item.qty=parseFloat(item.qty).toFixed(0);
        })
        if(data.items.length==0){
          if(p==1){
            that.setData({
              is_auth_sub:data.is_auth_sub,
              list:[],
              loading_status:true
            });
            app.dialog.tip({msg:'没有查询结果'});
          }else{
            that.setData({
              is_auth_sub:data.is_auth_sub,
              loading_status:true
            });
            app.dialog.tip({msg:'没有更多结果'});
          }
        }else{
          for(var i=0;i<data.items.length;i++){
            if(data.items[i].user_status==2&&data.items[i].retail_price>0){
              data.items[i].price_ratio=((data.items[i].retail_price-data.items[i].price) / data.items[i].retail_price *100).toFixed(0);
              data.items[i].retail_price=parseFloat(data.items[i].retail_price).toFixed(1);
            }
          }
          var lists=that.data.list;
          if(!that.data.loading_status){
            for(var i=0;i<data.items.length;i++){
              lists.push(data.items[i]);
            }
          }else{
            lists=data.items;
          }
          that.setData({
            is_auth_sub:data.is_auth_sub,
            is_recommend:false,
            list:lists,
            loading_status:true
          });
          wx.hideKeyboard();
          p++;
        }
      }else{
        app.dialog.tip({msg: data.info});
        if(!that.data.loading_status){
          that.setData({
            loading_status:true
          });
        }
      }
    });
  },
  onStock(){
    // let stockList=[];
    // let list=this.data.list;
    // let stockSort=this.data.stockSort;
    // this.setData({
    //   stockSort:!stockSort
    // })
    // if(stockSort){
    //   stockList=list.
    // }
  },
  input(res) {
    this.setData({
      searchVal : res.detail.value
    })
  },
  clear() {
    this.setData({
      searchVal : ''
    })
  },
  cancel() {
    wx.navigateBack();
  },
  goDetail(e){
    // this.goAuth();
    // if(item.user_status!=2){
    //   return false;
    // }
    wx.navigateTo({
      url: '/pages/goods_detail/index?goods_id='+e.currentTarget.dataset.gid+'&qty='+e.currentTarget.dataset.qty
    });
  },
  // openAddToCar(index){
  //   if(that.list[index].user_status!=2){
  //     return false;
  //   }
  //   this.goods_data=that.list[index];
  //   let price_data=that.goods_data.price.split(".");
  //   that.goods_data.priceLeft=price_data[0];
  //   that.goods_data.priceRight=price_data[1];
  //   that.car_num = 1;
  //   if (!car[that.goods_data.id]) {
  //     that.car_num = 1;
  //   } else {
  //     that.car_num = car[that.goods_data.id];
  //   }
  //   // this.$refs.popup.open();
  // },
  // 凑单
  onMark(){
    wx.navigateTo({
      url: '/pages/handsel_list/index'
    })
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
    if(e.currentTarget.dataset.price==0){
      wx.showToast({
        title: '此商品尚未定价，去挑选其他？',
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
      show:true
    })
  },
  closePopup(){
    this.setData({
      show:false
    })
  },
  numChange(val){
    console.log('val',val.detail)
    // that.car_num = 1;
    that.car_num=val.detail;
  },
  addToCar(){
    console.log('加入购物车',that.car_num,that)
    if(!that.car_num){
      that.car_num=1;
    }
    try{
      var car=wx.getStorageSync('car')||{};
      if (!car[that.data.order.gid]) {
        car[that.data.order.gid] = that.car_num;
      } else {
        car[that.data.order.gid] += parseInt(car[that.data.order.gid])+parseInt(that.car_num);
      }
      wx.setStorageSync('car',car);
      that.closePopup();
    }catch(e){
      //TODO handle the exception
    }
  },
  goBuy() {
    if(!that.car_num){
      that.car_num=1;
    }
    wx.navigateTo({
        url: '/pages/order/index?order_ids='+that.data.order.gid+'&goods_num='+that.car_num
    });
  },
  goAuth(){
    if(!that.isLogin){
      return false;
    }
    if(this.is_auth_sub!=1){
      app.dialog.confirm({title:'操作提示',content:'您还未提交资质文件，是否跳转提交？',cancelCallback:function(){},confirmCallback:function(){
        wx.navigateTo({
          url:"/pages/authentication/index"
        });
      }});
    }
  },
  search_focus(){
    this.setData({
      is_recommend:true
    })
  },
  onStock(e){
    console.log('000000000',e)
  },
  delAllSearch(){
    this.setData({
      search_list:[]
    })
    try{
      wx.removeStorageSync('search_list');
    }catch(e){
      //TODO handle the exception
    }
  },
  delSearch(index){
    var search_list=this.data.search_list;
    search_list.splice(index,1);
    this.setData({
      search_list:search_list
    });
    try{
      wx.setStorageSync('search_list',JSON.stringify(search_list));
    }catch(e){
      //TODO handle the exception
    }
  },
  sub_search(){
    p=1;
    that.search();
  },
  search_val(e){
    this.setData({
      searchVal:this.data.search_list[e.currentTarget.dataset.i]
    },()=>{
      p=1;
      that.search();
    });
  },
  onReachBottom(){
    this.setData({
      loading_status:false
    });
    that.search();
  },
  // // 倒计时
  // countdown() {
  //     if (!this.data.data.sales_info || !this.data.data.count_down) {
  //        return;
  //     }
  //     var data =this.data.data.count_down;
  //     data = data.replace(/\-/g, "/");
  //     var total_micro_second = parseInt(new Date(data).getTime() - new Date().getTime());
  //     // 渲染倒计时时钟
  //     this.setData({
  //       countDownDay: this.dateformaDay(total_micro_second),
  //       countDownHour: this.dateformaHour(total_micro_second),
  //       countDownMinute: this.dateformaMinute(total_micro_second),
  //       countDownSecond: this.dateformaSecondMinute(total_micro_second),
  //     },()=>{
  //     if(total_micro_second<0){
  //       this.setData({
  //         opacity:0,
  //         clock :'00天00时00分00秒'
  //       })
  //       return;
  //     }
  //     setTimeout(()=> {
  //       total_micro_second -= 1000;
  //       this.countdown();
  //     }, 1000)
  //   })
  // },
  // // 时间格式化输出
  // dateformaDay(micro_second) {
  //   // 总秒数
  //   var second = Math.floor(micro_second / 1000);
  //   // 天数
  //   var day = Math.floor(second / 3600 / 24);
  //   if(day<10){
  //     day='0'+day
  //   }
  //   return day;
  // },
  // dateformaHour(micro_second) {
  //   // 总秒数
  //   var second = Math.floor(micro_second / 1000);
  //   // 小时
  //   var hr = Math.floor(second / 3600 % 24);
  //   if(hr<10){
  //     hr='0'+hr
  //   }
  //   return hr;
  // },
  // dateformaMinute(micro_second) {
  //   // 总秒数
  //   var second = Math.floor(micro_second / 1000);
  //   // 分钟
  //   var min = Math.floor(second / 60 % 60);
  //   if(min<10){
  //     min='0'+min;
  //   }
  //   return min;
  // },
  // dateformaSecondMinute(micro_second) {
  //   // 总秒数
  //   var second = Math.floor(micro_second / 1000);
  //   // 秒
  //   var sec = Math.floor(second % 60);
  //   if(sec<10){
  //     sec='0'+sec
  //   }
  //   return sec;
  // },
})