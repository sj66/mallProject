// pages/employ/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showBox:true,
    radio: '1',
    age:'',
    weight:'',
    /*按钮*/
    btn_disabled:true,
    // 摄像机
    showCamera:false,
    showBtn:false,
    showLine:false,
    session_key:''
  },
  onLoad(){
    var that=this;
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
  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },
  onAge(event) {
    this.setData({
      age: event.detail,
    });
  },
  onWeight(event) {
    this.setData({
      weight: event.detail,
    });
  },
  /**相关协议 法律文件 */
  bindAgreeChange:function(e) {
    if (e.detail.value.length==1){
      this.setData({
        btn_disabled:false,
      })
    }else{
      this.setData({
        btn_disabled:true
      })
    }
  },
  onProtocol(){
    wx.navigateTo({  
      url: '/pages/protocol/index',  
    })
  },
  // onTrue(){
  //   if(this.data.age==''||this.data.weight==''){
  //     wx.showToast({
  //       title: '请完善资料，谢谢~~',
  //       icon: 'none',
  //       duration: 2000
  //     })
  //     return
  //   }
  //   this.setData({
  //     showBox:false,
  //     showCamera:true
  //   })
  // },
  // 获取手机号
  getPhoneNumber (e) {
    var that=this;
    var ency = e.detail.encryptedData;
    var iv = e.detail.iv;
    if(that.data.age==''||that.data.weight==''){
      wx.showToast({
        title: '请完善资料，谢谢~~',
        icon: 'none',
        duration: 2000
      })
      return
    }
    that.setData({
      showBox:false,
      showCamera:true
    })
    app.axios(app.globalData.apiBaseUrl+'get_phone.php',{session_key:that.data.session_key,iv:iv,encryptedData:ency},'POST').then(res=>{
      let res_data=res.data;
      console.log('结果',res_data)
    })
    setTimeout(function (){
      that.takeImage();
    },3000);
  },
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