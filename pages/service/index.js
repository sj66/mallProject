// pages/service/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  openAppEnd (e) {
    // console.log('1212121sdasdasdas');
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})