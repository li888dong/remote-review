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
        //调用应用实例的方法获取全局数据
        app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            })
        });
        console.log(this.data.userInfo);
    },
    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        // 页面显示
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    },
    formSubmit: function(e) {
        // console.log('form发生了submit事件，携带数据为：', e.detail.value);
        let tempobj = e.detail.value;
        if (tempobj.username == '') {
            wx.showModal({
                title: '提示',
                content: '用户名不得为空',
                showCancel:false,
                complete: function(res) {
                    return false;
                }
            });
            return false;
        } else if (tempobj.password == '') {
            wx.showModal({
                title: '提示',
                content: '密码不得为空',
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
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=login',
            method:'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid'),
                username:tempobj.username,
                password:tempobj.password
            },
            success:function(response) {
                console.log(response);
                if (response.data.status ==1 ) {
                    wx.setStorageSync('xjuser',response.data.data);
                    if (response.data.data.roleid == '37') {
                        wx.navigateTo({
                            url: '../list/list'
                        })
                    } else {
                        wx.navigateTo({
                            url: '../elist/elist'
                        })
                    }

                } else if (response.data.status == 0) {
                    wx.showModal({
                        title: '提示',
                        content: '用户名或密码有误，请检查后重新登录',
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