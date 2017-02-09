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
        this.updateNews()
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
    updateNews:function() {
        let that = this;
        let change_time = wx.getStorageSync('ruptime') || 0;
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=check_change', //仅为示例，并非真实的接口地址
            method:'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid'),
                change_time:change_time
            },
            success: function (res) {
                console.log(res);
                // res = JSON.parse(res);
                if (res.data.status == 1) {
                    that.getList();
                    wx.setStorageSync('ruptime', res.data.change_time);
                    console.log('time changed')
                }
            }
        });
    },
    onPullDownRefresh: function() {
        let that = this;
        let change_time = wx.getStorageSync('ruptime') || 0;
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=check_change', //仅为示例，并非真实的接口地址
            method:'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid'),
                change_time:change_time
            },
            success: function (res) {
                console.log(res);

                // res = JSON.parse(res);
                if (res.data.status == 1) {
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
                            console.log(res.data);
                            wx.setStorageSync('caogaoxiang', res.data);
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
                            console.log(res.data);
                            wx.setStorageSync('rshenhezhong', res.data);

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
                            wx.setStorageSync('ryishenhe', res.data);
                            console.log(res.data);
                            wx.stopPullDownRefresh();
                            wx.hideNavigationBarLoading();
                        }
                    });
                    // console.log('time changed')
                    wx.setStorageSync('ruptime', res.data.change_time);

                }
            }
        });



    },

    onLoad: function () {
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
        let cgxData = wx.getStorageSync('caogaoxiang') || [];
        let shzData = wx.getStorageSync('rshenhezhong') || [];
        let yshData = wx.getStorageSync('ryishenhe') || [];
        this.setData({
            'caogaoxiang': cgxData
        });
        this.setData({
            'shenhezhong': shzData
        });
        this.setData({
            'yishenhe': yshData
        });

        let that = this;
        let change_time = wx.getStorageSync('ruptime') || 0;
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=check_change', //仅为示例，并非真实的接口地址
            method:'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid'),
                change_time:change_time
            },
            success: function (res) {
                console.log(res);
                // res = JSON.parse(res);
                if (res.data.status == 1) {
                    that.getList();
                    wx.setStorageSync('ruptime', res.data.change_time);
                    console.log('time changed')
                }
            }
        });
        // that.getList();

    },
    getList:function() {
        let that = this;
        wx.showNavigationBarLoading();
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
                wx.setStorageSync('caogaoxiang',res.data);
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
                wx.setStorageSync('rshenhezhong', res.data);

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
                wx.setStorageSync('ryishenhe', res.data);
                wx.hideNavigationBarLoading();
                console.log(res.data)
            }
        });
    }
});