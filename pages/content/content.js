// pages/content/content.js
let app = getApp();
Page({
  data: {
    content: {},
    cid: 0,
    workflow: [],
    lineLength: 0,
    reject_reason:[]
  },
  onLoad: function (options) {
    app.getWorkFlowData(options.id, this);
    app.getBohuiContent(options.id, this)
    let that = this;
    this.setData({
      content: app.getNewsById(options.id, 'caogaoxiang'),
      cid: options.id
    });
    console.log(this.data.content)
    
  },
  
  // 跳转至编辑页面
  editNews: function () {
    wx.navigateTo({
      url: '../edit/edit?id=' + this.data.cid + '&type=' + this.data.content.type
    })
  },
  // 删除
  delNews: function (e) {
    let that = this;
    let reqData;
    if (this.data.content.type == 'bohui') {
      reqData = {
        sessid: wx.getStorageSync('sessid'),
        bohui_id: that.data.cid
      }
    }else{
      reqData = {
        sessid: wx.getStorageSync('sessid'),
        type:'caogao',
        caogao_id: that.data.cid
      }
    }
    wx.showModal({
      title: '确认删除',
      content: '您确定要删除这篇稿件吗？',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading();
          wx.request({
            url: "https://rmtapi.hnsjb.cn/bs_api.php?op=index&param=bs_delete",
            method: 'post',
            header: { "content-type": "application/x-www-form-urlencoded" },
            data: reqData,
            success: function (res) {
              wx.hideLoading();
              if (res.data.status == 1) {
                wx.showModal({
                  title: '删除成功',
                  showCancel: false,
                  content: '',
                  complete: function (res) {
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                })
              } else if (res.data.status == '-2') {
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
            fail: function (res) {
              wx.hideLoading()
              wx.showModal({
                title: '网络状况差，请稍后再试',
                showCancel: false,
                content: '',
                complete: function (res) {

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
  // 提交
  pushContent: function (e) {
    let that = this;
    let content = this.data.content;
    if (content.title.replace(/\s+/g, "") == '') {
      wx.showModal({
        title: '标题不得为空',
        showCancel: false,
        content: ''
      })
      return
    }
    
    let tempArr;
    if (this.data.model == 'text') {
      tempArr = [{
        type: 'text',
        value: ''
      }];

      for (let i = 0; i < content.content.length; i++) {
        if (content.content[i].type == 'text') {
          content.content[i].value = content.content[i].value.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
          tempArr[0].value += content.content[i].value;
        }
      }
    } else {
      tempArr = [];
      // 删去type=add的项
      for (let i = 0; i < content.content.length; i++) {
        if (content.content[i].type != 'add' && content.content[i].value.trim()) {
          tempArr.push(content.content[i])
        }
      }
    }
    let is_special = 0;

    if (this.data.is_special) {
      is_special = 1;
    }
    // 检查上传文章是否为空
    if (!tempArr[0].value) {
      wx.showModal({
        showCancel: false,
        title: '错误信息',
        content: '内容不能为空，请检查是否文本编辑后是否点击确认按钮'
      })
      return
    }

    wx.showLoading({
      mask: true,
      title: '提交中...',
    });

    // 请求携带的参数
    // title 文章标题
    // content 文章内容
    // sessid 保持登录状态
    // type 判断暂存情况(新建 | 草稿 | 驳回)
    // caogao_id bohui_id
    let reqData;
    if (that.data.content.type == 'bohui') {
      reqData = {
        title: this.data.content.title.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, ""),
        content: JSON.stringify(tempArr),
        sessid: app.globalData.sessid,
        type: 'bohui',
        bohui_id: this.data.cid
      }
    } else if (that.data.content.type == 'shenhe') {
      reqData = {
        title: this.data.content.title.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, ""),
        content: JSON.stringify(tempArr),
        sessid: app.globalData.sessid,
        type: 'shenhe',
        shenhe_id: this.data.cid
      }
    } else {
      reqData = {
        title: this.data.content.title.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, ""),
        content: JSON.stringify(tempArr),
        sessid: app.globalData.sessid,
        type: 'caogao',
        caogao_id: this.data.cid
      }
    }

    wx.request({
      url: 'https://rmtapi.hnsjb.cn/bs_api.php?op=index&param=bs_tijiao',
      method: 'post',
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: reqData,
      success: function (res) {
        wx.hideLoading()
        if (res.data.status == '1') {
          wx.showModal({
            title: '提交成功',
            showCancel: false,
            content: '',
            complete: function (res) {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        } else if (res.data.status == '-1') {
          wx.showModal({
            title: res.data.info,
            showCancel: false,
            content: ''
          })
        } else if (res.data.status == '-2') {
          wx.showModal({
            title: '登录过期，请重新登录',
            showCancel: false,
            complete: function () {
              wx.redirectTo({
                url: '../login/login',
              })
            }
          })

        } else {
          wx.showModal({
            title: '网络错误',
            showCancel: false,
            content: ''
          })
        }
      },
      fail: function (res) {
        wx.hideLoading()
        wx.showModal({
          title: '网络状况差，请稍后再试',
          showCancel: false,
          content: ''
        });

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
      for (let i = 0; i < this.data.content.reject_reason.length; i++) {
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