// pages/pay/index.js
const app = getApp()
let that,is_wx=false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    price:0.01,
    is_pay:false,
    openid:'',
    orderno:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options',options)
    if(!options.orderno){
      wx.showToast({
        title: '订单不存在',
        icon: 'none',
        duration: 2000
      })
      this.setData({
        is_pay:true,
      });
      return false;
    }
    if(options.is_wx){
      is_wx=true;
    }
    that=this;
    this.setData({
      orderno:options.orderno,
      price:options.price
    },function(){
      try {
        var openid=wx.getStorageSync('openid')
        if (openid) {
          that.setData({
            openid:openid
          },function(){
            that.getOrder();
          })
        }else{
          that.goLogin();
        }
      } catch (e) { }
    })
    
  },
  goLogin(){
    wx.login({
      success (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: app.globalData.apiBaseUrl + 'login.php',
            method: 'POST',
            data: {
              code: res.code
            },
            success:(res)=>{
              let res_data=res.data;
              if(res_data.status==1){
                wx.setStorage({
                  key:"openid",
                  data:res_data.data.openid,
                })
                that.setData({
                  openid:res_data.data.openid
                },function(){
                  that.getOrder();
                })
              }else{
                app.dialog.tip({msg:res_data.info});
              }
            },
            fail:()=>{
              // console.log('登录失败！' + res.errMsg)
              app.dialog.tip({msg:'登录失败！'});
            }
          })
        } else {
          // console.log('登录失败！' + res.errMsg)
          app.dialog.tip({msg:'登录失败！'});
        }
      }
    })
  },
  getOrder() {
    if(this.data.openid==""){
      this.goLogin();
    }
    wx.request({
      url: app.globalData.apiBaseUrl + 'pay.php',
      method: 'POST',
      data: {
        openid: that.data.openid,
        orderno: that.data.orderno
      },
      success:(res)=>{
        // console.log(res)
        let res_data=res.data;
        if(res_data.status==1){
          let pay_data = res_data.data;
          // console.log(pay_data);
          wx.requestPayment({
            timeStamp: pay_data.timeStamp,
            nonceStr: pay_data.nonceStr,
            package: pay_data.package,
            signType: pay_data.signType,
            paySign: pay_data.paySign,
            success(res) { 
              wx.showToast({ title: '支付成功' })       
              // this.setData({
              //   show:true
              // })
              if(is_wx){
                setTimeout(function () {
                  wx.redirectTo({
                    url: '/pages/order_detail/index?orderno=' + that.data.orderno
                  })
                }, 1500);
              }else{
                that.setData({
                  is_pay:true
                })  
              }
            },
            fail(res) { }
          })
        }else{
          app.dialog.tip({msg:res_data.info});
        }
      },
      fail:()=>{
        // console.log('操作失败！' + res.errMsg)
        app.dialog.tip({msg:'操作失败！'});
      }
    })
  },
  // closePopup(){
  //   this.setData({
  //     show:false
  //   })
  // },
  openAppEnd (e) {
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})