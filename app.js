//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    baseUrl: 'https://jzh.hulukeji.cn/',
    apiBaseUrl: 'https://jzh.hulukeji.cn/api/wx_app/',
    userInfo: null
  },
  axios:function(url, data, method = 'get', contentType = 1) {
    let header = {
        'content-type':contentType === 1 ? 'application/json' : 'application/x-www-form-urlencoded',
        'X-Token':wx.getStorageSync('token') != ''?wx.getStorageSync('token'):null
    }
    for (let property in data) {
        if (data[property] == null) {
            delete data[property]
        }
    }
    return new Promise((resolve, reject) => {
        wx.request({
            url: url,
            data,
            method,
            header,
            success: (res) => {
                if (res.statusCode == 200) {
                    resolve(res)
                } else if (res.statusCode == 405) {
                    wx.showToast({
                        icon: 'none',
                        title: '请求方法错误',
                        duration: 1500
                    });
                } else if (res.statusCode == 401) {
                    wx.showToast({
                        icon: 'none',
                        title: '未登录或登录状态已超时',
                        duration: 1500
                    });
                    setTimeout(() => {
                        wx.reLaunch({
                            url: '/pages/login/index',
                        });
                    }, 1500)
                    store.commit('logout')
                } else {
                    wx.showToast({
                        icon: 'none',
                        title: '请求错误:' + res.statusCode,
                        duration: 1500
                    });
                }
            },
            fail: (err) => {
				// console.log('request fail', err)
				if(!err.errMsg){
					wx.showToast({
					    icon: 'none',
					    title: '请求错误',
					    duration: 2000
					});
				}else{
					if(err.errMsg=='request:fail abort statusCode:-1'){
						err.errMsg='无网络连接';
					}
					wx.showToast({
					    icon: 'none',
					    title: err.errMsg,
					    duration: 2000
					});
				}
                reject(err)
            }
        })
    })
  },
  dialog:{
    alert:function(data){
      let data_config={
        content:data.msg||'',
        showCancel:false,
        confirmText:data.confirmText||'确定',
        success:function (res) {
          if (res.confirm) {
            data.success?data.success():function(){};
          }
        },
        fail:data.fail?data.fail:function(){},
        complete:data.complete?data.complete:function(){}
      }
      wx.showModal(data_config);
    },
    confirm:function(data){
      let data_config={
        title:data.title||'',
        content:data.content||'',
        showCancel:true,
        cancelText:data.cancelText||'取消',
        confirmText:data.confirmText||'确定',
        success:function (res) {
          if (res.confirm) {
            data.confirmCallback?data.confirmCallback():function(){};
          } else if (res.cancel) {
            data.cancelCallback?data.cancelCallback():function(){};
          }
        },
        fail:data.fail?data.fail:function(){},
        complete:data.complete?data.complete:function(){}
      }
      wx.showModal(data_config);
    },
    tip:function(data){
      wx.showToast({
          icon: 'none',
          title: data.msg||'',
          duration: data.duration||1500,
          mask: data.mask||false,
          success: data.success?data.success:function(){},
          fail: data.fail?data.fail:function(){},
          complete: data.complete?data.complete:function(){}
      });
    },
    tip_close:function(){
      wx.hideToast();
    },
    loding:function(data){
      wx.showLoading({
          title: data.msg||'',
          mask: data.mask||false,
          success: data.success?data.success:function(){},
          fail: data.fail?data.fail:function(){},
          complete: data.complete?data.complete:function(){}
      });
    },
    loding_close:function(){
      wx.hideLoading();
    }
  }
})