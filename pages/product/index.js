// pages/product/index.js
const app = getApp()
Page({

  data: {
    scrollH: 0,
    imgWidth: 0,
    loadingCount: 0,
    images: [],
    col1: [],
    col2: []
  },

  onLoad: function () {
    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        let imgWidth = ww * 0.48;
        let scrollH = wh;

        this.setData({
          scrollH: scrollH,
          imgWidth: imgWidth
        });

        //加载首组图片
        this.loadImages();
      }
    })
  },

  onImageLoad: function (e) {
    let imageId = e.currentTarget.id;
    let oImgW = e.detail.width;         //图片原始宽度
    let oImgH = e.detail.height;        //图片原始高度
    let imgWidth = this.data.imgWidth;  //图片设置的宽度
    let scale = imgWidth / oImgW;        //比例计算
    let imgHeight = oImgH * scale;      //自适应高度

    let images = this.data.images;
    let imageObj = null;

    for (let i = 0; i < images.length; i++) {
      let img = images[i];
      if (img.id === imageId) {
        imageObj = img;
        break;
      }
    }

    imageObj.height = imgHeight;

    let loadingCount = this.data.loadingCount - 1;
    let col1 = this.data.col1;
    let col2 = this.data.col2;

    //判断当前图片添加到左列还是右列
    if (col1.length <= col2.length) {
      col1.push(imageObj);
    } else {
      col2.push(imageObj);
    }

    let data = {
      loadingCount: loadingCount,
      col1: col1,
      col2: col2
    };

    //当前这组图片已加载完毕，则清空图片临时加载区域的内容
    if (!loadingCount) {
      data.images = [];
    }

    this.setData(data);
  },

  loadImages: function () {
    let images = [
      {
        goodId: 0,
        name: '医掌门 一次性使用医用口罩',
        url: 'bill',
        imageurl: 'https://cdn.hulukeji.cn/upload/20210201101537_126.jpg',
        newprice: "100",
        oldprice: "299",
        height: 0, 
      },
      {
        goodId: 1,
        name: '苏斯百 头孢克肟片',
        url: 'bill',
        imageurl: 'https://cdn.hulukeji.cn/upload/20210126094742_995.jpg',
        newprice: "99",
        oldprice: "199",
        height: 0,
      },
      {
        goodId: 2,
        name: '鱼胶巴沙胶 鱼鳔胶',
        url: 'bill',
        imageurl: 'https://cdn.hulukeji.cn/upload/20210120142826_860.jpg',
        newprice: "999",
        oldprice: "1900",
        height: 0, 
      },
      {
        goodId: 3,
        name: '茵阁 聚维酮碘栓',
        url: 'bill',
        imageurl: 'https://cdn.hulukeji.cn/upload/20210118172203_838.jpg',
        newprice: "199",
        oldprice: "399",
        height: 0,
      },
      {
        goodId: 4,
        name: '*维芙膏 氟轻松维B6乳膏',
        url: 'bill',
        imageurl: 'https://cdn.hulukeji.cn/upload/20210118163909_838.jpg',
        newprice: "200",
        oldprice: "320",
        height: 0,
      }
    ];

    let baseId = "img-" + (+new Date());

    for (let i = 0; i < images.length; i++) {
      images[i].id = baseId + "-" + i;
    }

    this.setData({
      loadingCount: images.length,
      images: images
    });
  }

})