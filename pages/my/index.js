//index.js
//获取应用实例
const app = getApp()
let that
Page({
  data: {
    isLogin:false,
    userName:'',
    account:'',
    typeList:[
      {
        link:'/pages/purchase_records/index',
        icon:'/public/orther_img/purchase_records.png',
        title:'采购记录',
      },
      {
        link:'/pages/coupon/index',
        icon:'/public/orther_img/coupon.png',
        title:'优惠劵',
      },
      {
        link:'/pages/my_group/index',
        icon:'/public/orther_img/group.png',
        title:'我的拼团',
      },
      {
        link:'/pages/collect/index',
        icon:'/public/orther_img/my_favorites.png',
        title:'我的收藏',
      }
    ],
    orderList:[
      {
        id:0,
        icon:'/public/orther_img/wait_payment.png',
        title:'待付款',
      },
      {
        id:1,
        icon:'/public/orther_img/wait_ship.png',
        title:'待发货',
      },
      {
        id:2,
        icon:'/public/orther_img/wait_receipt.png',
        title:'待收货',
      },
      // {
      //   id:3,
      //   link:'/pages/refund/index',
      //   icon:'/public/orther_img/refund_money.png',
      //   title:'售后订单',
      // }
      {
        id:3,
        icon:'/public/orther_img/refund_money.png',
        title:'已完成',
      }
    ],
    serviceList:[
      {
        icon:'/public/orther_img/purchasing.png',
        title:'智惠采购',
        link:'',
        type:'nav'
      },
      {
        icon:'/public/orther_img/my_scores.png',
        title:'我的积分',
        link:'',
        type:'nav'
      },
      {
        icon:'/public/orther_img/bill.png',
        title:'合同协议',
        link:'/pages/agreement/index',
        type:'nav'
      },
      {
        icon:'/public/orther_img/my_salesman.png',
        title:'资信账单',
        link:'',
        type:'nav'
      },
      {
        icon:'/public/orther_img/data_management.png',
        title:'资料管理',
        link:'',
        type:'nav'
      },
      {
        icon:'/public/orther_img/my_salesman.png',
        title:'我的业务员',
        link:'/pages/my_salesman/index',
        type:'nav'
      },
      {
        icon:'/public/orther_img/feedback.png',
        title:'意见反馈',
        link:'/pages/feedback/index',
        type:'nav'
      },
      {
        icon:'/public/orther_img/help_center.png',
        title:'帮助中心',
        link:'/pages/help_center/index',
        type:'nav'
      },
      {
        icon:'/public/orther_img/set.png',
        title:'设置',
        link:'/pages/settings/index',
        type:'nav'
      }
    ]
  },
  onLoad: function () {
    that=this;
  },
  onShow: function () {
    try {
      var token=wx.getStorageSync('token');
      if(token){
        this.setData({
          isLogin:true,
          userName:wx.getStorageSync('userName'),
          account:wx.getStorageSync('account')
        });
        this.getInfo();
      }else{
        this.setData({
          isLogin:false,
          userName:'',
          account:''
        })
      }
    } catch (error) {
      
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  goLogin(){
    if(!this.data.isLogin){
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }
  },
  onOrderType(e){
    console.log('打印',e)
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/order_pay/index?id='+id,
    })
  },
  goMyOrder(e){
    if(this.data.isLogin){
      // wx.navigateTo({
      //   url: '/pages/my_order/index?cate='+e.currentTarget.dataset.cat,
      // })
    }
  },
  goSettings(){
    if(this.data.isLogin){
      wx.navigateTo({
        url: '/pages/settings/index',
      })
    }
  },
  getInfo(){
    // wx.showLoading({title: '提交中...'});
    app.axios(app.globalData.apiBaseUrl+'getUser.php', {
    },'POST').then(response => {
      // wx.hideLoading();
      // console.log(response);
      let res=response.data;
      if(res.status===1){
        if(res.data.auth_status==0){
          app.dialog.confirm({
            content:'您还未提交审核资料，点击确定提交审核',
            confirmCallback:function(){
              wx.navigateTo({
                url: '/pages/authentication/index',
              })
            }
          });
        }
      }else{
        // app.dialog.tip({msg:res.info});
      }
    });
  }
})
