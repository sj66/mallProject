// pages/my_order/index.js
const app = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list_title:['全部','待付款','待发货','待收货','已完成','已取消'],
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
    var tab_arr=[];
    for (var i=0;i<6;i++){
      tab_arr.push({
        isRefreshing: false,
        data: [],
        isFirst: true,
        last_id: 0,
        order_scroll:'order_scroll_'+i
      });
    }
    this.setData({
      list:tab_arr
    });
    if(that.go_status){
      that.go_status=false;
      return false;
    }
    if(this.$route.query.cate===0||this.$route.query.cate){
      that.cate=this.$route.query.cate;
      that.swiperOptions.initialSlide=parseInt(that.cate)+1;
      that.list[that.swiperOptions.initialSlide].isFirst=false;
    }
    this.getData(that.swiperOptions.initialSlide);
    that.swiper_status=true;
    setTimeout(function () {
      that.list_status=true;
      that.swiper.slideTo(that.swiperOptions.initialSlide, 0)
    },200);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})