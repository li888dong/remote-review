// pages/newtest/newtest.js
let util = require('../../utils/util.js');
let app = getApp();
Page({
  data: {
    // 纯文本模式和图文模式
    model: 'withImg',
    // 文章内容
    content: {
      title: '',
      content: [{
        "type": "add",
        "value": ""
      }],
      copyfrom: '河南手机报'
    },
    // 判断暂存情况(新建|草稿|驳回)
    type: '',
    // 文章列表所属id，用以在storage里取值
    cid: '',

    disable: false,
    is_special: false,
    specials: [],
    types: [],
    selectedType: 0,
    selectedSpecial: 0,
    specialIndex: -1,
    typeIndex: -1
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // new app.WeToast();
    // this.fetchSpecialList()
    // 如果是编辑页，初始化页面数据
    this.initEditData(options)
  },
  // 初始化新建稿件页  判断暂存状态和取值
  initEditData(options) {
    this.setData({
      type: options.type,
      cid: options.id
    })
    if (this.data.type == 'caogao') {
      this.setData({
        content: app.getNewsById(this.data.cid, 'caogaoxiang')
      })
    }

  },
  // 图片上传，成功后将图片地址存入content
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
        wx.showLoading({
          'title': '图片上传中'
        });
        wx.uploadFile({
          url: 'https://rmtapi.hnsjb.cn/bs_api.php?op=bs_photo',
          filePath: tempFilePaths[0],
          name: 'files',
          formData: {
            'user': 'test'
          },
          success: function (res) {
            wx.hideLoading();
            let data = JSON.parse(res.data);
            console.log('图片上传', data)
            if (data.status == 1) {
              let imagedata = {
                "type": "image",
                "value": data.data.url,
                "title": ""
              };
              tempArr.splice(cidx, 0, imagedata);
              that.setContent(tempArr);
              data['content.content[' + (cidx + 1) + '].show'] = false;
              that.setData(data);
            } else {
              wx.showModal({
                title: data.info,
                showCancel: false,
                content: '',
                complete: function () {
                  return false
                }
              });
            }
          },
          fail: function (res) {
            wx.hideLoading();
            wx.showModal({
              title: '网络状况差，请稍后再试',
              showCancel: false,
              content: '',
              complete: function (res) {
                return false
              }
            });

          }
        });
      }
    })
  },
  // 视频上传，成功后将视频地址存入content
  uploadVd: function (e) {
    let cidx = e.target.dataset.cidx;
    let that = this;
    let tempArr = this.data.content.content;
    wx.chooseVideo({
      sourceType: ['album', 'camera'], // album 从相册选视频，camera 使用相机拍摄
      maxDuration: 60, // 拍摄视频最长拍摄时间，单位秒。最长支持60秒
      camera: ['back'],
      success: function (res) {
        let tempFilePath = res.tempFilePath;
        wx.showLoading({
          'title': '视频上传中'
        });
        wx.uploadFile({
          url: 'https://rmtapi.hnsjb.cn/bs_api.php?op=bs_video',
          filePath: tempFilePath,
          name: 'files',
          formData: {
            'user': 'test'
          },
          success: function (res) {
            wx.hideLoading();
            console.log('视频上传', res);
            let data = JSON.parse(res.data);
            if (data.status == 1) {
              let videodata = {
                "type": "video",
                "value": data.data.filepath,
                "title": ""
              };
              tempArr.splice(cidx, 0, videodata);
              that.setContent(tempArr);
              data['content.content[' + (cidx + 1) + '].show'] = false;
              that.setData(data);
            } else {
              wx.showModal({
                title: data.info,
                showCancel: false,
                content: '',
                complete: function () {
                  return false
                }
              });
            }
          },
          fail: function (res) {
            wx.hideLoading();
            wx.showModal({
              title: '网络状况差，请稍后再试',
              showCancel: false,
              content: '',
              complete: function () {
                return false
              }
            });
          }
        });
      }
    })
  },
  // 文章暂存和提交
  getContent: function (e) {
    let that = this,
      url,
      loadingTitle;
    if (e.target.dataset.disableid == 2) {
      // 暂存地址
      url = 'bs_zancun';
      loadingTitle = '暂存';
    } else if (e.target.dataset.disableid == 3) {
      // 提交地址
      url = 'bs_tijiao';
      loadingTitle = '提交'
    }
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
      // 删去type=add的项 和值为空的项
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
      title: loadingTitle + '中...',
    });

    // 请求携带的参数
    // title 文章标题
    // content 文章内容
    // sessid 保持登录状态
    // type 判断暂存情况(新建 | 草稿 | 驳回)
    // caogao_id bohui_id
    let reqData = {
      title: this.data.content.title.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, ""),
      content: JSON.stringify(tempArr),
      sessid: app.globalData.sessid,
      type: this.data.type
    }

    if (this.data.type == 'caogao') {
      reqData.caogao_id = this.data.cid;
    } else if (this.data.type == 'bohui') {
      reqData.bohui_id = this.data.cid
    }

    wx.request({
      url: 'https://rmtapi.hnsjb.cn/bs_api.php?op=index&param=' + url,
      method: 'post',
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: reqData,
      success: function (res) {
        wx.hideLoading()
        if (res.data.status == '1') {
          wx.showModal({
            title: loadingTitle + '成功',
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
  // 确认文本框
  confirmText(e) {
    console.log(e)
    if (this.data.model == 'text') {
      let tempArr = this.data.content.content;
      let cidx = e.target.dataset.cidx;
      let textdata = {
        "type": "text",
        "value": e.detail.value
      };
      tempArr.splice(cidx, 0, textdata);
      this.setContent(tempArr);
    } else {
      let tempArr = this.data.content.content;
      let cidx = e.target.dataset.cidx;
      let textdata = {
        "type": "text",
        "value": e.detail.value
      };
      tempArr.splice(cidx + 1, 0, textdata);
      this.setContent(tempArr);
    }
  },

  setText: function (e) {
    let cidx = e.target.dataset.cidx;
    let data = {};
    data['content.content[' + cidx + '].text'] = e.detail.value;
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
          for (let i = 0; i < tempArr.length; i++) {
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
  switchModel(e) {
    this.setData({
      model: !e.detail.value ? 'text' : 'withImg'
    });
    console.log(this.data.model)
  },
  sepText: function (idx) {
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

    for (let i = 0; i < tempArr.length; i++) {
      if (tempArr[i].type === 'text' && tempArr[i].value.length > 140) {
        tempCArr.push({
          'id': i,
          'strA': tempArr[i].value.substr(0, 140),
          'strB': tempArr[i].value.substr(140, tempArr[i].value.length)
        })
      }
    }
    this.setData({
      'content.content': tempArr
    });
    for (let j = 0; j < tempCArr.length; j++) {
      let data = {};
      data['content.content[' + tempCArr[j].id + '].value'] = tempCArr[j].strA + tempCArr[j].strB; // key 可以是任何字符串
      this.setData(data);
    }
  },
  setSpecial(e) {
    // console.log(e.detail.value);
    this.setData({
      is_special: e.detail.value
    })
  },
  getSpecialTypes(e) {
    let cid = e.detail.value;
    let that = this;

    this.setData({
      specialIndex: cid
    });
    this.setData({
      selectedSpecial: that.data.specials[cid].cid
    });
    this.setData({
      types: that.data.specials[cid].category
    });
    this.setData({
      selectedType: 0
    });
    this.setData({
      typeIndex: -1
    })
  },

  setSpecialType(e) {
    let tid = e.detail.value;
    this.setData({
      typeIndex: tid
    });
    let that = this;
    this.setData({
      selectedType: that.data.types[tid].scid
    })
  }
});