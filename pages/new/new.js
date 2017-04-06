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
            copyfrom: '河南手机报',

        },
        disable: false,
        disabletip1: '插图',
        disabletip2: '暂存',
        disabletip3: '提交'
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        new app.WeToast();
    },

    uploadImg: function (e) {
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
                that.wetoast.toast({
                    title: '图片上传中',
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
                        let data = JSON.parse(res.data);
                        if (data.status == 1) {
                            let imagedata = {
                                "type": "image",
                                "value": data.url,
                                "title": ""
                            };
                            // wx.hideToast();
                            that.wetoast.hide();
                            tempArr.splice(cidx, 0, imagedata); // key 可以是任何字符串
                            that.setContent(tempArr);
                            data['content.content[' + (cidx+1) + '].show'] = false; // key 可以是任何字符串
                            that.setData(data);
                        }
                    },
                    fail:function(res) {
                        wx.showModal({
                            title: '网络状况差，请稍后再试',
                            showCancel: false,
                            content: '',
                            complete: function (res) {
                                that.wetoast.hide()
                            }
                        });

                    }
                });

            }
        })
    },
    uploadVd: function (e) {
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
                that.wetoast.toast({
                    title: '视频上传中',
                    duration:0
                });
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
                            let videodata = {
                                "type": "video",
                                "value": data.data.filepath,
                                "title": ""
                            };
                            that.wetoast.hide();
                            // wx.hideToast();
                            tempArr.splice(cidx, 0, videodata); // key 可以是任何字符串
                            that.setContent(tempArr);
                            data['content.content[' + (cidx+1) + '].show'] = false; // key 可以是任何字符串
                            that.setData(data);
                        } else if (data.status == '-1') {
                            wx.showModal({
                                title: '视频错误，请重新上传',
                                showCancel: false,
                                content: '',
                                complete: function (res) {
                                    that.wetoast.hide()
                                }
                            });
                        } else if (data.status == '-2') {
                            wx.showModal({
                                title: '视频大小超过限制，请重新上传',
                                showCancel: false,
                                content: '',
                                complete: function (res) {
                                    that.wetoast.hide()
                                }
                            });
                        } else if (data.status == '-3') {
                            wx.showModal({
                                title: '视频文件错误，请重新上传',
                                showCancel: false,
                                content: '',
                                complete: function (res) {
                                    that.wetoast.hide()
                                }
                            });
                        } else if (data.status == '-5' || data.status == '-6' || data.status == '-7' || data.status == '-8') {
                            wx.showModal({
                                title: '服务器错误，请稍后再试或联系管理员',
                                showCancel: false,
                                content: '',
                                complete: function (res) {
                                    that.wetoast.hide()
                                }
                            });
                        }
                    },
                    fail:function(res) {
                        wx.showModal({
                            title: '网络状况差，请稍后再试',
                            showCancel: false,
                            content: '',
                            complete: function (res) {
                                that.wetoast.hide()
                            }
                        });

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
    getContent: function (e) {

        if (this.data.content.title.replace(/\s+/g,"") == '') {
            wx.showModal({
                title: '标题不得为空',
                showCancel: false,
                content: '',
                complete: function (res) {
                    return false;
                }
            })
        } else if (this.data.content.copyfrom.replace(/\s+/g,"") == '') {
            wx.showModal({
                title: '来源不得为空',
                showCancel: false,
                content: '',
                complete: function (res) {
                    return false;
                }
            })
        } else {
            let tempArr = [];
            let tempBarr = [];

            for (let i = 0; i < this.data.content.content.length; i++) {
                if (this.data.content.content[i].type != 'add') {
                    tempArr.push(this.data.content.content[i])
                }
            }


            for (let i = 0;i<tempArr.length;i++) {
                if (i < tempArr.length -1 && tempArr[i].type == 'text' && tempArr [i+1].type == 'text') {
                    tempArr[i+1].value = tempArr[i].value + '\n' + tempArr[i+1].value;
                    tempArr[i].value = '';
                }

            }

            for (let i = 0;i<tempArr.length;i++) {
                if (tempArr[i].value != '') {
                    tempBarr.push(tempArr[i])
                }
            }

            for (let i = 0;i<tempBarr.length;i++) {
                if (tempBarr[i].type == 'text') {
                    tempBarr[i].value = tempBarr[i].value.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "")
                } else {
                    tempBarr[i].title = tempBarr[i].title.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "")
                }
            }
            this.setData({
                'disable':true
            });
            let disabletip = 'disabletip' + e.currentTarget.dataset.disableid;
            let tempData = {};
            tempData[disabletip] = this.data[disabletip] + '中...';
            this.setData(tempData);
            let that = this;
            this.setData({
                'disableid':e.currentTarget.dataset.disableid
            });
            wx.request({
                url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_new&param=add',
                method: 'post',
                header: {"content-type": "application/x-www-form-urlencoded"},
                data: {
                    title: this.data.content.title.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, ""),
                    copyfrom: this.data.content.copyfrom.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, ""),
                    content: JSON.stringify(tempBarr),
                    way: 'zancun',
                    sessid: wx.getStorageSync('sessid')
                },
                success: function (res) {
                    if (res.data.status == '1') {
                        wx.showModal({
                            title: '保存成功',
                            showCancel: false,
                            content: '',
                            complete: function (res) {
                                wx.navigateBack({
                                    delta: 1
                                })
                            }
                        })
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
                },
                fail:function(res) {
                    wx.showModal({
                        title: '网络状况差，请稍后再试',
                        showCancel: false,
                        content: '',
                        complete: function (res) {
                            that.setData({
                                'disable':false
                            });
                            tempData = {};
                            tempData[disabletip] = that.data[disabletip].replace('中...', '');
                            that.setData(tempData);
                        }
                    });

                }
            });
        }




    },
    pushContent: function (e) {

        if (this.data.content.title.replace(/\s+/g,"") == '') {
            wx.showModal({
                title: '标题不得为空',
                showCancel: false,
                content: '',
                complete: function (res) {
                    return false;
                }
            })
        } else if (this.data.content.copyfrom.replace(/\s+/g,"") == '') {
            wx.showModal({
                title: '来源不得为空',
                showCancel: false,
                content: '',
                complete: function (res) {
                    return false;
                }
            })
        } else {
            let tempArr = [];
            let tempBarr = [];

            for (let i = 0; i < this.data.content.content.length; i++) {
                if (this.data.content.content[i].type != 'add') {
                    tempArr.push(this.data.content.content[i])
                }
            }


            for (let i = 0;i<tempArr.length;i++) {
                if (i < tempArr.length -1 && tempArr[i].type == 'text' && tempArr [i+1].type == 'text') {
                    tempArr[i+1].value = tempArr[i].value + '\n' + tempArr[i+1].value;
                    tempArr[i].value = '';
                }

            }

            for (let i = 0;i<tempArr.length;i++) {
                if (tempArr[i].value != '') {
                    tempBarr.push(tempArr[i])
                }
            }

            for (let i = 0;i<tempBarr.length;i++) {
                if (tempBarr[i].type == 'text') {
                    tempBarr[i].value = tempBarr[i].value.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "")
                } else {
                    tempBarr[i].title = tempBarr[i].title.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "")
                }
            }
            this.setData({
                'disable':true
            });
            let disabletip = 'disabletip' + e.detail.target.dataset.disableid;
            let tempData = {};
            tempData[disabletip] = this.data[disabletip] + '中...';
            this.setData(tempData);
            let that = this;
            this.setData({
                'disableid':e.detail.target.dataset.disableid
            });
            wx.request({
                url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_new&param=add',
                method: 'post',
                header: {"content-type": "application/x-www-form-urlencoded"},
                data: {
                    title: this.data.content.title.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, ""),
                    copyfrom: this.data.content.copyfrom.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, ""),
                    content: JSON.stringify(tempBarr),
                    way: 'tijiao',
                    sessid: wx.getStorageSync('sessid'),
                    formId:e.detail.formId
                },
                success: function (res) {
                    if (res.data.status == '1') {
                        wx.showModal({
                            title: '提交成功',
                            showCancel: false,
                            content: '',
                            complete: function (res) {
                                wx.navigateBack({
                                    delta: 1  //todo:change redirect url
                                })
                            }
                        })
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
                },
                fail:function(res) {
                    wx.showModal({
                        title: '网络状况差，请稍后再试',
                        showCancel: false,
                        content: '',
                        complete: function (res) {
                            that.setData({
                                'disable':false
                            });
                            tempData = {};
                            tempData[disabletip] = that.data[disabletip].replace('中...', '');
                            that.setData(tempData);
                        }
                    });

                }
            });
        }





    },
    setText: function (e) {
        let cidx = e.target.dataset.cidx;
        let data = {};
        data['content.content[' + cidx + '].value'] = e.detail.value; // key 可以是任何字符串
        this.setData(data);
        this.sepText(cidx);
    },
    setTitle: function (e) {
        let cidx = e.target.dataset.cidx;
        let data = {};
        data['content.content[' + cidx + '].title'] = e.detail.value; // key 可以是任何字符串
        this.setData(data);
    },
    showFuns: function (e) {
        let cidx = e.target.dataset.cidx;
        let data = {};
        data['content.content[' + cidx + '].show'] = !this.data.content.content[cidx].show; // key 可以是任何字符串
        this.setData(data);
    },
    setProp: function (e) {
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
        let that = this;

        wx.showModal({
            title: '确认删除',
            content: '您确定要删除这块内容吗？',
            success: function (res) {
                if (res.confirm) {
                    let cidx = e.target.dataset.cidx;
                    let tempArr = that.data.content.content;
                    tempArr.splice(cidx, 1);
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
                    that.setContent(tempArr);
                } else {
                    return false;
                }
            }
        });
    },
    getArray: function (e) {
        this.setData({
            'disable':true
        });
        let disabletip = 'disabletip' + e.currentTarget.dataset.disableid;
        let tempData = {};
        tempData[disabletip] = this.data[disabletip] + '中...';
        this.setData(tempData);
        this.setData({
            'disableid':e.currentTarget.dataset.disableid
        });
        let dataArr = [];
        for (let i=0;i<this.data.content.content.length;i++) {
            if (this.data.content.content[i].type != 'add') {
                dataArr.push(this.data.content.content[i])
            }
        }
        // let tempStr = this.data.content.content[0].value;
        let addObj = {
            "type": "add",
            "show": false
        };

        let resultArr = [];
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

        if (resultArr[0].type != 'add') {
            resultArr = [{"type":"add","show":false}].concat(resultArr);
        }
        if (resultArr[resultArr.length -1].type !='text') {
            resultArr = resultArr.concat([{"type":"text","value":""}]);
        }
        this.setContent(resultArr);

        tempData = {};
        tempData[disabletip] = this.data[disabletip].replace('中...', '');
        this.setData(tempData);
        this.setData({
            'disable':false
        });

    },
    sepText: function (idx) {
        let dataArr = this.data.content.content;
        if (idx != 0 && idx != dataArr.length -1) {
            let tempA = dataArr.slice(0, idx);
            let tempB = dataArr.slice(idx + 1);
            let resultArr = [];
            let tempStr = dataArr[idx].value;
            tempStr = tempStr.replace(/(\n)+/g, '\n');
            let tempRarr = [];
            let tempArr = tempStr.split('\n');
            for (let j = 0; j < tempArr.length; j++) {
                let tempObj = [];
                if (j == tempArr.length - 1 && dataArr[idx + 1].type == 'add') {
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
            resultArr = tempA.concat(tempRarr);
            resultArr = resultArr.concat(tempB);
            this.setContent(resultArr);
        } else if (idx == 0) {
            let tempB = dataArr.slice(idx + 1);
            let resultArr = [];
            let tempStr = dataArr[idx].value;
            tempStr = tempStr.replace(/(\n)+/g, '\n');
            let tempRarr = [];
            let tempArr = tempStr.split('\n');
            for (let j = 0; j < tempArr.length; j++) {
                let tempObj = [];
                if (j == tempArr.length - 1 && dataArr.length > 1 && dataArr[idx + 1].type == 'add') {
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
            resultArr = tempRarr.concat(tempB);
            this.setContent(resultArr);
        } else {
            let tempA = dataArr.slice(0, idx);
            // let tempB = dataArr.slice(idx+1);
            let resultArr = [];
            let tempStr = dataArr[idx].value;
            tempStr = tempStr.replace(/(\n)+/g, '\n');
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
            resultArr = tempA.concat(tempRarr);
            // resultArr = resultArr.concat(tempB);
            this.setContent(resultArr);
        }
    },
    setContent(tempArr) {
        let tempCArr = [];

        for (let i = 0;i<tempArr.length;i++) {
            if (tempArr[i].type === 'text' && tempArr[i].value.length > 140) {
                tempCArr.push({
                    'id':i,
                    'strA':tempArr[i].value.substr(0,140),
                    'strB':tempArr[i].value.substr(140,tempArr[i].value.length)
                })
            }
        }
        this.setData({
            'content.content': tempArr
        });
        for (let j = 0;j<tempCArr.length;j++) {
            let data = {};
            data['content.content[' + tempCArr[j].id + '].value'] = tempCArr[j].strA + tempCArr[j].strB; // key 可以是任何字符串
            this.setData(data);
        }
    }
});