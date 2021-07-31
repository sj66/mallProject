// pages/order_detail/index.js
const app=getApp();
var that,orderno='';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list1: [{
      text: '待付款'
    }, {
      text: '待发货'
    }, {
      text: '待收货'
    }, {
      text: '已完成'
    }],
    status:['待付款','待发货','待收货','已完成','已取消'],
    order_data:{},
    goods_arr:{},
    is_openPay: false,
    check_num: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(!options.orderno){
      wx.navigateBack();
      return false;
    }
    orderno=options.orderno;
    that=this;
    this.getData();
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  getData(){
    app.axios(app.globalData.apiBaseUrl+'order_detail.php', {orderno: orderno},'POST').then(response => {
      // uni.hideLoading();
      let res=response.data;
      if(res.status===404){
        app.dialog.alert({msg: res.info,success:function () {
          wx.navigateBack();
        }});
      }else if(res.status===1){
        /*console.log(res.items);*/
        that.setData({
          order_data:res.items,
          goods_arr:res.goods_items
        })
      }else{
        app.dialog.tip({msg: res.info});
      }
    }).catch(function (error) {
      /*console.log(error);*/
      // uni.hideLoading();
      app.dialog.tip({msg: error});
    });
  },
  goPay() {
    wx.redirectTo({
      url: '/pages/pay/index?is_wx=1&orderno='+orderno+'&price='+this.data.order_data.total
    })
  },
  goFinish() {
    app.dialog.confirm({
      title:'操作提示',
      content:'您是否已收到货物了？',
      confirmCallback:function(){
        that.doFinish()
      }
    })
  },
  doFinish() {
    app.dialog.loding({msg: '处理中...'});
    app.axios(app.globalData.api_base+'order_finish.php', {
        orderno:that.orderno
      },'POST').then(response=> {
        // console.log(response);
        app.dialog.loding_close();
        let res=response.data;
        if(res.status==1){;
          that.setData({
            'order_data.status':3
          })
        }else{
          app.dialog.tip({msg: res.info});
        }
    }).catch(function (error) {
      app.dialog.loding_close();
      app.dialog.tip({msg: error});
    });
  }
})