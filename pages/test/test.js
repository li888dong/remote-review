// pages/content/content.js
let util = require('../../utils/util.js');
let interval;
let timegap;
Page({
    data: {
        "content": {},
        cid: 0,
        workflow: [],
        lineLength: 0,
        editorauth: '',
        category: '116',
        subcate: '',
        categories: [],
        sucheckers: [],
        sucheck: '',
        currentCate: '116',
        selection: [],
        rejectopen: false,
        optionopen: '0',
        xjuser: {},
        rejectreason: '',
        mainindex: 0,
        subindex: 0,
        suindex: 0,
        disable:false,
        onlyreject:false,
        tocatid:0,
        parentid:0,
        disabletip3:'确认转审',
        disabletip2:'确认通过',
        disabletip1:'确认驳回',
        rejectaudio:[],
        currentVoice:['',''],
        currentRecord:''

    },
    onLoad: function (options) {
        let that = this;
        // 页面初始化 options为页面跳转所带来的参数
        this.setData({
            xjuser: wx.getStorageSync("xjuser")
        });
        this.setData({
            cid: options.id
        });
        if (options.onlycheck == '1') {
            this.setData({
                'onlyreject':true
            });
        }

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
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_new&param=cats',
            method: 'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid')
            },
            success: function (res) {

                if (res.data.status == 1) {
                    that.setData({
                        categories: res.data.data
                    });
                    that.setData({
                        currentCate: that.data.content.tocatid
                    });
                    if (that.data.content.parentid != 0) {
                        // console.log(that.data.content.parentid);

                        that.setData({
                            'mainindex':util.getArrayindx(that.data.content.parentid,that.data.categories,'catid')
                        });
                        // console.log(util.getArrayindx(that.data.content.parentid,that.data.categories,'catid'));
                        that.setData({
                            selection:that.data.categories[that.data.mainindex].subcats
                        });
                        that.setData({
                            'subindex':util.getArrayindx(that.data.content.tocatid,that.data.categories[that.data.mainindex].subcats,'catid')
                        })
                    } else {
                        that.setData({
                            'mainindex':util.getArrayindx(that.data.content.tocatid,that.data.categories,'catid')
                        })
                    }
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
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_new&param=sulist',
            method: 'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid')
            },
            success: function (res) {
                if (res.data.status == 1) {
                    that.setData({
                        sucheckers: res.data.data
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
        that.setData({
            lineLength: (this.data.workflow.length - 1) * 100
        });
        if (this.data.xjuser.roleid == '38' || this.data.xjuser.roleid == '37') {
            this.setData({
                editorauth: 'tocheck'
            })
        } else if (this.data.xjuser.roleid == '36') {
            this.setData({
                editorauth: 'tosucheck'
            })
        }


    },

    openOp: function (e) {
        let opid = e.target.dataset.opid;
        this.setData({
            optionopen: opid
        })
    },
    closeOp: function () {
        this.setData({
            optionopen: 0
        })
    },
    setReject: function (e) {
        this.setData({
            rejectreason: e.detail.value
        })
    },
    rejectNews: function (e) {
        let that = this;
        if (this.data.rejectreason == '' && this.data.rejectaudio.length == 0) {
            wx.showModal({
                title: '请填写驳回理由',
                content: '',
                showCancel: false,
                complete: function (res) {
                    return false;
                }
            })
        } else {

            wx.showModal({
                title: '确认驳回',
                content: '您确定要驳回这篇稿件吗？',
                success: function (res) {
                    if (res.confirm) {
                        that.setData({
                            'disable': true
                        });
                        let disabletip = 'disabletip' + e.currentTarget.dataset.disableid;
                        let tempData = {};
                        tempData[disabletip] = that.data[disabletip].replace('确认','') + '中...';
                        that.setData(tempData);

                        let tempRejectAudio = that.data.rejectaudio;
                        for (let i = 0;i<tempRejectAudio.length;i++) {
                            tempRejectAudio[i].filepath = ''
                        }
                        wx.request({
                            url: "https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_new&param=reject",
                            method: 'post',
                            header: {"content-type": "application/x-www-form-urlencoded"},
                            data: {
                                sessid: wx.getStorageSync('sessid'),
                                id: that.data.cid,
                                reject_reason: that.data.rejectreason.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, ""),
                                typefrom: that.data.editorauth,
                                reject_audio: JSON.stringify(tempRejectAudio)
                            },
                            success: function (res) {
                                if (res.data.status == 1) {
                                    wx.showModal({
                                        title: '驳回成功',
                                        showCancel: false,
                                        content: '',
                                        complete: function (res) {
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
                                            'disable': false
                                        });
                                        tempData = {};
                                        tempData[disabletip] = '确认' + that.data[disabletip].replace('中...', '');
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

        }

    },
    changeSelection: function (e) {
        let tmp = e.detail.value;
        this.setData({
            mainindex: tmp
        });

        this.setData({
            selection: this.data.categories[tmp].subcats
        });
        this.setData({
            currentCate: this.data.categories[tmp].catid
        })
    },
    setCate: function (e) {
        let tmp = e.detail.value;
        this.setData({
            subindex: tmp
        });

        this.setData({
            currentCate: this.data.selection[tmp].catid
        });
        this.setData({
            subcate: this.data.selection[tmp].catid
        })
    },
    setSu: function (e) {
        let tmp = e.detail.value;
        this.setData({
            suindex: tmp
        });
        this.setData({
            sucheck: this.data.sucheckers[tmp].userid
        });
    },
    confirmNews: function (e) {

        let that = this;

        if (this.data.currentCate == '') {
            wx.showModal({
                title: '请选择栏目',
                content: '',
                showCancel: false,
                complete: function (res) {
                    return false;
                }
            })
        } else if (this.data.selection.length > 0 && this.data.subcate == '') {
            wx.showModal({
                title: '请选择子栏目',
                content: '',
                showCancel: false,
                complete: function (res) {
                    return false;
                }
            })
        } else {
            wx.showModal({
                title: '确认通过',
                content: '您确定要通过这篇稿件吗？',
                success: function (res) {
                    if (res.confirm) {
                        that.setData({
                            'disable': true
                        });
                        let disabletip = 'disabletip' + e.currentTarget.dataset.disableid;
                        let tempData = {};
                        tempData[disabletip] = that.data[disabletip].replace('确认','') + '中...';
                        that.setData(tempData);
                        wx.request({
                            url: "https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_new&param=pass",
                            method: 'post',
                            header: {"content-type": "application/x-www-form-urlencoded"},
                            data: {
                                sessid: wx.getStorageSync('sessid'),
                                id: that.data.cid,
                                catid: that.data.currentCate,
                                typefrom: that.data.editorauth
                            },
                            success: function (res) {
                                if (res.data.status == 1) {
                                    wx.showModal({
                                        title: '已通过',
                                        showCancel: false,
                                        content: '',
                                        complete: function (res) {
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
                                            'disable': false
                                        });
                                        tempData = {};
                                        tempData[disabletip] = '确认' + that.data[disabletip].replace('中...', '');
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

        }

    },
    forwardNews: function (e) {

        let that = this;

        if (this.data.sucheck == '') {
            wx.showModal({
                title: '请选择总编辑',
                content: '',
                showCancel: false,
                complete: function (res) {
                    return false;
                }
            })
        } else if (this.data.currentCate == '') {
            wx.showModal({
                title: '请选择栏目',
                content: '',
                showCancel: false,
                complete: function (res) {
                    return false;
                }
            })
        } else if (this.data.selection.length > 0 && this.data.subcate == '') {
            wx.showModal({
                title: '请选择子栏目',
                content: '',
                showCancel: false,
                complete: function (res) {
                    return false;
                }
            })
        } else {
            wx.showModal({
                title: '确认转审',
                content: '您确定要转审这篇稿件吗？',
                success: function (res) {
                    if (res.confirm) {
                        that.setData({
                            'disable': true
                        });
                        let disabletip = 'disabletip' + e.currentTarget.dataset.disableid;
                        let tempData = {};
                        tempData[disabletip] = that.data[disabletip].replace('确认','') + '中...';
                        that.setData(tempData);
                        wx.request({
                            url: "https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_new&param=transcheck",
                            method: 'post',
                            header: {"content-type": "application/x-www-form-urlencoded"},
                            data: {
                                sessid: wx.getStorageSync('sessid'),
                                id: that.data.cid,
                                catid: that.data.currentCate,
                                typefrom: that.data.editorauth,
                                userid: that.data.sucheck
                            },
                            success: function (res) {
                                if (res.data.status == 1) {
                                    wx.showModal({
                                        title: '已转审',
                                        showCancel: false,
                                        content: '',
                                        complete: function (res) {
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
                                            'disable': false
                                        });
                                        tempData = {};
                                        tempData[disabletip] = '确认' + that.data[disabletip].replace('中...', '');
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

        }

    },
    suNews: function (e) {
        let that = this;
        wx.showModal({
            title: '确认通过',
            content: '您确定要通过这篇稿件吗？',
            success: function (res) {
                if (res.confirm) {
                    that.setData({
                        'disable': true
                    });
                    let disabletip = 'disabletip' + e.currentTarget.dataset.disableid;
                    let tempData = {};

                    tempData[disabletip] = that.data[disabletip].replace('确认','') + '中...';
                    that.setData(tempData);
                    wx.request({
                        url: "https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_new&param=pass",
                        method: 'post',
                        header: {"content-type": "application/x-www-form-urlencoded"},
                        data: {
                            sessid: wx.getStorageSync('sessid'),
                            id: that.data.cid,
                            catid: that.data.currentCate,
                            typefrom: that.data.editorauth
                        },
                        success: function (res) {
                            if (res.data.status == 1) {
                                wx.showModal({
                                    title: '已通过',
                                    showCancel: false,
                                    content: '',
                                    complete: function (res) {
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
                                        'disable': false
                                    });
                                    tempData = {};
                                    tempData[disabletip] = '确认' + that.data[disabletip].replace('中...', '');
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
    editNews: function () {
        wx.navigateTo({
            url: '../edit/edit?id=' + this.data.cid + '&type=editor'
        })
    },
    startRecord:function(e) {
        let that = this;
        let currentPosY = e.touches[0].clientY;

        this.setData({
            "posY":currentPosY
        });
        this.setData({
            "hasMoved":false
        });
        let tempFilePath;
        wx.startRecord({
            success: function(res) {
                tempFilePath = res.tempFilePath;
                that.setData({
                    'recording':false
                });
                let idx = that.data.rejectaudio.length - 1;
                let data = {};
                data['rejectaudio['+idx+'].filepath'] = tempFilePath;
                console.log(tempFilePath);

                that.setData(data);
                clearInterval(interval);
            },
            fail: function(res) {
                //录音失败
                console.log('aaa');
            }
        });


        timegap = setTimeout(function() {
            if (!that.data.hasMoved) {
                let tempVoice = {
                    "duration":1,
                    "filepath":'',
                    "playing":false,
                    'src':''
                };
                let tempArr = that.data.rejectaudio;
                tempArr.push(tempVoice);
                that.setData({
                    'recording':true
                });
                that.setData({
                    "rejectaudio":tempArr
                });
                interval = setInterval(that.updateRecord,1000);
            } else {
                that.cancelRecord();
            }
        },1000);
    },
    updateRecord:function() {
        let idx = this.data.rejectaudio.length - 1;
        console.log(this.data.rejectaudio[idx]);
        let data = {};
        data['rejectaudio['+idx+'].duration'] = this.data.rejectaudio[idx].duration + 1;
        this.setData(data);
    },
    completeRecord:function() {
        let that = this;
        if (this.data.recording) {
            // console.log('complete');
            wx.stopRecord();
            setTimeout(function() {
                wx.uploadFile({
                    url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=audio',
                    filePath: tempFilePath,
                    name: 'files',
                    success:res=>{
                        res.data = JSON.parse(res.data);
                        if (res.data.status == 1) {
                            let idx = that.data.rejectaudio.length - 1;
                            let data = {};
                            console.log(res);
                            data['rejectaudio['+idx+'].src'] = res.data.url;
                            that.setData(data);
                        }
                    }
                });
            },300);


            // let tempFilePath =
        } else {
            this.cancelRecord();
        }
    },
    cancelRecord:function() {
       wx.stopRecord();
       clearTimeout(timegap);
       console.log('canceled');
    },
    setMoving:function(e) {
        let posY = e.touches[0].clientY;
        if (!this.data.hasMoved) {
            if (Math.abs(posY - this.data.posY) > 100) {
                this.setData({
                    "hasMoved":true
                })
            }
        } else {
            this.cancelRecord();
        }


        // console.log(e);
    },
    playRecord:function(e) {
        let i = e.currentTarget.dataset.vid;
        let that = this;
        if (i == this.data.currentRecord) {
            if (that.data.rejectaudio[i].playing) {
                wx.pauseVoice();
                let data = {};
                data['rejectaudio['+i+'].playing'] = false;
                this.setData(data);
            } else {
                let pdata = {};
                pdata['rejectaudio['+i+'].playing'] = true;
                that.setData(pdata);
                that.setData({
                    'currentRecord':i
                });
                setTimeout(function() {
                    wx.playVoice({
                        filePath: that.data.rejectaudio[i].filepath,
                        success:function() {
                            let data = {};
                            data['rejectaudio['+i+'].playing'] = false;
                            that.setData(data);
                        }
                    });
                },500);

            }
        } else {
            wx.stopVoice();
            let tempVarr = this.data.rejectaudio;
            for (let i = 0;i<tempVarr.length;i++) {
                tempVarr[i].playing = false;
            }
            let data = {};
            data['rejectaudio'] = tempVarr;
            this.setData(data);
            let pdata = {};
            pdata['rejectaudio['+i+'].playing'] = true;
            that.setData(pdata);
            that.setData({
                'currentRecord':i
            });
            setTimeout(function() {
                wx.playVoice({
                    filePath: that.data.rejectaudio[i].filepath,
                    success:function() {
                        let data = {};
                        data['rejectaudio['+i+'].playing'] = false;
                        that.setData(data);
                    }
                });
            },500);
        }

    },
    delRecord:function(e) {
        let that = this;
        wx.showModal({
            title: '确认删除',
            content: '您确定要删除这块内容吗？',
            success: function (res) {
                if (res.confirm) {
                    let i = e.currentTarget.dataset.vid;
                    let tempArr = that.data.rejectaudio;
                    tempArr.splice(i, 1);
                    that.setData({
                        'rejectaudio':tempArr
                    })
                } else {
                    return false;
                }
            }
        });
    },
    playVoice:function(e) {

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
                data['content.reject_reason['+rid+'].reject_audio['+i+'].playing'] = false;
                that.setData(data);
            } else {
                if (that.data.content.reject_reason[rid].reject_audio[i].filepath != '') {
                    let data = {};
                    data['content.reject_reason['+rid+'].reject_audio['+i+'].playing'] = true;
                    that.setData(data);
                    that.setData({
                        'currentVoice':[rid,i]
                    });
                    setTimeout(function() {
                        wx.playVoice({
                            filePath: that.data.content.reject_reason[rid].reject_audio[i].filepath,
                            success:function() {
                                let data = {};
                                data['content.reject_reason['+rid+'].reject_audio['+i+'].playing'] = false;
                                that.setData(data);
                            }
                        });
                    },500);

                } else {
                    wx.downloadFile({
                        url: src,
                        success: function(res) {
                            wx.stopVoice();
                            let data = {};
                            data['content.reject_reason['+rid+'].reject_audio['+i+'].playing'] = true;
                            that.setData(data);
                            let pathdata = {};
                            pathdata['content.reject_reason['+rid+'].reject_audio['+i+'].filepath'] = res.tempFilePath;
                            that.setData(pathdata);
                            that.setData({
                                'currentVoice':[rid,i]
                            });
                            setTimeout(function() {
                                wx.playVoice({
                                    filePath: res.tempFilePath,
                                    success:function() {
                                        let data = {};
                                        data['content.reject_reason['+rid+'].reject_audio['+i+'].playing'] = false;
                                        that.setData(data);
                                    }
                                });
                            },500);
                        }
                    })
                }
            }
        } else {
            wx.stopVoice();
            let tempVarr = this.data.content.reject_reason[rid].reject_audio;
            for (let i = 0;i<tempVarr.length;i++) {
                tempVarr[i].playing = false;
            }
            let data = {};
            data['content.reject_reason['+rid+'].reject_audio'] = tempVarr;
            this.setData(data);
            console.log(that.data.content.reject_reason[rid].reject_audio[i].filepath);
            if (that.data.content.reject_reason[rid].reject_audio[i].filepath != '') {
                let data = {};
                data['content.reject_reason['+rid+'].reject_audio['+i+'].playing'] = true;
                that.setData(data);
                that.setData({
                    'currentVoice':[rid,i]
                });

                setTimeout(function() {
                    wx.playVoice({
                        filePath: that.data.content.reject_reason[rid].reject_audio[i].filepath,
                        success:function() {
                            let data = {};
                            data['content.reject_reason['+rid+'].reject_audio['+i+'].playing'] = false;
                            that.setData(data);
                        }
                    });
                },500);
            } else {
                wx.downloadFile({
                    url: src,
                    success: function(res) {
                        let data = {};
                        data['content.reject_reason['+rid+'].reject_audio['+i+'].playing'] = true;
                        that.setData(data);
                        let pathdata = {};
                        pathdata['content.reject_reason['+rid+'].reject_audio['+i+'].filepath'] = res.tempFilePath;
                        that.setData(pathdata);
                        that.setData({
                            'currentVoice':[rid,i]
                        });

                        setTimeout(function() {
                            wx.playVoice({
                                filePath: res.tempFilePath,
                                success:function() {
                                    let data = {};
                                    data['content.reject_reason['+rid+'].reject_audio['+i+'].playing'] = false;
                                    console.log('triggered');
                                    that.setData(data);
                                }
                            });
                        },500);
                    }
                })
            }
        }
    }
});