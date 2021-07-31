// pages/settings/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  goSwitchIdentity(){
    wx.navigateTo({
      url: '/pages/switch_identity/index',
    })
  },
  goResetPsw(){
    wx.navigateTo({
      url: '/pages/reset_psw/index',
    })
  },
  logout(){
    try{
      wx.removeStorageSync('token');
      wx.removeStorageSync('userName');
      wx.showToast({
          title: '登出成功',
          duration: 800,
        success:function(){
          setTimeout(function(){
            wx.switchTab({
                url: '/pages/my/index'
            });
          },800);
        }
      });
    }catch(e){
      //TODO handle the exception
    }
  }
})