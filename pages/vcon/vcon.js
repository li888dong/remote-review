// pages/content/content.js
Page({
    data:{
        'content':{}
    },
    onLoad:function(options){
        var that = this;
        // 页面初始化 options为页面跳转所带来的参数
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=get_article&id=' + options.id, //仅为示例，并非真实的接口地址
            method: 'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid')
            },
            success: function (res) {
                var tempArr = res.data;
                tempArr['content'] = JSON.parse(tempArr['content']) ;
                that.setData({
                    content: tempArr
                });
                // console.log(res.data)
            }
        });
    },
    onReady:function(){
        // 页面渲染完成
    },
    onShow:function(){
        // 页面显示
    },
    onHide:function(){
        // 页面隐藏
    },
    onUnload:function(){
        // 页面关闭
    }
});