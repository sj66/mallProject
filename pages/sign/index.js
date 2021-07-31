// pages/sign/index.js
let app = new getApp();
// import * as api from "../../../../api/home.js"//调入后端接口
Page({
  //当前时间
  getNowFormatDate() {
    let date = new Date();
    let seperator1 = "-";
    let seperator2 = ":";
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +" " + date.getHours() + seperator2 + date.getMinutes() +seperator2 + date.getSeconds();
    return currentdate;
  },
  //签到
  calendarSign: function() {
    let data = {
    checkDate: this.getNowFormatDate()
    }
    app.login().then((res) => {
      api.addCheckIn(data).then((res) => {
        if (res.code == 0) {
          this.getCheckedInRecord(this.data.year, this.data.month, this.data.monthDaySize)
          wx.showToast({
            title: '签到成功',
            icon: 'success',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'success',
            duration: 2000
          })
        }
      })
    })
  },
  //获取已签到日期
  getCheckedInRecord: function(year, month, monthDaySize) {
    let calendarSignData = new Array(monthDaySize)
    let data = {
      month: month,
      year: year
    }
    app.login().then((res) => {
      api.getCheckedInRecord(data).then((res) => {
        if (res.code == 0) {
          let arr = res.data.checkedDayList
          for (let value of arr) {
            calendarSignData[value] = value
          }
          this.setData({
            calendarSignData: calendarSignData,
          })
        }
      })
    })
  },
  //初始化
  init: function() {
    let mydate = new Date(); //本地时间
    let year = mydate.getFullYear(); //年
    let month = mydate.getMonth() + 1; //月
    let date = mydate.getDate(); //今日
    let day = mydate.getDay(); //天
    let nbsp = 7 - ((date - day) % 7); //空格
    let monthDaySize; //天数
    if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
      monthDaySize = 31;
    } else if (month == 4 || month == 6 || month == 9 || month == 11) {
      monthDaySize = 30;
    } else if (month == 2) { //计算是否是闰年,如果是二月份则是29天
      if ((year - 2000) % 4 == 0) {
        monthDaySize = 29;
      } else {
        monthDaySize = 28;
      }
    };
    this.setData({
      year: year,
      month: month,
      nbsp: nbsp,
      date: date,
      monthDaySize: monthDaySize
    })
    this.getCheckedInRecord(year, month, monthDaySize) //获取已签到日期
  },
  onLoad: function() {
    this.init() //初始化
  }
})
