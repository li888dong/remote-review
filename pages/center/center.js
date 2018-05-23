// pages/center/center.js

let app = getApp();
Page({
  data:{
    userInfo:app.globalData.userInfo
  },
  onLoad: function () {
    console.log('enter center page')
    let that = this;
    // 未登录跳转回登陆页
    if (!app.globalData.userInfo) {
      wx.redirectTo({
        url: '../login/login'
      })
      return false
    } 
  },
  logout: function () {
    wx.request({
      url: 'https://rmtapi.hnsjb.cn/bs_api.php?op=index&param=logout',
      method: 'post',
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        sessid: app.globalData.sessid
      },
      success: function (response) {
        if (response.data.status == 1) {
          wx.clearStorage();
          app.globalData.userInfo = null;
          wx.redirectTo({
            url: '../login/login'
          })
        }else{
          wx.showModal({
            title: response.data.info,
            content: '',
            showCancel: false,
            complete: function () {
              return false;
            }
          });
        }
      }
    });
  }
});