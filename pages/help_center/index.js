//index.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    arrdata: [
      {
        id: 1,
        name: "如何下单",
        content:"点击下单后，可以直接点击加入购物车到购物车页面，再直接点击下单，微信支付付款即可；也可以直接点击立即下单，微信支付付款即可",
        isTrue: false
      },
      {
        id: 2,
        name:"付款成功未结束订单",
        content:"直接返回键回去看付款成功页面，如付款成功页面未显示订单,请联系客服",
        isTrue: false
      },
      {
        id: 3,
        name: "为什么商品加入购物车了，购物车页面却看不到商品",
        content:"商品加入购物车了，购物车页面却看不到商品，可能商品点击的时候未触发按钮，导致购物车页面却看不到商品，请重新进行一次下单操作",
        isTrue: false
      }
    ],
  },
  onOpen(e) {
    this.selectedIndex = e.currentTarget.dataset.index;
    this.data.arrdata[this.selectedIndex].isTrue = !this.data.arrdata[this.selectedIndex].isTrue;
    this.setData({
      arrdata:this.data.arrdata
    })
  },
})