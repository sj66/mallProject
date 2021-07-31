// pages/record/index.js
Page({
  data: {
    listData: [
      { "code": "1", "name": "板蓝根", "unit": "包", "format": "20包", "factory":"白云山", "number":"88", "price":"234" },
      { "code": "2", "name": "夏桑菊", "unit": "包", "format": "20包", "factory":"白云山", "number":"88", "price":"234" },
      { "code": "3", "name": "咳嗽灵", "unit": "盒", "format": "4包", "factory":"白云山", "number":"88", "price":"234" },
      { "code": "4", "name": "感冒灵", "unit": "盒", "format": "9包", "factory":"白云山", "number":"88", "price":"234" },
      { "code": "5", "name": "口服液", "unit": "盒", "format": "6瓶", "factory":"白云山", "number":"88", "price":"234"}
    ]
  },
  onLoad: function () {
    console.log('onLoad') 
  }
})