// pages/content/content.js
let util = require('../../utils/util.js');
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
        parentid:0
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
                            url: "https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_new&param=reject",
                            method: 'post',
                            header: {"content-type": "application/x-www-form-urlencoded"},
                            data: {
                                sessid: wx.getStorageSync('sessid'),
                                id: that.data.cid,
                                reject_reason: that.data.rejectreason.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, ""),
                                typefrom: that.data.editorauth
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
                                            'disable':false
                                        })
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
                                            'disable':false
                                        })
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
    forwardNews: function () {

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
                                            'disable':false
                                        })
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
    suNews: function () {
        let that = this;
        wx.showModal({
            title: '确认通过',
            content: '您确定要通过这篇稿件吗？',
            success: function (res) {
                if (res.confirm) {
                    wx.request({
                        url: "https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_new&param=pass",
                        method: 'post',
                        header: {"content-type": "application/x-www-form-urlencoded"},
                        data: {
                            sessid: wx.getStorageSync('sessid'),
                            id: that.data.cid,
                            catid: that.data.content.catid,
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
                                        'disable':false
                                    })
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

});