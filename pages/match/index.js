// pages/match/index.js
const app = getApp()
Page({

  data: {
    list: [
      {
        img: 'https://cdn.hulukeji.cn/upload/20201108115639_266.jpg',
        goods_id: "40732",
        name: '东富海 一次性使用口罩',
        specs: "长17.5cm*高9.5cm三层挂耳式10个/包",
        company: "东富海医疗（深圳）有限公司",
        mid_pack_num: 0, 
        big_pack_num:100,
        prod_date:"2020-06-28",
        valid_date:"2022-06-27",
        price:"0.23",
        retail_price:"1.0",
        price_ratio:"80%"
      },
      {
        img: 'https://cdn.hulukeji.cn/upload/20210201101537_126.jpg',
        goods_id: "42781",
        name: '医掌门 一次性使用医用口罩',
        specs: "非无菌型平面耳挂式17.5cm*10cm",
        company: "福建德森茶业有限公司",
        mid_pack_num: 0, 
        big_pack_num:100,
        prod_date:"2020-10-18",
        valid_date:"2022-10-17",
        price:"0.2",
        retail_price:"1.0",
        price_ratio:"80%"
      },
    ],
    // 倒计时
    time: 30 * 60 * 60 * 1000,
  },

  onLoad: function () {
  },
  // 下单
  showPopup(e){
    console.log('eeee',e,this)
    var data=this.data.list;
    var index = e.currentTarget.dataset.index
    this.setData({
      order:data[index],
      show:true
    })
  },
  closePopup(){
    this.setData({
      show:false
    })
  },
})