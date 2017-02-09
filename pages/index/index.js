
let app = getApp();
Page({
    data: {
        motto: '河南手机报远程发稿系统',
        userInfo: {}
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../center/center'
        })
    },
    bindListTap: function () {
        wx.navigateTo({
            url: '../list/list'
        })
    },
    onLoad: function (options) {
        console.log(options);
        console.log('onLoad');
        let that = this;
        // let roleid = wx.getStorageSync('xjuser').roleid;
        //
        // if (roleid == '37') {
        //     wx.redirectTo({
        //       url: '../list/list'
        //     })
        // } else {
        //     wx.redirectTo({
        //         url: '../elist/elist'
        //     })
        // }

        //调用应用实例的方法获取全局数据
        app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            })
        })
    }
});
