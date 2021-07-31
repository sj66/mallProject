// pages/authentication/save.js
const app = getApp();
var that,token;
function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:{
      0:"",
      1:"营业执照",
      2:"药品经营许可证",
      3:"药品经营质量管理规范认证证书",
      4:"法定代表人身份证",
      5:"食品经营许可证",
      6:"第二类医疗器械备案凭证",
      7:"医疗机构执业许可证",
      8:"采购收货证明或委托书"
    },
    code_title:{
      0:"",
      1:"社会统一信用代码",
      2:"许可证证号",
      3:"证书编号",
      4:"身份证号码",
      5:"食品经营许可证",
      6:"第二类医疗器械备案凭证",
      7:"医疗机构执业许可证",
      8:"采购收货证明或委托书"
    },
    id: null,
    enterprise_id:null,
    img: "",
    c_name: "",
    credit_code: "",
    validity_time_cate: '2',
    validity_time: parseTime(new Date().getTime(),'{y}-{m}-{d}'),
    minDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
    dateShow:false
  },
  radioChange(event) {
    this.setData({
      validity_time_cate: event.detail,
    });
  },
  // onInput(event) {
  //   this.setData({
  //     validity_time: event.detail,
  //   });
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(!options.id||!options.enterprise_id){
      wx.navigateBack();
      return false;
    }
    if(options.id==1||options.id==4){
      this.setData({
        id:options.id,
        enterprise_id:options.enterprise_id,
        validity_time_cate:'2'
      })
    }else{
      this.setData({
        id:options.id,
        enterprise_id:options.enterprise_id,
        validity_time_cate:'1'
      })
    }
    that=this;
    wx.setNavigationBarTitle({
      title: this.data.title[options.id] 
    });
    try{
      token=wx.getStorageSync('token') != ''?wx.getStorageSync('token'):null
      if(options.id!=0&&options.id!=6){
        var _img=wx.getStorageSync(options.id+'_img');
        if(_img){
          this.setData({
            img:_img
          });
        }
      }
      if(options.id<5){
        var _credit_code=wx.getStorageSync(options.id+'_credit_code');
        if(_credit_code){
          this.setData({
            credit_code:_credit_code
          });
        }
        var _validity_time=wx.getStorageSync(options.id+'_validity_time');
        if(_validity_time){
          this.setData({
            validity_time:_validity_time
          });
        }
      }
      if(options.id==1||options.id==4){
        var _validity_time_cate=wx.getStorageSync(options.id+'_validity_time_cate');
        if(_validity_time_cate){
          this.setData({
            validity_time_cate:_validity_time_cate
          });
        }
      }
      if(options.id==4){
        var _c_name=wx.getStorageSync(options.id+'_c_name');
        if(_c_name){
          this.setData({
            c_name:_c_name
          });
        }
      }
    }catch(e){
      //TODO handle the exception
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
  
  showDatePopup() {
    this.setData({ dateShow: true });
  },
  closeDatePopup() {
    this.setData({ dateShow: false});
  },
  confirmDatePopup(e){
    this.setData({
      dateShow: false,
      validity_time: parseTime(e.detail,'{y}-{m}-{d}')
    });
  },
  viewImg(){
    wx.previewImage({
      urls: ['https://cdn.hulukeji.cn/images/demo.jpg']
    });
  },
  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: (res) => {
        // console.log('chooseImage success, temp path is', res.tempFilePaths[0])
        that.setData({
          img:res.tempFilePaths[0]
        })
      },
      fail: (err) => {
        // console.log('chooseImage fail', err)
        // app.dialog.tip({msg:'选择图片操作失败'});
        wx.getSetting({
          success: (res) => {
            let authStatus = res.authSetting['scope.album'];
            if (!authStatus) {
              wx.showModal({
                title: '授权失败',
                content: '选择图片需要从您的相册获取图片，请在设置界面打开相关权限',
                success: (res) => {
                  if (res.confirm) {
                    wx.openSetting()
                  }
                }
              })
            }
          }
        })
      }
    })
  },
  goBack(){
    wx.navigateBack();
  },
  saveInfo(){
    if(this.data.id==4&&this.data.c_name.trim().length==0){
      app.dialog.tip({msg:'请输入法定代表人姓名'});
      return false;
    }
    if(this.data.id<5&&this.data.credit_code.trim().length==0){
      app.dialog.tip({msg:'请输入'+this.data.code_title[this.data.id]});
      return false;
    }
    if(!this.data.img){
      app.dialog.tip({msg:'请输入要上传的图片'});
      return false;
    }
    wx.showLoading({title: '保存中...'});
    wx.uploadFile({
      url: app.globalData.apiBaseUrl+'saveEnterprise.php',
      filePath: this.data.img,
      fileType: 'image',
      name: 'img',
      header:{
        'X-Token':token
      },
      formData:{
        id:this.data.id,
        enterprise_id:this.data.enterprise_id,
        credit_code:this.data.credit_code,
        validity_time_cate:this.data.validity_time_cate,
        validity_time:this.data.validity_time,
        c_name:this.data.c_name
      },
      success: (res) => {
        wx.hideLoading();
        // console.log(res.data);
        var res_data=JSON.parse(res.data);
        // console.log('uploadImage success, res is:', res_data)
        if(res_data.status==1){
          try{
            wx.setStorageSync(that.data.id + '_img',that.data.img);
            wx.setStorageSync(that.data.id + '_credit_code',that.data.credit_code);
            wx.setStorageSync(that.data.id + '_validity_time_cate',that.data.validity_time_cate);
            wx.setStorageSync(that.data.id + '_validity_time',that.data.validity_time);
            wx.setStorageSync(that.data.id + '_c_name',that.data.c_name);
          }catch(e){
            //TODO handle the exception
          }
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 800
          })
          setTimeout(function(){
            that.goBack();
          },800)
        }else{
          app.dialog.tip({msg:res_data.info});
        }
      },
      fail: (err) => {
        wx.hideLoading();
        // console.log('uploadImage fail', err);
        app.dialog.tip({msg:err.errMsg});
      }
    });
  },
})