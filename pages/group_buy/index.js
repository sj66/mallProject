// pages/group_buy/index.js
const app = getApp()
let that;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    car_num:1,
    user_status:0,
    // 拼团消息
    msgList:[
      {
        name:'广东家之和药业',
        phone:'1232246542',
        format:'10盒',
        date:'4分钟前'
      },
      {
        name:'广东正康药业',
        phone:'1232246666',
        format:'20盒',
        date:'6分钟前'
      },
      {
        name:'广东仁和堂药业',
        phone:'1236666642',
        format:'6盒',
        date:'8分钟前'
      }
    ]
  },
  onLoad:function(){ 
    this.setData( {
      windowHeight: wx.getStorageSync( 'windowHeight' )
    })
    var that = this 
    wx.getSystemInfo({ 
        success: function (res) { 
            that.setData({ 
                clientHeight: res.windowHeight 
            }); 
        } 
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
  numChange(e){
    this.setData({
      car_num:e.detail
    })
  },
  onJoin: function(e) {
    wx.navigateTo({
      url: '/pages/group_detail/index'
    })
  },
  onJoinList:function(e){
    wx.navigateTo({
      url: '/pages/group_list/index'
    })
  }
})