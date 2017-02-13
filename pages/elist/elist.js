// pages/elist/elist.js

Page({
    data: {
        tab: '2',
        shenhezhong: [],
        yishenhe: [],
        caogaoxiang: []
    },
    changeTab: function (e) {
        this.setData({
            tab: e.currentTarget.dataset.tabindex
        });
        this.updateNews()
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
    updateNews:function() {
        let that = this;
        let change_time = wx.getStorageSync('euptime') || 0;
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=check_change', //仅为示例，并非真实的接口地址
            method:'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid'),
                change_time:change_time
            },
            success: function (res) {
                if (res.data.status == 1) {
                    that.getList();
                    wx.setStorageSync('euptime', res.data.change_time);
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

        if (roleid == '37') {
            wx.redirectTo({
                url: '../list/list'
            })
        }

    },
    onPullDownRefresh: function() {
        // Do something when pull down.

        let that = this;
        let change_time = wx.getStorageSync('euptime') || 0;
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=check_change', //仅为示例，并非真实的接口地址
            method:'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid'),
                change_time:change_time
            },
            success: function (res) {
                if (res.data.status == 1) {
                    wx.request({
                        url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=newslist&status=shenhezhong&offset=0&num=100', //仅为示例，并非真实的接口地址
                        method: 'post',
                        header: {"content-type": "application/x-www-form-urlencoded"},
                        data: {
                            sessid: wx.getStorageSync('sessid')
                        },
                        success: function (res) {
                            if (res.data.status == 1) {
                                that.setData({
                                    shenhezhong: res.data.data
                                });
                                wx.setStorageSync('eshenhezhong', res.data.data);
                            } else if (res.data.status == '100' && wx.getStorageSync('wentload') == '') {
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
                    wx.request({
                        url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=newslist&status=yishenhe&offset=0&num=100', //仅为示例，并非真实的接口地址
                        method: 'post',
                        header: {"content-type": "application/x-www-form-urlencoded"},
                        data: {
                            sessid: wx.getStorageSync('sessid')
                        },
                        success: function (res) {
                            if (res.data.status == 1) {
                                that.setData({
                                    yishenhe: res.data.data
                                });
                                wx.setStorageSync('eyishenhe', res.data.data);
                                wx.stopPullDownRefresh();
                                wx.hideNavigationBarLoading();
                            } else if (res.data.status == '100' && wx.getStorageSync('wentload') == '') {
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
                    wx.setStorageSync('euptime', res.data.change_time);

                } else if (res.data.status == '100' && wx.getStorageSync('wentload') == '') {
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

        // wx.showNavigationBarLoading();

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
        let shzData = wx.getStorageSync('eshenhezhong') || [];
        let yshData = wx.getStorageSync('eyishenhe') || [];
        this.setData({
            'shenhezhong': shzData
        });
        this.setData({
            'yishenhe': yshData
        });

        let that = this;
        let change_time = wx.getStorageSync('euptime') || 0;
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=check_change', //仅为示例，并非真实的接口地址
            method:'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid'),
                change_time:change_time
            },
            success: function (res) {
                if (res.data.status == 1) {
                    that.getList();
                    wx.setStorageSync('euptime', res.data.change_time);

                } else if (res.data.status == '100' && wx.getStorageSync('wentload') == '') {
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
    getList:function() {
        let that = this;
        wx.showNavigationBarLoading();
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=newslist&status=shenhezhong&offset=0&num=100', //仅为示例，并非真实的接口地址
            method: 'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid')
            },
            success: function (res) {

                if (res.data.status == 1) {
                    that.setData({
                        shenhezhong: res.data.data
                    });
                    wx.setStorageSync('eshenhezhong', res.data.data);
                } else if (res.data.status == '100' && wx.getStorageSync('wentload') == '') {
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
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=newslist&status=yishenhe&offset=0&num=100', //仅为示例，并非真实的接口地址
            method: 'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid')
            },
            success: function (res) {
                if (res.data.status == 1) {
                    that.setData({
                        yishenhe: res.data.data
                    });
                    wx.setStorageSync('eyishenhe', res.data.data);
                    wx.hideNavigationBarLoading();
                } else if (res.data.status == '100' && wx.getStorageSync('wentload') == '') {
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
    }
});