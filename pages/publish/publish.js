// pages/craft/craft.js
let app = getApp();
Page({
  data: {
    page: 1,
    num: 20,
    final_data: [],
    yishen_data: [],
    zicai_data: [],

    yishenhe: [],
    currentType: ''
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    if (!wx.getStorageSync('sessid')) {
      wx.redirectTo({
        url: '../login/login'
      });
      return
    }
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    if (!wx.getStorageSync('sessid')) {
      wx.redirectTo({
        url: '../login/login'
      });
      return false;
    }
    let pagestatus = wx.getStorageSync('ysstatus') || 'none';
    let self = wx.getStorageSync('ysself') || '0';
    let currentType = wx.getStorageSync('ystype') || '全部';
    this.setData({
      currentType: currentType
    })
    this.getNews();
  },
  onHide: function () {
    // 页面隐藏
    this.data.page = 1;
    this.data.yishenhe.length = 0;
    this.data.final_data.length = 0;
    this.data.yishen_data.length = 0;
    this.data.zicai_data.length = 0;
  },
  onUnload: function () {
    // 页面关闭
  },
  onPullDownRefresh: function () {
    this.data.page = 1;
    this.data.yishenhe.length = 0;
    this.data.final_data.length = 0;
    this.data.yishen_data.length = 0;
    this.data.zicai_data.length = 0;
    this.getNews()
  },
  viewNews: function (e) {
    wx.navigateTo({
      url: '../vcon/vcon?id=' + e.currentTarget.dataset.newsid
    })
  },
  getNews: function () {
    let that = this;
    wx.showLoading({
      title: '加载中...',
    });
    wx.request({
      url: 'https://rmtapi.hnsjb.cn/bs_api.php?op=index&param=yiwancheng_list', //仅为示例，并非真实的接口地址
      method: 'post',
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        sessid: wx.getStorageSync('sessid'),
        page: that.data.page,
        num: that.data.num
      },
      success: function (res) {
        wx.stopPullDownRefresh();
        console.log('已审核', res)
        wx.hideLoading();
        if (res.data.status == 1) {
          that.setData({
            final_data: that.data.final_data.concat(res.data.data.final_data.data),
            yishen_data: that.data.yishen_data.concat(res.data.data.yishen_data.data),
            zicai_data: that.data.zicai_data.concat(res.data.data.zicai_data.data)
          });
          let pagestatus = wx.getStorageSync('ysstatus') || 'none';
          let self = wx.getStorageSync('ysself') || '0';
          let currentType = wx.getStorageSync('ystype') || '全部';
          that.setData({
            currentType: currentType
          });
          that.reformNews(wx.getStorageSync('publishTypeIndex') || 0)
        } else if (res.data.status == -2) {
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

        } else if(res.data.status == -1){
          wx.showModal({
            title: '',
            showCancel: false,
            content: res.data.info
          })
        }else{
          wx.showModal({
            content: '网络错误，请尝试刷新',
          })
        }
      }
    });
  },


  showFilter: function () {
    let that = this;
    wx.showActionSheet({
      itemList: ['全部', '自采稿件', '我审核的稿件'],
      success: function (res) {
        that.reformNews(res.tapIndex);
        wx.setStorageSync('publishTypeIndex', res.tapIndex)
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  reformNews: function (idx) {
    switch (idx) {
      case 0:
        wx.removeStorageSync('ysstatus');
        wx.removeStorageSync('ysself');
        wx.setStorageSync('ystype', '全部');
        this.setData({
          currentType: '全部',
          yishenhe: this.data.final_data
        });
        wx.setStorageSync('yishenhe', this.data.final_data)
        break;
      case 1:
        wx.setStorageSync('ysstatus', 'all');
        wx.setStorageSync('ysself', '1');
        wx.setStorageSync('ystype', '自采稿件');
        this.setData({
          currentType: '自采稿件',
          yishenhe: this.data.zicai_data
        });
        wx.setStorageSync('yishenhe', this.data.zicai_data)
        break;
      case 2:
        wx.setStorageSync('ysstatus', 'self_check');
        wx.setStorageSync('ysself', '1');
        wx.setStorageSync('ystype', '我审核的稿件');
        this.setData({
          currentType: '我审核的稿件',
          yishenhe: this.data.yishen_data
        });
        wx.setStorageSync('yishenhe', this.data.zicai_data)
        break;
      default:
        // this.getNews();
        return false;
    }

  },
  filterNews: function (a, b) {
    let tempArr = wx.getStorageSync('yishenhe');
    let newArr = [];
    if (a == 'self_check') {
      for (let i = 0; i < tempArr.length; i++) {
        if (tempArr[i].self_check == b) {
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
      'yishenhe': newArr
    })
  },

  onReachBottom: function () {
    this.data.page++;
    this.getNews()
  }
});