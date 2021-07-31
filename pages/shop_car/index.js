// pages/shop_car/index.js
const app = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_arr:[],
    order_status:false,
    total:"0.00",
    all_select:false,
    qty:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.getStorage({
      key: 'car',
      success(res) {
        // console.log(res.data)
        var ids=Object.keys(res.data).toString();
        // that.setData({
        //   goods_arr: res.data
        // });
        app.dialog.loding({msg: '加载中...'});
        app.axios(app.globalData.apiBaseUrl+'car_goods_list.php', {ids: ids},'POST').then(goods_res => {
          app.dialog.loding_close();
          let res_data=goods_res.data;
            // console.log(res_data)
            if(res_data.status==1){
              var total=0;
              let list=res_data.items;
              list.forEach((item)=>{
                item.qty=parseFloat(item.qty).toFixed(0);
              })
              for (var y = 0; y < res_data.items.length; y++) {
                res_data.items[y]['car_num'] = res.data[res_data.items[y].goods_id];
                res_data.items[y]['selected'] = true;
                total += res_data.items[y]['price'] * 10000 * res_data.items[y]['car_num'] / 10000;
              }
              total = total.toFixed(2);
              console.log('打印一下数据',res_data.items);
              that.setData({
                goods_arr: res_data.items,
                order_status: true,
                total: total,
                all_select: true
              });
            }else{
              app.dialog.tip({msg: res_data.info});
            }
        });
      }
    })
  },
  select_all:function(){
    var goods_arr = this.data.goods_arr, all_select = !this.data.all_select;
    for (var y = 0; y < goods_arr.length; y++) {
      goods_arr[y]['selected'] = all_select;
    }
    this.setData({
      goods_arr: goods_arr,
      all_select: all_select
    });
    this.getTotal();
  },
  goShop:function(){
    wx.switchTab({
      url: '/pages/shop/index'
    })
  },
  select_goods:function(e){
    var id = e.currentTarget.dataset.id, x = e.currentTarget.dataset.x, that = this,goods_arr=this.data.goods_arr;
    if(goods_arr[x]['selected']){
      goods_arr[x]['selected']=false;
      if (this.data.all_select){
        this.setData({
          goods_arr: goods_arr,
          all_select:false
        });
      }
    }else{
      goods_arr[x]['selected']=true;
      var all_selected=true;
      for (var y = 0; y < goods_arr.length; y++) {
        if (!goods_arr[y]['selected']){
          all_selected=false;
          break;
        }
      }
      this.setData({
        goods_arr: goods_arr,
        all_select: all_selected
      });
    }
    this.getTotal();
  },
  getTotal:function(){
    var goods_arr = this.data.goods_arr, order_status=false;
    var total=0.00;
    for (var y = 0; y < goods_arr.length; y++) {
      if (goods_arr[y]['selected']) {
        total += (goods_arr[y].price * goods_arr[y].car_num);
      }
    }
    if (total > 0) {
      order_status=true;
    }
    this.setData({
      total: total.toFixed(2),
      order_status: order_status
    });
  },
  numChange(e){
    console.log('这是e',e)
    var param='goods_arr['+e.currentTarget.dataset.x+'].car_num';
    this.setData({
      [param]:e.detail
    },()=>{
      try {
        var car={};
        console.log('that.data.goods_arr',that.data.goods_arr)
        for (let i=0;i<that.data.goods_arr.length;i++){
          // car[that.data.goods_arr[i].id] = that.data.goods_arr[i].car_num;
          car[that.data.goods_arr[i].goods_id] = that.data.goods_arr[i].car_num;
        }
        if(Object.keys(car).length===0){
          wx.removeStorageSync('car');
        }else {
          wx.setStorageSync('car',car);
        }
      } catch (e) {
          // error
      }
      this.getTotal();
    });
    
  },
  goOrder:function(){
    if(!this.data.order_status){
      return false;
    }
    var token = wx.getStorageSync('token') || '';
    if (token == '') {
      wx.showModal({
        title: '提示',
        content: '您还未登录，是否跳转登录',
        success(res) {
          if (res.confirm) {
            // console.log('用户点击确定')
            wx.switchTab({
              url: '/pages/center/index'
            })
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
    }else{
      var cartIds=[];
      for (var j = 0; j < this.data.goods_arr.length; j++) {
        if (this.data.goods_arr[j].selected) {
          cartIds.push(this.data.goods_arr[j].goods_id);
        }
      }
      console.log('cartIds.join(',')',cartIds.join(','))
      try {
        wx.redirectTo({
          url: '/pages/order/index?order_ids='+cartIds.join(',')
        })
      } catch (e) {
        wx.showToast({ icon:'none',title: '缓存出错，请重试' })
      }
    }
  },
  delGoods(index){
    var goods_arr=this.data.goods_arr,all_select=true;
    goods_arr.splice(index,1);
    for (let i=0;i<goods_arr.length;i++){
      if(!goods_arr[i].selected){
        all_select=false;
      }
    }
    this.setData({
      goods_arr:goods_arr,
      all_select:all_select
    },()=>{
      try {
        var car={};
        for (let i=0;i<that.data.goods_arr.length;i++){
          // car[that.data.goods_arr[i].id] = that.data.goods_arr[i].car_num;
          car[that.data.goods_arr[i].goods_id] = that.data.goods_arr[i].car_num;
        }
        if(Object.keys(car).length===0){
          wx.removeStorageSync('car');
        }else {
          wx.setStorageSync('car',car);
        }
      } catch (e) {
          // error
      }
      this.getTotal();
    });
  },
  swipe_close(e){
    console.log(e);
    const { position, instance } = e.detail;
    switch (position) {
      case 'left':
      case 'cell':
        instance.close();
        break;
      case 'right':
        instance.close();
        app.dialog.confirm({
          content:'确定删除吗？',
          confirmCallback:function(){
            that.delGoods(e.currentTarget.dataset.x);
          }
        });
        break;
    }
  }
})