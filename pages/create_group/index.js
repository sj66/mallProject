//index.js
//获取应用实例
var app = getApp()    
Page({  
    data: {
        radio: '1',
    },
    onChange(event) {
        console.log("event.detail",event)
        if(event.detail=2){
            wx.redirectTo({
                url:"/pages/authentication/index?info="+event.detail
            })
        }
        this.setData({
            radio: event.detail,
        });
    },
    //完成
    onComplete:function(){
        // wx.navigateTo({
        //     url: '/pages/login/index',
        // })
    }
}) 