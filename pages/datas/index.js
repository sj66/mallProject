//index.js
//获取应用实例
var app = getApp()    
Page({  
    modalcnt:function(){  
        wx.showModal({  
            title: '提示',  
            content: '是否申请系统数据对接',  
            success: function(res) {  
                if (res.confirm) {  
                console.log('用户点击确定')  
                } else if (res.cancel) {  
                console.log('用户点击取消')  
                }  
            }  
        })  
    }  
}) 