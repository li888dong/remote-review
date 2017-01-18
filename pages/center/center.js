// pages/center/center.js
var util = require('../../utils/util.js');

var app = getApp();
Page({
    data: {
        userInfo: {},
        loading: false,
        roles:[
            {roleid:37,rolename:'记者'},
            {roleid:38,rolename:'编辑'}
        ],
        xjuser:{},
        index:0
    },
    onLoad: function () {
        // 页面初始化 options为页面跳转所带来的参数
        var that = this;
        //调用应用实例的方法获取全局数据
        app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            })
        });
        console.log(this.data.userInfo);
        this.setData({
            xjuser:wx.getStorageSync("xjuser")
        });
        this.setData({
            index:util.getArrayindx(this.data.xjuser.roleid,this.data.roles,'roleid')
        });
        console.log(util.getArrayindx(this.data.xjuser.roleid,this.data.roles,'roleid'));
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
    bindPickerChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value);
        this.setData({
            index: e.detail.value
        });
        var that = this;
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=choose_role',
            method:'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid'),
                username:this.data.xjuser.username,
                userid:this.data.xjuser.userid,
                roleid:this.data.roles[e.detail.value].roleid
            },
            success:function(response) {
                if (response.data.status == 1) {
                    wx.setStorageSync('xjuser', response.data.data);
                    that.setData({
                        'xjuser':response.data.data
                    })
                }
                console.log(response);
            }
        });

        console.log(this.data.roles[e.detail.value]);
    }
});