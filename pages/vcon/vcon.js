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
                that.setData({
                    workflow: res.data
                });
                that.setData({
                    lineLength: (res.data.length - 1) * 100
                });
                console.log(res.data)
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
                let tempArr = res.data;
                tempArr['content'] = JSON.parse(tempArr['content']) ;
                that.setData({
                    content: tempArr
                });
                // console.log(res.data)
            }
        });
    }
});