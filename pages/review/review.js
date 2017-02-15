// pages/craft/craft.js
Page({
    data: {
    },
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
        let shzData = wx.getStorageSync('shenhezhong') || [];
        this.setData({
            'shenhezhong': shzData
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
        wx.showNavigationBarLoading();
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=new_newslist&status=shenhezhong&offset=0&num=100', //仅为示例，并非真实的接口地址
            method:'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid')
            },
            success: function (res) {
                if (res.data.status == 1) {
                    that.setData({
                        shenhezhong: res.data.data
                    });
                    wx.setStorageSync('slastupdate',0);
                    wx.setStorageSync('shenhezhong',res.data.data);
                    wx.hideNavigationBarLoading();
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
        if (e.currentTarget.dataset.forbid == 1) {
            wx.navigateTo({
                url: '../vcon/vcon?id=' + e.currentTarget.dataset.newsid
            })
        } else {
            wx.navigateTo({
                url: '../ckcon/ckcon?id=' + e.currentTarget.dataset.newsid
            })
        }

    },
    loadNews:function() {
        let that = this;
        let change_time = wx.getStorageSync('slastupdate') || 0;
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=check_change', //仅为示例，并非真实的接口地址
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
                    wx.setStorageSync('slastupdate', res.data.change_time);
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
        wx.showNavigationBarLoading();
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=new_newslist&status=shenhezhong&offset=0&num=100', //仅为示例，并非真实的接口地址
            method:'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid')
            },
            success: function (res) {
                if (res.data.status == 1) {
                    that.setData({
                        shenhezhong: res.data.data
                    });
                    wx.setStorageSync('shenhezhong',res.data.data);
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
    },
    showFilter:function() {
        let that = this;
        wx.showActionSheet({
            itemList: ['全部','待审稿件', '驳回稿件', '转审稿件','我的待审','我的转审'],
            success: function(res) {
                console.log(res);
                that.reformNews(res.tapIndex);
            },
            fail: function(res) {
                console.log(res.errMsg)
            }
        })
    },
    reformNews:function(idx) {
        console.log(idx);
        switch (idx) {
            case 0:
                this.getNews();
                break;
            case 1:
                this.filterNews('tocheck','0');
                break;
            case 2:
                this.filterNews('rejected','0');
                break;
            case 3:
                this.filterNews('tosucheck','0');
                break;
            case 4:
                this.filterNews('tocheck','1');
                break;
            case 5:
                this.filterNews('tosucheck','1');
                break;
            default:
                this.getNews();
        }

    },
    filterNews:function(a,b) {
        let tempArr = wx.getStorageSync('shenhezhong');
        let newArr = [];
        for (let i = 0;i < tempArr.length;i++) {
            if (tempArr[i].typefrom==a && tempArr[i].is_self == b) {
                newArr.push(tempArr[i]);
            }
        }
        this.setData({
            'shenhezhong':newArr
        })
    }
});