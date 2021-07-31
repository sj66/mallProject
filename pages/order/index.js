// pages/order/index.js
const app=getApp();
var that,ids_num='',car={},goods_num=0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_show_address: false,
    show:false,
    remarks: '', //备注
    addressData: {
      name: '',
      mobile: '',
      province: '',
      city: '',
      district: '',
      address: ''
    },
    ids: '',
    goods_arr: [],
    goods_total: 0.00,
    total: 0.00,
    is_selectAddr: 0,
    is_openPay: false,
    orderno: null,
    price: null,
    check_num: 0,
    goodsList:[
      {
        goods_id:'56333',
        img:'/public/orther_img/produce_bg.png',
        name:'清热消炎宁胶囊',
        specs:'0.5g*36粒',
        company:"广东五虎山药业有限公司",
        price:"13.20",
        mid_pack_num:1,
        big_pack_num:200,
        prod_date:'2020-06-20',
        valid_date:'2022-06-20',
      },
      {
        goods_id:'56333',
        img:'/public/orther_img/produce_bg.png',
        name:'清热消炎宁胶囊',
        specs:'0.5g*36粒',
        company:"广东五虎山药业有限公司",
        price:"13.20",
        mid_pack_num:1,
        big_pack_num:200,
        prod_date:'2020-06-20',
        valid_date:'2022-06-20',
      }
    ],
    // 倒计时
    time: 30 * 60 * 60 * 1000,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    that=this;
    if(!option.order_ids){
      wx.navigateBack();
      return false;
    }
    this.setData({
      ids:option.order_ids
    })
    console.log("数据",option);
    if(!option.goods_num){
      try{
        car = wx.getStorageSync('car')||{};
      }catch(e){
        //TODO handle the exception
      }
    }else{
      console.log('这什么值',car[that.ids])
      car[that.ids]=option.goods_num;
      goods_num=option.goods_num;
    }
    that.getAddr();
    that.getData();
  },
  getAddr(){
    app.axios(app.globalData.apiBaseUrl+'getAddr.php', {},'POST').then(response => {
      let res=response.data;
      if(res.status===1){
        that.setData({
          is_show_address:true,
          addressData:res.addr
        })
      }else{
        app.dialog.tip({msg:res.info});
      }
    });
  },
  getData(){
    app.axios(app.globalData.apiBaseUrl+'car_goods_list.php', {ids:that.data.ids},'POST').then(response => {
      let res=response.data;
      if(res.status===1){
        console.log('值',goods_num,res.items)
        console.log('res.items[0]', res.items[0])
        var total=0,ids_num_arr={};
        if(goods_num>0){
          total = res.items[0]['price'] * 10000 * goods_num / 10000;
          ids_num_arr[res.items[0].goods_id]=goods_num;
          res.items[0]['car_num'] = goods_num;
        }else{
          for (let y = 0; y < res.items.length; y++) {
            console.log('res.items[y]',car, car[res.items[y].goods_id],res.items[y])
            ids_num_arr[res.items[y].goods_id]=car[res.items[y].goods_id];
            res.items[y]['car_num'] = car[res.items[y].goods_id];
            // res.items[y]['car_num'] = car[res.items[y].goods_num];
            total += res.items[y]['price'] * 10000 * res.items[y]['car_num'] / 10000;
          }
        }
        // 计算总价保留两位小数
        total = total.toFixed(2);
        that.setData({
          goods_total:total,
          total:total,
          goods_arr:res.items
        });
        ids_num=JSON.stringify(ids_num_arr)
      }else{
        app.dialog.tip({msg:res.info});
      }
    });
  },
  submitOrder(){
    if(this.data.addressData.address==""){
      app.dialog.tip({msg:"收件人信息不完整"});
      return false;
      }
      app.dialog.loding({msg: '提交中...'});
      app.axios(app.globalData.apiBaseUrl+'order.php', {
        ids_num:ids_num,
        userName: that.data.addressData.name||'',
        telNumber: that.data.addressData.mobile||'',
        // province: that.addressData.province,
        // city: that.addressData.city,
        // district: that.addressData.district,
        area: that.data.addressData.area,
        address: that.data.addressData.address,
        remarks: that.data.remarks
      },'POST').then(response=> {
        // console.log(response);
        app.dialog.loding_close();
        let res=response.data;
        if(res.status===1){
          if(goods_num==0){
            let ids_arr=that.data.ids.split(',');
            for (let i=0;i<ids_arr.length;i++){
              delete car[ids_arr[i]]
            }
            try{
              if(car.length>0){
                wx.setStorageSync('car',car);
              }else{
                wx.removeStorageSync('car');
              }
            }catch(e){
              //TODO handle the exception
            }
          }
          // that.orderno=res.orderno;
          // that.price=res.price;
          
          if(res.is_mon_pay===1){  //判断是不是月结客户
            this.setData({
              show:true
            })
            setTimeout(function () {
              wx.redirectTo({
                url: '/pages/order_detail/index?orderno=' + res.orderno
              })
            }, 5000);
          }else{
            wx.redirectTo({
              url: '/pages/pay/index?is_wx=1&orderno='+res.orderno+'&price='+res.price
            })
          }
        }else{
          app.dialog.tip({msg:res.info});
        }
    }).catch(function (error) {
      app.dialog.loding_close();
      /*console.log(error);*/
      /*that.$dialog.loading.close();*/
      app.dialog.tip({msg: error});
    });
  },
  closePopup(){
    this.setData({
      show:false
    })
  },
  remarks_input(e){
    // console.log(e.detail.value);
    this.setData({
      remarks:e.detail.value
    })
  }
})