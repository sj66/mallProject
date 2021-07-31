//index.js
//获取应用实例
const app = getApp()
Page({
  data: { 
    naviList:[
      {
        icon:'/public/orther_img/upload_photos.png',
        title:'拍照上传来货单',
        link:'/pages/photo/index',
        type:'nav'
      },
      {
        icon:'/public/orther_img/price_record.png',
        title:'调价记录',
        link:'/pages/record/index',
        type:'nav'
      },
      {
        icon:'/public/orther_img/data_docking.png',
        title:'申请数据对接',
        link:'/pages/datas/index',
        type:'nav'
      }
    ],
  }, 
})
   
