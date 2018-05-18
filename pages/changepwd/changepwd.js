// pages/changepwd/changepwd.js
let app = getApp();

Page({
    data: {
        userInfo:{},
        loading:false,
        btntext:'确认修改'
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        let that = this;
        //调用应用实例的方法获取全局数据
        app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            })
        });
    },

    formSubmit: function (e) {
        let tempobj = e.detail.value;
        if (tempobj.password == '') {
            wx.showModal({
                title: '请输入您的旧密码',
                content: '',
                showCancel: false,
                complete: function (res) {
                    return false;
                }
            });
            return false;
        } else if (tempobj.newpassword == '' || tempobj.newpassword.length < 6) {
            wx.showModal({
                title: '请输入不少于6位的新密码',
                content: '',
                showCancel: false,
                complete: function (res) {
                    return false;
                }
            });
            return false;
        } else if (tempobj.repassword == '') {
            wx.showModal({
                title: '请确认新密码',
                content: '',
                showCancel: false,
                complete: function (res) {
                    return false;
                }
            });
        } else if (tempobj.newpassword != tempobj.repassword) {
            wx.showModal({
                title: '两次密码输入不一致，请检查输入',
                content: '',
                showCancel: false,
                complete: function (res) {
                    return false;
                }
            });
        } else {
            this.setData({
                loading: true
            });
            this.setData({
                'btntext':'提交中...'
            });
            let that = this;
            wx.request({
                url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_3&param=change_pd',
                method: 'post',
                header: {"content-type": "application/x-www-form-urlencoded"},
                data: {
                    sessid: wx.getStorageSync('sessid'),
                    new_pd: tempobj.newpassword,
                    old_pd: tempobj.password
                },
                success: function (response) {
                    if (response.data.status == 1) {
                        wx.showModal({
                            title: '密码修改成功',
                            content: '',
                            showCancel: false,
                            complete: function (res) {
                                wx.navigateBack({
                                    delta: 1
                                })
                            }
                        });


                    } else if (response.data.status == -1) {
                        wx.showModal({
                            title: '旧密码错误，请重新输入',
                            content: '',
                            showCancel: false,
                            complete: function (res) {
                                that.setData({
                                    loading:false
                                });
                                that.setData({
                                    'btntext':'确认修改'
                                });
                                return false;
                            }
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

                },
                fail:function() {
                    wx.showModal({
                        title: '网络状况差，请稍后再试',
                        showCancel: false,
                        content: '',
                        complete: function (res) {
                            that.setData({
                                'loading': false
                            });
                            that.setData({
                                'btntext':'确认修改'
                            })
                        }
                    });
                }
            });
        }

    }


});