// pages/craft/craft.js
var app = getApp();
Page({
  data: {
    caogaoxiang:[],
    page:1,
    pageSize:20
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    if (!app.globalData.sessid) {
      wx.redirectTo({
        url: '../login/login'
      });
    }
    this.getNews();    
  },
  onHide:function(){
    this.data.page = 1;
    this.data.caogaoxiang.length = 0;
  },
  onPullDownRefresh: function () {
    this.data.page = 1;
    this.data.caogaoxiang.length = 0;
    this.getNews();
  },
  gotoNews: function (e) {
    wx.navigateTo({
      url: '../content/content?id=' + e.currentTarget.dataset.newsid
    })
  },
  getNews: function () {
    let that = this;
    wx.request({
      url: 'https://rmtapi.hnsjb.cn/bs_api.php?op=index&param=caogao_list', 
      method: 'post',
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        sessid: app.globalData.sessid,
        page:this.data.page,
        num:this.data.pageSize
      },
      success: function (res) {
        console.log('草稿箱',res);
        wx.stopPullDownRefresh();
        if (res.data.status == 1) {
          that.setData({
            caogaoxiang: that.data.caogaoxiang.concat(res.data.data.info)
          });
          wx.setStorageSync('caogaoxiang', res.data.data.info);
        } else if (res.data.status == '-1'){
          wx.showModal({
            title: res.data.info,
            showCancel: false,
            content: '请尝试刷新'
          })
        } else if (res.data.status == '-2') {
          wx.showModal({
            title: '登录过期，请重新登录',
            showCancel: false,
            content: '',
            complete: res => {
              wx.redirectTo({
                url: '../login/login'
              })
            }
          })
        }else{
          wx.showModal({
            title: '网络错误',
            showCancel: false,
            content: '请尝试刷新'
          })
        }
      },
      fail:function(){
        wx.stopPullDownRefresh();
        wx.showModal({
          title: '网络错误',
          showCancel: false,
          content: '请尝试刷新'
        })
      }
    });
  },
  onReachBottom: function () {
    this.data.page++;
    this.getNews()
  }
});