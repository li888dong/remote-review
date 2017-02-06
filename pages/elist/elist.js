// pages/elist/elist.js
let app = getApp();

Page({
    data: {
        tab: '2',
        shenhezhong: [],
        yishenhe: [],
        caogaoxiang: []
    },
    changeTab: function (e) {
        console.log(e);
        this.setData({
            tab: e.currentTarget.dataset.tabindex
        })
    },
    ckNews: function (e) {

        if (e.currentTarget.dataset.forbid == '1') {
            wx.navigateTo({
                url: '../vcon/vcon?id=' + e.currentTarget.dataset.newsid
            })
        } else {
            wx.navigateTo({
                url: '../ckcon/ckcon?id=' + e.currentTarget.dataset.newsid
            })
        }
    },
    viewNews:function(e) {

            wx.navigateTo({
                url: '../vcon/vcon?id=' + e.currentTarget.dataset.newsid
            })



    },
    onLoad: function () {
        new app.WeToast();
        if (wx.getStorageSync('xjuser') == '') {
            wx.redirectTo({
                url: '../login/login'
            })
        }
        console.log('onLoad');

        let roleid = wx.getStorageSync('xjuser').roleid;

        if (roleid == '37') {
            wx.redirectTo({
                url: '../list/list'
            })
        }

        let that = this;
        that.wetoast.toast({
            title: '加载中',
            duration:0
        });
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=newslist&status=shenhezhong&offset=0&num=100', //仅为示例，并非真实的接口地址
            method: 'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid')
            },
            success: function (res) {
                that.setData({
                    shenhezhong: res.data
                });
                console.log(res.data)
            }
        });
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=newslist&status=yishenhe&offset=0&num=100', //仅为示例，并非真实的接口地址
            method: 'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid')
            },
            success: function (res) {
                that.setData({
                    yishenhe: res.data
                });
                that.wetoast.hide();
                console.log(res.data)
            }
        });

    },
    onReady: function () {
        // 页面渲染完成
    },
    onPullDownRefresh: function() {
        // Do something when pull down.
        let that = this;
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=newslist&status=shenhezhong&offset=0&num=100', //仅为示例，并非真实的接口地址
            method: 'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid')
            },
            success: function (res) {
                that.setData({
                    shenhezhong: res.data
                });
                console.log(res.data)
            }
        });
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=newslist&status=yishenhe&offset=0&num=100', //仅为示例，并非真实的接口地址
            method: 'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid')
            },
            success: function (res) {
                that.setData({
                    yishenhe: res.data
                });
                console.log(res.data);
                wx.stopPullDownRefresh();
            }
        });
    },
    onShow: function () {
        if (wx.getStorageSync('xjuser') == '') {
            wx.redirectTo({
                url: '../login/login'
            })
        }
        // 页面显示
        let roleid = wx.getStorageSync('xjuser').roleid;

        if (roleid == '37') {
            wx.redirectTo({
                url: '../list/list'
            })
        }

        let that = this;
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=newslist&status=shenhezhong&offset=0&num=100', //仅为示例，并非真实的接口地址
            method: 'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid')
            },
            success: function (res) {
                that.setData({
                    shenhezhong: res.data
                });
                console.log(res.data)
            }
        });
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=newslist&status=yishenhe&offset=0&num=100', //仅为示例，并非真实的接口地址
            method: 'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid')
            },
            success: function (res) {
                that.setData({
                    yishenhe: res.data
                });
                console.log(res.data);
                wx.stopPullDownRefresh();
            }
        });

        console.log('show')
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    }
});