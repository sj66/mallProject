// pages/forget_psw/index.js
const app = getApp()
let that,sms_status=false,phone_reg=/^[1][3,4,5,6,7,8,9][0-9]{9}$/,psd_reg=/^[a-zA-Z0-9]{6,20}$/,time_countdown=null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account:'',
    sms:'',
    psw:'',
    code_txt: '发送验证码',
		countdown: 60
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
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearTimeout(time_countdown);
  },
  sendSms(){
    if(sms_status){
      return false;
    }
    var phone=this.data.account.trim();
    if(phone.length>0){
      if(!phone_reg.test(phone)){    
        app.dialog.tip({msg:'请输入正确的11位手机号码'});
        return false;
      }
    }else{
      app.dialog.tip({msg:'请填写手机号码'});
      return false;
    }
    wx.showLoading({title: '发送中...'});
    app.axios(app.globalData.apiBaseUrl+'sendSms.php', {
      phone: phone
    },'POST').then(response => {
      wx.hideLoading();
      let res=response.data;
      if(res.status===1){
        wx.showToast({
            title: '已发送',
            duration: 800
        });
        sms_status=true;
        that.sms_countdown();
      }else{
        app.dialog.tip({msg:res.info});
      }
    });
  },
  sms_countdown(){
    if(that.data.countdown>0){
      this.setData({
        code_txt:this.data.countdown+'s',
        countdown:this.data.countdown-1
      })
      time_countdown=setTimeout(function(){
        that.sms_countdown();
      },1000);
    }else{
      this.setData({
        code_txt:'发送验证码',
        countdown:60
      })
      sms_status=false;
    }
  },
  subHandle() {
    var phone=this.data.account.trim();
    if(phone.length>0){
      if(!phone_reg.test(phone)){   
        app.dialog.tip({msg:'请输入正确的11位手机号码'});
        return false;
      }
    }else{
      app.dialog.tip({msg:'请填写手机号码'});
      return false;
    }
    var sms_code=this.data.sms.trim();
    if(sms_code.length<6){
      app.dialog.tip({msg:'请填写6位手机验证码'});
      return false;
    }
    var psd=this.data.psw.trim();
    if(psd.length<6){
      app.dialog.tip({msg:'密码不能少于6位'});
      return false;
    }else{
      if(!psd_reg.test(psd)){
        app.dialog.tip({msg:'请输入正确的密码，密码为至少6位的大小写字母和数字'});
        return false;
      }
    }
    wx.showLoading({title: '提交中...'});
    app.axios(app.globalData.apiBaseUrl+'forget.php', {
      userName: phone,
      userPass: psd,
      smsCode: sms_code
    },'POST').then(response => {
      wx.hideLoading();
      let res=response.data;
      if(res.status===1){
        wx.showToast({
            title: '设置成功',
            duration: 800,
          success:function(){
            setTimeout(function(){
              wx.navigateBack();
            },800);
          }
        });
      }else{
        app.dialog.tip({msg:res.info});
      }
    });
  },
  goLogin(){
    wx.navigateBack();
  }
})