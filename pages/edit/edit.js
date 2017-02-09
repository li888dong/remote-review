// pages/newtest/newtest.js
let util = require('../../utils/util.js');
let app = getApp();
Page({
    data: {
        content: {
            title: '',
            content: [],
            copyfrom: '',
        },
        editor:''
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        new app.WeToast();

        let that = this;
        this.setData({
            'cid':options.id
        });
        this.setData({
           'editor':options.type
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
                let tempTarr = [];
                for (let i = 0;i<tempArr.content.length;i++) {
                    if (tempArr.content[i].type == 'text' && tempArr.content[i].value.length > 140) {
                        tempTarr.push({
                            'id':i,
                            'strA':tempArr.content[i].value.substr(0,140),
                            'strB':tempArr.content[i].value.substr(140,tempArr.content[i].value.length)
                        })
                    }
                }


                that.setData({
                    content: tempArr
                });

                for (let j = 0;j<tempTarr.length;j++) {
                    let data = {};
                    data['content.content[' + tempTarr[j].id + '].value'] = tempTarr[j].strA + tempTarr[j].strB; // key 可以是任何字符串
                    that.setData(data);
                }
                // console.log(res.data)
            }
        });
    },

    uploadImg: function (e) {
        console.log(e.target.dataset.cidx);
        let cidx = e.target.dataset.cidx ;
        let that = this;
        let tempArr = this.data.content.content;
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
                //     mask:true
                // });
                that.wetoast.toast({
                    title: '图片上传中',
                    duration:0
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
                        let data = JSON.parse(res.data);
                        if (data.status == 1) {
                            console.log(data);
                            let imagedata = {
                                "type":"image",
                                "value":data.url,
                                "title":""
                            };
                            // wx.hideToast();
                            that.wetoast.hide();
                            tempArr.splice(cidx,0,imagedata); // key 可以是任何字符串
                            console.log(imagedata);
                            that.setData({
                                "content.content":tempArr
                            });
                            data['content.content[' + (cidx+1) + '].show'] = false; // key 可以是任何字符串
                            // console.log(data);
                            that.setData(data);
                            console.log(that.data.content.content[cidx+1]);
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
                // wx.showToast({
                //     title: '视频上传中',
                //     icon: 'loading',
                //     duration: 10000,
                //     mask:true
                // });
                that.wetoast.toast({
                    title: '视频上传中',
                    duration:0
                });
                wx.uploadFile({
                    url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=video',
                    filePath: tempFilePath,
                    name: 'files',
                    formData:{
                        'user': 'test'
                    },
                    success: function(res){
                        let data = JSON.parse(res.data);
                        if (data.status == 1) {
                            console.log(data.data);
                            let videodata = {
                                "type":"video",
                                "value":data.data.filepath,
                                "title":""
                            };
                            // wx.hideToast();
                            that.wetoast.hide();
                            tempArr.splice(cidx,0,videodata); // key 可以是任何字符串
                            console.log(videodata);
                            that.setData({
                                "content.content":tempArr
                            });
                            data['content.content[' + (cidx+1) + '].show'] = false; // key 可以是任何字符串
                            // console.log(data);
                            that.setData(data);

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
    getContent: function (e) {
        if (this.data.content.title == '') {
            wx.showModal({
                title: '标题不得为空',
                showCancel: false,
                content: '',
                complete: function (res) {
                    return false;
                }
            })
        } else if (this.data.content.copyfrom == '') {
            wx.showModal({
                title: '来源不得为空',
                showCancel: false,
                content: '',
                complete: function (res) {
                    return false;
                }
            })
        } else {
            console.log(this.data.content);
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
            wx.request({
                url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=edit',
                method: 'post',
                header: {"content-type": "application/x-www-form-urlencoded"},
                data: {
                    title:this.data.content.title,
                    copyfrom:this.data.content.copyfrom,
                    content: JSON.stringify(tempBarr),
                    way:'zancun',
                    id:this.data.content.id,
                    sessid: wx.getStorageSync('sessid')
                },
                success: function (res) {
                    console.log(res);
                    if (res.data.status == '1') {
                        wx.showModal({
                            title: '保存成功',
                            showCancel: false,
                            content: '',
                            complete: function (res) {
                                wx.navigateBack({
                                    delta: 2  //todo:change redirect url
                                })
                            }
                        })
                    }
                }
            });
        }




    },
    pushContent: function (e) {



        if (this.data.content.title == '') {
            wx.showModal({
                title: '标题不得为空',
                showCancel: false,
                content: '',
                complete: function (res) {
                    return false;
                }
            })
        } else if (this.data.content.copyfrom == '') {
            wx.showModal({
                title: '来源不得为空',
                showCancel: false,
                content: '',
                complete: function (res) {
                    return false;
                }
            })
        } else {
            console.log(this.data.content);
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
            let formId;
            if (this.data.editor == 'reporter') {
                formId = e.detail.formId
            } else {
                formId = ''
            }

            wx.request({
                url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=edit',
                method: 'post',
                header: {"content-type": "application/x-www-form-urlencoded"},
                data: {
                    title: this.data.content.title,
                    copyfrom: this.data.content.copyfrom,
                    content: JSON.stringify(tempBarr),
                    way: 'tijiao',
                    id:this.data.content.id,
                    sessid: wx.getStorageSync('sessid'),
                    formId:formId
                },
                success: function (res) {
                    console.log(res);
                    if (res.data.status == '1') {
                        wx.showModal({
                            title: '提交成功',
                            showCancel: false,
                            content: '',
                            complete: function (res) {
                                wx.navigateBack({
                                    delta: 2  //todo:change redirect url
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
        console.log(e);
        this.sepText(cidx);
    },
    setTitle: function (e) {
        let cidx = e.target.dataset.cidx;
        let data = {};
        data['content.content[' + cidx + '].title'] = e.detail.value; // key 可以是任何字符串
        this.setData(data);
        console.log(e);
    },
    showFuns: function (e) {
        let cidx = e.target.dataset.cidx;
        let data = {};
        // console.log(this.data.content.content[cidx].show);
        data['content.content[' + cidx + '].show'] = !this.data.content.content[cidx].show; // key 可以是任何字符串
        // console.log(data);
        this.setData(data);
        // console.log(e);
    },
    setProp: function (e) {
        let prop = e.target.dataset.prop;
        let data = {};
        data['content.' + prop] = e.detail.value; // key 可以是任何字符串
        this.setData(data);
    },
    clrMedia: function (e) {
        let cidx = e.target.dataset.cidx;
        let data = {};
        data['content.content[' + cidx + '].value'] = ""; // key 可以是任何字符串
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
                    console.log(tempArr);
                    console.log(tempArr.length);
                    tempArr.splice(cidx, 1);
                    console.log(tempArr);

                    console.log(tempArr.length);

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


                    console.log(tempArr);
                    that.setData({
                        "content.content": tempArr
                    })
                } else {
                    return false;
                }
            }
        });




    },
    getArray: function () {
        let dataArr = [];
        for (let i=0;i<this.data.content.content.length;i++) {
            if (this.data.content.content[i].type != 'add') {
                dataArr.push(this.data.content.content[i])
            }
        }
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
        if (resultArr[0].type != 'add') {
            resultArr = [{"type":"add","show":false}].concat(resultArr);
        }
        if (resultArr[resultArr.length -1].type !='text') {
            resultArr = resultArr.concat([{"type":"text","value":""}]);
        }

        console.log(resultArr);

        this.setData({
            "content.content": resultArr
        })

    },
    sepText: function (idx) {
        console.log(idx);
        let dataArr = this.data.content.content;
        if (idx != 0 && idx != dataArr.length - 1) {
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
            this.setData({
                'content.content': resultArr
            })
        } else if (idx == 0) {
            let tempB = dataArr.slice(idx + 1);
            console.log(tempB);
            let resultArr = [];
            let tempStr = dataArr[idx].value;
            tempStr = tempStr.replace(/(\n)+/g, '\n');
            let tempRarr = [];
            let tempArr = tempStr.split('\n');
            for (let j = 0; j < tempArr.length; j++) {
                let tempObj = [];
                console.log(idx + 1);
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
            console.log(resultArr);
            this.setData({
                'content.content': resultArr
            })

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
            this.setData({
                'content.content': resultArr
            })
        }
    }
});