//app.js
let {WeToast} = require('src/wetoast.js');
App({
    onLaunch: function () {
        //调用API从本地缓存中获取数据
        let logs = wx.getStorageSync('logs') || [];
        logs.unshift(Date.now());
        wx.setStorageSync('logs', logs.slice(0,50))
    },
    getUserInfo: function (cb) {
        let that = this;
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.login({
                success: function (res) {
                    // console.log(res);
                    if (res.code) {
                        //发起网络请求
                        wx.request({
                            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_new&param=wx_login',
                            method:'post',
                            header: {"content-type": "application/x-www-form-urlencoded"},
                            data: {
                                code: res.code,
                                sessid:wx.getStorageSync('sessid')
                            },
                            success:function(response) {
                                // console.log(response);
                                wx.setStorageSync('sessid', response.data.sessid);
                                if (response.data.status == 0) {
                                    wx.redirectTo({
                                        url: '../login/login'
                                    })
                                } else {
                                    wx.setStorageSync('xjuser',response.data.data);
                                }
                            }
                        });
                        // console.log(res)
                    }

                    wx.getUserInfo({
                        success: function (res) {
                            that.globalData.userInfo = res.userInfo;
                            wx.setStorageSync('userInfo', res.userInfo);
                            // console.log(res);
                            typeof cb == "function" && cb(that.globalData.userInfo)
                        }
                    })
                }
            })
        }
    },
    globalData: {
        userInfo: null
    },
    WeToast
});