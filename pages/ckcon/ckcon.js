// pages/content/content.js

Page({
    data: {
        "content": {},
        cid: 0,
        workflow: [],
        lineLength: 0,
        editorauth: '',
        category: '19',
        subcate: '',
        categories: [],
        sucheckers: [],
        sucheck: '',
        currentCate: '',
        selection: [],
        rejectopen: false,
        optionopen: '0',
        xjuser: {},
        rejectreason: '',
        mainindex: 0,
        subindex: 0,
        suindex: 0
    },
    onLoad: function (options) {
        let that = this;
        // 页面初始化 options为页面跳转所带来的参数
        console.log(options);
        this.setData({
            xjuser: wx.getStorageSync("xjuser")
        });
        this.setData({
            cid: options.id
        });
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=show_workflow&id=' + options.id, //仅为示例，并非真实的接口地址
            method: 'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid')
            },
            success: function (res) {
                that.setData({
                    workflow: res.data
                });
                that.setData({
                    lineLength: (res.data.length - 1) * 100
                });
                console.log(res.data)
            }
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
                that.setData({
                    content: tempArr
                });
                // console.log(res.data)
            }
        });
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=cats',
            method: 'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid')
            },
            success: function (res) {
                that.setData({
                    categories: res.data
                });

                console.log(res.data)
            }
        });
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=sulist',
            method: 'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid')
            },
            success: function (res) {
                that.setData({
                    sucheckers: res.data
                });
                console.log(res.data)
            }
        });
        console.log(this.data.workflow.length);
        that.setData({
            lineLength: (this.data.workflow.length - 1) * 100
        });
        if (this.data.xjuser.roleid == '38') {
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
    rejectNews: function () {
        let that = this;
        if (this.data.rejectreason == '') {
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
                        wx.request({
                            url: "https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=reject",
                            method: 'post',
                            header: {"content-type": "application/x-www-form-urlencoded"},
                            data: {
                                sessid: wx.getStorageSync('sessid'),
                                id: that.data.cid,
                                reject_reason: that.data.rejectreason,
                                typefrom: that.data.editorauth
                            },
                            success: function (res) {
                                console.log(res);
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
                                }
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
    confirmNews: function () {

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
                        wx.request({
                            url: "https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=pass",
                            method: 'post',
                            header: {"content-type": "application/x-www-form-urlencoded"},
                            data: {
                                sessid: wx.getStorageSync('sessid'),
                                id: that.data.cid,
                                catid: that.data.currentCate,
                                typefrom: that.data.editorauth
                            },
                            success: function (res) {
                                console.log(res);
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
                                }
                            }
                        })
                    } else {
                        return false;
                    }
                }
            });

        }

    },
    forwardNews: function () {
        console.log(this.data);

        let that = this;

        if (this.data.sucheck == '') {
            console.log('t1');
            wx.showModal({
                title: '请选择总编辑',
                content: '',
                showCancel: false,
                complete: function (res) {
                    return false;
                }
            })
        } else if (this.data.currentCate == '') {
            console.log('t2');

            wx.showModal({
                title: '请选择栏目',
                content: '',
                showCancel: false,
                complete: function (res) {
                    return false;
                }
            })
        } else if (this.data.selection.length > 0 && this.data.subcate == '') {
            console.log('t3');

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
                        wx.request({
                            url: "https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=transcheck",
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
                                console.log(res);
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
                                }
                            }
                        })
                    } else {
                        return false;
                    }
                }
            });

        }

    },
    suNews: function () {
        let that = this;
        wx.showModal({
            title: '确认通过',
            content: '您确定要通过这篇稿件吗？',
            success: function (res) {
                console.log(res);
                if (res.confirm) {
                    wx.request({
                        url: "https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=pass",
                        method: 'post',
                        header: {"content-type": "application/x-www-form-urlencoded"},
                        data: {
                            sessid: wx.getStorageSync('sessid'),
                            id: that.data.cid,
                            catid: that.data.content.catid,
                            typefrom: that.data.editorauth
                        },
                        success: function (res) {
                            console.log(res);
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
                            }
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
            url: '../edit/edit?id=' + this.data.cid
        })
    },

});