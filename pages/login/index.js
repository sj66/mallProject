// pages/login/index.js
const app = getApp()
let that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account:'',
    psw:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
  },
  bindLogin() {
    /**
     * 客户端对账号信息进行一些必要的校验。
     * 实际开发中，根据业务需要进行处理，这里仅做示例。
     */
    // 判断多身份
    // if(!this.data.account){
    //   wx.showActionSheet({
    //     itemList: ['13242765421', '13242766666', '13800001380'],
    //     success: function (res) {
    //       if (!res.cancel) {
    //         console.log(res.tapIndex)//这里是点击了那个按钮的下标
    //       }
    //     }
    //   })
    // }
    if (this.data.account.length != 11) {
      wx.showToast({
        icon: 'none',
        title: '请输入11位手机号码'
      });
      return;
    }
    if (this.data.psw.length < 6) {
      wx.showToast({
        icon: 'none',
        title: '密码最短为 6 个字符'
      });
      return;
    }
    wx.showLoading({title: '提交中...'});
    app.axios(app.globalData.apiBaseUrl+'account_login.php', {
      userName: this.data.account,
      userPass: this.data.psw
    },'POST').then(response => {
      wx.hideLoading();
      console.log(response);
      let res=response.data;
      console.log(res);
      if(res.status===1){
        try{
          wx.setStorageSync('userName',res.userName);
          wx.setStorageSync('account',res.account);
          wx.setStorageSync('token',res.token);
        }catch(e){
          //TODO handle the exception
        }
        wx.showToast({
            title: '登录成功',
            duration: 800,
          success:function(){
            setTimeout(function(){
              wx.switchTab({
                  url: '/pages/my/index'
              });
            },800);
          }
        });
      }else{
        app.dialog.tip({msg:res.info});
      }
    });
  }
})