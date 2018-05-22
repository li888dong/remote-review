//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    let logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs.slice(0, 50));
    this.getSessionId();
  },
  getSessionId: function (cb) {
    let that = this;
    //调用登录接口
    wx.login({
      success: function (res) {
        console.log('code', res);
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_3&param=wx_login',
            method: 'post',
            header: { "content-type": "application/x-www-form-urlencoded" },
            data: {
              code: res.code
            },
            success: function (response) {
              console.log('login', response);
              if (response.data.status == 0) {
                wx.redirectTo({
                  url: '../login/login'
                })
              } else {
                wx.setStorageSync('sessid', response.data.sessid);
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
    loginStatus: true,
    userInfo: null,
    access_token: '',
    mobile: '',
    nickname: '',
    avatarUrl: ''
  },
  // WeToast
});