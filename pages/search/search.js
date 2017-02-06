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
        let q = e.detail.value;
        if (q != '') {
            let that = this;
            that.wetoast.toast({
                title: '搜索中',
                duration:0
            });
            wx.request({
                url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=search&pattern=' + q, //仅为示例，并非真实的接口地址
                method: 'post',
                header: {"content-type": "application/x-www-form-urlencoded"},
                data: {
                    sessid: wx.getStorageSync('sessid')
                },
                success: function (res) {
                    that.setData({
                        results: res.data
                    });
                    that.wetoast.hide();
                    console.log(res.data)
                }
            });
        }

    },
    gotoNews:function(e) {
        console.log(e);
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