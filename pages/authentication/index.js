// pages/authentication/index.js
const app = getApp(),areaList = require('../../utils/area.js'),form = require("../../utils/tui-validation.min.js");
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    steps: [
      {
        text: '填写基本信息'
      },
      {
        text: '上传资质证明'
      },
      {
        text: '提交成功'
      }
    ],
    active: 0,
    show: false,
    columns: ['请选择', '零售药店','诊疗机构'],
    index:0,
    data:{
      cate_val: 0,
      enterprise_name:'',
      contacts_name:'',
      contacts_phone:'',
      addr:'',
      province: '',
      city: '',
      district: '',
      email: '',
      postal_code: ''	
    },
    areaList:[],
    areaShow: false,
  },

  onChange(event) {
    const { picker, value, index } = event.detail;
    // Toast(`当前值：${value}, 当前索引：${index}`);
    this.setData({
      index:index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options',options)
    that=this;
    this.setData({
      areaList:areaList.default,
      info:options.info
    })
  },/**
  * 生命周期函数--监听页面显示
  */
 onShow: function () {
   this.getInfo();
 },
 inputChange(e){
   var param='data.'+e.currentTarget.dataset.param;
   this.setData({
     [param]:e.detail
   })
 },

 showPopup(e) {
   this.setData({ show: true });
 },

 confirmPopup() {
   this.setData({
     'data.cate_val':this.data.index,
     'value':this.data.index,
     show: false
   })
 },
 closePopup() {
   this.setData({ show: false});
 },
 showAreaPopup() {
   this.setData({ areaShow: true });
 },
 closeAreaPopup() {
   this.setData({ areaShow: false});
 },
 confirmAreaPopup(e){
   this.setData({
     areaShow: false,
     'data.province':e.detail.values[0].name,
     'data.city':e.detail.values[1].name,
     'data.district':e.detail.values[2].name,
     'province':e.detail.values[0].name,
     'city':e.detail.values[1].name,
     'district':e.detail.values[2].name,
   });
 },
 getInfo(){
   // wx.showLoading({title: '提交中...'});
   app.axios(app.globalData.apiBaseUrl+'getEnterprise.php', {
   },'POST').then(response => {
     // wx.hideLoading();
     // console.log(response);
     let res=response.data;
     if(res.status===1){
       var data={};
       if(res.data['cate_val']){
         data['cate_val']=parseInt(res.data['cate_val']);
       }else{
         data['cate_val']=0;
       }
       if(res.data['enterprise_name']){
         data['enterprise_name']=res.data['enterprise_name'];
       }else{
         data['enterprise_name']='';
       }
       if(res.data['contacts_name']){
         data['contacts_name']=res.data['contacts_name'];
       }else{
         data['contacts_name']='';
       }
       if(res.data['contacts_phone']){
         data['contacts_phone']=res.data['contacts_phone'];
       }else{
         data['contacts_phone']='';
       }
       if(res.data['email']){
         data['email']=res.data['email'];
       }else{
         data['email']='';
       }
       if(res.data['postal_code']){
         data['postal_code']=res.data['postal_code'];
       }else{
         data['postal_code']='';
       }
       if(res.data['area']){
         data['province']=res.data['province'];
         data['city']=res.data['city'];
         data['district']=res.data['area'];
       }else{
         data['province']='';
         data['city']='';
         data['district']='';
       }
       if(res.data['addr']){
         data['addr']=res.data['addr'];
       }else{
         data['addr']='';
       }
       that.setData({
         index:data['cate_val'],
         data:data
       });
     }else{
       // app.dialog.tip({msg:res.info});
     }
   });
 },
 enterpriseSubmit: function(e) {
   console.log('9999999',this)
   if(this.data.index==0){
     app.dialog.tip({msg:'请选择企业类型'});
     return false;
   }
   if(this.data.data.district.trim().length==0){
     app.dialog.tip({msg:'请选择营业执照地址所在的省市区'});
     return false;
   }
   //表单规则
   let rules = [{
     name: "enterprise_name",
     rule: ["required"], //可使用区间，此处主要测试功能
     msg: ["请输入企业名称"]
   }, {
     name: "contacts_name",
     rule: ["required"],
     msg: ["请输入联系人"]
   }, {
     name: "contacts_phone",
     rule: ["required", "isMobile"],
     msg: ["请输入联系电话", "请输入11位的联系电话"]
   }, {
     name: "addr",
     rule: ["required"],
     msg: ["请输入营业执照详细地址"]
   }, {
     name: "email",
     rule: ["isEmail"],
     msg: ["请输入正确的邮箱"]
   }];
   //进行表单检查
   let formData = this.data.data;
   // console.log(formData);
   let checkRes = form.validation(formData, rules);
   if (!checkRes) {
     wx.showLoading({title: '提交中...'});
     app.axios(app.globalData.apiBaseUrl+'addEnterprise.php', {
       enterprise_name: formData.enterprise_name,
       contacts_name: formData.contacts_name,
       contacts_phone: formData.contacts_phone,
       addr: formData.addr,
       province: formData.province,
       city: formData.city,
       area: formData.district,
       cate_val: formData.cate_val,
       email: formData.email,
       postal_code: formData.postal_code
     },'POST').then(response => {
       wx.hideLoading();
       let res=response.data;
       if(res.status===1){
         that.setData({
           active:1,
           enterprise_id:res.enterprise_id
         })
         wx.setStorage({
           key:'userName',
           data:res.userName
         });
       }else{
         app.dialog.tip({msg:res.info});
       }
     });
   } else {
     app.dialog.tip({msg:checkRes});
   }
 },
 saveInfo(){
   wx.showLoading({title: '提交中...'});
   app.axios(app.globalData.apiBaseUrl+'saveEnterprise1.php', {
     id: -1,
     enterprise_id: this.data.enterprise_id
   },'POST').then(response => {
     wx.hideLoading();
     // console.log(response);
     let res=response.data;
     if(res.status===1){
       that.setData({
         active:2
       })
     }else{
       app.dialog.tip({msg:res.info});
     }
   });
 },
 goUpload(e){
   // console.log(e)
   wx.navigateTo({
     url:'/pages/authentication/save?id='+e.currentTarget.dataset.i+"&enterprise_id="+this.data.enterprise_id
   });
 },
 goBack(){
   wx.navigateBack();
 },
 goBack1(){
   this.setData({
     active:0
   })
 }
})