// pages/content/content.js
Page({
    data:{
        'content':{},
        workflow:[],
        lineLength:0,
        currentVoice:['','']
    },
    onLoad:function(options){
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
        // 页面初始化 options为页面跳转所带来的参数
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