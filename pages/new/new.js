// pages/newtest/newtest.js
var util = require('../../utils/util.js');
Page({
    data: {
        content: {
            title: '',
            content: [{"type": "text", "value": ""}],
            copyfrom: ''
        }
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
    uploadImg: function (e) {
        console.log(e.target.dataset.cidx);
        var cidx = e.target.dataset.cidx;
        var that = this;
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths;
                console.log(this);
                console.log(that);
                console.log(that.data);
                var data = {};
                data['content.content[' + cidx + '].value'] = tempFilePaths[0] // key 可以是任何字符串
                that.setData(data);


            }
        })
    },
    uploadVd: function (e) {
        console.log(e.target.dataset.cidx);
        var cidx = e.target.dataset.cidx;
        var that = this;
        wx.chooseVideo({
            sourceType: ['album', 'camera'], // album 从相册选视频，camera 使用相机拍摄
            maxDuration: 60, // 拍摄视频最长拍摄时间，单位秒。最长支持60秒
            camera: ['back'],
            success: function (res) {
                // success
                var tempFilePath = res.tempFilePath;
                console.log(this);
                console.log(that);
                console.log(that.data);

                wx.uploadFile({
                    url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=video', //仅为示例，非真实的接口地址
                    filePath: tempFilePath,
                    name: 'files',
                    formData:{
                        'user': 'test'
                    },
                    success: function(res){
                        var data = JSON.parse(res.data);
                        if (data.status == 1) {
                            console.log(data.data);
                            var videodata = {};
                            videodata['content.content[' + cidx + '].value'] = data.data.filepath; // key 可以是任何字符串
                            console.log(videodata);
                            that.setData(videodata);
                        }
                    }
                });


            },
            fail: function () {
                // fail
            },
            complete: function () {
                // complete
            }
        })
    },
    addElement: function () {
        var tempItem = [{
            "type": "image",
            "value": ""
        }, {
            "type": "video",
            "value": ""
        }];
        var tempArray = this.data.content.content.concat(tempItem);
        this.setData({
            "content.content": tempArray
        })
    },
    getContent: function () {
        console.log(this.data.content);

        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=add',
            method: 'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                title:this.data.content.title,
                copyfrom:this.data.content.copyfrom,
                content: JSON.stringify(this.data.content.content),
                way:'zancun',
                sessid: wx.getStorageSync('sessid')
            },
            success: function (res) {
                console.log(res)
            }
        });

    },
    setText: function (e) {
        var cidx = e.target.dataset.cidx;
        var data = {};
        data['content.content[' + cidx + '].value'] = e.detail.value // key 可以是任何字符串
        this.setData(data);
        console.log(e);
    },
    setProp: function (e) {
        var prop = e.target.dataset.prop;
        var data = {};
        data['content.' + prop] = e.detail.value // key 可以是任何字符串
        this.setData(data);
    },
    clrMedia: function (e) {
        var cidx = e.target.dataset.cidx;
        var data = {};
        data['content.content[' + cidx + '].value'] = "" // key 可以是任何字符串
        this.setData(data);
    },
    delMedia: function (e) {
        var cidx = e.target.dataset.cidx;
        var tempArr = this.data.content.content;
        tempArr.splice(cidx, 1);
        console.log(tempArr);
        if (tempArr[cidx] != undefined) {
            if (util.mergeText(tempArr[cidx - 1], tempArr[cidx]) != 'noop') {
                tempArr[cidx - 1] = util.mergeText(tempArr[cidx - 1], tempArr[cidx]);
                tempArr.splice(cidx, 1);
            }
        }


        this.setData({
            "content.content": tempArr
        })
    },
    getArray: function () {
        var dataArr = [];
        var tempStr = this.data.content.content[0].value;
        console.log(tempStr);

        var tempArr = tempStr.split('\n\n');
        for (var i = 0; i < tempArr.length; i++) {
            var tempObj = [{
                "type": "text",
                "value": tempArr[i]
            }, {
                "type": "image",
                "value": ""
            }, {
                "type": "video",
                "value": ""
            }];
            dataArr = dataArr.concat(tempObj);
        }
        console.log(dataArr);
        this.setData({
            "content.content": dataArr
        })

    }
});