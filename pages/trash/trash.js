// pages/trash/trash.js
Page({
    data: {
        trash: []
    },
    onLoad: function () {
        // 页面初始化 options为页面跳转所带来的参数
        let that = this;
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_3&param=show_deleted&offset=0&num=100', //仅为示例，并非真实的接口地址
            method: 'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid')
            },
            success: function (res) {
                if (res.data.status == 1) {
                    that.setData({
                        trash: res.data.data
                    });
                } else if (res.data.status == '100' && wx.getStorageSync('wentload') == '') {
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
            url: '../vcon/vcon?id=' + e.currentTarget.dataset.newsid
        })
    }
});