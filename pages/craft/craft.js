// pages/craft/craft.js
Page({
    data: {},
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        if (wx.getStorageSync('xjuser') == '') {
            wx.redirectTo({
                url: '../login/login'
            });
            return false;
        }
    },
    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        // 页面显示
        if (wx.getStorageSync('xjuser') == '') {
            wx.redirectTo({
                url: '../login/login'
            });
            return false;
        }
        let cgxData = wx.getStorageSync('caogaoxiang') || [];
        this.setData({
            'caogaoxiang': cgxData
        });
        this.loadNews();
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    },
    onPullDownRefresh:function () {
        let that = this;
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_3&param=new_newslist&status=caogaoxiang&offset=0&num=100', //仅为示例，并非真实的接口地址
            method:'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid')
            },
            success: function (res) {
                if (res.data.status == 1) {
                    that.setData({
                        caogaoxiang: res.data.data
                    });
                    wx.setStorageSync('lastupdate',0);
                    wx.setStorageSync('caogaoxiang',res.data.data);
                    wx.stopPullDownRefresh();
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
    gotoNews: function (e) {
        wx.navigateTo({
            url: '../content/content?id=' + e.currentTarget.dataset.newsid
        })
    },
    loadNews:function() {
        let that = this;
        let change_time = wx.getStorageSync('lastupdate') || 0;
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_3&param=check_change', //仅为示例，并非真实的接口地址
            method:'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid'),
                change_time:change_time
            },
            success: function (res) {
                // res = JSON.parse(res);
                if (res.data.status == 1) {
                    that.getNews();
                    wx.setStorageSync('lastupdate', res.data.change_time);
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
    getNews:function() {
        let that = this;
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_3&param=new_newslist&status=caogaoxiang&offset=0&num=100', //仅为示例，并非真实的接口地址
            method:'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid')
            },
            success: function (res) {
                if (res.data.status == 1) {
                    that.setData({
                        caogaoxiang: res.data.data
                    });
                    wx.setStorageSync('caogaoxiang',res.data.data);
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
    onReachBottom:function() {
        let currentLength = this.data.caogaoxiang.length;
        let currentNews = this.data.caogaoxiang;
        let that = this;
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_3&param=new_newslist&status=caogaoxiang&offset='+currentLength+'&num=100', //仅为示例，并非真实的接口地址
            method:'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid')
            },
            success: function (res) {
                if (res.data.status == 1) {
                    that.setData({
                        caogaoxiang: currentNews.concat(res.data.data)
                    });
                    wx.setStorageSync('caogaoxiang',currentNews.concat(res.data.data));
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