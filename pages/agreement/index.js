//index.js
//获取应用实例
const app = getApp()
Page({
  data: { 
    // tab切换 
    currentTab: 1, 
    contractList:[],
  }, 
  onLoad:function(options){
    // // 获取token，并存储起来
    // let token = '833e41b4d23e62ea84179ccc013d3c1b1977955fbf29a78b627ac44e1fd78048';
    // //将token存到本地存储中
    // wx.setStorageSync('token',token);
    
    // 路径传参
    // var tab = options.tab
    // this.setData({
    //   currentTab: tab
    // })
    this.swichNav(0);
  },
  swichNav: function (e) { 
    console.log('看看值',e); 
    var token = wx.getStorageSync('token')
    console.log('这个token是',token)
    var that = this; 
    if(e==0){
      that.setData({ 
        currentTab:1
      })
    }else{
      that.setData({ 
        currentTab: e.target.dataset.current, 
        currentId:e.currentTarget.dataset.id
      }) 
    }
    // 加载合同协议列表
    wx.request({
      url: 'https://jzh.hulukeji.cn/api/wx_app/my_agreement.php', //接口地址
      data: {
          cate:this.data.currentTab,
          last_id:this.data.last_id,
      },
      header: {
        'content-type': 'application/json', // 对数据进行 JSON 序列化
        'X-Token': token,
      },
      method:'POST',
      success (res) {
        console.log('拿值',res.data)
        let contractList = res.data.items;
        console.log('列表',contractList)
        that.setData({
          contractList:contractList
        })
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
  swiperChange: function (e) {
    console.log('看事件',e);
    this.setData({
      currentTab: e.detail.current, 
    })
  },
  onDetails:function(e){
    console.log('看这个事件',e)
    var data=this.data.contractList;
    var tab = this.data.currentTab;
    var p = e.currentTarget.dataset.id
    console.log('看id是什么？',data,p,this.data.currentTab)
    wx.navigateTo({url:'/pages/agreement_details/index?id='+p+ '&tab=' + tab}) 
  }
})
   
