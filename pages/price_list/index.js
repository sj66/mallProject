// pages/price_list/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    car_num:1,
    user_status:0,
    list: [],
    // 倒计时
    time: 30 * 60 * 60 * 1000,
    // 列表展开收缩
    showMore: false,
    goodsInfo:'',
    id:'',
  },
  onLoad:function(options){ 
    console.log('options',options)
    var that = this;
    that.setData( {
      goodsInfo:options.content,
      id:options.id,
      windowHeight: wx.getStorageSync( 'windowHeight' )
    })
    wx.getSystemInfo({ 
        success: function (res) { 
            that.setData({ 
                clientHeight: res.windowHeight 
            }); 
        } 
    }) 
    that.getData();
  },
  getData:function(){ 
    var token = wx.getStorageSync('token')
    var that = this; 
    console.log('id',that.data,that.data.id)
    wx.request({
      url: 'https://jzh.hulukeji.cn/api/wx_app/promote_detail.php', //接口地址
      data: {
        id:that.data.id,
      },
      header: {
        'content-type': 'application/json', // 对数据进行 JSON 序列化
        'X-Token': token
      },
      method:'POST',
      success (res) {
        if(res.data.status === 1){
          let data = res.data.data;
          let endTime=new Date(res.data.data.end_time.replace(/\-/g, "/")).getTime()-new Date().getTime();
          console.log('res.data.items',res)
          if(!res.data.items){
            return;
          }
          let list = res.data.items;
          list.forEach((item)=>{
            item.qty=parseFloat(item.qty).toFixed(0);
            console.log('item.qty',item.qty)
          })
          that.setData({
            list:list,
            data:data,
            endTime:endTime,
          })
        }else{
          wx.showToast({
            title: res.data.info,
            icon: 'none',
            duration: 2000//持续的时间
          })
        }
      }
    })
  },
  closePopup(){
    this.setData({
      show:false
    })
  },
  goDetail: function(e) {
    console.log('e',e)
    wx.navigateTo({
      url: '/pages/goods_detail/index?goods_id='+e.currentTarget.dataset.gid+'&qty='+e.currentTarget.dataset.qty
    })
  },
  goCar: function() {
    wx.navigateTo({
      url: '/pages/shop_car/index'
    })
  },
  showPopup: function(e){
    if(e.currentTarget.dataset.qty==0){
      wx.showToast({
        title: '此商品无货，去挑选其他？',
        icon: 'none',
        duration: 2000
      })
      return
    }
    var data=this.data.list;
    var index = e.currentTarget.dataset.index
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
    this.setData({
      car_num:val.detail
    })
    if(this.data.car_num>this.data.order.qty){
      let qty=parseFloat(this.data.order.qty).toFixed(0);
      this.data.car_num=qty
    }
  },
  addToCar(){
    console.log('加入购物车',this.data.car_num)
    if(!this.data.car_num){
      // this.data.car_num=1;
      return
    }
    try{
      var car=wx.getStorageSync('car')||{};
      if (!car[this.data.order.goods_id]) {
        car[this.data.order.goods_id] = this.data.car_num;
      } else {
        car[this.data.order.goods_id] = parseInt(car[this.data.order.goods_id])+parseInt(this.data.car_num);
      }
      wx.setStorageSync('car',car);
      this.closePopup();
      // that.hideCar();
    }catch(e){
      //TODO handle the exception
    }
  },
  // hideCar(){
  //   this.$refs.popup.close();
  // },
  goBuy() {
    console.log('查看id',this.data.order)
    if(!this.data.car_num){
      return;
      // this.data.car_num=1;
    }
    this.closePopup();
    wx.navigateTo({
        url: '/pages/order/index?order_ids='+this.data.order.goods_id+'&goods_num='+this.data.car_num
    });
  },
  // 点击查看更多商品
  listToggle: function () {
    console.log('切换',this.data.showMore)
    this.setData({
      showMore: !this.data.showMore
    })
  },
})