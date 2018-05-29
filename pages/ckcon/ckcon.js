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
    lineLength: 0,
    editorauth: '',
    category: '116',
    subcate: '',
    categories: [],
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
    disable: false,
    onlyreject: false,
    tocatid: 0,
    parentid: 0,
    disabletip4: '确认修改',
    disabletip3: '确认转审',
    disabletip2: '确认通过',
    disabletip1: '确认驳回',
    rejectaudio: [],
    currentVoice: ['', ''],
    currentRecord: '',
    audioarea: false,
    newsScore: 1,
    autheditors: [],
    supereditors: [],
    is_special: false,
    specials: [],
    types: [],
    selectedType: 0,
    selectedSpecial: 0,
    specialIndex: -1,
    typeIndex: -1
  },
  onLoad: function (options) {
    let that = this;
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      cid: options.id,
      content: app.getNewsById(options.id, 'shenhezhong')
    });
    this.getSu();
  },
  fetchData() {
    wx.request({
      url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_3&param=show_workflow&id=' + options.id, //仅为示例，并非真实的接口地址
      method: 'post',
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        sessid: wx.getStorageSync('sessid')
      },
      success: function (res) {

        if (res.data.status == 1) {
          that.setData({
            workflow: res.data.data
          });
          that.setData({
            lineLength: (res.data.data.length - 1) * 100
          });
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
    wx.request({
      url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_3&param=get_article&id=' + options.id, //仅为示例，并非真实的接口地址
      method: 'post',
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        sessid: wx.getStorageSync('sessid')
      },
      success: function (res) {

        if (res.data.status == 1) {
          let tempArr = res.data.data;
          tempArr['content'] = JSON.parse(tempArr['content']);
          that.setData({
            content: tempArr
          });

          if (tempArr.is_special == 1) {
            that.setData({
              is_special: true
            });
          }

          that.setData({
            selectedSpecial: tempArr.sid
          });
          that.setData({
            selectedType: tempArr.scid
          });

          that.setData({
            specialName: tempArr.sname
          });
          that.setData({
            specialType: tempArr.scname
          });

          if (tempArr.news_grade != 0) {
            that.setData({
              newsScore: tempArr.news_grade
            })
          }

          that.getSpecials();



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
    wx.request({
      url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_3&param=cats',
      method: 'post',
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        sessid: wx.getStorageSync('sessid')
      },
      success: function (res) {

        if (res.data.status == 1) {
          that.setData({
            categories: res.data.data
          });
          that.setData({
            currentCate: that.data.content.tocatid
          });
          if (that.data.content.parentid != 0) {
            // console.log(that.data.content.parentid);

            that.setData({
              'mainindex': util.getArrayindx(that.data.content.parentid, that.data.categories, 'catid')
            });
            // console.log(util.getArrayindx(that.data.content.parentid,that.data.categories,'catid'));
            that.setData({
              selection: that.data.categories[that.data.mainindex].subcats
            });
            that.setData({
              'subindex': util.getArrayindx(that.data.content.tocatid, that.data.categories[that.data.mainindex].subcats, 'catid')
            })
          } else {
            that.setData({
              'mainindex': util.getArrayindx(that.data.content.tocatid, that.data.categories, 'catid')
            })
          }
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

    wx.request({
      url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_3&param=set_checkers',
      type: 'get',
      // header: { "content-type": "application/x-www-form-urlencoded"},
      success: function (res) {
        // console.log(res);
        if (res.data.status === 1) {
          that.setData({
            'supereditors': res.data.data.sucheckers
          });
          that.setData({
            'autheditors': res.data.data.checkers
          });
          let tempID = parseInt(that.data.xjuser.roleid);
          if (that.data.autheditors.indexOf(tempID) > -1) {
            // console.log('true');
            that.setData({
              editorauth: 'tocheck'
            })
          } else if (that.data.supereditors.indexOf(tempID) > -1) {
            // console.log('sutrue');

            that.setData({
              editorauth: 'tosucheck'
            })
          }
          // console.log(that.data.xjuser.roleid);
        }
      }
    });




    that.setData({
      lineLength: (this.data.workflow.length - 1) * 100
    });
  },
  getSpecials: function () {

    let that = this;

    wx.request({
      url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_3&param=special_list',
      type: 'post',
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        sessid: wx.getStorageSync('sessid')
      },
      success: function (res) {
        if (res.data.status == 1) {
          that.setData({
            specials: res.data.data
          });
          if (that.data.content.sid !== 0) {
            that.setData({
              'specialIndex': util.getArrayindx(that.data.content.sid, that.data.specials, 'sid')
            });
            // console.log(util.getArrayindx(that.data.content.parentid,that.data.categories,'catid'));
            that.setData({
              types: that.data.specials[that.data.specialIndex].category
            });
            that.setData({
              'typeIndex': util.getArrayindx(that.data.content.scid, that.data.types, 'scid')
            })
          }
        }
      }
    });
  },
  openOp: function (e) {
    let opid = e.target.dataset.opid;
    this.setData({
      optionopen: opid
    })
  },
  closeOp: function () {
    this.setData({
      optionopen: 0
    })
  },
  setReject: function (e) {
    this.setData({
      rejectreason: e.detail.value
    })
  },
  setGradeReason: function (e) {
    this.setData({
      grade_message: e.detail.value
    })
  },
  rejectNews: function (e) {
    let that = this;
    if (this.data.rejectreason == '') {
      wx.showModal({
        title: '请填写驳回理由',
        content: '',
        showCancel: false,
        complete: function (res) {
          return false;
        }
      })
    } else {
      wx.showModal({
        title: '确认驳回',
        content: '您确定要驳回这篇稿件吗？',
        success: function (res) {
          if (res.confirm) {
            wx.showLoading();
            wx.request({
              url: 'https://rmtapi.hnsjb.cn/bs_api.php?op=index&param=bs_bohui',
              method: 'post',
              header: { "content-type": "application/x-www-form-urlencoded" },
              data: {
                sessid: wx.getStorageSync('sessid'),
                bohui_id: that.data.cid,
                content: that.data.rejectreason.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, ""),
              },
              success: function (res) {
                wx.hideLoading();
                if (res.data.status == 1) {
                  wx.showModal({
                    title: '驳回成功',
                    showCancel: false,
                    content: '',
                    complete: function (res) {
                      wx.navigateBack({
                        delta: 1
                      })
                    }
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
          } else {
            return false;
          }
        }
      });

    }

  },
  changeSelection: function (e) {
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
  setCate: function (e) {
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
  setSu: function (e) {
    let tmp = e.detail.value;
    this.setData({
      suindex: tmp,
      sucheck: this.data.sucheckers[tmp].userid,
      tocheckname: this.data.sucheckers[tmp].realname
    });
  },
  // 通过审核
  confirmNews: function (e) {

    let that = this;

    wx.showModal({
      title: '确认通过',
      content: '您确定要通过这篇稿件吗？',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading();
          wx.request({
            url: "https://rmtapi.hnsjb.cn/bs_api.php?op=index&param=bs_pass",
            method: 'post',
            header: { "content-type": "application/x-www-form-urlencoded" },
            data: {
              sessid: wx.getStorageSync('sessid'),
              id: that.data.cid,
              steps: that.data.content.steps,
              type: ''
            },
            success: function (res) {
              wx.hideLoading();
              if (res.data.status == 1) {
                wx.showModal({
                  title: '已通过',
                  showCancel: false,
                  content: '',
                  complete: function (res) {
                    wx.navigateBack({
                      delta: 1
                    })
                  }
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
        } else {
          return false;
        }
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

      wx.showModal({
        title: '确认转审',
        content: '您确定要转审这篇稿件吗？',
        success: function (res) {
          if (res.confirm) {
            wx.showLoading({
              title: '转审中...',
            })
            wx.request({
              url: "https://rmtapi.hnsjb.cn/bs_api.php?op=index&param=bs_zhuanshen",
              method: 'post',
              header: { "content-type": "application/x-www-form-urlencoded" },
              data: {
                sessid: wx.getStorageSync('sessid'),
                zhuanshen_id: that.data.cid,
                tocheckid: that.data.sucheck,
                tocheckname: that.data.tocheckname
              },
              success: function (res) {
                wx.hideLoading();
                if (res.data.status == 1) {
                  wx.showModal({
                    title: '已转审',
                    showCancel: false,
                    content: '',
                    complete: function (res) {
                      wx.navigateBack({
                        delta: 1
                      })
                    }
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
          } else {
            return false;
          }
        }
      });

    }

  },
  suNews: function (e) {
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
      success: function (res) {
        if (res.confirm) {
          that.setData({
            'disable': true
          });
          let disabletip = 'disabletip' + e.currentTarget.dataset.disableid;
          let tempData = {};

          tempData[disabletip] = that.data[disabletip].replace('确认', '') + '中...';
          that.setData(tempData);
          wx.request({
            url: "https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_3&param=pass",
            method: 'post',
            header: { "content-type": "application/x-www-form-urlencoded" },
            data: {
              sessid: wx.getStorageSync('sessid'),
              id: that.data.cid,
              catid: that.data.currentCate,
              typefrom: that.data.editorauth,
              to_specialid: that.data.selectedSpecial,
              to_specialcat: that.data.selectedType,
              is_special: is_special
            },
            success: function (res) {
              if (res.data.status == 1) {
                wx.showModal({
                  title: '已通过',
                  showCancel: false,
                  content: '',
                  complete: function (res) {
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
            fail: function (res) {
              wx.showModal({
                title: '网络状况差，请稍后再试',
                showCancel: false,
                content: '',
                complete: function (res) {
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
  editNews: function () {
    wx.navigateTo({
      url: '../edit/edit?id=' + this.data.cid + '&type=editor'
    })
  },

  setScore: function (e) {
    console.log(e.target.dataset.score);
    this.setData({
      'newsScore': e.target.dataset.score
    })
  }

});