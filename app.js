//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log('手机型号',res.model);
        if (res.model.trim() == 'iPhone X'){
          that.globalData.isIpx = true
        }else{
          that.globalData.isIpx = false
        }
      }
    })
    this.globalData.userInfo = wx.getStorageSync('userInfo');
    if (!wx.getStorageSync('sessid')) {
      this.getSessionId();
    } else {
      this.globalData.sessid = wx.getStorageSync('sessid')
    }
  },
  getSessionId: function (cb) {
    let that = this;
    //调用登录接口
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://rmtapi.hnsjb.cn/bs_api.php?op=index&param=wx_login',
            method: 'post',
            header: { "content-type": "application/x-www-form-urlencoded" },
            data: {
              code: res.code
            },
            success: function (response) {
              console.log('code',res.code)
              console.log('openid',response)
              // sessid获取成功，跳转至登陆
              if (response.data.status == -2) {
                wx.setStorage({
                  key: "sessid",
                  data: response.data.data.sessid,
                  success: function () {
                    that.globalData.sessid = response.data.data.sessid;
                    wx.redirectTo({
                      url: '../login/login'
                    })
                  }
                })
              } else if (response.data.status == -1) {
                wx.showModal({
                  title: response.data.info,
                  showCancel: false,
                })
                // 已登陆，获取新的sessid
              } else {
                wx.setStorage({
                  key: "sessid",
                  data: response.data.data.sessid,
                  success: function () {
                    that.globalData.sessid = response.data.data.sessid;
                  }
                })
              }
            }
          });
        }
      }
    })

  },
  getNewsById(id, type) {
    let contents = wx.getStorageSync(type);
    let content = null;
    contents.map(item => {
      item.content = JSON.parse(item.content)
      if (item.id == id) {
        content = item;
      }
    })
    return content
  },
  // 获取文章驳回理由
  getBohuiContent(id, _this) {
    let that = _this;
    wx.request({
      url: 'https://rmtapi.hnsjb.cn/bs_api.php?op=index&param=bs_bohui_content',
      method: 'post',
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        sessid: wx.getStorageSync('sessid'),
        bohui_id: id
      },
      success(res) {
        if (res.data.status == 1 && res.data.data) {
          let resArr = Object.values(res.data.data);
          let tempArr = [];
          for (let i = 0; i < resArr.length; i++) {
            if (resArr[i]) tempArr = tempArr.concat(resArr[i])
          }
          console.log('驳回理由', tempArr)
          that.setData({
            reject_reason: tempArr
          });
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
        } else if (!res.data.data) {
          return
        } else {
          wx.showModal({
            title: res.data.info
          })
        }
      },
      fail(err) {
        wx.showModal({
          title: err
        })
      }
    })
  },
  // 获取文章工作流
  getWorkFlowData(id, _this) {
    let that = _this;
    wx.request({
      url: 'https://rmtapi.hnsjb.cn/bs_api.php?op=index&param=bs_content_progress',
      method: 'post',
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        sessid: wx.getStorageSync('sessid'),
        newsid: id
      },
      success: function (res) {
        if (res.data.status == 1) {
          let resArr = Object.values(res.data.data);
          let tempArr = [];
          for (let i = 0; i < resArr.length; i++) {
            if (resArr[i]) tempArr = tempArr.concat(resArr[i])
          }
          console.log('工作流', tempArr)
          that.setData({
            workflow: tempArr,
            lineLength: (tempArr.length - 1) * 100
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
        } else {
          wx.showModal({
            title: res.data.info
          })
        }
      }
    })
  },
  // 初始化每个页面前
  beforeRender(){
    // 页面显示
    if (!wx.getStorageSync('sessid')) {
      wx.redirectTo({
        url: '../login/login'
      });
      return false;
    }
    // 编辑角色隐藏tab条，用自定义替代
    if (wx.getStorageSync('is_bianji') == 1) {
      wx.redirectTo({
        url: '../shenhezhong/shenhezhong',
      })
      return
    }
    // 滚动到页面顶部
    wx.pageScrollTo({
      scrollTop: 0
    }) 
  },
  //全局数据
  globalData: {
    baseUrl: 'https://rmtapi.hnsjb.cn/',
    userInfo: null,
    sessid: null,
    mobile: '',
    nickname: '',
    avatarUrl: '',
    isIpx:false
  },
  // WeToast
});