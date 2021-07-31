// pages/discern/index.js
const app = getApp()
let that;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showCamera:true,
    showBtn:false,
    showLine:false,
    session_key:''
  },
  onLoad(){
    var that=this;
    setTimeout(function (){ 
      that.setData({
        showLine:true
      })
    },2000);
    wx.login({
      success (res) {
        if (res.code) {
          //发起网络请求
          app.axios(app.globalData.apiBaseUrl + 'login.php',{code: res.code},'POST').then(res=>{
              let res_data=res.data;
              console.log("session_key",res_data)
              if(res_data.data.session_key){
                that.setData({
                  session_key:res_data.data.session_key
                })
                setTimeout(()=>{
                  console.log(that.data.session_key)
                },500)
              }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  // 获取手机号
  getPhoneNumber (e) {
    console.log('打印1',e.detail.errMsg)
    console.log('打印2',e.detail.iv)
    console.log('打印3',e.detail.encryptedData)
    var that=this;
    var ency = e.detail.encryptedData;
    var iv = e.detail.iv;
    console.log('打印4',that)
    app.axios(app.globalData.apiBaseUrl+'get_phone.php',{session_key:that.data.session_key,iv:iv,encryptedData:ency},'POST').then(res=>{
      let res_data=res.data;
      console.log('结果',res_data)
    })
    setTimeout(function (){
      that.takeImage();
    },3000);
  },
  // takePhoto() {
  //   this.setData({
  //     showLine:true,
  //   })
  //   let self=this;
  //   setTimeout(function (){
  //     self.takeImage();
  //   },3000);
  // },
  takeImage(){
    let ctx = wx.createCameraContext() //拍摄照片
    ctx.takePhoto({
      quality: 'high',//object.quality   成像质量：高质量
      success: (res) => {
        this.setData({
          showCamera:false,
          showLine:false,
          showBtn:true,
          src: res.tempImagePath
        })
      }
    })
  },
  submitPhoto(){
    console.log('提交人脸识别接口')
    wx.navigateTo({  
      url: '/pages/match/index',  
    })
  }
})