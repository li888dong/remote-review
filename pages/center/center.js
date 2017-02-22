// pages/center/center.js

let app = getApp();
Page({
    data: {
        userInfo: {},
        loading: false,
        roles: [
            {roleid: 36, rolename: '总值班'},
            {roleid: 37, rolename: '记者'},
            {roleid: 38, rolename: '编辑'}
        ],
        xjuser: {},
        stats: {}
    },
    onLoad: function () {
        // 页面初始化 options为页面跳转所带来的参数
        //调用应用实例的方法获取全局数据
        let that = this;
        if (wx.getStorageSync('userInfo') != '') {
            this.setData({
                userInfo:wx.getStorageSync('userInfo')
            });
        } else {
            app.getUserInfo(function (userInfo) {
                //更新数据
                that.setData({
                    userInfo: userInfo
                })
            });
        }
        this.setData({
            xjuser: wx.getStorageSync("xjuser")
        });
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_new&param=userlist',
            method: 'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid')
            },
            success: function (response) {
                if (response.data.status == '1') {
                    that.setData({
                        stats: response.data.data
                    });
                } else if (response.data.status == '100' && wx.getStorageSync('wentload') == '') {
                    wx.setStorageSync('wentload','went');
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
    logout: function () {
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_new&param=logout',
            method: 'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid')
            },
            success: function (response) {
                wx.removeStorageSync('xjuser');
                wx.removeStorageSync('userInfo');
                wx.removeStorageSync('ruptime');
                wx.removeStorageSync('euptime');
                if (response.data.status == 1) {
                    wx.redirectTo({
                        url: '../login/login'
                    })
                } else if (response.data.status == '100') {
                    wx.setStorageSync('wentload','went');
                    wx.redirectTo({
                        url: '../login/login'
                    })
                }
            }
        });
    }
});