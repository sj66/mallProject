// pages/integral/index.js
const app = getApp()
let goodsList = [
  {actEndTime: '2020/10/22 10:00:43'}
]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tab切换 
    currentTab: 0, 
    duration: 500,
    activityList1:[
      {
        link:'',
        pic:'https://cdn.hulukeji.cn/upload/20210330173705_355.jpg',
        drug:'赠品 纯色素色纯棉浴巾/米色'
      },
      {
        link:'',
        pic:'https://cdn.hulukeji.cn/upload/20210330172843_355.jpg',
        drug:'罗浮山赠品 九阳电磁灶'
      },
      {
        link:'',
        pic:'https://cdn.hulukeji.cn/upload/20210329175951_957.jpg',
        drug:'赠品 天韵条纹面方巾两件套'
      },
      {
        link:'',
        pic:'https://cdn.hulukeji.cn/upload/20210512135619_122.jpg',
        drug:'赠品 加厚团圆火锅'
      },
      {
        link:'',
        pic:'https://cdn.hulukeji.cn/upload/20210512160344_284.jpg',
        drug:'赠品 最生活毛巾·青春系列轻柔款浴巾'
      },
      {
        link:'',
        pic:'https://cdn.hulukeji.cn/upload/20210512162147_284.jpg',
        drug:'赠品 最生活毛巾·浅色系列  A-1154'
      }
    ],
    activityList2:[
      {
        link:'',
        pic:'https://cdn.hulukeji.cn/upload/20210330173705_355.jpg',
        drug:'纯爱素色纯棉浴巾'
      },
      {
        link:'',
        pic:'https://cdn.hulukeji.cn/upload/20210402174122_375.jpg',
        drug:'赠品 富安娜决明子枕'
      },
      {
        link:'',
        pic:'https://cdn.hulukeji.cn/upload/20210402115730_186.jpg',
        drug:'单层法兰绒毯 花间精灵/蓝'
      },
      {
        link:'',
        pic:'https://cdn.hulukeji.cn/upload/20210326102810_102.jpg',
        drug:'赠品 强效去油洗洁精'
      },
      {
        link:'',
        pic:'https://cdn.hulukeji.cn/upload/20210313115007_464.jpg',
        drug:'万金油赠品 75%酒精湿巾'
      },
      {
        link:'',
        pic:'https://cdn.hulukeji.cn/upload/20210313105540_631.jpg',
        drug:'润都赠品 维达雅致卷纸'
      },
      {
        link:'',
        pic:'https://cdn.hulukeji.cn/upload/20210208155850_709.jpg',
        drug:'万通赠品 室内加热器'
      },
      {
        link:'',
        pic:'https://cdn.hulukeji.cn/upload/20210203161905_499.jpg',
        drug:'赠品 二层挂架'
      }
    ],
    activityList3:[
      {
        link:'',
        pic:'https://cdn.hulukeji.cn/upload/20210330173705_355.jpg',
        drug:'纯爱素色纯棉浴巾'
      },
      {
        link:'',
        pic:'https://cdn.hulukeji.cn/upload/20210402174122_375.jpg',
        drug:'赠品 富安娜决明子枕'
      },
      {
        link:'',
        pic:'https://cdn.hulukeji.cn/upload/20210402115730_186.jpg',
        drug:'单层法兰绒毯 花间精灵/蓝'
      },
      {
        link:'',
        pic:'https://cdn.hulukeji.cn/upload/20210330173705_355.jpg',
        drug:'赠品 纯色素色纯棉浴巾/米色'
      },
      {
        link:'',
        pic:'https://cdn.hulukeji.cn/upload/20210330172843_355.jpg',
        drug:'罗浮山赠品 九阳电磁灶'
      },
      {
        link:'',
        pic:'https://cdn.hulukeji.cn/upload/20210329175951_957.jpg',
        drug:'赠品 天韵条纹面方巾两件套'
      },
      {
        link:'',
        pic:'https://cdn.hulukeji.cn/upload/20210326102810_102.jpg',
        drug:'赠品 强效去油洗洁精'
      },
      {
        link:'',
        pic:'https://cdn.hulukeji.cn/upload/20210313115007_464.jpg',
        drug:'万金油赠品 75%酒精湿巾'
      },
      {
        link:'',
        pic:'https://cdn.hulukeji.cn/upload/20210313105540_631.jpg',
        drug:'润都赠品 维达雅致卷纸'
      },
      {
        link:'',
        pic:'https://cdn.hulukeji.cn/upload/20210208155850_709.jpg',
        drug:'万通赠品 室内加热器'
      },
      {
        link:'',
        pic:'https://cdn.hulukeji.cn/upload/20210203161905_499.jpg',
        drug:'赠品 二层挂架'
      },
      {
        link:'',
        pic:'https://cdn.hulukeji.cn/upload/20210512135619_122.jpg',
        drug:'赠品 加厚团圆火锅'
      },
      {
        link:'',
        pic:'https://cdn.hulukeji.cn/upload/20210512160344_284.jpg',
        drug:'赠品 最生活毛巾·青春系列轻柔款浴巾'
      },
      {
        link:'',
        pic:'https://cdn.hulukeji.cn/upload/20210512162147_284.jpg',
        drug:'赠品 最生活毛巾·浅色系列  A-1154'
      },
      {
        link:'',
        pic:'https://cdn.hulukeji.cn/upload/20210512165627_284.jpg',
        drug:'赠品 最生活毛巾·儿童系列A-1175'
      }
    ],
    activityList4:[
      {
        link:'',
        pic:'https://cdn.hulukeji.cn/upload/20210330172843_355.jpg',
        drug:'罗浮山赠品 九阳电磁灶'
      }
    ],
    activityList5:[
      {
        link:'',
        pic:'https://cdn.hulukeji.cn/upload/20210330172843_355.jpg',
        drug:'罗浮山赠品 九阳电磁灶'
      }
    ],
    activityList6:[
      {
        link:'',
        pic:'https://cdn.hulukeji.cn/upload/20210402115730_186.jpg',
        drug:'单层法兰绒毯 花间精灵/蓝'
      },
      {
        link:'',
        pic:'https://cdn.hulukeji.cn/upload/20210330173705_355.jpg',
        drug:'纯爱素色纯棉浴巾'
      },
      {
        link:'',
        pic:'https://cdn.hulukeji.cn/upload/20210330173705_355.jpg',
        drug:'赠品 纯色素色纯棉浴巾/米色'
      },
      {
        link:'',
        pic:'https://cdn.hulukeji.cn/upload/20210329175951_957.jpg',
        drug:'赠品 天韵条纹面方巾两件套'
      },
      {
        link:'',
        pic:'https://cdn.hulukeji.cn/upload/20210512160344_284.jpg',
        drug:'赠品 最生活毛巾·青春系列轻柔款浴巾'
      },
      {
        link:'',
        pic:'https://cdn.hulukeji.cn/upload/20210512162147_284.jpg',
        drug:'赠品 最生活毛巾·浅色系列  A-1154'
      },
      {
        link:'',
        pic:'https://cdn.hulukeji.cn/upload/20210512165627_284.jpg',
        drug:'赠品 最生活毛巾·儿童系列A-1175'
      }
    ],
    activityList7:[
      {
        link:'',
        pic:'https://cdn.hulukeji.cn/upload/20210402174122_375.jpg',
        drug:'赠品 富安娜决明子枕'
      },
    ],
    activityList8:[
      {
        link:'',
        pic:'https://cdn.hulukeji.cn/upload/20210512135619_122.jpg',
        drug:'赠品 加厚团圆火锅'
      },
    ],
  },
  onLoad:function(){ 
    this.setData( {
      windowHeight: wx.getStorageSync( 'windowHeight' )
    })
    var that = this 
    wx.getSystemInfo({ 
        success: function (res) { 
            that.setData({ 
                clientHeight: res.windowHeight
            }); 
        } 
    }) 
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
      select: false
    }) 
  } 
  },
  swiperChange: function (e) {
    console.log(e);
    this.setData({
      currentTab: e.detail.current, 
    })
  },
  suo: function (e) {  
    wx.navigateTo({  
      url: '/pages/search/index',  
    })  
  }, 
})