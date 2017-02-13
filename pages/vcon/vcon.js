// pages/content/content.js
Page({
    data:{
        'content':{},
        workflow:[],
        lineLength:0
    },
    onLoad:function(options){
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
                if (res.data.status == 1) {
                    that.setData({
                        workflow: res.data.data
                    });
                    that.setData({
                        lineLength: (res.data.data.length - 1) * 100
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
        // 页面初始化 options为页面跳转所带来的参数
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=get_article&id=' + options.id, //仅为示例，并非真实的接口地址
            method: 'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid')
            },
            success: function (res) {
                if (res.data.status == 1) {
                    let tempArr = res.data.data;
                    tempArr['content'] = JSON.parse(tempArr['content']) ;
                    that.setData({
                        content: tempArr
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
    }
});