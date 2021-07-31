// pages/center/index.js
const app = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin:false,
    userName:'',
    account:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
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
    try {
      var token=wx.getStorageSync('token');
      if(token){
        this.setData({
          isLogin:true,
          userName:wx.getStorageSync('userName'),
          account:wx.getStorageSync('account')
        });
        this.getInfo();
      }else{
        this.setData({
          isLogin:false,
          userName:'',
          account:''
        })
      }
    } catch (error) {
      
    }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  goLogin(){
    if(!this.data.isLogin){
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }
  },
  goMyOrder(e){
    if(this.data.isLogin){
      // wx.navigateTo({
      //   url: '/pages/my_order/index?cate='+e.currentTarget.dataset.cat,
      // })
    }
  },
  goSettings(){
    if(this.data.isLogin){
      wx.navigateTo({
        url: '/pages/settings/index',
      })
    }
  },
  getInfo(){
    // wx.showLoading({title: '提交中...'});
    app.axios(app.globalData.apiBaseUrl+'getUser.php', {
    },'POST').then(response => {
      // wx.hideLoading();
      // console.log(response);
      let res=response.data;
      if(res.status===1){
        if(res.data.auth_status==0){
          app.dialog.confirm({
            content:'您还未提交审核资料，点击确定提交审核',
            confirmCallback:function(){
              wx.navigateTo({
                url: '/pages/authentication/index',
              })
            }
          });
        }
      }else{
        // app.dialog.tip({msg:res.info});
      }
    });
  }
})