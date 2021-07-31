// pages/my_group/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // tab切换 
    currentTab: 0, 
    //这是页面需要的json
    list: [
      {
        'pic':'/public/orther_img/produce_bg.png',
        'coding':'15436',
        'name':'小儿热速清颗粒',
        'format':'2g*6袋',
        'factory':'哈尔滨圣泰生物制药有限公司',
        'startDate':'2020-11-20',
        'endDate':'2022-11-19',
        'newPrice':'6.30',
        'oldPrice':'12.50'
      },
      {
        'pic':'/public/orther_img/produce_bg.png',
        'coding':'11236',
        'name':'夏桑菊',
        'format':'10g*15袋',
        'factory':'广州白云山有限公司',
        'startDate':'2020-11-20',
        'endDate':'2022-11-19',
        'newPrice':'6.30',
        'oldPrice':'12.50'
      },
    ],	
    //这是查询需要的json
	  list2: [
      {
        'id':'1',
        'pic':'/pages/news/img/banner3.png',
        'coding':'15436',
        'name':'小儿热速清颗粒',
        'format':'2g*6袋',
        'factory':'哈尔滨圣泰生物制药有限公司'
      },
      {
        'id':'2',
        'pic':'/pages/news/img/banner3.png',
        'coding':'15436',
        'name':'夏桑菊',
        'format':'10g*15袋',
        'factory':'广州白云山制药有限公司'
      },
    ]	
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  // 导航栏切换
  swichNav: function (e) { 
    console.log(e); 
    var that = this; 
    if (this.data.currentTab === e.target.dataset.current) { 
      return false; 
    } else {
      that.setData({ 
      currentTab: e.target.dataset.current, 
    }) 
  } 
  },
  swiperChange: function (e) {
    console.log(e);
    this.setData({
      currentTab: e.detail.current, 
    })
  },
  // 搜索
  query(e){
    console.log('111')
    var list = this.data.list2;		//先把第二条json存起来
    var list2 = [];		//定义一个数组
    //循环去取数据
    for(var i=0;i<list.length;i++){
      var string = list[i].name;
      //查询json里的name是否包含搜索的关键词，如果有就把他装进list2数组
      if(string.indexOf(e.detail.value) >= 0){
        list2.push(list[i]);
      }
    }
    //到这里list2就已经是你查出的数据
    //如果输入的关键词为空就加载list数据，不是空就加载list2数据
    if(e.detail.value == ""){
      //加载全部
      this.setData({
        list: list
      })
    } else {
      this.setData({
        list: list2
      })
    }
  },
  // 点击商品详情
  onGoodsDetail:function(){
    wx.navigateTo({
      url: '/pages/goods_detail/index'
    })
  }
})