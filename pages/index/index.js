// index.js
const app = getApp()
let that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    background: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    typeList:[
      {
        link:'/pages/product/index',
        icon:'/public/orther_img/new_product.png',
        title:'新品',
      },
      {
        link:'/pages/mall/index',
        icon:'/public/orther_img/prescription.png',
        title:'精品处方',
      },
      // {
      //   link:'/pages/employ/index',
      //   icon:'/public/orther_img/broadcast.png',
      //   title:'拍照上传',
      // }
    ],
    serviceList:[
      {
        icon:'/public/orther_img/purchase.png',
        title:'蔡兴堂中药城',
        link:'/pages/mall/index',
        type:'nav'
      },
      {
        icon:'/public/orther_img/spike.png',
        title:'百合会',
        link:'/pages/kind/index',
        type:'nav'
      },
      {
        icon:'/public/orther_img/price.png',
        title:'特价秒杀',
        link:'/pages/price/index',
        type:'nav'
      },
      // {
      //   icon:'/public/orther_img/broadcast.png',
      //   title:'直播专区',
      //   link:'/pages/broadcast/index',
      //   type:'nav'
      // },
      {
        icon:'/public/orther_img/handsel.png',
        title:'买送专区',
        link:'/pages/handsel/index',
        type:'nav'
      },
      {
        icon:'/public/orther_img/group_buy.png',
        title:'团购优惠',
        link:'/pages/group_buy/index',
        type:'nav'
      },
      {
        icon:'/public/orther_img/sell.png',
        title:'控销专区',
        link:'/pages/mall/index',
        type:'nav'
      },
      {
        icon:'/public/orther_img/drug.png',
        title:'帮您找药',
        link:'/pages/find/index',
        type:'nav'
      },
      {
        icon:'/public/orther_img/consult.png',
        title:'价格协商',
        link:'/pages/negotiation/index',
        type:'nav'
      }
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    that=this;
    this.getSlide();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  getSlide:()=>{
    app.axios(app.globalData.apiBaseUrl+'slide.php', {cate_id:1},'POST').then(res => {
      let res_data=res.data;
        // console.log(res_data)
        if(res_data.status==1){
          var slide_list=[];
          if(res_data.items.length>0){
            for(var i=0;i<res_data.items.length;i++){
              slide_list.push({url:res_data.items[i]['href'],icon:res_data.items[i]['img']})
            }
            that.setData({
              background: slide_list
            });
          }
        }else{
          app.dialog.tip({msg: res_data.info});
        }
    });

    app.axios(app.globalData.apiBaseUrl+'agreement_detail.php', {id:14},'POST').then(res => {
      let res_data=res.data;
        console.log(res_data)
    });
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})