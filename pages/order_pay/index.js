// pages/order_pay/index.js
const app = getApp();
Page({
 
  /**
  * 页面的初始数据
  */
  data: {
    currtab: 0,
    swipertab: [
      { 
        name: '待付款', 
        index: 0 
      }, 
      { 
        name: '待发货', 
        index: 1 
      }, 
      { 
        name: '待收货', 
        index: 2 
      },
      { 
        name: '已完成', 
        index: 3 
      }
    ],
    goods_arr:[],
    listData:[
      {
        goods_id:"42923",
        name:"香雪 复方南板蓝根颗粒",
        company:"广州市香雪制药股份有限公司",
        qty:"77.0000000",
        specs:"10g*15袋",
        car_num:1000,
        unit:"包",
        price:"8.35",
        total:"8350.0"
      },
      {
        goods_id:"04552",
        name:"聚肌胞注射液",
        company:"广东南国药业有限公司",
        qty:"199.0000000",
        specs:"2ml:2mg*10支",
        car_num:50,
        unit:"盒",
        price:"2.00",
        total:"100.0"
      },
      {
        goods_id:"03067",
        name:"克霉唑溶液",
        company:"广州白云山医药集团股份有限公司",
        qty:"99.0000000",
        specs:"8ml:1.5%",
        car_num:10000,
        unit:"瓶",
        price:"0.10",
        total:"1000.0"
      }
    ]
  },
  onLoad: function (options) {
    const that=this;
    if(options.id!=0){
      that.setData({
        currtab: options.id
      })
    }
  },
  // 生命周期函数--监听页面初次渲染完成
  onReady: function () {
    // 页面渲染完成
    this.getDeviceInfo()
    this.orderShow()
  },
  getDeviceInfo: function () {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          deviceW: res.windowWidth,
          deviceH: res.windowHeight
        })
      }
    })
  },
  //选项卡点击切换
  tabSwitch: function (e) {
    console.log('值',e)
    var that = this
    if (this.data.currtab === e.target.dataset.current) {
      return false
    } else {
      that.setData({
        currtab: e.target.dataset.current
      })
    }
  },
  tabChange: function (e) {
    console.log('数值',e)
    this.setData({ currtab: e.detail.current })
    this.orderShow()
  },
  orderShow: function () {
    let that = this
    switch (this.data.currtab) {
      case 0:
        that.waitPayShow()
        break
      case 1:
        that.alreadyShow()
        break
      case 2:
        that.lostShow()
        break
      case 3:
        that.endShow()
        break
    }
  },
  //  待付款
  waitPayShow:function(){
    this.setData({
      waitPayOrder: [
        { name: "HL2021051698505250210", state: "去付款", time: "2021-05-16 15:59", money: "132.00",isTrue: false }, 
        { name: "HL2021051698505250210", state: "去付款", time: "2021-05-16 15:59", money: "205.00",isTrue: false }
      ]
    })
  },
  // 待发货
  alreadyShow: function(){
    this.setData({
      alreadyOrder: [
        { name: "HL2021051698505250210", state: "待发货", time: "2021-05-16 15:59", money: "132.00",isTrue: false }, 
        { name: "HL2021051698505250210", state: "待发货", time: "2021-05-16 15:59", money: "205.00",isTrue: false }
      ]
    })
  },
  //  待收货
  lostShow: function () {
    this.setData({
      lostOrder: [
        { name: "HL2021051698505250210", state: "点击确认", time: "2021-05-16 15:59", money: "132.00",isTrue: false }, 
        { name: "HL2021051698505250210", state: "点击确认", time: "2021-05-16 15:59", money: "205.00",isTrue: false }
      ],
    })
  },
  // 已完成
  endShow: function () {
    this.setData({
      endOrder: [
        { name: "HL2021051698505250210", state: "已完成", time: "2021-05-16 15:59", money: "132.00",isTrue: false }, 
        { name: "HL2021051698505250210", state: "已完成", time: "2021-05-16 15:59", money: "205.00",isTrue: false }
      ],
    })
  },
  // 打开待付款订单详情
  onOpenPay(e) {
    this.selectedIndex = e.currentTarget.dataset.index;
    this.data.waitPayOrder[this.selectedIndex].isTrue = !this.data.waitPayOrder[this.selectedIndex].isTrue;
    this.setData({
      waitPayOrder:this.data.waitPayOrder
    })
  },
  // 打开待发货订单详情
  onOpenAlready(e) {
    this.selectedIndex = e.currentTarget.dataset.index;
    this.data.alreadyOrder[this.selectedIndex].isTrue = !this.data.alreadyOrder[this.selectedIndex].isTrue;
    this.setData({
      alreadyOrder:this.data.alreadyOrder
    })
  },
  // 打开待收货订单详情
  onOpenLost(e) {
    this.selectedIndex = e.currentTarget.dataset.index;
    this.data.lostOrder[this.selectedIndex].isTrue = !this.data.lostOrder[this.selectedIndex].isTrue;
    this.setData({
      lostOrder:this.data.lostOrder
    })
  },
  // 打开已完成订单详情
  onOpenEnd(e) {
    this.selectedIndex = e.currentTarget.dataset.index;
    this.data.endOrder[this.selectedIndex].isTrue = !this.data.endOrder[this.selectedIndex].isTrue;
    this.setData({
      endOrder:this.data.endOrder
    })
  },
  // 打开商品详情页
  goDetail: function(e) {
    console.log('qty',e)
    wx.navigateTo({
      url: '/pages/goods_detail/index?goods_id='+e.currentTarget.dataset.gid+'&qty='+e.currentTarget.dataset.qty+'&price='+e.currentTarget.dataset.price
    })
  },
})