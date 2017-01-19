// pages/center/center.js

var app = getApp();
Page({
    data: {
        userInfo: {},
        loading: false,
        roles:[
            {roleid:37,rolename:'记者'},
            {roleid:38,rolename:'编辑'}
        ],
        xjuser:{},
        stats: {}
    },
    onLoad: function () {
        // 页面初始化 options为页面跳转所带来的参数
        var that = this;
        //调用应用实例的方法获取全局数据
        app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            })
        });
        console.log(this.data.userInfo);
        this.setData({
            xjuser:wx.getStorageSync("xjuser")
        });
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=userlist',
            method:'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid')
            },
            success:function(response) {
                that.setData({
                   stats:response.data
                });
                console.log(response);
            }
        });
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
    roleChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value);
        var that = this;
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=choose_role',
            method:'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid'),
                username:this.data.xjuser.username,
                userid:this.data.xjuser.userid,
                roleid:e.detail.value
            },
            success:function(response) {
                if (response.data.status == 1) {
                    wx.setStorageSync('xjuser', response.data.data);
                    that.setData({
                        'xjuser':response.data.data
                    });
                    wx.request({
                        url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=userlist',
                        method:'post',
                        header: {"content-type": "application/x-www-form-urlencoded"},
                        data: {
                            sessid: wx.getStorageSync('sessid')
                        },
                        success:function(response) {
                            that.setData({
                                stats:response.data
                            });
                            console.log(response);
                        }
                    });
                }
                console.log(response);
            }
        });

        // console.log(this.data.roles[e.detail.value]);
    }
});