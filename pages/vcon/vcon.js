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
    cid: 0,
    workflow: [],
    // 驳回理由前面的小圆点
    lineLength: 0,
    // 驳回信息
    reject_reason: []
  },
  onLoad: function (options) {
    // 获取工作流数据
    app.getWorkFlowData(options.id, this);
    // 获取驳回数据
    app.getBohuiContent(options.id, this)
    let that = this;
    // 页面初始化 options为页面跳转所带来的参数
    if(options.from == 'search'){
      this.setData({
        cid: options.id,
        content: app.getNewsById(options.id, 'searchData')
      });
    }else if(options.from == 'delete'){
      this.setData({
        cid: options.id,
        content: app.getNewsById(options.id, 'delete')
      });
    }else{
      this.setData({
        cid: options.id,
        content: app.getNewsById(options.id, 'yishenhe')
      });
    } 
  }

});