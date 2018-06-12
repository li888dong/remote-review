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
    reject_reason: [],
    // 转审人员列表
    sucheckers: [],
    // 选定转审人员id
    sucheck: '',
    // 选定转审人员姓名
    tocheckname: '',
    currentCate: '116',
    selection: [],
    rejectopen: false,
    optionopen: '0',
    xjuser: {},
    rejectreason: '',
    mainindex: 0,
    subindex: 0,
    suindex: 0,
    currentVoice: ['', ''],
    currentRecord: '',
    audioarea: false,
    newsScore: 1
  },
  onLoad: function(options) {
    // 获取工作流数据
    app.getWorkFlowData(options.id, this);
    // 获取驳回数据
    app.getBohuiContent(options.id, this)
    let that = this;
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      cid: options.id,
      content: app.getNewsById(options.id, 'shenhezhong')
    });
  },


  openOp: function(e) {
    let opid = e.target.dataset.opid;
    this.setData({
      optionopen: opid
    })
    if (opid == 3) {
      this.getSu()
    }
  },
  closeOp: function() {
    this.setData({
      optionopen: 0
    })
  },
  setReject: function(e) {
    this.setData({
      rejectreason: e.detail.value
    })
  },
  setGradeReason: function(e) {
    this.setData({
      grade_message: e.detail.value
    })
  },
  rejectNews: function(e) {
    let that = this;
    if (this.data.rejectreason == '') {
      wx.showModal({
        title: '请填写驳回理由',
        content: '',
        showCancel: false,
        complete: function(res) {
          return false;
        }
      })
    } else {

      wx.showLoading();
      wx.request({
        url: 'https://rmtapi.hnsjb.cn/bs_api.php?op=index&param=bs_bohui',
        method: 'post',
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          sessid: wx.getStorageSync('sessid'),
          bohui_id: that.data.cid,
          content: that.data.rejectreason.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "")
        },
        success: function(res) {
          wx.hideLoading();
          if (res.data.status == 1) {
            wx.showModal({
              title: '驳回成功',
              showCancel: false,
              content: '',
              complete: function(res) {
                wx.navigateBack({
                  delta: 1
                })
              }
            })
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
          }
        },
        fail: function(res) {
          wx.hideLoading();
          wx.showModal({
            title: '网络状况差，请稍后再试',
            showCancel: false,
            content: '',
            complete: function(res) {

            }
          });

        }
      })
    }

  },
  changeSelection: function(e) {
    let tmp = e.detail.value;
    this.setData({
      mainindex: tmp
    });

    this.setData({
      selection: this.data.categories[tmp].subcats
    });
    this.setData({
      currentCate: this.data.categories[tmp].catid
    })
  },
  setCate: function(e) {
    let tmp = e.detail.value;
    this.setData({
      subindex: tmp
    });

    this.setData({
      currentCate: this.data.selection[tmp].catid
    });
    this.setData({
      subcate: this.data.selection[tmp].catid
    })
  },
  // 获取转审人员列表
  getSu() {
    let that = this;
    wx.request({
      url: 'https://rmtapi.hnsjb.cn/bs_api.php?op=index&param=bs_zhuanshen_users',
      method: 'post',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        sessid: wx.getStorageSync('sessid'),
        newsid: that.data.cid
      },
      success: function(res) {
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
  setSu: function(e) {
    let tmp = e.detail.value;
    this.setData({
      suindex: tmp,
      sucheck: this.data.sucheckers[tmp].userid,
      tocheckname: this.data.sucheckers[tmp].realname
    });
  },
  // 通过审核
  confirmNews: function(e) {

    let that = this;
    wx.showLoading();
    wx.request({
      url: "https://rmtapi.hnsjb.cn/bs_api.php?op=index&param=bs_pass",
      method: 'post',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        sessid: wx.getStorageSync('sessid'),
        id: that.data.cid,
        steps: that.data.content.steps,
        type: that.data.content.type
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.status == 1) {
          wx.showModal({
            title: '已通过',
            showCancel: false,
            content: '',
            complete: function(res) {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        } else if (res.data.status == -1) {
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

        }
      },
      fail: function(res) {
        wx.hideLoading();
        wx.showModal({
          title: '网络状况差，请稍后再试',
          showCancel: false,
          content: '',
          complete: function(res) {

          }
        });

      }
    })
  },
  // 转审
  forwardNews: function(e) {

    let that = this;

    if (this.data.sucheck == '') {
      wx.showModal({
        title: '请选择总编辑',
        content: '',
        showCancel: false,
        complete: function(res) {
          return false;
        }
      })
    } else {
      wx.showLoading();
      wx.request({
        url: "https://rmtapi.hnsjb.cn/bs_api.php?op=index&param=bs_zhuanshen",
        method: 'post',
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          sessid: wx.getStorageSync('sessid'),
          zhuanshen_id: that.data.cid,
          tocheckid: that.data.sucheck,
          tocheckname: that.data.tocheckname
        },
        success: function(res) {
          wx.hideLoading();
          if (res.data.status == 1) {
            wx.showModal({
              title: '已转审',
              showCancel: false,
              content: '',
              complete: function(res) {
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          } else if (res.data.status == -1) {
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

          }
        },
        fail: function(res) {
          wx.hideLoading();
          wx.showModal({
            title: '网络状况差，请稍后再试',
            showCancel: false,
            content: '',
            complete: function(res) {

            }
          });

        }
      })
    }

  },
  suNews: function(e) {
    let that = this;

    if (this.data.is_special && (this.data.currentCate == '' || this.data.currentCate == 0)) {
      this.setData({
        currentCate: '116'
      })
    }
    let is_special = 0;

    if (this.data.is_special) {
      is_special = 1;
    }

    wx.showModal({
      title: '确认通过',
      content: '您确定要通过这篇稿件吗？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: "https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_3&param=pass",
            method: 'post',
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            data: {
              sessid: wx.getStorageSync('sessid'),
              id: that.data.cid,
              catid: that.data.currentCate,
              typefrom: that.data.editorauth,
              to_specialid: that.data.selectedSpecial,
              to_specialcat: that.data.selectedType,
              is_special: is_special
            },
            success: function(res) {
              if (res.data.status == 1) {
                wx.showModal({
                  title: '已通过',
                  showCancel: false,
                  content: '',
                  complete: function(res) {
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                })
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
            },
            fail: function(res) {
              wx.showModal({
                title: '网络状况差，请稍后再试',
                showCancel: false,
                content: '',
                complete: function(res) {
                  that.setData({
                    'disable': false
                  });
                  tempData = {};
                  tempData[disabletip] = '确认' + that.data[disabletip].replace('中...', '');
                  that.setData(tempData);
                }
              });

            }
          })
        } else {
          return false;
        }
      }
    });
  },
  editNews: function() {
    wx.navigateTo({
      url: '../edit/edit?id=' + this.data.cid + '&type=shenhe'
    })
  },

  setScore: function(e) {
    console.log(e.target.dataset.score);
    this.setData({
      'newsScore': e.target.dataset.score
    })
  },
  // 文章是否已更新
  is_update(e) {
    let that = this;
    let fn;
    if (e.target.dataset.disableid == 1) {
      fn = this.rejectNews;
    } else if (e.target.dataset.disableid == 2) {
      fn = this.confirmNews;
    } else if (e.target.dataset.disableid == 3) {
      fn = this.forwardNews;
    }
    wx.request({
      url: "https://rmtapi.hnsjb.cn/bs_api.php?op=index&param=is_update",
      method: 'post',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        sessid: wx.getStorageSync('sessid'),
        id: that.data.cid,
        updatetime: that.data.content.updatetime
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.status == 1) {
          wx.showModal({
            title: '',
            showCancel: false,
            content: '该文章已被他人操作',
            complete: function() {
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
            complete: function() {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }
      },
      fail: function(res) {
        wx.hideLoading();
        wx.showModal({
          title: '网络状况差，请稍后再试',
          showCancel: false,
          content: '',
          complete: function(res) {

          }
        });

      }
    })
  }

});