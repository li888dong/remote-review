// pages/newtest/newtest.js
var util = require('../../utils/util.js');
Page({
    data: {
        content: {
            title: '',
            content: [],
            copyfrom: ''
        }
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        var that = this;
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
        var cidx = e.target.dataset.cidx ;
        var that = this;
        var tempArr = this.data.content.content;
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
                wx.showToast({
                    title: '图片上传中',
                    icon: 'loading',
                    duration: 10000,
                    mask:true
                });
                wx.uploadFile({
                    url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=photo', //仅为示例，非真实的接口地址
                    filePath: tempFilePaths[0],
                    name: 'files',
                    formData:{
                        'user': 'test'
                    },
                    success: function(res){
                        console.log(res);
                        var data = JSON.parse(res.data);
                        if (data.status == 1) {
                            console.log(data);
                            var imagedata = {
                                "type":"image",
                                "value":data.url,
                                "title":""
                            };
                            wx.hideToast();
                            tempArr.splice(cidx,0,imagedata); // key 可以是任何字符串
                            console.log(imagedata);
                            that.setData({
                                "content.content":tempArr
                            });
                        }
                    }
                });

            }
        })
    },
    uploadVd: function (e) {
        console.log(e.target.dataset.cidx);
        var cidx = e.target.dataset.cidx;
        var that = this;
        var tempArr = this.data.content.content;
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
                wx.showToast({
                    title: '视频上传中',
                    icon: 'loading',
                    duration: 10000,
                    mask:true
                });
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
                            var videodata = {
                                "type":"video",
                                "value":data.data.filepath,
                                "title":""
                            };
                            wx.hideToast();
                            tempArr.splice(cidx,0,videodata); // key 可以是任何字符串
                            console.log(videodata);
                            that.setData({
                                "content.content":tempArr
                            });
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
    getContent: function () {
        console.log(this.data.content);

        var tempArr = [];
        for (var i = 0;i<this.data.content.content.length;i++) {
            if (this.data.content.content[i].type != 'add') {
                tempArr.push(this.data.content.content[i])
            }
        }
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=add',
            method: 'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                title:this.data.content.title,
                copyfrom:this.data.content.copyfrom,
                content: JSON.stringify(tempArr),
                way:'zancun',
                sessid: wx.getStorageSync('sessid')
            },
            success: function (res) {
                console.log(res);
                if (res.data.status == '1') {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: '提交成功',
                        complete: function (res) {
                            wx.redirectTo({
                                url: '../list/list'   //todo:change redirect url
                            })
                        }
                    })
                }
            }
        });

    },
    pushContent: function () {
        console.log(this.data.content);
        var tempArr = [];
        for (var i = 0; i < this.data.content.content.length; i++) {
            if (this.data.content.content[i].type != 'add') {
                tempArr.push(this.data.content.content[i])
            }
        }
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=add',
            method: 'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                title: this.data.content.title,
                copyfrom: this.data.content.copyfrom,
                content: JSON.stringify(tempArr),
                way: 'tijiao',
                sessid: wx.getStorageSync('sessid')
            },
            success: function (res) {
                console.log(res);
                if (res.data.status == '1') {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: '提交成功',
                        complete: function (res) {
                            wx.redirectTo({
                                url: '../list/list'   //todo:change redirect url
                            })
                        }
                    })
                }
            }
        });

    },
    setText: function (e) {
        var cidx = e.target.dataset.cidx;
        var data = {};
        data['content.content[' + cidx + '].value'] = e.detail.value; // key 可以是任何字符串
        this.setData(data);
        console.log(e);
    },
    setTitle: function (e) {
        var cidx = e.target.dataset.cidx;
        var data = {};
        data['content.content[' + cidx + '].title'] = e.detail.value; // key 可以是任何字符串
        this.setData(data);
        console.log(e);
    },
    showFuns: function (e) {
        var cidx = e.target.dataset.cidx;
        var data = {};
        data['content.content[' + cidx + '].show'] = true; // key 可以是任何字符串
        this.setData(data);
        console.log(e);
    },
    setProp: function (e) {
        var prop = e.target.dataset.prop;
        var data = {};
        data['content.' + prop] = e.detail.value; // key 可以是任何字符串
        this.setData(data);
    },
    clrMedia: function (e) {
        var cidx = e.target.dataset.cidx;
        var data = {};
        data['content.content[' + cidx + '].value'] = ""; // key 可以是任何字符串
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
        var dataArr = this.data.content.content;
        console.log('aa');
        // var tempStr = this.data.content.content[0].value;
        var addObj = {
            "type": "add",
            "show": false
        };

        var resultArr = [];
        // console.log(dataArr);
        for (var i = 0; i < dataArr.length; i++) {

            if ( i+1<dataArr.length ) {
                if (dataArr[i].type == "text" && dataArr[i+1].type == "add") {
                    var tempStr = dataArr[i].value;
                    var tempRarr = [];
                    var tempArr = tempStr.split('\n\n');
                    for (var j = 0; j < tempArr.length; j++) {
                        if (j == tempArr.length) {
                            var tempObj = [{
                                "type": "text",
                                "value": tempArr[j]
                            }];
                        } else {
                            var tempObj = [{
                                "type": "text",
                                "value": tempArr[j]
                            }, {
                                "type": "add",
                                "show": false
                            },{
                                "type":"text",
                                "value":""
                            }];
                        }

                        tempRarr = tempRarr.concat(tempObj);
                    }
                    resultArr = resultArr.concat(tempRarr);

                } else if (dataArr[i].type == "text") {
                    var tempStr = dataArr[i].value;
                    var tempRarr = [];
                    var tempArr = tempStr.split('\n\n');
                    for (var j = 0; j < tempArr.length; j++) {
                        var tempObj = [{
                            "type": "text",
                            "value": tempArr[j]
                        }, {
                            "type": "add",
                            "show": false
                        },{
                            "type":"text",
                            "value":""
                        }];
                        tempRarr = tempRarr.concat(tempObj);
                    }
                    resultArr = resultArr.concat(tempRarr);
                } else if (dataArr[i].type == "image" || dataArr[i].type == "video") {

                    if (dataArr[i+1].type == "add") {
                        var tempRarr = [dataArr[i]];
                    } else {
                        var tempRarr = [
                            dataArr[i],
                            addObj,{
                            "type":"text",
                            "value":""
                        }];

                    }

                    resultArr = resultArr.concat(tempRarr)
                }
            } else {
                if (dataArr[i].type == "text" ) {
                    var tempStr = dataArr[i].value;
                    var tempRarr = [];
                    var tempArr = tempStr.split('\n\n');
                    for (var j = 0; j < tempArr.length; j++) {
                        var tempObj = [{
                            "type": "text",
                            "value": tempArr[j]
                        }, {
                            "type": "add",
                            "show": false
                        },{
                            "type":"text",
                            "value":""
                        }];
                        tempRarr = tempRarr.concat(tempObj);
                    }
                    resultArr = resultArr.concat(tempRarr);

                } else if (dataArr[i].type == "image" || dataArr[i].type == "video") {
                    var tempRarr = [
                        dataArr[i],
                        addObj,{
                            "type":"text",
                            "value":""
                        }];
                    resultArr = resultArr.concat(tempRarr)
                }
            }


        }
        // console.log(tempStr);

        this.setData({
            "content.content": resultArr
        })

    }
});