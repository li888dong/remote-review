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
        let yshData = wx.getStorageSync('yishenhe') || [];
        this.setData({
            'yishenhe': yshData
        });
        this.loadNews();
        let pagestatus = wx.getStorageSync('ysstatus') || 'none';
        let self = wx.getStorageSync('ysself') || '0';
        let currentType = wx.getStorageSync('ystype') || '全部';
        this.filterNews(pagestatus,self);
        this.setData({
            'currentType':currentType
        })
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
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_new&param=new_newslist&status=yishenhe&offset=0&num=100', //仅为示例，并非真实的接口地址
            method:'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid')
            },
            success: function (res) {
                if (res.data.status == 1) {
                    that.setData({
                        yishenhe: res.data.data
                    });
                    wx.setStorageSync('ylastupdate',0);
                    wx.setStorageSync('yishenhe',res.data.data);
                    that.setData({
                        'currentType':'全部'
                    });
                    wx.stopPullDownRefresh();
                    wx.removeStorageSync('ysstatus');
                    wx.removeStorageSync('ysself');
                    wx.removeStorageSync('ystype');
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
    viewNews: function (e) {
        if (e.currentTarget.dataset.forbid == 1) {
            wx.navigateTo({
                url: '../vcon/vcon?id=' + e.currentTarget.dataset.newsid
            })
        } else {
            wx.navigateTo({
                url: '../ckcon/ckcon?id=' + e.currentTarget.dataset.newsid + '&onlycheck=1'
            })
        }
    },
    loadNews:function() {
        let that = this;
        let change_time = wx.getStorageSync('ylastupdate') || 0;
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_new&param=check_change', //仅为示例，并非真实的接口地址
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
                    wx.setStorageSync('ylastupdate', res.data.change_time);
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
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_new&param=new_newslist&status=yishenhe&offset=0&num=100', //仅为示例，并非真实的接口地址
            method:'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid')
            },
            success: function (res) {
                if (res.data.status == 1) {
                    that.setData({
                        yishenhe: res.data.data
                    });
                    let pagestatus = wx.getStorageSync('ysstatus') || 'none';
                    let self = wx.getStorageSync('ysself') || '0';
                    let currentType = wx.getStorageSync('ystype') || '全部';
                    this.filterNews(pagestatus,self);
                    this.setData({
                        'currentType':currentType
                    });
                    wx.setStorageSync('yishenhe',res.data.data);
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


    showFilter:function() {
        let that = this;
        wx.showActionSheet({
            itemList: ['全部','自采稿件','我通过的稿件'],
            success: function(res) {
                that.reformNews(res.tapIndex);
            },
            fail: function(res) {
                console.log(res.errMsg)
            }
        })
    },
    reformNews:function(idx) {
        switch (idx) {
            case 0:
                this.getNews();
                wx.removeStorageSync('ysstatus');
                wx.removeStorageSync('ysself');
                wx.setStorageSync('ystype', '全部');
                this.setData({
                    'currentType':'全部'
                });
                break;
            case 1:
                this.filterNews('all','1');
                wx.setStorageSync('ysstatus', 'all');
                wx.setStorageSync('ysself', '1');
                wx.setStorageSync('ystype', '自采稿件');
                this.setData({
                    'currentType':'自采稿件'
                });
                break;
            case 2:
                this.filterNews('self_check','1');
                wx.setStorageSync('ysstatus', 'self_check');
                wx.setStorageSync('ysself', '1');
                wx.setStorageSync('ystype', '我通过的稿件');
                this.setData({
                    'currentType':'我通过的稿件'
                });
                break;
            default:
                // this.getNews();
                return false;
        }

    },
    filterNews:function(a,b) {
        let tempArr = wx.getStorageSync('yishenhe');
        let newArr = [];
        if (a == 'self_check') {
            for (let i = 0;i < tempArr.length;i++) {
                if (tempArr[i].self_check == b ) {
                    newArr.push(tempArr[i]);
                }
            }
        } else {
            for (let i = 0;i < tempArr.length;i++) {
                if (tempArr[i].is_self == b) {
                    newArr.push(tempArr[i]);
                }
            }
        }
        this.setData({
            'yishenhe':newArr
        })
    },

    onReachBottom:function() {
        let currentLength = this.data.yishenhe.length;
        let currentNews = this.data.yishenhe;
        let that = this;
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_new&param=new_newslist&status=yishenhe&offset='+currentLength+'&num=100', //仅为示例，并非真实的接口地址
            method:'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid')
            },
            success: function (res) {
                if (res.data.status == 1) {
                    that.setData({
                        yishenhe: currentNews.concat(res.data.data)
                    });
                    wx.setStorageSync('yishenhe',currentNews.concat(res.data.data));
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