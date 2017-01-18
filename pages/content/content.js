// pages/content/content.js
Page({
    data: {
        "content": {
            "title": "text",
            "author": "test",
            "time": "2016-10-10",
            "copyfrom": "河南手机报",
            "content": [{
                "type": "text",
                "value": "新闻正文"
            }, {
                "type": "text",
                "value": "新闻正文"
            }, {
                "type": "text",
                "value": "新闻正文"
            }, {
                "type": "text",
                "value": "新闻正文"
            }, {
                "type": "text",
                "value": "新闻正文"
            }, {
                "type": "text",
                "value": "新闻正文"
            }, {
                "type": "text",
                "value": "新闻正文"
            }],
            "reject_reason": [{
                "reason": "退回",
                "time": "2017-01-12 17:36",
                "name": "审稿编辑"
            }]
        },
        cid: 0,
        workflow: [{
            "action": "\u6d4b\u8bd5\u8bb0\u8005:\u65b0\u5efa",
            "time": "2017-01-10 11:42:10"
        }, {"action": "\u5ba1\u7a3f\u7f16\u8f91:\u9a73\u56de", "time": "2017-01-10 11:43:07"}],
        lineLength: 0
    },
    onLoad: function (options) {
        var that = this;
        // 页面初始化 options为页面跳转所带来的参数
        console.log(options);
        this.setData({
            cid: options.id
        });
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=show_workflow&id=' + options.id, //仅为示例，并非真实的接口地址
            method: 'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid')
            },
            success: function (res) {
                // that.setData({
                //     workflow: res.data
                // });
                // that.setData({
                //     linelength: (res.data.length - 1) * 40
                // });
                console.log(res.data)
            }
        });
        console.log(this.data.workflow.length);
        that.setData({
            lineLength: (this.data.workflow.length - 1) * 100
        });
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
    editNews: function () {
        wx.navigateTo({
            url: '../edit/edit?id=' + this.data.cid
        })
    },
    delNews: function () {
        wx.showModal({
            title: '确认删除',
            content: '您确定要删除这篇稿件吗？',
            success: function (res) {
                if (res.confirm) {
                    wx.request({
                        url: "https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=delete",
                        data: {
                            sessid: wx.getStorageSync('sessid'),
                            id: this.data.cid
                        },
                        success: function (res) {
                            if (res.data.status == 1) {
                                wx.showModal({
                                    title: '提示',
                                    showCancel: false,
                                    content: '删除成功',
                                    complete: function (res) {
                                        wx.redirectTo({
                                            url: '../list/list'
                                        })
                                    }
                                })
                            }
                        }
                    })
                } else {
                    return false;
                }
            }
        });
    }
});