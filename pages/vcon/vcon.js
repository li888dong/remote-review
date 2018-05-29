// pages/content/content.js
let util = require('../../utils/util.js');
let app = getApp();
let interval,
  touchstarttime,
  tout;
Page({
  data: {
    // 文章内容
    content: {},
    // 文章id
    cid: 0
  },
  onLoad: function (options) {
    let that = this;
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      cid: options.id,
      content: app.getNewsById(options.id, 'yishenhe')
    });
  }

});