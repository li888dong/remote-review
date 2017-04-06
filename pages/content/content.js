// pages/content/content.js
Page({
    data: {
        "content": {},
        cid: 0,
        workflow: [],
        lineLength: 0,
        disable:false,
        disabletip1:'提交',
        disabletip2:'删除',
        currentVoice:['','']
    },
    onLoad: function (options) {
        let that = this;
        // 页面初始化 options为页面跳转所带来的参数
        this.setData({
            cid: options.id
        });
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_new&param=show_workflow&id=' + options.id, //仅为示例，并非真实的接口地址
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
                    wx.setStorageSync('wentload','went');
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
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_new&param=get_article&id=' + options.id, //仅为示例，并非真实的接口地址
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
                    wx.setStorageSync('wentload','went');
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
    },

    editNews: function () {
        wx.navigateTo({
            url: '../edit/edit?id=' + this.data.cid + '&type=reporter'
        })
    },
    delNews: function (e) {
        let that = this;
        wx.showModal({
            title: '确认删除',
            content: '您确定要删除这篇稿件吗？',
            success: function (res) {
                if (res.confirm) {
                    that.setData({
                        'disable': true
                    });
                    let disabletip = 'disabletip' + e.currentTarget.dataset.disableid;
                    let tempData = {};
                    tempData[disabletip] = that.data[disabletip] + '中...';
                    that.setData(tempData);
                    that.setData({
                        'disableid':e.currentTarget.dataset.disableid
                    });
                    wx.request({
                        url: "https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_new&param=delete",
                        method: 'post',
                        header: {"content-type": "application/x-www-form-urlencoded"},
                        data: {
                            sessid: wx.getStorageSync('sessid'),
                            id: that.data.cid
                        },
                        success: function (res) {
                            if (res.data.status == 1) {
                                wx.showModal({
                                    title: '删除成功',
                                    showCancel: false,
                                    content: '',
                                    complete: function (res) {
                                        that.setData({
                                            'disable':false
                                        });
                                        wx.navigateBack({
                                            delta: 1
                                        })
                                    }
                                })
                            } else if (res.data.status == '100' && wx.getStorageSync('wentload') == '') {
                                wx.setStorageSync('wentload','went');
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
                    })
                } else {
                    return false;
                }
            }
        });
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

            let formId = e.detail.formId;
            this.setData({
                'disable': true
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
                url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_new&param=edit',
                method: 'post',
                header: {"content-type": "application/x-www-form-urlencoded"},
                data: {
                    title: this.data.content.title.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, ""),
                    copyfrom: this.data.content.copyfrom.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, ""),
                    content: JSON.stringify(tempBarr),
                    way: 'tijiao',
                    id:this.data.content.id,
                    sessid: wx.getStorageSync('sessid'),
                    formId:formId
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
                        wx.setStorageSync('wentload','went');
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
    playVoice: function (e) {

        let currentRid = this.data.currentVoice[0];
        let currentVid = this.data.currentVoice[1];


        let src = e.currentTarget.dataset.src;
        let i = e.currentTarget.dataset.vid;
        let rid = e.currentTarget.dataset.rid;
        let that = this;

        if (currentRid == rid && currentVid == i) {
            if (that.data.content.reject_reason[rid].reject_audio[i].playing) {
                wx.pauseVoice();
                let data = {};
                data['content.reject_reason[' + rid + '].reject_audio[' + i + '].playing'] = false;
                that.setData(data);
            } else {
                if (that.data.content.reject_reason[rid].reject_audio[i].filepath != '') {
                    let data = {};
                    data['content.reject_reason[' + rid + '].reject_audio[' + i + '].playing'] = true;
                    that.setData(data);
                    that.setData({
                        'currentVoice': [rid, i]
                    });
                    setTimeout(function () {
                        wx.playVoice({
                            filePath: that.data.content.reject_reason[rid].reject_audio[i].filepath,
                            success: function () {
                                let data = {};
                                data['content.reject_reason[' + rid + '].reject_audio[' + i + '].playing'] = false;
                                that.setData(data);
                            }
                        });
                    }, 500);

                } else {
                    wx.downloadFile({
                        url: src,
                        success: function (res) {
                            wx.stopVoice();
                            let data = {};
                            data['content.reject_reason[' + rid + '].reject_audio[' + i + '].playing'] = true;
                            that.setData(data);
                            let pathdata = {};
                            pathdata['content.reject_reason[' + rid + '].reject_audio[' + i + '].filepath'] = res.tempFilePath;
                            that.setData(pathdata);
                            that.setData({
                                'currentVoice': [rid, i]
                            });
                            setTimeout(function () {
                                wx.playVoice({
                                    filePath: res.tempFilePath,
                                    success: function () {
                                        let data = {};
                                        data['content.reject_reason[' + rid + '].reject_audio[' + i + '].playing'] = false;
                                        that.setData(data);
                                    }
                                });
                            }, 500);
                        }
                    })
                }
            }
        } else {
            wx.stopVoice();
            for (let i = 0;i<this.data.content.reject_reason.length;i++) {
                // tempVarr.concat(this.data.content.reject_reason[i].reject_audio)
                let tempVarr = this.data.content.reject_reason[i].reject_audio;
                for (let j = 0; j < tempVarr.length; j++) {
                    tempVarr[j].playing = false;
                }
                let data = {};
                data['content.reject_reason[' + i + '].reject_audio'] = tempVarr;
                this.setData(data);
            }

            if (that.data.content.reject_reason[rid].reject_audio[i].filepath != '') {
                let data = {};
                data['content.reject_reason[' + rid + '].reject_audio[' + i + '].playing'] = true;
                that.setData(data);
                that.setData({
                    'currentVoice': [rid, i]
                });

                setTimeout(function () {
                    wx.playVoice({
                        filePath: that.data.content.reject_reason[rid].reject_audio[i].filepath,
                        success: function () {
                            let data = {};
                            data['content.reject_reason[' + rid + '].reject_audio[' + i + '].playing'] = false;
                            that.setData(data);
                        }
                    });
                }, 500);
            } else {
                wx.downloadFile({
                    url: src,
                    success: function (res) {
                        let data = {};
                        data['content.reject_reason[' + rid + '].reject_audio[' + i + '].playing'] = true;
                        that.setData(data);
                        let pathdata = {};
                        pathdata['content.reject_reason[' + rid + '].reject_audio[' + i + '].filepath'] = res.tempFilePath;
                        that.setData(pathdata);
                        that.setData({
                            'currentVoice': [rid, i]
                        });
                        setTimeout(function () {
                            wx.playVoice({
                                filePath: res.tempFilePath,
                                success: function () {
                                    let data = {};
                                    data['content.reject_reason[' + rid + '].reject_audio[' + i + '].playing'] = false;
                                    console.log('triggered');
                                    that.setData(data);
                                }
                            });
                        }, 500);
                    }
                })
            }
        }
    }
});