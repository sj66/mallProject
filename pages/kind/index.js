// pages/kind/index.js
const app = getApp()
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
  },
  onLoad:function(){ 
    var that = this;
    that.setData({
      windowHeight: wx.getStorageSync( 'windowHeight' )
    })
    wx.getSystemInfo({ 
      success: function (res) { 
        that.setData({ 
            clientHeight: res.windowHeight 
        }); 
      } 
    }) 
  },
  goDetail: function(e) {
    console.log('e',e)
    wx.navigateTo({
      url: '/pages/goods_detail/index?goods_id='+e.currentTarget.dataset.gid
    })
  },
  goCar: function() {
    // console.log(e)
    wx.navigateTo({
      url: '/pages/shop_car/index'
    })
  },
  showPopup(){
    this.setData({
      show:true
    })
  },
  closePopup(){
    this.setData({
      show:false
    })
  },
  numChange(val){
    this.data.car_num=val.detail;
  },
  addToCar(){
    console.log('加入购物车',this.data.car_num)
    if(!this.data.car_num){
      this.data.car_num=1;
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
    // that.hideCar();
    wx.navigateTo({
        url: '/pages/order/index?order_ids='+this.data.order.goods_id+'&goods_num='+this.data.car_num
    });
  },
})