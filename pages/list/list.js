let app = getApp();
Page({
    data: {
        tab: '1',
        shenhezhong: [],
        yishenhe: [],
        caogaoxiang: []
    },
    //事件处理函数
    changeTab: function (e) {
        console.log(e);
        this.setData({
            tab: e.currentTarget.dataset.tabindex
        })
    },
    gotoNews: function (e) {
        wx.navigateTo({
            url: '../content/content?id=' + e.currentTarget.dataset.newsid
        })
    },
    viewNews:function(e) {
        wx.navigateTo({
            url: '../vcon/vcon?id=' + e.currentTarget.dataset.newsid
        })
    },

    onPullDownRefresh: function() {
        let that = this;
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=newslist&status=caogaoxiang&offset=0&num=100', //仅为示例，并非真实的接口地址
            method:'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid')
            },
            success: function (res) {
                that.setData({
                    caogaoxiang: res.data
                });
                console.log(res.data)
            }
        });
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=newslist&status=shenhezhong&offset=0&num=100', //仅为示例，并非真实的接口地址
            method:'post',
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
            method:'post',
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

    onLoad: function () {
        new app.WeToast();
        if (wx.getStorageSync('xjuser') == '') {
            wx.redirectTo({
                url: '../login/login'
            })
        }
        let roleid = wx.getStorageSync('xjuser').roleid;

        if (roleid != '37') {
            wx.redirectTo({
                url: '../elist/elist'
            })
        }
        console.log('onLoad');

    },
    onShow:function() {

        if (wx.getStorageSync('xjuser') == '') {
            wx.redirectTo({
                url: '../login/login'
            })
        }

        let roleid = wx.getStorageSync('xjuser').roleid;

        if (roleid != '37') {
            wx.redirectTo({
                url: '../elist/elist'
            })
        }


        let that = this;
        that.wetoast.toast({
            title: '加载中',
            duration:0
        });
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=newslist&status=caogaoxiang&offset=0&num=100', //仅为示例，并非真实的接口地址
            method:'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid')
            },
            success: function (res) {
                that.setData({
                    caogaoxiang: res.data
                });
                console.log(res.data)
            }
        });
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=newslist&status=shenhezhong&offset=0&num=100', //仅为示例，并非真实的接口地址
            method:'post',
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
            method:'post',
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
    }
});