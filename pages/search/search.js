// pages/search/search.js
Page({
    data: {
        results:[]
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
    },
    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        // 页面显示
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
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
                    console.log(res.data)
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