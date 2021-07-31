// pages/price/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productList:[],
    productList1:[],
    // 倒计时
    time: 30 * 60 * 60 * 1000,
    timeSort:true
  },
  onLoad:function(){ 
    var that = this; 
    wx.request({
      url: 'https://jzh.hulukeji.cn/api/wx_app/promote_list.php', //接口地址
      data: {},
      header: {
        'content-type': 'application/json', // 对数据进行 JSON 序列化
      },
      method:'POST',
      success (res) {
        if(res.data.status === 1){
          res.data.items.forEach((item)=>{
            item.end_time=new Date(item.end_time.replace(/\-/g, "/")).getTime()-new Date().getTime();
          })
          let productList = res.data.items;
          let productList1 = res.data.items;
          that.setData({
            productList:productList,
            productList1:productList1,
          })
          // console.log('值',that.data.productList)
        }else{
          wx.showToast({
            title: res.data.info,
            icon: 'none',
            duration: 2000//持续的时间
          })
        }
      }
    })
  },
  // 搜索
  query(e){
    var productList = this.data.productList1;		//先把第二条json存起来
    var productList1 = [];		//定义一个数组
    //循环去取数据
    for(var i=0;i<productList.length;i++){
      var string = productList[i].content;
      console.log('0000000',e.detail.value)
      if(string.indexOf(e.detail.value) >= 0){
        productList1.push(productList[i]);
      }
    }
    if(e.detail.value == ""){
      //加载全部
      this.setData({
        productList: productList
      })
    } else {
      this.setData({
        productList: productList1
      })
    }
  },
  //时间排序
  reverse(){
    let list=[];
    let productList = this.data.productList;
    let timesort=this.data.timeSort;
    this.setData({
      timeSort:!timesort
    })
    if(timesort){
      list=productList.sort(function(a,b){
        return a.end_time < b.end_time ? -1 : 1
      });
    }else{
      list=productList.sort(function(a,b){
        return a.end_time < b.end_time ? 1 : -1
      });
    }
    this.data.productList=[];
    for(let i=0;i<list.length;i++){
      this.data.productList.push(list[i])
    }
    this.setData({
      productList:this.data.productList
    })
  },
  // 点击商品系列
  onHandselList:function(e){
    console.log('看一下促销内容',e,this.data.content)
    wx.navigateTo({
      url: '/pages/price_list/index?content='+e.currentTarget.dataset.content+'&id='+e.currentTarget.dataset.id
    })
  }
 
})