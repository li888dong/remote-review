// pages/review/review.js
let app = getApp();
Page({
  data: {

    bohui_data: [],
    daishen_data: [],
    final_data: [],
    zhuanshen_data: [],
    zicai_data: [],

    shenhezhong: [],
    page: 1,
    pageSize: 20,
    currentType: ''
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
    this.data.bohui_data.length = 0;
    this.data.daishen_data.length = 0;
    this.data.final_data.length = 0;
    this.data.zhuanshen_data.length = 0;
    this.data.zicai_data.length = 0;
  },
  onUnload: function () {
    // 页面关闭
  },
  onPullDownRefresh: function () {
    this.data.page = 1;
    this.data.shenhezhong.length = 0;
    this.data.bohui_data.length = 0;
    this.data.daishen_data.length = 0;
    this.data.final_data.length = 0;
    this.data.zhuanshen_data.length = 0;
    this.data.zicai_data.length = 0;
    this.getNews();
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

  getNews: function () {
    let that = this;
    wx.request({
      url: 'https://rmtapi.hnsjb.cn/bs_api.php?op=index&param=shenhezhong_list', //仅为示例，并非真实的接口地址
      method: 'post',
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        sessid: app.globalData.sessid,
        page: that.data.page,
        num: that.data.pageSize
      },
      success: function (res) {
        console.log('审核中', res.data.data);
        wx.stopPullDownRefresh();
        if (res.data.status == 1) {
          let pagestatus = wx.getStorageSync('pagestatus') || 'none';
          let self = wx.getStorageSync('pageself') || '0';
          let currentType = wx.getStorageSync('pagetype') || '全部';
          that.setData({
            currentType: currentType,
            bohui_data: that.data.bohui_data.concat(res.data.data.bohui_data.data),
            daishen_data: that.data.daishen_data.concat(res.data.data.daishen_data.data),
            final_data: that.data.final_data.concat(res.data.data.final_data.data),
            zhuanshen_data: that.data.zhuanshen_data.concat(res.data.data.zhuanshen_data.data),
            zicai_data: that.data.zicai_data.concat(res.data.data.zicai_data.data)
          })
          that.reformNews(wx.getStorageSync('currentTypeIndex')||0)
        } else if (res.data.status == '-1') {
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
        wx.setStorageSync('currentTypeIndex', res.tapIndex)
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  reformNews: function (idx) {
    switch (idx) {
      case 0:
        this.setData({
          shenhezhong: this.data.final_data,
          currentType: '全部'
        })
        wx.removeStorageSync('pagestatus');
        wx.removeStorageSync('pageself');
        wx.setStorageSync('pagetype', '全部');
        wx.setStorageSync('shenhezhong', this.data.final_data);
        break;
      case 1:
        this.setData({
          currentType: '待审稿件',
          shenhezhong: this.data.daishen_data
        })
        wx.setStorageSync('pagestatus', 'tocheck');
        wx.setStorageSync('pageself', '0');
        wx.setStorageSync('pagetype', '待审稿件');
        wx.setStorageSync('shenhezhong', this.data.daishen_data);
        break;
      case 2:
        this.setData({
          shenhezhong: this.data.bohui_data,
          currentType: '驳回稿件'
        })
        wx.setStorageSync('pagestatus', 'rejected');
        wx.setStorageSync('pageself', '0');
        wx.setStorageSync('pagetype', '驳回稿件');
        wx.setStorageSync('shenhezhong', this.data.bohui_data);
        break;
      case 3:
        this.setData({
          shenhezhong: this.data.zhuanshen_data,
          currentType: '转审稿件'
        })
        wx.setStorageSync('pagestatus', 'tosucheck');
        wx.setStorageSync('pagetype', '转审稿件');
        wx.setStorageSync('pageself', '0');
        wx.setStorageSync('shenhezhong', this.data.zhuanshen_data);
        break;
      case 4:
        this.setData({
          shenhezhong: this.data.zicai_data,
          currentType: '自采稿件'
        })
        wx.setStorageSync('pagestatus', 'all');
        wx.setStorageSync('pageself', '1');
        wx.setStorageSync('pagetype', '自采稿件');
        wx.setStorageSync('shenhezhong', this.data.zicai_data);
        break;
      default:
        // this.getNews();
        return false;
    }

  },
  filterNews: function (a, b) {
    console.log(a, b);
    let tempArr = this.data.dataList;
    let newArr = [];
    if (a == 'final') {
      newArr = tempArr.final_data.data
    }
    console.log(newArr)
    this.setData({
      'shenhezhong': newArr
    })


  },
  onReachBottom: function () {
    this.data.page++;
    this.getNews()
  }
});