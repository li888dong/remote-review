// pages/login/login.js
let app = getApp();
Page({
  onLoad: function () {
    console.log('enter login page')
    // 页面初始化 options为页面跳转所带来的参数
    if (!wx.getStorageSync('sessid')) {
      app.getSessionId();
    } else {
      app.globalData.sessid = wx.getStorageSync('sessid')
    }
  },

  formSubmit: function (e) {
    let tempobj = e.detail.value;
    if (tempobj.username == '') {
      wx.showModal({
        title: '用户名不得为空',
        content: '',
        showCancel: false,
        complete: function (res) {
          return false;
        }
      });
    } else if (tempobj.password == '') {
      wx.showModal({
        title: '密码不得为空',
        content: '',
        showCancel: false,
        complete: function (res) {
          return false;
        }
      });
      return false;
    }
    wx.request({
      url: 'https://rmtapi.hnsjb.cn/bs_api.php?op=index&param=login',
      method: 'post',
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        sessid: app.globalData.sessid,
        username: tempobj.username,
        password: tempobj.password
      },
      success: function (response) {
        console.log('登录',response)
        if (response.data.status == 1) {
          wx.setStorage({
            key: 'userInfo',
            data: response.data.data,
            success: function () {
              app.globalData.userInfo = response.data.data;
              app.globalData.sessid = response.data.data.sessid;
              wx.setStorageSync('sessid', response.data.data.sessid)
              wx.switchTab({
                url: '../craft/craft'
              })
            }
          });
        } else if (response.data.status == -1) {
          wx.showModal({
            title: response.data.info,
            content: '',
            showCancel: false,
            complete: function (res) {
              return false;
            }
          });
        }
      }
    });
  },
  scrollBottom(){
    wx.createSelectorQuery().select('#login-page').boundingClientRect((rect) => {

      // 使页面滚动到底部  

      wx.pageScrollTo({

        scrollTop: rect.bottom,//rect.height

        duration: 10//设置滚动时间

      })

      //功能代码

    }).exec()
  }
});