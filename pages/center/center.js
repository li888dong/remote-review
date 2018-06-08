// pages/center/center.js
let app = getApp();
Page({
  data: {
    userInfo: {},
    realname:'',
    is_bianji: 0,
    role: ''
  },
  onLoad: function () {
    let that = this;
    // 未登录跳转回登陆页
    if (!wx.getStorageSync('sessid')) {
      wx.redirectTo({
        url: '../login/login'
      })
    } else {
      this.setData({
        is_bianji: wx.getStorageSync('is_bianji'),
        role: wx.getStorageSync('role'),
      })
      if (wx.getStorageSync('is_bianji')==1) {
        // 编辑角色的用户信息地址
        let url = 'https://rmtapi.hnsjb.cn/bs_api.php?op=news_index&param=userlist';
        this.fetchUserInfo(url)
      } else {
        // 记者角色用户信息接口地址
        let url = 'https://rmtapi.hnsjb.cn/bs_api.php?op=index&param=userlist';
        this.fetchUserInfo(url)
      }
    }
  },
  fetchUserInfo: function (url) {
    let that = this;

    wx.request({
      url: url,
      method: 'post',
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        sessid: app.globalData.sessid
      },
      success: function (response) {
        if (response.data.status == 1) {
          console.log('获取用户信息列表', response.data.data);
          that.setData({
            userInfo:response.data.data
          })
          
        } else if (response.data.status == -1){
          wx.showModal({
            title: '',
            content: response.data.info,
            showCancel: false,
            complete: function () {
              return false;
            }
          });
        } else if (response.data.status == -2){
          wx.showModal({
            title: '',
            content: '登录过期，请重新登录',
            showCancel: false,
            complete: function () {
              wx.clearStorage();
              wx.redirectTo({
                url: '../login/login'
              })
            }
          });
        }
      }
    });
  },
  logout: function () {
    wx.showLoading({
      title: '网络请求中...',
    })
    wx.request({
      url: 'https://rmtapi.hnsjb.cn/bs_api.php?op=index&param=logout',
      method: 'post',
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        sessid: app.globalData.sessid
      },
      success: function (response) {
        wx.hideLoading();
        if (response.data.status == 1) {
          wx.clearStorage();
          app.globalData.userInfo = null;
          wx.redirectTo({
            url: '../login/login'
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
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showModal({
          title: '',
          content: '网络错误，请尝试刷新'
        });
      }
    });
  },
  switch2bianji(e) {
    let that = this;
    if (e.detail.value) {
      // 编辑角色的用户信息地址
      let url = 'https://rmtapi.hnsjb.cn/bs_api.php?op=news_index&param=userlist';
      wx.setStorage({
        key: 'is_bianji',
        data: '1',
        success:function(){
          that.setData({
            is_bianji:1
          })
          that.fetchUserInfo(url)
        }
      });
    } else {
      // 记者角色用户信息接口地址
      let url = 'https://rmtapi.hnsjb.cn/bs_api.php?op=index&param=userlist';
      wx.setStorage({
        key: 'is_bianji',
        data: '0',
        success:function(){
          that.setData({
            is_bianji: 0
          })
          that.fetchUserInfo(url)
        }
      });    
    }
  },
});