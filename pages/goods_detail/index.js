// pages/goods_detail/index.js
var app=getApp(),that,goods_id;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_id:null,
    imgs: '', // 分享封面
    scene:'',//分享二维码
    context: null, // canvas
    data:{
      goods_id:'',
      list:{},
      content_list:{},
      name:'',
      specs:'',
      company:'',
      activity:'',
      title:'',
      details:'',
      batch_number:'',
      limited_period:'',
      mid_pack_num:'',
      big_pack_num:'',
      priceLeft:'',
      priceRight:'',
      user_status:0
    },
    show:false,
    car_num:1,
    hei:100,
    cont_index:0,
    cont_scroll_hei:0,
    // 倒计时
    time: 30 * 60 * 60 * 1000,
    // 缺货提示
    showTip:false,
    // 分享弹窗
    shareShow:false,
    // 分享朋友圈
    showPoster:false,//隐藏显示
    maskHidden: true,//隐藏显示
    y_menus:[
      {title:"生成商业海报",icon:"../../public/orther_img/poster.png"},
      {title:"生成终端海报",icon:"../../public/orther_img/terminal.png"}
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var id = options.id; //页面跳转传过来的值
    console.log('111111',options)
    const scene = decodeURIComponent(options.scene)
    if(!scene && !options.goods_id){
      wx.navigateBack();
    }
    if(options.is_share){
      this.setData({
        cont_index:1
      })
    }
    if(options.qty==0){
      this.setData({
        showTip:true
      })
    }
    this.setData({
      hei: wx.getSystemInfoSync().windowHeight
    })
    
    that=this;
    goods_id= options.scene ? scene : options.goods_id;
    this.setData({
      goods_id: goods_id
    })
    this.getData(goods_id);
    // 分享朋友圈
    // 此处获取设备的宽高。canvas绘制的图片以次宽高为准
    var _this = this;
      wx.getSystemInfo({
        success: function(res) {
            _this.setData({
                // windowW: res.windowWidth,
                // windowH: res.screenHeight,
                windowW: 500,
                windowH: 930,
            })
        },
    })
    
  },
  onReady: function() {
    var context = wx.createCanvasContext("mycanvas");
    this.setData({
      context: context
    })
  },
  //将分享标题绘制到canvas的固定
  setContent: function(context) {
    if(!this.data.data.share_title){
      return;
    }
    var content = this.data.data.share_title;//这是要绘制的文本
    var chr = content.split("");//这个方法是将一个字符串分割成字符串数组
    var temp = "";
    var row = [];
    context.setFontSize(24);
    context.setFillStyle("#000000");
    for (var a = 0; a < chr.length; a++) {
      if (context.measureText(temp).width < 460) {
        temp += chr[a];
      }
      else {
        a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
        row.push(temp);
        temp = "";
      }
    }
    row.push(temp); 
 
    //如果数组长度大于2 则截取前两个
    if (row.length > 2) {
      var rowCut = row.slice(0, 2);
      var rowPart = rowCut[1];
      var test = "";
      var empty = [];
      for (var a = 0; a < rowPart.length; a++) {
        if (context.measureText(test).width < 460) {
          test += rowPart[a];
        }
        else {
          break;
        }
      }
      empty.push(test);
      var group = empty[0] + "..."//这里只显示两行，超出的用...表示
      rowCut.splice(1, 1, group);
      row = rowCut;
    }else{
      context.fillText(content, 20, 50, 460);// row[b],x轴,y轴+行高,300
      return;
    }
    for (var b = 0; b < row.length; b++) {
      context.fillText(row[b], 20, 30 + b * 30, 460);// row[b],x轴,y轴+行高,300
    }
  },
  //将商品id绘制到canvas的固定（终端）
  setId: function(context) {
    var Id = this.data.data.goods_id;
    context.setFontSize(24);
    context.setFillStyle("#000000");
    if(!this.data.data.share_title){
      context.fillText(Id, 20, 428);
    }else{
      context.fillText(Id, 20, 508);
    }
    context.stroke();
  },
  //将商品id绘制到canvas的固定（商业）
  setIdTitle: function(context) {
    var idTitle = "编   号：";
    context.setFontSize(24);
    context.setFillStyle("#737373");
    if(!this.data.data.share_title){
      context.fillText(idTitle, 20, 438);
    }else{
      context.fillText(idTitle, 20, 508);
    }
    context.stroke();
  },
  setIdContent: function(context) {
    var idContent = this.data.data.goods_id;
    context.setFontSize(24);
    context.setFillStyle("#000000");
    if(!this.data.data.share_title){
      context.fillText(idContent, 110, 438);
    }else{
      context.fillText(idContent, 110, 508);
    }
    context.stroke();
  },
  //将商品名绘制到canvas的固定(终端)
  setName: function(context) {
    var name = this.data.data.name;
    var chr = name.split("");//这个方法是将一个字符串分割成字符串数组
    var temp = "";
    var row = [];
    context.setFontSize(24);
    context.setFillStyle("#000000");
    for (var a = 0; a < chr.length; a++) {
      if (context.measureText(temp).width < 280) {
        temp += chr[a];
      }
      else {
        a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
        row.push(temp);
        temp = "";
      }
    }
    row.push(temp); 
    let contents = '' // 绘制的文字
    if (row.length > 1) {
      // 长度大于1
      contents = row[0] + '...'
    } else {
      contents = row[0]
    }
    if(!this.data.data.share_title){
      context.fillText(contents, 20, 458 , 280);// row[b],x轴,y轴+行高,300
    }else{
      context.fillText(contents, 20, 538 , 280);// row[b],x轴,y轴+行高,300
    }
  },
  //将商品名绘制到canvas的固定(商业)
  setNameTitle: function(context) {
    var nameTitle = "名   称：";
    context.setFontSize(24);
    context.setFillStyle("#737373");
    if(!this.data.data.share_title){
      context.fillText(nameTitle, 20, 473);
    }else{
      context.fillText(nameTitle, 20, 543);
    }
    context.stroke();
  },
  setNameContent: function(context) {
    var nameContent = this.data.data.name;
    context.setFontSize(24);
    context.setFillStyle("#000000");
    if(!this.data.data.share_title){
      context.fillText(nameContent, 110, 473);
    }else{
      context.fillText(nameContent, 110, 543);
    }
    context.stroke();
  },
  //将规格绘制到canvas的固定(终端)
  setSpecs: function(context) {
    var specs =this.data.data.specs;
    var chr = specs.split("");//这个方法是将一个字符串分割成字符串数组
    var temp = "";
    var row = [];
    context.setFontSize(24);
    context.setFillStyle("#000000");
    for (var a = 0; a < chr.length; a++) {
      if (context.measureText(temp).width < 280) {
        temp += chr[a];
      }
      else {
        a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
        row.push(temp);
        temp = "";
      }
    }
    row.push(temp); 
    let contents = '' // 绘制的文字
    if (row.length > 1) {
      // 长度大于1
      contents = row[0] + '...'
    } else {
      contents = row[0]
    }
    if(!this.data.data.share_title){
      context.fillText(contents, 20, 492);
    }else{
      context.fillText(contents, 20, 572);
    }
    // context.stroke();
  },
  //将规格绘制到canvas的固定(商业)
  setSpecsTitle: function(context) {
    var specsTitle = "规   格：";
    context.setFontSize(24);
    context.setFillStyle("#737373");
    if(!this.data.data.share_title){
      context.fillText(specsTitle, 20, 507);
    }else{
      context.fillText(specsTitle, 20, 577);
    }
    context.stroke();
  },
  setSpecsContent: function(context) {
    var specsContent = this.data.data.specs;
    context.setFontSize(24);
    context.setFillStyle("#000000");
    if(!this.data.data.share_title){
      context.fillText(specsContent, 110, 512);
    }else{
      context.fillText(specsContent, 110, 582);
    }
    context.stroke();
  },
  //将厂家绘制到canvas的固定(终端)
  setCompany: function(context) {
    var company =this.data.data.company;
    var chr = company.split("");//这个方法是将一个字符串分割成字符串数组
    var temp = "";
    var row = [];
    context.setFontSize(24);
    context.setFillStyle("#000000");
    for (var a = 0; a < chr.length; a++) {
      if (context.measureText(temp).width < 280) {
        temp += chr[a];
      }
      else {
        a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
        row.push(temp);
        temp = "";
      }
    }
    row.push(temp); 
    let contents = '' // 绘制的文字
    if (row.length > 1) {
      // 长度大于1
      contents = row[0] + '...'
    } else {
      contents = row[0]
    }
    if(!this.data.data.share_title){
      context.fillText(contents, 20, 528 , 280);// row[b],x轴,y轴+行高,300
    }else{
      context.fillText(contents, 20, 606 , 280);// row[b],x轴,y轴+行高,300
    }
  },
  //将厂家绘制到canvas的固定(商业)
  setCompanyTitle: function(context) {
    var companyTitle = "厂   家：";
    context.setFontSize(24);
    context.setFillStyle("#737373");
    if(!this.data.data.share_title){
      context.fillText(companyTitle, 20, 550);
    }else{
      context.fillText(companyTitle, 20, 620);
    }
    context.stroke();
  },
  setCompanyContent: function(context) {
    var companyContent = this.data.data.company;
    var chr = companyContent.split("");//这个方法是将一个字符串分割成字符串数组
    var temp = "";
    var row = [];
    context.setFontSize(24);
    context.setFillStyle("#000000");
    for (var a = 0; a < chr.length; a++) {
      if (context.measureText(temp).width < 360) {
        temp += chr[a];
      }
      else {
        a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
        row.push(temp);
        temp = "";
      }
    }
    row.push(temp); 
    let contents = '' // 绘制的文字
    if (row.length > 1) {
      // 长度大于1
      contents = row[0] + '...'
    } else {
      contents = row[0]
    }
    if(!this.data.data.share_title){
      context.fillText(contents, 110, 550 , 360);// row[b],x轴,y轴+行高,300
    }else{
      context.fillText(contents, 110, 620 , 360);// row[b],x轴,y轴+行高,300
    }
  },
  // 将中包装数和大包装数绘制到canvas的固定（终端）
  setMidNum:function(context){
    var midNum = "中包装：" + this.data.data.mid_pack_num;
    context.setFontSize(24);
    context.setFillStyle("#000000");
    if(!this.data.data.share_title){
      context.fillText(midNum, 20, 565);
    }else{
      context.fillText(midNum, 20, 640);
    }
    context.stroke();
  },
  setBigNum:function(context){
    var bigNum = "大包装：" + this.data.data.big_pack_num;
    context.setFontSize(24);
    context.setFillStyle("#000000");
    if(!this.data.data.share_title){
      context.fillText(bigNum, 150, 565);
    }else{
      context.fillText(bigNum, 150, 640);
    }
    context.stroke();
  },
  //将中包装数绘制到canvas的固定(商业)
  setMidNumTitle: function(context) {
    var midNumTitle = "中包装：";
    context.setFontSize(24);
    context.setFillStyle("#737373");
    if(!this.data.data.share_title){
      context.fillText(midNumTitle, 20, 590);
    }else{
      context.fillText(midNumTitle, 20, 660);
    }
    context.stroke();
  },
  setMidNumContent: function(context) {
    var midNumContent = this.data.data.mid_pack_num;
    context.setFontSize(24);
    context.setFillStyle("#000000");
    if(!this.data.data.share_title){
      context.fillText(midNumContent, 110, 590);
    }else{
      context.fillText(midNumContent, 110, 660);
    }
    context.stroke();
  },
  //将大包装数绘制到canvas的固定(商业)
  setBigNumTitle: function(context) {
    var bigNumTitle = "大包装：";
    context.setFontSize(24);
    context.setFillStyle("#737373");
    if(!this.data.data.share_title){
      context.fillText(bigNumTitle, 20, 630);
    }else{
      context.fillText(bigNumTitle, 20, 700);
    }
    context.stroke();
  },
  setBigNumContent: function(context) {
    var bigNumContent = this.data.data.big_pack_num;
    context.setFontSize(24);
    context.setFillStyle("#000000");
    if(!this.data.data.share_title){
      context.fillText(bigNumContent, 110, 630);
    }else{
      context.fillText(bigNumContent, 110, 700);
    }
    context.stroke();
  },
  // 将活动剩余绘制到canvas的固定
  setLave:function(context){
    if(!this.data.data.promote || !this.data.data.promote.end_time||new Date(this.data.data.promote.end_time.replace(/\-/g, "/")).getTime()-new Date().getTime()<0){
      return;
    }
    var lave = "活动结束日期";
    context.setFontSize(20);
    context.setFillStyle("#ffffff");
    if(!this.data.data.share_title){
      context.fillText(lave, 352, 452);
    }else{
      context.fillText(lave, 352, 532);
    }
    context.stroke();
  },
  // 将结束时间绘制到canvas的固定
  setCountdown:function(context){
    if(!this.data.data.promote || !this.data.data.promote.end_time||new Date(this.data.data.promote.end_time.replace(/\-/g, "/")).getTime()-new Date().getTime()<0){
      return;
    }
    var endTimes=" "+" "+this.data.data.promote.end_time.substring(0,10).replace(/-/,'年 '+ ' ').replace(/-/,'月') + "日";
    var chr = endTimes.split("");//这个方法是将一个字符串分割成字符串数组
    var temp = "";
    var row = [];
    context.setFontSize(24);
    context.setFillStyle("#000000");
    for (var a = 0; a < chr.length; a++) {
      if (context.measureText(temp).width < 100) {
        temp += chr[a];
      }
      else {
        a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
        row.push(temp);
        temp = "";
      }
    }
    row.push(temp); 
 
    //如果数组长度大于2 则截取前两个
    if (row.length > 2) {
      var rowCut = row.slice(0, 2);
      var rowPart = rowCut[1];
      var test = "";
      var empty = [];
      for (var a = 0; a < rowPart.length; a++) {
        if (context.measureText(test).width < 100) {
          test += rowPart[a];
        }
        else {
          break;
        }
      }
      empty.push(test);
      var group = empty[0] + "..."//这里只显示两行，超出的用...表示
      rowCut.splice(1, 1, group);
      row = rowCut;
    }
    if(!this.data.data.share_title){
      for (var b = 0; b < row.length; b++) {
        context.fillText(row[b], 362, 497 + b * 30, 100);// row[b],x轴,y轴+行高,300
      }
    }else{
      for (var b = 0; b < row.length; b++) {
        context.fillText(row[b], 362, 577 + b * 30, 100);// row[b],x轴,y轴+行高,300
      }
    }
  },
  //将活动绘制到canvas的固定
  setActivity: function(context) {
    if(!this.data.data.promote || !this.data.data.promote.content||new Date(this.data.data.promote.end_time.replace(/\-/g, "/")).getTime()-new Date().getTime()<0){
      return;
    }
    var activity = this.data.data.promote.content;//这是要绘制的文本
    var chr = activity.split("");//这个方法是将一个字符串分割成字符串数组
    var temp = "";
    var row = [];
    context.setFontSize(22);
    context.setFillStyle("#ff0000");
    // context.setFillStyle("#000000");
    for (var a = 0; a < chr.length; a++) {
      if (context.measureText(temp).width < 440) {
        temp += chr[a];
      }
      else {
        a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
        row.push(temp);
        temp = "";
      }
    }
    row.push(temp); 
    //如果数组长度大于4 则截取前4个
    if (row.length > 4) {
      var rowCut = row.slice(0, 4);
      var rowPart = rowCut[1];
      var test = "";
      var empty = [];
      for (var a = 0; a < rowPart.length; a++) {
        if (context.measureText(test).width < 440) {
          test += rowPart[a];
        }
        else {
          break;
        }
      }
      empty.push(test);
      var group = empty[0] + "..."//这里只显示两行，超出的用...表示
      rowCut.splice(3, 1, group);
      row = rowCut;
    }
    if(!this.data.data.share_title){
      for (var b = 0; b < row.length; b++) {
        context.fillText(row[b], 20, 630 + b * 30, 440);// row[b],x轴,y轴+行高,300
      }
    }else{
      for (var b = 0; b < row.length; b++) {
        context.fillText(row[b], 20, 685 + b * 30, 440);// row[b],x轴,y轴+行高,300
      }
    }
  },
  //将标题绘制到canvas固定
  setTitle: function (context) {
    var title = "家之和商城"
    context.setFillStyle("#000000"); //填充背景颜色
    context.font = 'normal bold 26px sans-serif';//设置字体加粗
   if(!this.data.data.share_title){
      context.fillText(title, 20, 780);
    }else{
      context.fillText(title, 20, 850);
    }
    context.stroke();
  },
  //将说明绘制到canvas固定
  setDetails: function(context){
    var details = "识别二维码下单，获取更多优惠！"//这是要绘制的文本
    context.setFillStyle("#484a3d"); //填充背景颜色
    context.font = 'normal normal 24px sans-serif';//设置字体
    // if(!this.data.data.promote || !this.data.data.promote.content||new Date(this.data.data.promote.end_time.replace(/\-/g, "/")).getTime()-new Date().getTime()<0){
    if(!this.data.data.share_title){
      context.fillText(details, 20, 830);
    }else{
      context.fillText(details, 20, 890);
    }
    context.stroke();
  },
  // 将联系我们绘制到canvas固定
  setCallMe: function(context) {
    var callMe = "联系我们";
    // context.setFontSize(20);
    context.setFillStyle("#737373");
    context.font = 'normal bold 20px sans-serif';
    if(!this.data.data.share_title){
      context.fillText(callMe, 20, 680);
    }else{
      context.fillText(callMe, 20, 740);
    }
    context.stroke();
  },
  // 将广东粤东绘制到canvas绘制
  setEastName: function(context) {
    var eastName = "广东粤东";
    // context.setFontSize(20);
    context.setFillStyle("#737373");
    context.font = 'normal normal 20px sans-serif';
    if(!this.data.data.share_title){
      context.fillText(eastName, 20, 710);
    }else{
      context.fillText(eastName, 20, 770);
    }
    context.stroke();
  },
  setEastPhone: function(context) {
    var eastPhone = "手机：";
    context.setFontSize(20);
    context.setFillStyle("#737373");
    if(!this.data.data.share_title){
      context.fillText(eastPhone, 110, 710);
    }else{
      context.fillText(eastPhone, 110, 770);
    }
    context.stroke();
  },
  setEastNumber: function(context) {
    var eastNumber = "186 2000 0370";
    context.setFontSize(20);
    context.setFillStyle("#000000");
    if(!this.data.data.share_title){
      context.fillText(eastNumber, 160, 710);
    }else{
      context.fillText(eastNumber, 160, 770);
    }
    context.stroke();
  },
  setEastQQ: function(context) {
    var eastQQ = "QQ ：";
    context.setFontSize(20);
    context.setFillStyle("#737373");
    if(!this.data.data.share_title){
      context.fillText(eastQQ, 315, 710);
    }else{
      context.fillText(eastQQ, 315, 770);
    }
    context.stroke();
  },
  setEastNum: function(context) {
    var eastNum = "96981 3300";
    context.setFontSize(20);
    context.setFillStyle("#000000");
    if(!this.data.data.share_title){
      context.fillText(eastNum, 365, 710);
    }else{
      context.fillText(eastNum, 365, 770);
    }
    context.stroke();
  },
  // 将广东粤西绘制到canvas绘制
  setWeatName: function(context) {
    var weatName = "广东粤西";
    // context.setFontSize(20);
    context.setFillStyle("#737373");
    context.font = 'normal normal 20px sans-serif';
    if(!this.data.data.share_title){
      context.fillText(weatName, 20, 740);
    }else{
      context.fillText(weatName, 20, 800);
    }
    context.stroke();
  },
  setWeatPhone: function(context) {
    var weatPhone = "手机：";
    context.setFontSize(20);
    context.setFillStyle("#737373");
    if(!this.data.data.share_title){
      context.fillText(weatPhone, 110, 740);
    }else{
      context.fillText(weatPhone, 110, 800);
    }
    context.stroke();
  },
  setWeatNumber: function(context) {
    var weatNumber = "186 2000 1091";
    context.setFontSize(20);
    context.setFillStyle("#000000");
    if(!this.data.data.share_title){
      context.fillText(weatNumber, 160, 740);
    }else{
      context.fillText(weatNumber, 160, 800);
    }
    context.stroke();
  },
  setWeatQQ: function(context) {
    var weatQQ = "QQ ：";
    context.setFontSize(20);
    context.setFillStyle("#737373");
    if(!this.data.data.share_title){
      context.fillText(weatQQ, 315, 740);
    }else{
      context.fillText(weatQQ, 315, 800);
    }
    context.stroke();
  },
  setWeatNum: function(context) {
    var weatNum = "96980 2233";
    context.setFontSize(20);
    context.setFillStyle("#000000");
    if(!this.data.data.share_title){
      context.fillText(weatNum, 365, 740);
    }else{
      context.fillText(weatNum, 365, 800);
    }
    context.stroke();
  },
  // 将全国内勤绘制到canvas绘制
  setBackName: function(context) {
    var backName = "全国内勤";
    // context.setFontSize(20);
    context.setFillStyle("#737373");
    context.font = 'normal normal 20px sans-serif';
    if(!this.data.data.share_title){
      context.fillText(backName, 20, 770);
    }else{
      context.fillText(backName, 20, 830);
    }
    context.stroke();
  },
  setBackPhone: function(context) {
    var backPhone = "手机：";
    context.setFontSize(20);
    context.setFillStyle("#737373");
    if(!this.data.data.share_title){
      context.fillText(backPhone, 110, 770);
    }else{
      context.fillText(backPhone, 110, 830);
    }
    context.stroke();
  },
  setBackNumber: function(context) {
    var backNumber = "186 2000 0630";
    context.setFontSize(20);
    context.setFillStyle("#000000");
    if(!this.data.data.share_title){
      context.fillText(backNumber, 160, 770);
    }else{
      context.fillText(backNumber, 160, 830);
    }
    context.stroke();
  },
  setBackQQ: function(context) {
    var backQQ = "QQ ：";
    context.setFontSize(20);
    context.setFillStyle("#737373");
    if(!this.data.data.share_title){
      context.fillText(backQQ, 315, 770);
    }else{
      context.fillText(backQQ, 315, 830);
    }
    context.stroke();
  },
  setBackNum: function(context) {
    var backNum = "96983 2233";
    context.setFontSize(20);
    context.setFillStyle("#000000");
    if(!this.data.data.share_title){
      context.fillText(backNum, 365, 770);
    }else{
      context.fillText(backNum, 365, 830);
    }
    context.stroke();
  },
  // 将公司名称绘制到canvas固定
  setCompanyName: function(context) {
    var companyName = "公司名称：广东家之和药业有限公司";
    context.setFontSize(18);
    context.setFillStyle("#000000");
    if(!this.data.data.share_title){
      context.fillText(companyName, 80, 820);
    }else{
      context.fillText(companyName, 80, 880);
    }
    context.stroke();
  },
  // 将公司地址绘制到canvas固定
  setCompanyAddress: function(context) {
    var companyAddress = "联系地址：广州市番禺区石基镇市莲路永善村段6号";
    context.setFontSize(18);
    context.setFillStyle("#000000");
    if(!this.data.data.share_title){
      context.fillText(companyAddress, 80, 850);
    }else{
      context.fillText(companyAddress, 80, 910);
    }
    context.stroke();
  },
  getImgInfo: function (url) {
    return new Promise((resolve, reject) => {
      if (this.data.imgs) {
        resolve(this.data.imgs)
      } else {
        // 获取图片信息 （配置downloadFile 合法域名 不然是获取不到资源的）
        wx.getImageInfo({
          src: url,//服务器返回的图片地址
          success: (res) => {
            this.setData({
              imgs: res.path,
            })
            resolve(res.path)
          },
          fail: function (res) {}
        });
      }
    })
  },
  getQrcodeInfo: function (url) {
    return new Promise((resolve, reject) => {
      if (this.data.scene) {
        resolve(this.data.scene)
      } else {
        // 获取图片信息 （配置downloadFile 合法域名 不然是获取不到资源的）
        wx.getImageInfo({
          src: url,//服务器返回的图片地址
          success: (res) => {
            this.setData({
              scene: res.path,
            })
            resolve(res.path)
          },
          fail: function (res) {}
        });
      }
    })
  },
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src >>>终端海报
  createNewImg: async function() {
    var _this = this;
    var context = this.data.context
    context.setFillStyle('#FFF')
    context.fillRect(0, 0, this.data.windowW, this.data.windowH)
    // 无促销信息（产品背景颜色）
    // if(!this.data.data.promote || !this.data.data.promote.content||new Date(this.data.data.promote.end_time.replace(/\-/g, "/")).getTime()-new Date().getTime()<0){
    if(!this.data.data.share_title){
      // 绘制产品背景颜色
      context.setFillStyle('#f9f9f9');
      context.fillRect(0, 0, 500,722);// x轴位置、y轴位置、宽度、高度
    }else{
      // 绘制产品背景颜色
      context.setFillStyle('#f9f9f9');
      context.fillRect(0, 0, 500,790);// x轴位置、y轴位置、宽度、高度
    }
    // 有分享标题有促销内容（促销信息背景颜色+促销时间背景框）
    if(this.data.data.share_title&&(this.data.data.promote.end_time && new Date(this.data.data.promote.end_time.replace(/\-/g, "/")).getTime()-new Date().getTime()>0)){
      // 绘制活动信息背景颜色
      context.setFillStyle('#fff8e5');
      context.fillRect(0, 648, 500, 140);// x轴位置、y轴位置、宽度、高度
      //矩形颜色
      context.fillStyle = '#ff0000';
      // 红色实心矩形 x坐标, y坐标, 宽度, 高度
      context.fillRect(345,506,135,40)
      //矩形边框
      context.lineWidth=1;
      //矩形边框颜色
      context.strokeStyle="#ff0000";
      //x,y,宽度,高度
      context.rect(345,506,135,0)//上边框
      context.rect(345,506,0,120)//左边框
      context.rect(345,626,135,0)//下边框
      context.rect(480,506,0,120)//右边框
    }
    // 无分享标题有促销内容（促销信息背景颜色+促销时间背景框）
    if(!this.data.data.share_title && (this.data.data.promote.end_time && new Date(this.data.data.promote.end_time.replace(/\-/g, "/")).getTime()-new Date().getTime()>0)){
      // 绘制活动信息背景颜色
      context.setFillStyle('#fff8e5');
      context.fillRect(0, 580, 500, 140);// x轴位置、y轴位置、宽度、高度
       //矩形颜色
       context.fillStyle = '#ff0000';
       // 红色实心矩形 x坐标, y坐标, 宽度, 高度
       context.fillRect(345,426,135,40)
       //矩形边框
       context.lineWidth=1;
       //矩形边框颜色
       context.strokeStyle="#ff0000";
       //x,y,宽度,高度
       context.rect(345,426,135,0)//上边框
       context.rect(345,426,0,120)//左边框
       context.rect(345,546,135,0)//下边框
       context.rect(480,426,0,120)//右边框
    }
    // 无分享标题无促销内容（促销信息背景颜色+促销时间背景框）
    if(!this.data.data.share_title && (!this.data.data.promote||!this.data.data.promote.end_time||new Date(this.data.data.promote.end_time.replace(/\-/g, "/")).getTime()-new Date().getTime()<0)){
      // 绘制活动信息背景颜色
      context.setFillStyle('#fff8e5');
      context.fillRect(0, 600, 500, 0);// x轴位置、y轴位置、宽度、高度
      //矩形颜色
      context.fillStyle = '#ff0000';
      // 红色实心矩形 x坐标, y坐标, 宽度, 高度
      context.fillRect(345,458,135,0)
      //矩形边框
      context.lineWidth=1;
      //矩形边框颜色
      context.strokeStyle="#ff0000";
      //x,y,宽度,高度
      context.rect(345,458,0,0)//上边框
      context.rect(345,458,0,0)//左边框
      context.rect(345,558,0,0)//下边框
      context.rect(480,458,0,0)//右边框
    }
    // 有分享标题无促销内容（促销信息背景颜色+促销时间背景框）
    if(this.data.data.share_title && (!this.data.data.promote||!this.data.data.promote.end_time||new Date(this.data.data.promote.end_time.replace(/\-/g, "/")).getTime()-new Date().getTime()<0)){
      // 绘制活动信息背景颜色
      context.setFillStyle('#fff8e5');
      context.fillRect(0, 600, 500, 0);// x轴位置、y轴位置、宽度、高度
      //矩形颜色
      context.fillStyle = '#ff0000';
      // 红色实心矩形 x坐标, y坐标, 宽度, 高度
      context.fillRect(345,458,135,0)
      //矩形边框
      context.lineWidth=1;
      //矩形边框颜色
      context.strokeStyle="#ff0000";
      //x,y,宽度,高度
      context.rect(345,458,0,0)//上边框
      context.rect(345,458,0,0)//左边框
      context.rect(345,558,0,0)//下边框
      context.rect(480,458,0,0)//右边框
    }
    // 传入你要绘制的网络图片 （必须配置网络）
    if(!this.data.data.share_img){
      imgs = await this.getImgInfo(this.data.data.img)
    }
    let imgs = await this.getImgInfo(this.data.data.share_img)
    let scene = await this.getQrcodeInfo(this.data.data.qrcode_url);  //这里放你的本地图片路径，或者网络图片缓存在本地的路径
    if(!this.data.data.share_title){
      context.drawImage(imgs, 0, 0, 500, 400);  //这里是商品图片（测试）
    }else{
      context.drawImage(imgs, 0, 80, 500, 400);  //这里是商品图片（测试）
    }
    this.setContent(context);
    this.setId(context);
    this.setName(context);
    this.setSpecs(context);
    this.setCompany(context);
    this.setMidNum(context);
    this.setBigNum(context);
    this.setLave(context);
    this.setCountdown(context);
    this.setActivity(context);  
    this.setTitle(context);
    this.setDetails(context);
    // if(!this.data.data.promote || !this.data.data.promote.content||new Date(this.data.data.promote.end_time.replace(/\-/g, "/")).getTime()-new Date().getTime()<0){
    if(!this.data.data.share_title){
      context.drawImage(scene, 380, 750, 100, 100);//这里是二维码图片 x轴位置、y轴位置、宽度、高度
    }else{
      context.drawImage(scene, 380, 810, 100, 100);//这里是二维码图片 x轴位置、y轴位置、宽度、高度
    }
    // context.draw(_this.getImg())
    context.draw(true,setTimeout(function(){
      wx.hideToast()
      _this.getImg()
    },1000));
  },
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src >>>商品海报
  createNewTerminal: async function() {
    var _this = this;
    var context = this.data.context
    context.setFillStyle('#FFF')
    context.fillRect(0, 0, this.data.windowW, this.data.windowH)
    // 传入你要绘制的网络图片 （必须配置网络）
    if(!this.data.data.share_img){
      imgs = await this.getImgInfo(this.data.data.img)
    }
    let imgs = await this.getImgInfo(this.data.data.share_img)
    var logo = "../../public/orther_img/logo.png";  //这里放你的本地图片路径，或者网络图片缓存在本地的路径
    if(!this.data.data.share_title){
      context.drawImage(imgs, 0, 0, 500, 400);  //这里是商品图片（测试）
    }else{
      // 绘制分享标题背景颜色
      context.setFillStyle('#f2f2f2');
      context.fillRect(0, 0, 500,80);// x轴位置、y轴位置、宽度、高度
      context.drawImage(imgs, 0, 80, 500, 400);  //这里是商品图片（测试）
    }
    this.setContent(context);
    this.setIdTitle(context);
    this.setIdContent(context);
    this.setNameTitle(context);
    this.setNameContent(context);
    this.setSpecsTitle(context);
    this.setSpecsContent(context);
    this.setCompanyTitle(context);
    this.setCompanyContent(context);
    this.setMidNumTitle(context);
    this.setMidNumContent(context);
    this.setBigNumTitle(context);
    this.setBigNumContent(context);
    if(!this.data.data.share_title){
      // 绘制联系我们背景颜色
      context.setFillStyle('#f2f2f2');
      context.fillRect(0, 650, 500,135);// x轴位置、y轴位置、宽度、高度
    }else{
      // 绘制联系我们背景颜色
      context.setFillStyle('#f2f2f2');
      context.fillRect(0, 710, 500,135);// x轴位置、y轴位置、宽度、高度
    }
    this.setCallMe(context);
    // 将广东粤东绘制到canvas绘制
    this.setEastName(context);
    this.setEastPhone(context);
    this.setEastNumber(context);
    this.setEastQQ(context);
    this.setEastNum(context);
    // 将广东粤西绘制到canvas绘制
    this.setWeatName(context);
    this.setWeatPhone(context);
    this.setWeatNumber(context);
    this.setWeatQQ(context);
    this.setWeatNum(context);
    // 全国内勤
    this.setBackName(context);
    this.setBackPhone(context);
    this.setBackNumber(context);
    this.setBackQQ(context);
    this.setBackNum(context);
    // 公司名称
    this.setCompanyName(context);
    // 公司地址
    this.setCompanyAddress(context);
    if(!this.data.data.share_title){
      context.drawImage(logo, 15, 800, 50, 50);//这里是二维码图片 x轴位置、y轴位置、宽度、高度
    }else{
      context.drawImage(logo, 15, 860, 50, 50);//这里是二维码图片 x轴位置、y轴位置、宽度、高度
    }
    // context.draw(_this.getImg())
    context.draw(true,setTimeout(function(){
      wx.hideToast()
      _this.getImg()
    },1000));
  },
  //将生成好的图片保存到本地 
  // tip: 在 draw 回调里调用canvasToTempFilePath方法才能保证图片导出成功。
  getImg() {
    var _this = this;
    wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function success(res) {
            _this.setData({
                imagePath: res.tempFilePath,
            });   
        }
    });
  },
  // 关闭海报弹窗
  closeCanvas(){
    this.setData({
      showPoster:false,
      maskHidden:true,
      shareShow:false
    })
  },
  //点击图片进行预览，长按保存分享图片
  previewImg: function(e) {
    var img = this.data.imagePath
    wx.previewImage({
        current:img, // 当前显示图片的http链接
        urls: [img] // 需要预览的图片http链接列表
    })
  },
  // 点击保存图片按钮
  saveCanvasImg(){
    // 将商品分享图片保存到本地
    wx.saveImageToPhotosAlbum({
      filePath: this.data.imagePath,
      success: function (data) {
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '您的二维码已保存到相册，赶快识别二维码添加小易进行咨询吧',
          showCancel: false,
        })
      },
      fail: function (err) {
        if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny" || err.errMsg === "saveImageToPhotosAlbum:fail authorize no response") {
          // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
          wx.showModal({
            title: '提示',
            content: '需要您授权保存相册',
            showCancel: false,
            success: modalSuccess => {
              wx.openSetting({
                success(settingdata) {
                  console.log("settingdata", settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    wx.showModal({
                      title: '提示',
                      content: '获取权限成功,再次点击图片即可保存',
                      showCancel: false,
                    })
                  } else {
                    wx.showModal({
                      title: '提示',
                      content: '获取权限失败，将无法保存到相册哦~',
                      showCancel: false,
                    })
                  }
                },
                fail(failData) {
                  console.log("failData", failData)
                },
                complete(finishData) {
                  console.log("finishData", finishData)
                }
              })
            }
          })
        }
      },
      complete(res) {
        wx.hideLoading()
      }
    })
  },
  // 生成海报
  onPoster: function(e) {
    var _this=this;
    console.log('eeeee',e,_this)
    var indf=e.currentTarget.dataset.indd;
    console.log('海报',indf)
    this.setData({
      maskHidden:false,
      showPoster:true
    })
    // if (this.data.imagePath) {
    //   return true
    // }
    wx.showToast({
        title: '图片生成中...',
        icon: 'loading',
        duration: 2000
    });
    if(indf==0){
      _this.createNewTerminal();//生成商品海报
    }else{
      _this.createNewImg();// 生成终端海报
    }
  },
  // 显示分享弹窗
  onShare(){
    this.setData({
      shareShow:true
    })
  },
  onClose(){
    this.setData({
      shareShow:false
    })
  },
  getData(){
    app.dialog.loding({msg: '加载中...'});
    app.axios(app.globalData.apiBaseUrl+'goods.php', {gid: this.data.goods_id},'POST').then(res => {
      app.dialog.loding_close();
        let res_data=res.data;
        console.log('这里有什么数值',res_data)
        if(res_data.status===404){
          wx.showModal({
            title: '提示',
            content: '商品不存在',
            showCancel: false,
            success (res) {
              if (res.confirm) {
                wx.navigateBack();
              }
            }
          })
        }else if(res_data.status==1){
          console.log('999999',res_data.items)
          var shareTitle=res_data.items.share_title;
          if(res_data.items.price){
            let price_data=res_data.items.price.split(".");
            res_data.items["priceLeft"]=price_data[0];
            res_data.items["priceRight"]=price_data[1];
          }
          if(res_data.items["user_status"] == 2&&res_data.items["retail_price"]>0){
            res_data.items["price_ratio"]=((res_data.items["retail_price"]-res_data.items["price"]) / res_data.items["retail_price"] *100).toFixed(0);
            res_data.items["retail_price"]=parseFloat(res_data.items["retail_price"]).toFixed(1);
          }
          that.setData({
            data: res_data.items,
            shareTitle:shareTitle
          },()=>{
            // setTimeout(function(){
            //   that.setHei();
            // },200)
          });
        }else{
          app.dialog.tip({msg: res_data.info});
        }
      this.countdown();
    })
  },
  countdown() {
    console.log('res_data',this)
    if (!this.data.data.promote||!this.data.data.promote.content || !this.data.data.promote.end_time) {
      return;
    }
    let content=this.data.data.promote.content;
    let endTime;
    if(new Date(this.data.data.promote.start_time.replace(/\-/g, "/")).getTime()-new Date().getTime()>0){
      endTime=new Date(this.data.data.promote.end_time.replace(/\-/g, "/")).getTime()-new Date(this.data.data.promote.start_time.replace(/\-/g, "/")).getTime();
    }else{
      endTime=new Date(this.data.data.promote.end_time.replace(/\-/g, "/")).getTime()-new Date().getTime();
    }
    this.setData({
      content:content,
      endTime:endTime
    });
  },
  previewImage: function(e) {
    wx.previewImage({
      current: this.data.data.list[e.currentTarget.dataset.index],
      urls: this.data.data.list
    });
  },
  contPreviewImage: function(e) {
    wx.previewImage({
      current: this.data.data.content_list[e.currentTarget.dataset.index],
      urls: this.data.data.content_list
    });
  },
  contGalleryImage: function(e) {
    wx.previewImage({
      current: this.data.data.gallery_list[e.currentTarget.dataset.index],
      urls: this.data.data.gallery_list
    });
  },
  numChange(e){
    this.setData({
      car_num:e.detail
    })
  },
  doCollect(){
    if(this.data.data.user_status==2){
      // this.setData({
      //   show:true
      // })
      var goodsId=this.data.data.goods_id
      wx.navigateTo({
        url: '/pages/collect/index?order_ids='+goodsId
      });
    }else if(this.data.data.user_status==1){
      app.dialog.tip({msg:'资质审核后才可收藏'})
    }else if(this.data.data.user_status==0){
      app.dialog.tip({msg:'登录后才可收藏'})
    }
  },
  goCar(){
    wx.navigateTo({
      url:'/pages/shop_car/index'
    })
  },
  showPopup(){
    if(this.options.qty==0){
      wx.showToast({
        title: '此商品无货，去挑选其他？',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if(this.options.price==0){
      wx.showToast({
        title: '此商品尚未定价，去挑选其他？',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if(this.data.data.user_status==2){
      this.setData({
        show:true
      })
    }else if(this.data.data.user_status==1){
      app.dialog.tip({msg:'资质审核后可见'})
    }else if(this.data.data.user_status==0){
      app.dialog.tip({msg:'登录后可见'})
    }
  },
  closePopup(){
    this.setData({
      show:false
    })
  },
  setHei: function () {
    var query = wx.createSelectorQuery()
    let _this = this
    query.selectAll('.cont').boundingClientRect()
    query.exec(function (res) {
      // console.log(res);
      var hei_arr=[];
      hei_arr.push(res[0][0].height)
      if(res[0][1].height){
        hei_arr.push(res[0][1].height)
      }else{
        hei_arr.push(res[0][0].height)
      }
      if(res[0][2].height){
        hei_arr.push(res[0][2].height)
      }else{
        hei_arr.push(res[0][0].height)
      }
      _this.setData({
        // hei: res[0][_this.data.cont_index].height
        hei: hei_arr
      })
    })
  },
  tab_change(e){
    this.setData({
      cont_index:e.detail.current
    })
  },
  // 加入购物车
  addToCar(){
    try{
      var car=wx.getStorageSync('car')||{};
      if (!car[goods_id]) {
        car[goods_id] = parseInt(that.data.car_num);
      } else {
        car[goods_id] = parseInt(car[goods_id])+parseInt(that.data.car_num);
      }
      wx.setStorageSync('car',car);
      that.closePopup();
    }catch(e){
      //TODO handle the exception
    }
  },
  // 立即下单
  goBuy() {
    if(this.options.qty==0){
      wx.showToast({
        title: '此商品无货，去挑选其他？',
        icon: 'none',
        duration: 2000
      })
      return
    }
    this.closePopup();
    wx.navigateTo({
        url: '/pages/order/index?order_ids='+goods_id+'&goods_num='+that.data.car_num
    });
  },
  // 分享给朋友
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    var share={
      path: '/pages/goods_detail/index?is_share=1&goods_id='+goods_id
    };
    console.log('this.data.data',this.data.data)
    if(this.data.data.share_title){
      share['title']=this.data.data.share_title;
    }else if(this.data.data.promote&&this.data.data.promote.content&&new Date(this.data.data.promote.end_time.replace(/\-/g, "/")).getTime()-new Date().getTime()>0){
      share['title']=this.data.data.promote.content;
    }else{
      share['title']=this.data.data.name;
    }
    if(this.data.data.share_img){
      share['imageUrl']=this.data.data.share_img;
    }else if(this.data.data.list[0]){
      share['imageUrl']=this.data.data.list[0];
    }else{
      share['imageUrl']='https://cdn.hulukeji.cn/images/empty.png';
    }
    return share
  },
  onShareTimeline(){
    // if(res.from==='menu'){
    //   // 来自页面内转发按钮
    // }
    var share={
      query: 'is_share=1&goods_id='+goods_id
    };
    if(this.data.data.share_title){
      share['title']=this.data.data.share_title;
    }else if(this.data.data.promote&&this.data.data.promote.content&&new Date(this.data.data.promote.end_time.replace(/\-/g, "/")).getTime()-new Date().getTime()>0){
      share['title']=this.data.data.promote.content;
    }else{
      share['title']=this.data.data.name;
    }
    if(this.data.data.share_img){
      share['imageUrl']=this.data.data.share_img;
    }else if(this.data.data.list[0]){
      share['imageUrl']=this.data.data.list[0];
    }else{
      share['imageUrl']='https://cdn.hulukeji.cn/images/empty.png';
    }
    return share
  },
  view_cont(e){
    this.setData({
      cont_index:e.currentTarget.dataset.i
    })
  },
  stickyScroll(e){
    // console.log(e.detail.isFixed);
    if(!this.data.is_scroll){
      if(e.detail.isFixed){
        this.setData({
          is_scroll:true
        })
      }
    }else{
      if(!e.detail.isFixed){
        this.setData({
          is_scroll:false
        })
      }
    }
  },
  cont_ready(e){
    // console.log(e);
    this.setData({
      cont_scroll_hei:e.detail.height
    })
  }
})
 