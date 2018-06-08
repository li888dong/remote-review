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
    console.log('enter center page')
    let that = this;
    // 未登录跳转回登陆页
    if (!wx.getStorageSync('sessid')) {
      wx.redirectTo({
        url: '../login/login'
      })
    } else {
      if (this.data.role == 'bianji') {
        wx.setStorage({
          key: 'role',
          data: 'bianji',
        });
        // 编辑角色的用户信息地址
        let url = 'https://rmtapi.hnsjb.cn/bs_api.php?op=news_index&param=userlist';
        this.fetchUserInfo(url)
      } else {
        wx.setStorage({
          key: 'role',
          data: 'jizhe',
        });
        // 记者角色用户信息接口地址
        let url = 'https://rmtapi.hnsjb.cn/bs_api.php?op=index&param=userlist';
        this.fetchUserInfo(url)
      }
    }
    this.setData({
      is_bianji: wx.getStorageSync('is_bianji'),
      role: wx.getStorageSync('role') || 'jizhe',
      realname:wx.getStorageSync('realname')
    })
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
            userInfo: response.data.data
          })
          if(response.data.data.realname){
            wx.setStorage({
              key: 'realname',
              data: response.data.data.realname,
            })
          }
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
    if (e.detail.value) {
      wx.setStorage({
        key: 'role',
        data: 'bianji',
      });
      this.setData({
        role:'bianji'
      })
      // 编辑角色的用户信息地址
      let url = 'https://rmtapi.hnsjb.cn/bs_api.php?op=news_index&param=userlist';
      this.fetchUserInfo(url)
    } else {
      wx.setStorage({
        key: 'role',
        data: 'jizhe',
      });
      this.setData({
        role:'jizhe'
      })
      // 记者角色用户信息接口地址
      let url = 'https://rmtapi.hnsjb.cn/bs_api.php?op=index&param=userlist';
      this.fetchUserInfo(url)
    }
  },
});