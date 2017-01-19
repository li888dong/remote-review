Page({
    data: {
        tab: '1',
        shenhezhong: [],
        yishenhe: [],
        caogaoxiang: []
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
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
    onLoad: function () {
        var roleid = wx.getStorageSync('xjuser').roleid;

        if (roleid != '37') {
            wx.redirectTo({
                url: '../elist/elist'
            })
        }
        console.log('onLoad');
        var that = this;
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
                console.log(res.data)
            }
        });

    },
    onShow:function() {
        var roleid = wx.getStorageSync('xjuser').roleid;

        if (roleid != '37') {
            wx.redirectTo({
                url: '../elist/elist'
            })
        }
    }
});