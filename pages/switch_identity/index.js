//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    radio: '1',
  },
  onLoad: function () {
  },
  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },

  onClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      radio: name,
    });
  },
  onCutover:function(){
    wx.navigateTo({
      url: '/pages/create_group/index',
    })
  },
})
