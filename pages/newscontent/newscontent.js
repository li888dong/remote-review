var WxParse = require('../../wxParse/wxParse.js');
var app = getApp();
Page({
  data: {
    content: '',
    // 转审人员列表
    sucheckers: [],
    // 选定转审人员id
    sucheck: '',
    // 选定转审人员姓名
    tocheckname: '',
    optionopen: '0',

    // 转审
    suindex: 0,
    // 转审人员列表
    sucheckers: [],
    // 选定转审人员id
    sucheck: '',
    // 选定转审人员姓名
    tocheckname: '',
    // 转移栏目
    zhuanyiStatus: false,
    zhuanyiList: [],
    zhuanyiIndex: 0,
    zhuanyiId: '',
    newsId: '',

    // 工作流
    workflow: [],
  },
  onLoad: function (options) {
    var that = this;
    var content;
    if (options.status == 99) {
      content = this.getNewsById(options.id, 'yishenhe');
    } else {
      content = this.getNewsById(options.id, 'shenhezhong');
    }
    console.log('内容...', content)
    this.setData({
      newsId: options.id,
      content: content
    });
    this.zhuanyiStatus();
    this.getWorkFlow();
    // 图片地址处理
    var str = this.addImgDomain(content.url, content.content);
    // &nbsp处理
    str = str.replace(/&nbsp/g, ' ')
    var article = `${str}`;

    WxParse.wxParse('article', 'html', article, that, 5);
  },
  // 存缓存列表中获取文章数据
  getNewsById(id, type) {
    let contents = wx.getStorageSync(type);
    let content = null;
    contents.map(item => {
      if (item.id == id) {
        content = item;
      }
    })
    return content
  },
  openOp: function (e) {
    let opid = e.target.dataset.opid;
    this.setData({
      optionopen: opid
    })
    if (opid == 3) {
      this.getSu()
    }
  },
  closeOp: function () {
    this.setData({
      optionopen: 0
    })
  },
  // 获取所有的栏目列表
  zhuanyilanmu() {
    let that = this;
    wx.request({
      url: 'https://rmtapi.hnsjb.cn/bs_api.php?op=news_index&param=category_list', //仅为示例，并非真实的接口地址
      method: 'post',
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        sessid: app.globalData.sessid
      },
      success: function (res) {
        console.log('栏目显示', res);
        if (res.data.status == 1) {
          that.setData({
            zhuanyiList: res.data.data
          })
        } else if (res.data.status == -1) {
          wx.showModal({
            title: '',
            content: res.data.info
          })
        } else if (res.data.status == -2) {
          wx.clearStorageSync();
          wx.showModal({
            title: '',
            content: '登录过期,请重新登录',
            success: function () {
              wx.redirectTo({
                url: '../login/login',
              })
            }
          })
        } else {
          wx.showModal({
            title: '',
            content: '网络错误，请尝试刷新'
          })
        }
      },
      fail: function (err) {
        console.log('栏目错误', err)
      }
    })
  },
  // 设置要转移的栏目
  setZhuanyi(e) {
    console.log(e.detail.value);
    this.setData({
      zhuanyiIndex: e.detail.value,
      zhuanyiId: this.data.zhuanyiList[e.detail.value].id
    })
  },
  // 确认转移栏目
  confirmZhuanyi() {
    let that = this;
    wx.request({
      url: 'https://rmtapi.hnsjb.cn/bs_api.php?op=news_index&param=news_switch_catid',
      method: 'post',
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        sessid: app.globalData.sessid,
        newsid: that.data.newsId,
        catid: that.data.zhuanyiId
      },
      success: function (res) {
        console.log('转移栏目', res);
        if (res.data.status == 1) {
          that.setData({
            zhuanyiStatus: true,
            zhuanyiList: []
          })
        } else if (res.data.status == -1) {
          wx.showModal({
            title: '',
            content: res.data.info
          })
        } else if (res.data.status == -2) {
          wx.clearStorageSync();
          wx.showModal({
            title: '',
            content: '登录过期,请重新登录',
            success: function () {
              wx.redirectTo({
                url: '../login/login',
              })
            }
          })
        } else {
          wx.showModal({
            title: '',
            content: '网络错误，请尝试刷新'
          })
        }
      },
      fail: function (err) {
        console.log('转移错误', err)
      }
    })
  },
  // 栏目是否已转移
  zhuanyiStatus() {
    let that = this;
    wx.showLoading({
      title: '网络请求中',
    })
    wx.request({
      url: 'https://rmtapi.hnsjb.cn/bs_api.php?op=news_index&param=switch_catid_status',
      method: 'post',
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        sessid: app.globalData.sessid,
        newsid: that.data.newsId
      },
      success: function (res) {
        console.log('转移栏目', res);
        wx.hideLoading();
        if (res.data.status == 1) {
          that.setData({
            zhuanyiStatus: true
          });

        } else if (res.data.status == -1) {
          console.log(res.data.info)
        } else if (res.data.status == -2) {
          wx.clearStorageSync();
          wx.showModal({
            title: '',
            content: '登录过期,请重新登录',
            success: function () {
              wx.redirectTo({
                url: '../login/login',
              })
            }
          })
        } else {
          wx.showModal({
            title: '',
            content: '网络错误，请尝试刷新'
          })
        }
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showModal({
          title: '',
          content: '网络错误，请尝试刷新'
        })
      }
    })
  },
  // 通过审核
  confirmNews: function (e) {

    let that = this;

    wx.showLoading();
    wx.request({
      url: "https://rmtapi.hnsjb.cn/bs_api.php?op=news_index&param=news_pass",
      method: 'post',
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        sessid: wx.getStorageSync('sessid'),
        id: that.data.newsId,
        steps: that.data.content.steps,
        type: that.data.content.type
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.status == 1) {
          wx.navigateBack({
            delta: 1
          })
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

        }
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showModal({
          title: '网络状况差，请稍后再试',
          showCancel: false,
          content: '',
          complete: function (res) {

          }
        });

      }


    });



  },
  // 转审
  forwardNews: function (e) {

    let that = this;

    if (this.data.sucheck == '') {
      wx.showModal({
        title: '请选择总编辑',
        content: '',
        showCancel: false,
        complete: function (res) {
          return false;
        }
      })
    } else {
      wx.showLoading({
        title: '转审中...',
      })
      wx.request({
        url: "https://rmtapi.hnsjb.cn/bs_api.php?op=news_index&param=news_zhuanshen",
        method: 'post',
        header: { "content-type": "application/x-www-form-urlencoded" },
        data: {
          sessid: wx.getStorageSync('sessid'),
          zhuanshen_id: that.data.newsId,
          tocheckid: that.data.sucheck,
          tocheckname: that.data.tocheckname
        },
        success: function (res) {
          wx.hideLoading();
          if (res.data.status == 1) {
            wx.navigateBack({
              delta: 1
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

          }
        },
        fail: function (res) {
          wx.hideLoading();
          wx.showModal({
            title: '网络状况差，请稍后再试',
            showCancel: false,
            content: '',
            complete: function (res) {

            }
          });

        }
      })
    
    }

  },
  // 获取转审人员列表
  getSu() {
    let that = this;
    wx.request({
      url: 'https://rmtapi.hnsjb.cn/bs_api.php?op=news_index&param=news_zhuanshen_users',
      method: 'post',
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        sessid: wx.getStorageSync('sessid')
      },
      success: function (res) {
        console.log('转审人员列表', res.data)

        if (res.data.status == 1) {
          that.setData({
            sucheckers: res.data.data,
            sucheck: res.data.data[that.data.suindex].userid,
            tocheckname: res.data.data[that.data.suindex].realname
          });
        } else if (res.data.status == -1) {
          wx.showModal({
            title: '',
            content: res.data.info,
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

        }

      }
    });
  },
  setSu: function (e) {
    let tmp = e.detail.value;
    this.setData({
      suindex: tmp,
      sucheck: this.data.sucheckers[tmp].userid,
      tocheckname: this.data.sucheckers[tmp].realname
    });
  },
  // 驳回
  bohui(){
    let that = this;
    wx.request({
      url: 'https://rmtapi.hnsjb.cn/bs_api.php?op=news_index&param=news_bohui',
      method: 'post',
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        sessid: wx.getStorageSync('sessid'),
        id:that.data.newsId
      },
      success: function (res) {
        console.log('驳回结果', res.data)

        if (res.data.status == 1) {
          wx.showModal({
            title: '',
            content: '驳回成功',
            complete:function(){
              wx.navigateBack({
                delta: 1
              })
            }
          })
        } else if (res.data.status == -1) {
          wx.showModal({
            title: '',
            content: res.data.info,
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

        }

      }
    });
  },
  // 获取工作流
  getWorkFlow() {
    let that = this;
    wx.request({
      url: 'https://rmtapi.hnsjb.cn/bs_api.php?op=news_index&param=news_content_progress',
      method: 'post',
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        sessid: wx.getStorageSync('sessid'),
        newsid: that.data.newsId
      },
      success: function (res) {
        console.log('文章进度', res.data)

        if (res.data.status == 1) {
          that.setData({
            workflow: res.data.data
          })
        } else if (res.data.status == -1) {
          wx.showModal({
            title: '',
            content: res.data.info,
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

        }

      }
    });
  },
  // 拼接图片的地址
  addImgDomain(domain, str) {
    if (!domain) {
      return str
    }
    var newDomain = domain.match(/^http(s)?:\/\/(.*?)\//)[0];
    var newStr = str.replace(/src=['"]([^'"]+)/gi, function (match, capture) {
      if (/^http/.test(capture)) {
        return 'src="' + capture
      } else {
        return 'src="' + newDomain + capture
      }
    });
    return newStr
  },
  // 文章是否已更新
  is_update(e) {
    let that = this;
    let fn;
    if (e.target.dataset.disableid == 1) {
      fn = this.confirmZhuanyi;
    } else if (e.target.dataset.disableid == 2) {
      fn = this.confirmNews;
    } else if (e.target.dataset.disableid == 3) {
      fn = this.forwardNews;
    } else if (e.target.dataset.disableid == 4){
      fn = this.bohui;
    }
    wx.request({
      url: "https://rmtapi.hnsjb.cn/bs_api.php?op=news_index&param=is_update",
      method: 'post',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        sessid: wx.getStorageSync('sessid'),
        id: that.data.newsId,
        updatetime: that.data.content.updatetime
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.status == 1) {
          wx.showModal({
            title: '',
            showCancel: false,
            content: '该文章已被他人操作',
            complete: function () {
              wx.navigateBack({
                delta: 1
              })
            }
          })

        } else if (res.data.status == 0) {
          console.log('已更新');
          fn();
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
            content: '网络错误请尝试刷新',
            complete: function () {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showModal({
          title: '网络状况差，请稍后再试',
          showCancel: false,
          content: '',
          complete: function (res) {

          }
        });

      }
    })
  }
})
