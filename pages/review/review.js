// pages/review/review.js
let app = getApp();
Page({
  data: {
    shenhezhong: [],
    page: 1,
    pageSize: 20
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
      return false;
    }
    this.getNews();
    let pagestatus = wx.getStorageSync('pagestatus') || 'none';
    let self = wx.getStorageSync('pageself') || '0';
    let currentType = wx.getStorageSync('pagetype') || '全部';
    this.filterNews(pagestatus, self);
    this.setData({
      'currentType': currentType
    })

  },
  onHide: function () {
    // 页面隐藏
    this.data.page = 1;
    this.data.shenhezhong.length = 0;
  },
  onUnload: function () {
    // 页面关闭
  },
  onPullDownRefresh: function () {
    let that = this;
    wx.request({
      url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_3&param=new_newslist&status=shenhezhong&offset=0&num=100', //仅为示例，并非真实的接口地址
      method: 'post',
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        sessid: wx.getStorageSync('sessid')
      },
      success: function (res) {
        if (res.data.status == 1) {
          that.setData({
            shenhezhong: res.data.data
          });
          wx.setStorageSync('slastupdate', 0);
          wx.setStorageSync('shenhezhong', res.data.data);
          wx.stopPullDownRefresh();
          that.setData({
            'currentType': '全部'
          });
          wx.removeStorageSync('pagestatus');
          wx.removeStorageSync('pageself');
          wx.removeStorageSync('pagetype');
        } else if (res.data.status == '100' && wx.getStorageSync('wentload') == '') {
          wx.setStorageSync('wentload', 'went');
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
  },
  gotoNews: function (e) {
    if (e.currentTarget.dataset.forbid == 1) {
      wx.navigateTo({
        url: '../vcon/vcon?id=' + e.currentTarget.dataset.newsid
      })
    } else {
      wx.navigateTo({
        url: '../ckcon/ckcon?id=' + e.currentTarget.dataset.newsid
      })
    }

  },
  loadNews: function () {
    let that = this;
    let change_time = wx.getStorageSync('slastupdate') || 0;
    wx.request({
      url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_3&param=check_change', //仅为示例，并非真实的接口地址
      method: 'post',
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        sessid: wx.getStorageSync('sessid'),
        change_time: change_time
      },
      success: function (res) {
        // res = JSON.parse(res);
        if (res.data.status == 1) {
          that.getNews();
          wx.setStorageSync('slastupdate', res.data.change_time);
        } else if (res.data.status == '100' && wx.getStorageSync('wentload') == '') {
          wx.setStorageSync('wentload', 'went');
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
  },
  getNews: function () {
    let that = this;
    wx.request({
      url: 'https://rmtapi.hnsjb.cn/bs_api.php?op=index&param=shenhezhong_list', //仅为示例，并非真实的接口地址
      method: 'post',
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        sessid: app.globalData.sessid,
        page: this.data.page,
        num: this.data.pageSize
      },
      success: function (res) {
        console.log('审核中', res)
        if (res.data.status == 1) {
          that.setData({
            shenhezhong: res.data.data
          });
          let pagestatus = wx.getStorageSync('pagestatus') || 'none';
          let self = wx.getStorageSync('pageself') || '0';
          let currentType = wx.getStorageSync('pagetype') || '全部';
          that.filterNews(pagestatus, self);
          that.setData({
            'currentType': currentType
          });
          wx.setStorageSync('shenhezhong', res.data.data);
        } else if (res.data.status == '-1'){
          wx.showModal({
            title: res.data.info,
            showCancel: false,
            content: ''
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

        }
      }
    });
  },
  showFilter: function () {
    let that = this;
    wx.showActionSheet({
      itemList: ['全部', '待审稿件', '驳回稿件', '转审稿件', '自采稿件'],
      success: function (res) {
        that.reformNews(res.tapIndex);
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  reformNews: function (idx) {
    switch (idx) {
      case 0:
        this.getNews();
        wx.removeStorageSync('pagestatus');
        wx.removeStorageSync('pageself');
        wx.setStorageSync('pagetype', '全部');
        this.setData({
          'currentType': '全部'
        });
        break;
      case 1:
        this.filterNews('tocheck', '0');
        wx.setStorageSync('pagestatus', 'tocheck');
        wx.setStorageSync('pageself', '0');
        wx.setStorageSync('pagetype', '待审稿件');

        this.setData({
          'currentType': '待审稿件'
        });
        break;
      case 2:
        this.filterNews('rejected', '0');
        wx.setStorageSync('pagestatus', 'rejected');
        wx.setStorageSync('pageself', '0');
        wx.setStorageSync('pagetype', '驳回稿件');

        this.setData({
          'currentType': '驳回稿件'
        });
        break;
      case 3:
        this.filterNews('tosucheck', '0');
        wx.setStorageSync('pagestatus', 'tosucheck');
        wx.setStorageSync('pagetype', '转审稿件');
        wx.setStorageSync('pageself', '0');
        this.setData({
          'currentType': '转审稿件'
        });
        break;
      case 4:
        this.filterNews('all', '1');
        wx.setStorageSync('pagestatus', 'all');
        wx.setStorageSync('pageself', '1');
        wx.setStorageSync('pagetype', '自采稿件');
        this.setData({
          'currentType': '自采稿件'
        });
        break;
      default:
        // this.getNews();
        return false;
    }

  },
  filterNews: function (a, b) {

    if (a == 'none') {
      return false;
    } else {
      let tempArr = wx.getStorageSync('shenhezhong');
      let newArr = [];
      if (b == 0) {
        for (let i = 0; i < tempArr.length; i++) {
          if (tempArr[i].typefrom == a && tempArr[i].is_self == b) {
            newArr.push(tempArr[i]);
          }
        }
      } else {
        for (let i = 0; i < tempArr.length; i++) {
          if (tempArr[i].is_self == b) {
            newArr.push(tempArr[i]);
          }
        }
      }
      this.setData({
        'shenhezhong': newArr
      })
    }


  },
  onReachBottom: function () {
    let currentLength = this.data.shenhezhong.length;
    let currentNews = this.data.shenhezhong;
    let that = this;
    wx.request({
      url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_3&param=new_newslist&status=shenhezhong&offset=' + currentLength + '&num=100', //仅为示例，并非真实的接口地址
      method: 'post',
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        sessid: wx.getStorageSync('sessid')
      },
      success: function (res) {
        if (res.data.status == 1) {
          that.setData({
            shenhezhong: currentNews.concat(res.data.data)
          });
          wx.setStorageSync('shenhezhong', currentNews.concat(res.data.data));
        } else if (res.data.status == '100' && wx.getStorageSync('wentload') == '') {
          wx.setStorageSync('wentload', 'went');
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
});