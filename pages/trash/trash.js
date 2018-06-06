// pages/trash/trash.js
Page({
  data: {
    trash: []
  },
  onLoad: function () {
    // 页面初始化 options为页面跳转所带来的参数
    this.getNews()
  },
  getNews() {
    let that = this;
    wx.request({
      url: 'https://rmtapi.hnsjb.cn/bs_api.php?op=index&param=yishanchu_list', //仅为示例，并非真实的接口地址
      method: 'post',
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        sessid: wx.getStorageSync('sessid'),
        page: 1,
        num: 100
      },
      success: function (res) {
        if (res.data.status == 1) {
          that.setData({
            trash: res.data.data.data
          });
          wx.setStorageSync('delete', res.data.data.data)
        } else if (res.data.status == -1) {
          wx.showModal({
            title: '',
            showCancel: false,
            content: res.data.info
          })

        } else if (res.data.status == -2) {
          wx.clearStorageSync();
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
        } else {
          wx.showModal({
            title: '',
            showCancel: false,
            content: '网络错误，请尝试刷新'
          })
        }
      }
    });
  },
  gotoNews: function (e) {
    wx.navigateTo({
      url: '../vcon/vcon?id=' + e.currentTarget.dataset.newsid+'&from=delete'
    })
  }
});