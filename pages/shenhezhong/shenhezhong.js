// pages/shenhezhong/shenhezhong.js
let app = getApp();
Page({
  data: {
    isIpx: app.globalData.isIpx ? true : false,
    bohui_data: [],
    daishen_data: [],
    final_data: [],
    zhuanshen_data: [],
    zicai_data: [],

    dataList: [],
    page: 1,
    pageSize: 20,
    currentType: '',

    currentPage:'shenhezhong'
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
    let that = this;    
    // 页面显示
    if (!wx.getStorageSync('sessid')) {
      wx.redirectTo({
        url: '../login/login'
      });
      return false;
    }
    // 编辑角色隐藏tab条，用自定义替代
    if (wx.getStorageSync('is_bianji') == '1') {
      wx.hideTabBar();
    } else {
      wx.switchTab({
        url: '../craft/craft',
      })
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
    this.data.dataList.length = 0;
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
    this.data.dataList.length = 0;
    this.data.bohui_data.length = 0;
    this.data.daishen_data.length = 0;
    this.data.final_data.length = 0;
    this.data.zhuanshen_data.length = 0;
    this.data.zicai_data.length = 0;
    this.getNews();
  },
  gotoNews: function (e) {
    wx.navigateTo({
      url: '../newscontent/newscontent?id=' + e.currentTarget.dataset.newsid
    })
  },

  getNews: function () {
    let that = this;
    wx.showLoading({
      title: '网络请求中...',
    })
    if(this.data.currentPage == 'shenhezhong'){
      wx.request({
        url: 'https://rmtapi.hnsjb.cn/bs_api.php?op=news_index&param=shenhezhong_list', //仅为示例，并非真实的接口地址
        method: 'post',
        header: { "content-type": "application/x-www-form-urlencoded" },
        data: {
          sessid: app.globalData.sessid,
          page: that.data.page,
          num: that.data.pageSize
        },
        success: function (res) {
          wx.hideLoading();
          console.log('审核中', res.data.data);
          wx.stopPullDownRefresh();
          if (res.data.status == 1) {
            let pagestatus = wx.getStorageSync('pagestatus') || 'none';
            let self = wx.getStorageSync('pageself') || '0';
            let currentType = wx.getStorageSync('pagetype') || '全部';
            that.setData({
              currentType: currentType,
              daishen_data: that.data.daishen_data.concat(res.data.data.daishen_data.data),
              final_data: that.data.final_data.concat(res.data.data.final_data.data)
            })
            that.reformNews(wx.getStorageSync('currentTypeIndex') || 0)
          } else if (res.data.status == '-1') {
            wx.showModal({
              title: '',
              showCancel: false,
              content: res.data.info
            })
          } else if (res.data.status == '-2') {
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
        },
        fail:function(err){
          wx.hideLoading();
        }
      });
    }else{
      wx.request({
        url: 'https://rmtapi.hnsjb.cn/bs_api.php?op=news_index&param=yiwancheng_list',
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
              final_data: that.data.final_data.concat(res.data.data.final_data.data)
            });
            let pagestatus = wx.getStorageSync('ysstatus') || 'none';
            let self = wx.getStorageSync('ysself') || '0';
            let currentType = wx.getStorageSync('ystype') || '全部';
            that.setData({
              currentType: currentType
            });
            that.reformNews(wx.getStorageSync('publishTypeIndex') || 0)
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

          } else if (res.data.status == -1) {
            wx.showModal({
              title: '',
              showCancel: false,
              content: res.data.info
            })
          } else {
            wx.showModal({
              content: '网络错误，请尝试刷新',
            })
          }
        }
      });
    }
    
  },
  showFilter: function () {
    let that = this;
    wx.showActionSheet({
      itemList: ['全部', '待审稿件'],
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
          dataList: this.data.final_data,
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
          dataList: this.data.daishen_data
        })
        wx.setStorageSync('pagestatus', 'tocheck');
        wx.setStorageSync('pageself', '0');
        wx.setStorageSync('pagetype', '待审稿件');
        wx.setStorageSync('shenhezhong', this.data.daishen_data);
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
      'dataList': newArr
    })


  },
  onReachBottom: function () {
    this.data.page++;
    this.getNews()
  },
  // 切换审核中和已完成
  switchPage(){
    if(this.data.currentPage == 'shenhezhong'){
      this.setData({
        currentPage:'yishenhe'
      });
      this.data.page = 1;
      this.data.dataList.length = 0;
      this.data.bohui_data.length = 0;
      this.data.daishen_data.length = 0;
      this.data.final_data.length = 0;
      this.data.zhuanshen_data.length = 0;
      this.data.zicai_data.length = 0;
      this.getNews()
    }else{
      this.setData({
        currentPage: 'shenhezhong'
      });
      this.data.page = 1;
      this.data.dataList.length = 0;
      this.data.bohui_data.length = 0;
      this.data.daishen_data.length = 0;
      this.data.final_data.length = 0;
      this.data.zhuanshen_data.length = 0;
      this.data.zicai_data.length = 0;
      this.getNews()
    }
  }
});