// pages/search/search.js
let app = getApp();

Page({
    data: {
        results:[]
    },
    onLoad:function() {
        new app.WeToast();

    },

    backCenter: function () {
        wx.navigateBack({
            delta: 1
        })
    },
    search:function(e) {
        let q = e.detail.value.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
        if (q != '') {
            let that = this;
            that.wetoast.toast({
                title: '搜索中',
                duration:0
            });
            wx.request({
                url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_new&param=search&pattern=' + q, //仅为示例，并非真实的接口地址
                method: 'post',
                header: {"content-type": "application/x-www-form-urlencoded"},
                data: {
                    sessid: wx.getStorageSync('sessid')
                },
                success: function (res) {

                    if (res.data.status == 1) {
                        that.setData({
                            results: res.data.data
                        });
                        that.wetoast.hide();
                    } else if (res.data.status == '100' && wx.getStorageSync('wentload') == '') {
                        that.wetoast.hide();
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

    },
    gotoNews:function(e) {
        if (e.currentTarget.dataset.status == 1) {
            wx.navigateTo({
                url: '../vcon/vcon?id=' + e.currentTarget.dataset.newsid
            })
        } else if (e.currentTarget.dataset.status == 0) {
            wx.navigateTo({
                url: '../ckcon/ckcon?id=' + e.currentTarget.dataset.newsid
            })
        } else {
            wx.navigateTo({
                url: '../content/content?id=' + e.currentTarget.dataset.newsid
            })
        }


    }
});