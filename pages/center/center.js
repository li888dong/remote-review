// pages/center/center.js
let app = getApp();
Page({
  data:{
    userInfo:{},
    is_bianji:0,
    role:''
  },
  onLoad: function () {
    console.log('enter center page')
    let that = this;
    // 未登录跳转回登陆页
    if (!wx.getStorageSync('sessid')) {
      wx.redirectTo({
        url: '../login/login'
      })
    }else{
      this.fetchUserInfo()
    }
    this.setData({
      is_bianji:wx.getStorageSync('is_bianji'),
      role:wx.getStorageSync('role')||'jizhe'
    })
  },
  fetchUserInfo:function(){
    let that = this;
    wx.request({
      url: 'https://rmtapi.hnsjb.cn/bs_api.php?op=index&param=userlist',
      method: 'post',
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        sessid: app.globalData.sessid
      },
      success: function (response) {
        if (response.data.status == 1) {
          console.log('获取用户信息列表',response.data.data);
          that.setData({
            userInfo: response.data.data
          })
        } else {
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
  },
  switch2bianji(e){
    if(e.detail.value){
      wx.setStorage({
        key: 'role',
        data: 'bianji',
      })
      
    }else{
      wx.setStorage({
        key: 'role',
        data: 'jizhe',
      })
    }
  }
});