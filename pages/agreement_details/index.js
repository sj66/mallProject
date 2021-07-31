// pages/agreement_details/index.js
var interval = null //倒计时函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenDatalist:true,
    listData: [],
    protocolList:[],
    name:'',
    phone:'',
    number:'',
    tab:'',
    // 发送验证码倒计时
    date:'请选择日期',
    fun_id:2,
    time: '获取验证码', //倒计时 
    currentTime:61,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var token = wx.getStorageSync('token')
    var that = this;
    var tab=options.tab
    console.log('导航栏值',options)
    // 加载合同协议详情
    wx.request({
      url: 'https://jzh.hulukeji.cn/api/wx_app/agreement_detail.php', //接口地址
      data: {
          id:options.id,
      },
      header: {
        'content-type': 'application/json', // 对数据进行 JSON 序列化
        'X-Token': token
      },
      method:'POST',
      success (res) {
        console.log('拿值',res.data)
        let userinfo=res.data.second_party;
        let protocolList = res.data.data;
        let listData=res.data.data.goods_list;
        if(!protocolList.sign_up_time){
          protocolList.sign_up_time=new Date().getTime();
        }else{
          protocolList.sign_up_time = protocolList.sign_up_time.substring(0, 10);
        }
        // protocolList.content = protocolList.content.replace(/<p>/ig, '<p class="p_class">')
        // protocolList.content2 = protocolList.content2.replace(/<p>/ig, '<p class="p_class">')
        console.log('拿值回来没',protocolList,listData,tab)
        that.setData({
          userinfo:userinfo,
          protocolList:protocolList,
          listData:listData,
          tab:tab
        })
      }
    })
  },
  // 点击展开商品详情
  onopen:function(){
    this.setData({
      hiddenDatalist:!this.data.hiddenDatalist
    })
  },
  // 获取姓名
  phoneName:function(e){
    this.setData({
        name:e.detail.value
    });
  },
  // 获取手机号码
  phoneInput:function(e){
    this.setData({
        phone:e.detail.value
    });
  },
  // 获取验证码
  phoneNumber:function(e){
    this.setData({
        number:e.detail.value
    });
  },
  // 发送验证码
  sendPhone:function(){
    // 发送验证码倒计时
    var that = this
    that.setData({
      disabled:true
    })
    // this.getCode();
    var currentTime = that.data.currentTime
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: currentTime+'秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime:61,
          disabled: false   
        })
      }
    }, 1000)  
    // 发送验证码请求
    var token = wx.getStorageSync('token')
    wx.request({
      url: 'https://jzh.hulukeji.cn/api/wx_app/agreement_sendSms.php', //接口地址
      data: {},
      header: {
      'content-type': 'application/json', // 对数据进行 JSON 序列化
      'X-Token': token
      },
      method:'POST',
      success (res) {
          if(res.data.status === 0){
            wx.showToast({
                title: res.data.info,
                icon: 'none',
                duration: 2000//持续的时间
            })
        }
      }
    })
  },
  /*弹窗*/
  onSign: function() {
    this.setData({
        showModal: true
    })
  },
  /**
  * 隐藏模态对话框
  */
  hideModal: function() {
    this.setData({
        showModal: false
    });
  },
  /**
  * 对话框取消按钮点击事件
  */
  onCancel: function() {
    this.hideModal();
  },
  /**
  * 对话框确认按钮点击事件
  */
  onConfirm: function(options) {
    var token = wx.getStorageSync('token')
    console.log('看这个有什么值',this)
    wx.request({
      url: 'https://jzh.hulukeji.cn/api/wx_app/agreement_sub.php', //接口地址
      data: {
          sms_code: this.data.number,
          ar_id:this.options.id,
      },
      header: {
      'content-type': 'application/json', // 对数据进行 JSON 序列化
      'X-Token': token
      },
      method:'POST',
      success (res) {
        console.log(res.data)
        wx.showToast({
            title: '签订成功',
            icon: 'success',
            duration: 2000
        })
        wx.navigateTo({
          url: '/pages/agreement/index?tab=2',
        })
        wx.navigateBack({
          delta: 1
        })
      }
    })
    this.hideModal();
  },
})
