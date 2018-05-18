// pages/login/login.js
let app = getApp();
Page({
    data: {
        userInfo: {},
        loading:false
    },
    onLoad: function () {
        
        // 页面初始化 options为页面跳转所带来的参数
        let that = this;
        // console.log(this.globalData);


        if (wx.getStorageSync('userInfo') != '' && wx.getStorageSync('wentload') == '') {
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
        //调用应用实例的方法获取全局数据
    },

    formSubmit: function(e) {
        let tempobj = e.detail.value;
        if (tempobj.username == '') {
            wx.showModal({
                title: '用户名不得为空',
                content: '',
                showCancel:false,
                complete: function(res) {
                    return false;
                }
            });
            return false;
        } else if (tempobj.password == '') {
            wx.showModal({
                title: '密码不得为空',
                content: '',
                showCancel:false,
                complete: function(res) {
                    return false;
                }
            });
            return false;
        }
        this.setData({
            loading: true
        });
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_3&param=login',
            method:'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid'),
                username:tempobj.username,
                password:tempobj.password
            },
            success:function(response) {
                if (response.data.status ==1 ) {
                    wx.setStorageSync('xjuser',response.data.data);
                    wx.removeStorageSync('wentload');
                    wx.removeStorageSync('lastupdate');
                    wx.removeStorageSync('slastupdate');
                    wx.removeStorageSync('ylastupdate');
                    wx.removeStorageSync('euptime');
                    wx.removeStorageSync('ruptime');
                    wx.switchTab({
                        url: '../craft/craft'
                    })

                } else if (response.data.status == 0) {
                    wx.showModal({
                        title: '用户名或密码有误，请检查后重新登录',
                        content: '',
                        showCancel:false,
                        complete: function(res) {
                            return false;
                        }
                    });
                }

            }
        });
    }
});