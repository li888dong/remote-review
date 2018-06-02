// pages/search/search.js
let app = getApp();

Page({
  data: {
    page: 1,
    num: 100,
    results: []
  },
  onLoad: function () {
    // new app.WeToast();

  },

  backCenter: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  search: function (e) {
    let q = e.detail.value.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
    if (q != '') {
      let that = this;
      wx.showLoading({
        title: '搜索中'
      })
      // that.wetoast.toast({
      //     title: '搜索中',
      //     duration:0
      // });
      wx.request({
        url: 'https://rmtapi.hnsjb.cn/bs_api.php?op=index&param=sousuo_list', //仅为示例，并非真实的接口地址
        method: 'post',
        header: { "content-type": "application/x-www-form-urlencoded" },
        data: {
          sessid: wx.getStorageSync('sessid'),
          content: q,
          page:that.data.page,
          num:that.data.num
        },
        success: function (res) {
          wx.hideLoading();
          if (res.data.status == 1) {
            that.setData({
              results: res.data.data.data
            });
            wx.setStorageSync('searchData', res.data.data.data)
          }else if(res.data.status == -1){
            wx.showModal({
              title: '',
              showCancel: false,
              content: res.data.info
            })
          } else if (res.data.status == -2) {
            // that.wetoast.hide();
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

          }
        }
      });
    }

  },
  gotoNews: function (e) {
    wx.navigateTo({
      url: '../vcon/vcon?id=' + e.currentTarget.dataset.newsid+'&from=search'
    })


  }
});