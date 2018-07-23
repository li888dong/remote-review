// pages/content/content.js
let app = getApp();
Page({
  data: {
    // 文章内容
    content: {},
    // 当前文章id
    cid: 0,
    // 工作流
    workflow: [],
    // 工作流的高度
    lineLength: 0,
    // 驳回理由
    reject_reason: []
  },
  onLoad: function(options) {

    let that = this;
    //从进入页面的参数里取出文章id  用此id从草稿箱列表里取出文章数据  
    this.setData({
      content: app.getNewsById(options.id, 'caogaoxiang'),
      cid: options.id
    });

    // 如果是驳回的稿件显示工作流 如果不是显示草稿工作流
    if (this.data.content.type == 'bohui') {
      app.getWorkFlowData(options.id, this);
      app.getBohuiContent(options.id, this)
    } else {
      this.getCaogaoWorkflow(options.id)
    }

  },

  // 获取草稿工作流
  getCaogaoWorkflow(id) {
    let that = this;
    wx.request({
      url: 'https://rmtapi.hnsjb.cn/bs_api.php?op=index&param=bs_draft_progress',
      method: 'post',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        sessid: wx.getStorageSync('sessid'),
        caogao_id: id
      },
      success: function(res) {
        if (res.data.status == 1) {
          console.log('草稿工作流', [res.data.data]);
          that.setData({
            workflow: [res.data.data]
          })
        } else if (res.data.status == '-2') {
          wx.clearStorageSync();
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
        } else {
          wx.showModal({
            title: res.data.info
          })
        }
      }
    })
  },
  // 跳转至编辑页面
  editNews: function() {
    wx.navigateTo({
      url: '../edit/edit?id=' + this.data.cid + '&type=' + this.data.content.type
    })
  },
  // 删除
  delNews: function(e) {
    let that = this;
    let reqData;
    if (this.data.content.type == 'bohui') {
      reqData = {
        sessid: wx.getStorageSync('sessid'),
        bohui_id: that.data.cid
      }
    } else {
      reqData = {
        sessid: wx.getStorageSync('sessid'),
        type: 'caogao',
        caogao_id: that.data.cid
      }
    }
    wx.showModal({
      title: '确认删除',
      content: '您确定要删除这篇稿件吗？',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading();
          wx.request({
            url: "https://rmtapi.hnsjb.cn/bs_api.php?op=index&param=bs_delete",
            method: 'post',
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            data: reqData,
            success: function(res) {
              wx.hideLoading();
              if (res.data.status == 1) {
                wx.showModal({
                  title: '删除成功',
                  showCancel: false,
                  content: '',
                  complete: function(res) {
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                })
              } else if (res.data.status == '-2') {
                wx.clearStorageSync();
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
            fail: function(res) {
              wx.hideLoading()
              wx.showModal({
                title: '网络状况差，请稍后再试',
                showCancel: false,
                content: '',
                complete: function(res) {

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
  pushContent: function(e) {
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
    let tempArr = [];
    // 删去type=add的项
    for (let i = 0; i < content.content.length; i++) {
      if (content.content[i].type != 'add' && content.content[i].value.trim()) {
        content.content[i].value = content.content[i].value.trim();
        tempArr.push(content.content[i])
      }
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
    // formid 在需要微信小程序主推信息时需要的id
    let reqData;
    if (that.data.content.type == 'bohui') {
      reqData = {
        title: this.data.content.title.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, ""),
        content: JSON.stringify(tempArr),
        sessid: app.globalData.sessid,
        type: 'bohui',
        bohui_id: this.data.cid,
        formId: e.detail.formId
      }
    } else if (that.data.content.type == 'shenhe') {
      reqData = {
        title: this.data.content.title.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, ""),
        content: JSON.stringify(tempArr),
        sessid: app.globalData.sessid,
        type: 'shenhe',
        shenhe_id: this.data.cid,
        formId: e.detail.formId
      }
    } else {
      reqData = {
        title: this.data.content.title.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, ""),
        content: JSON.stringify(tempArr),
        sessid: app.globalData.sessid,
        type: 'caogao',
        caogao_id: this.data.cid,
        formId: e.detail.formId
      }
    }

    wx.request({
      url: 'https://rmtapi.hnsjb.cn/bs_api.php?op=index&param=bs_tijiao',
      method: 'post',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: reqData,
      success: function(res) {
        wx.hideLoading()
        if (res.data.status == '1') {
          wx.showModal({
            title: '提交成功',
            showCancel: false,
            content: '',
            complete: function(res) {
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
          wx.clearStorageSync();
          wx.showModal({
            title: '登录过期，请重新登录',
            showCancel: false,
            complete: function() {
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
      fail: function(res) {
        wx.hideLoading()
        wx.showModal({
          title: '网络状况差，请稍后再试',
          showCancel: false,
          content: ''
        });

      }
    });
  }
});