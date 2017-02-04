// pages/newtest/newtest.js
let util = require('../../utils/util.js');
let app = getApp();
Page({
    data: {
        content: {
            title: '',
            content: [{
                "type": "text",
                "value": ""
            }],
            copyfrom: ''
        }
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        new app.WeToast();
        // console.log(this.wetoast);
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
        let cidx = e.target.dataset.cidx;
        let that = this;
        let tempArr = this.data.content.content;
        let addObj = {
            "type": "add",
            "show": false
        };
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                let tempFilePaths = res.tempFilePaths;
                console.log(this);
                console.log(that);
                console.log(that.data);
                // wx.showToast({
                //     title: '图片上传中',
                //     icon: 'loading',
                //     duration: 10000,
                //     mask: true
                // });
                that.wetoast.toast({
                    title: '视频上传中',
                    duration:0
                });
                wx.uploadFile({
                    url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=photo', //仅为示例，非真实的接口地址
                    filePath: tempFilePaths[0],
                    name: 'files',
                    formData: {
                        'user': 'test'
                    },
                    success: function (res) {
                        console.log(res);
                        let data = JSON.parse(res.data);
                        if (data.status == 1) {
                            console.log(data);
                            let imagedata = {
                                "type": "image",
                                "value": data.url,
                                "title": ""
                            };
                            // wx.hideToast();
                            that.wetoast.hide();
                            tempArr.splice(cidx, 0, imagedata); // key 可以是任何字符串
                            console.log(imagedata);
                            that.setData({
                                "content.content": tempArr
                            });
                        }
                    }
                });

            }
        })
    },
    uploadVd: function (e) {
        console.log(e.target.dataset.cidx);
        let cidx = e.target.dataset.cidx;
        let that = this;
        let tempArr = this.data.content.content;
        wx.chooseVideo({
            sourceType: ['album', 'camera'], // album 从相册选视频，camera 使用相机拍摄
            maxDuration: 60, // 拍摄视频最长拍摄时间，单位秒。最长支持60秒
            camera: ['back'],
            success: function (res) {
                // success
                let tempFilePath = res.tempFilePath;
                console.log(this);
                console.log(that);
                console.log(that.data);
                that.wetoast.toast({
                    title: '视频上传中',
                    duration:0
                });
                // wx.showToast({
                //     title: '视频上传中',
                //     icon: 'loading',
                //     duration: 10000,
                //     mask: true
                // });
                wx.uploadFile({
                    url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=video', //仅为示例，非真实的接口地址
                    filePath: tempFilePath,
                    name: 'files',
                    formData: {
                        'user': 'test'
                    },
                    success: function (res) {
                        let data = JSON.parse(res.data);
                        if (data.status == 1) {
                            console.log(data.data);
                            let videodata = {
                                "type": "video",
                                "value": data.data.filepath,
                                "title": ""
                            };
                            that.wetoast.hide();
                            // wx.hideToast();
                            tempArr.splice(cidx, 0, videodata); // key 可以是任何字符串
                            console.log(videodata);
                            that.setData({
                                "content.content": tempArr
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

        if (this.data.content.title == '') {
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '标题不得为空',
                complete: function (res) {
                    return false;
                }
            })
        } else if (this.data.content.copyfrom == '') {
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '来源不得为空',
                complete: function (res) {
                    return false;
                }
            })
        } else {
            let tempArr = [];
            for (let i = 0; i < this.data.content.content.length; i++) {
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
                    way: 'zancun',
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
        }




    },
    pushContent: function () {

        if (this.data.content.title == '') {
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '标题不得为空',
                complete: function (res) {
                    return false;
                }
            })
        } else if (this.data.content.copyfrom == '') {
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '来源不得为空',
                complete: function (res) {
                    return false;
                }
            })
        } else {
            console.log(this.data.content);
            let tempArr = [];
            for (let i = 0; i < this.data.content.content.length; i++) {
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
        }





    },
    setText: function (e) {
        let cidx = e.target.dataset.cidx;
        let data = {};
        data['content.content[' + cidx + '].value'] = e.detail.value; // key 可以是任何字符串
        this.setData(data);
        // console.log(e);
    },
    setTitle: function (e) {
        let cidx = e.target.dataset.cidx;
        let data = {};
        data['content.content[' + cidx + '].title'] = e.detail.value; // key 可以是任何字符串
        this.setData(data);
        // console.log(e);
    },
    showFuns: function (e) {
        let cidx = e.target.dataset.cidx;
        let data = {};
        data['content.content[' + cidx + '].show'] = true; // key 可以是任何字符串
        this.setData(data);
        // console.log(e);
    },
    setProp: function (e) {
        console.log(e);
        let prop = e.target.dataset.prop;
        let data = {};
        data['content.' + prop] = e.detail.value; // todo 再检查
        this.setData(data);
    },
    clrMedia: function (e) {
        let cidx = e.target.dataset.cidx;
        let data = {};
        data['content.content[' + cidx + '].value'] = "";
        this.setData(data);
    },
    delMedia: function (e) {
        let cidx = e.target.dataset.cidx;
        let tempArr = this.data.content.content;
        tempArr.splice(cidx, 1);
        console.log(tempArr);
        if (tempArr[cidx] != undefined) {
            if (util.mergeText(tempArr[cidx - 1], tempArr[cidx]) != 'noop') {
                tempArr[cidx - 1] = util.mergeText(tempArr[cidx - 1], tempArr[cidx]);
                tempArr.splice(cidx, 1);
            }
        }
        for (let i = 0;i<tempArr.length;i++) {
            if (tempArr[i].type == 'add') {
                tempArr[i].show = false
            }
        }
        this.setData({
            "content.content": tempArr
        })
    },
    getArray: function () {
        let dataArr = this.data.content.content;
        console.log(dataArr);
        // let tempStr = this.data.content.content[0].value;
        let addObj = {
            "type": "add",
            "show": false
        };

        let resultArr = [];
        // console.log(dataArr);
        for (let i = 0; i < dataArr.length; i++) {

            if ( i+1<dataArr.length ) {
                if (dataArr[i].type == "text" && dataArr[i+1].type == "add") {
                    let tempStr = dataArr[i].value;
                    tempStr = tempStr.replace(/(\n)+/g,'\n');
                    let tempRarr = [];
                    let tempArr = tempStr.split('\n');
                    for (let j = 0; j < tempArr.length; j++) {
                        let tempObj = [];
                        if (j == tempArr.length -1) {
                            tempObj = [{
                                "type": "text",
                                "value": tempArr[j]
                            }];
                        } else {
                            tempObj = [{
                                "type": "text",
                                "value": tempArr[j]
                            }, {
                                "type": "add",
                                "show": false
                            }];
                        }

                        tempRarr = tempRarr.concat(tempObj);
                    }
                    resultArr = resultArr.concat(tempRarr);

                } else if (dataArr[i].type == "text") {
                    let tempStr = dataArr[i].value;
                    tempStr = tempStr.replace(/(\n)+/g,'\n');
                    let tempRarr = [];
                    let tempArr = tempStr.split('\n');
                    for (let j = 0; j < tempArr.length; j++) {
                        let tempObj = [{
                            "type": "text",
                            "value": tempArr[j]
                        }, {
                            "type": "add",
                            "show": false
                        }];
                        tempRarr = tempRarr.concat(tempObj);
                    }
                    resultArr = resultArr.concat(tempRarr);
                } else if (dataArr[i].type == "image" || dataArr[i].type == "video") {
                    let tempRarr = [];
                    if (dataArr[i+1].type == "add") {
                        tempRarr = [dataArr[i]];
                    } else {
                        tempRarr = [dataArr[i],addObj];

                    }

                    resultArr = resultArr.concat(tempRarr)
                }
            } else {

                console.log(i);

                if (dataArr[i].type == "text" ) {
                    let tempStr = dataArr[i].value;
                    tempStr = tempStr.replace(/(\n)+/g,'\n');
                    let tempRarr = [];
                    let tempArr = tempStr.split('\n');
                    for (let j = 0; j < tempArr.length; j++) {
                        let tempObj = [];
                        if (j == tempArr.length - 1) {
                            tempObj = [{
                                "type": "text",
                                "value": tempArr[j]
                            }];
                        } else {
                            tempObj = [{
                                "type": "text",
                                "value": tempArr[j]
                            }, {
                                "type": "add",
                                "show": false
                            }];
                        }

                        tempRarr = tempRarr.concat(tempObj);
                    }
                    resultArr = resultArr.concat(tempRarr);

                } else if (dataArr[i].type == "image" || dataArr[i].type == "video") {
                    let tempRarr = [
                        dataArr[i],
                        addObj];
                    resultArr = resultArr.concat(tempRarr)
                }
            }


        }

        resultArr = [{"type":"text","value":""},{"type":"add","show":false}].concat(resultArr);
        if (resultArr[resultArr.length -1].type !='text') {
            resultArr = resultArr.concat([{"type":"text","value":""}]);
        }

        console.log(resultArr);

        this.setData({
            "content.content": resultArr
        })

    }
});