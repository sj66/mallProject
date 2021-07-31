//index.js
//获取应用实例
const app = getApp()
Page({
  data: { 
    // tab切换 
    currentTab: 0, 
    couponList:[
      {
        price:5,
        cost:50,
        time:'2020-10-31 23:59',
      },
      {
        price:10,
        cost:100,
        time:'2020-10-31 23:59',
      },
      {
        price:20,
        cost:200,
        time:'2020-10-31 23:59',
      }
    ]
  }, 
  swichNav: function (e) { 
    console.log(e); 
    var that = this; 
    if (this.data.currentTab === e.target.dataset.current) { 
      return false; 
    } else {
      that.setData({ 
      currentTab: e.target.dataset.current, 
    }) 
  } 
  },
  swiperChange: function (e) {
    console.log(e);
    this.setData({
      currentTab: e.detail.current, 
    })
  }
  })
   
