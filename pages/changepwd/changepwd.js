// pages/changepwd/changepwd.js
let app = getApp();

Page({
    data: {
        userInfo:{},
        loading:false
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
        // console.log('form发生了submit事件，携带数据为：', e.detail.value);
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
            wx.request({
                url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=change_pd',
                method: 'post',
                header: {"content-type": "application/x-www-form-urlencoded"},
                data: {
                    sessid: wx.getStorageSync('sessid'),
                    new_pd: tempobj.newpassword,
                    old_pd: tempobj.password
                },
                success: function (response) {
                    console.log(response);
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
                                return false;
                            }
                        });
                    }

                }
            });
        }

    }


});