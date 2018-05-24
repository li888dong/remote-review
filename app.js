//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    let logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs.slice(0, 50));
    this.globalData.userInfo = wx.getStorageSync('userInfo');
    if(!wx.getStorageSync('sessid')){
      this.getSessionId();
    }else{
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
              // sessid获取成功，跳转至登陆
              if (response.data.status == -1) {
                wx.setStorage({
                  key: "sessid",
                  data: response.data.data.sessid,
                  success: function () {
                    that.globalData.sessid = response.data.data.sessid;
                    wx.showModal({
                      title: response.data.info,
                      content: '',
                      showCancel: false,
                      complete: function (res) {
                        wx.redirectTo({
                          url: '../login/login'
                        })
                      }
                    });
                  }
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
  //全局数据
  globalData: {
    baseUrl: 'https://rmtapi.hnsjb.cn/',
    userInfo: null,
    sessid: '',
    mobile: '',
    nickname: '',
    avatarUrl: ''
  },
  // WeToast
});