// pages/content/content.js
Page({
    data: {
        "content": {},
        cid: 0,
        workflow: [],
        lineLength: 0
    },
    onLoad: function (options) {
        let that = this;
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
                that.setData({
                    workflow: res.data
                });
                that.setData({
                    lineLength: (res.data.length - 1) * 100
                });
                console.log(res.data)
            }
        });
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=get_article&id=' + options.id, //仅为示例，并非真实的接口地址
            method: 'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid')
            },
            success: function (res) {
                let tempArr = res.data;
                tempArr['content'] = JSON.parse(tempArr['content']) ;
                that.setData({
                    content: tempArr
                });
                // console.log(res.data)
            }
        });
        // console.log(this.data.workflow.length);
        // that.setData({
        //     lineLength: (this.data.workflow.length - 1) * 100
        // });
        //
    },

    editNews: function () {
        wx.navigateTo({
            url: '../edit/edit?id=' + this.data.cid
        })
    },
    delNews: function () {
        let that = this;
        wx.showModal({
            title: '确认删除',
            content: '您确定要删除这篇稿件吗？',
            success: function (res) {
                if (res.confirm) {
                    wx.request({
                        url: "https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=delete",
                        method: 'post',
                        header: {"content-type": "application/x-www-form-urlencoded"},
                        data: {
                            sessid: wx.getStorageSync('sessid'),
                            id: that.data.cid
                        },
                        success: function (res) {
                            if (res.data.status == 1) {
                                wx.showModal({
                                    title: '删除成功',
                                    showCancel: false,
                                    content: '',
                                    complete: function (res) {
                                        wx.navigateBack({
                                            delta: 1
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