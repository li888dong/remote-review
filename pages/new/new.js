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
      copyfrom: '河南手机报'
    },
    disable: false,
    disabletip1: '插图',
    disabletip2: '暂存',
    disabletip3: '提交',
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
    let that = this;
    wx.request({
      url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_3&param=special_list',
      type: 'post',
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: {
        sessid: wx.getStorageSync('sessid')
      },
      success: function (res) {
        console.log(res);
        if (res.data.status == 1) {
          that.setData({
            specials: res.data.data
          })
        }
      }
    })

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
              tempArr.splice(cidx, 0, imagedata); // key 可以是任何字符串
              that.setContent(tempArr);
              data['content.content[' + (cidx + 1) + '].show'] = false; // key 可以是任何字符串
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
  getContent: function (e) {

    if (this.data.content.title.replace(/\s+/g, "") == '') {
      wx.showModal({
        title: '标题不得为空',
        showCancel: false,
        content: '',
        complete: function (res) {
          return false;
        }
      })
    } else if (this.data.content.copyfrom.replace(/\s+/g, "") == '') {
      wx.showModal({
        title: '来源不得为空',
        showCancel: false,
        content: '',
        complete: function (res) {
          return false;
        }
      })
    } else if (this.data.is_special && this.data.selectedType == 0) {
      wx.showModal({
        title: '请专题栏目',
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


      for (let i = 0; i < tempArr.length; i++) {
        if (i < tempArr.length - 1 && tempArr[i].type == 'text' && tempArr[i + 1].type == 'text') {
          tempArr[i + 1].value = tempArr[i].value + '\n' + tempArr[i + 1].value;
          tempArr[i].value = '';
        }

      }

      for (let i = 0; i < tempArr.length; i++) {
        if (tempArr[i].value != '') {
          tempBarr.push(tempArr[i])
        }
      }

      for (let i = 0; i < tempBarr.length; i++) {
        if (tempBarr[i].type == 'text') {
          tempBarr[i].value = tempBarr[i].value.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "")
        } else {
          tempBarr[i].title = tempBarr[i].title.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "")
        }
      }
      this.setData({
        'disable': true
      });
      let disabletip = 'disabletip' + e.currentTarget.dataset.disableid;
      let tempData = {};
      tempData[disabletip] = this.data[disabletip] + '中...';
      this.setData(tempData);
      let that = this;
      this.setData({
        'disableid': e.currentTarget.dataset.disableid
      });

      let is_special = 0;

      if (this.data.is_special) {
        is_special = 1;
      }

      wx.request({
        url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_3&param=add',
        method: 'post',
        header: { "content-type": "application/x-www-form-urlencoded" },
        data: {
          title: this.data.content.title.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, ""),
          copyfrom: this.data.content.copyfrom.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, ""),
          content: JSON.stringify(tempBarr),
          way: 'zancun',
          sessid: wx.getStorageSync('sessid'),
          to_specialid: this.data.selectedSpecial,
          to_specialcat: this.data.selectedType,
          is_special: is_special
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
        fail: function (res) {
          wx.showModal({
            title: '网络状况差，请稍后再试',
            showCancel: false,
            content: '',
            complete: function (res) {
              that.setData({
                'disable': false
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

    if (this.data.content.title.replace(/\s+/g, "") == '') {
      wx.showModal({
        title: '标题不得为空',
        showCancel: false,
        content: '',
        complete: function (res) {
          return false;
        }
      })
    } else if (this.data.content.copyfrom.replace(/\s+/g, "") == '') {
      wx.showModal({
        title: '来源不得为空',
        showCancel: false,
        content: '',
        complete: function (res) {
          return false;
        }
      })
    } else if (this.data.is_special && this.data.selectedType == 0) {
      wx.showModal({
        title: '请专题栏目',
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


      for (let i = 0; i < tempArr.length; i++) {
        if (i < tempArr.length - 1 && tempArr[i].type == 'text' && tempArr[i + 1].type == 'text') {
          tempArr[i + 1].value = tempArr[i].value + '\n' + tempArr[i + 1].value;
          tempArr[i].value = '';
        }

      }

      for (let i = 0; i < tempArr.length; i++) {
        if (tempArr[i].value != '') {
          tempBarr.push(tempArr[i])
        }
      }

      for (let i = 0; i < tempBarr.length; i++) {
        if (tempBarr[i].type == 'text') {
          tempBarr[i].value = tempBarr[i].value.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "")
        } else {
          tempBarr[i].title = tempBarr[i].title.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "")
        }
      }
      this.setData({
        'disable': true
      });
      let disabletip = 'disabletip' + e.detail.target.dataset.disableid;
      let tempData = {};
      tempData[disabletip] = this.data[disabletip] + '中...';
      this.setData(tempData);
      let that = this;
      this.setData({
        'disableid': e.detail.target.dataset.disableid
      });
      let is_special = 0;

      if (this.data.is_special) {
        is_special = 1;
      }
      wx.request({
        url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx_3&param=add',
        method: 'post',
        header: { "content-type": "application/x-www-form-urlencoded" },
        data: {
          title: this.data.content.title.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, ""),
          copyfrom: this.data.content.copyfrom.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, ""),
          content: JSON.stringify(tempBarr),
          way: 'tijiao',
          sessid: wx.getStorageSync('sessid'),
          formId: e.detail.formId,
          to_specialid: this.data.selectedSpecial,
          to_specialcat: this.data.selectedType,
          is_special: is_special
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
        fail: function (res) {
          wx.showModal({
            title: '网络状况差，请稍后再试',
            showCancel: false,
            content: '',
            complete: function (res) {
              that.setData({
                'disable': false
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
  getArray: function (e) {
    this.setData({
      'disable': true
    });
    let disabletip = 'disabletip' + e.currentTarget.dataset.disableid;
    let tempData = {};
    tempData[disabletip] = this.data[disabletip] + '中...';
    this.setData(tempData);
    this.setData({
      'disableid': e.currentTarget.dataset.disableid
    });
    let dataArr = [];
    for (let i = 0; i < this.data.content.content.length; i++) {
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

      if (i + 1 < dataArr.length) {
        if (dataArr[i].type == "text" && dataArr[i + 1].type == "add") {
          let tempStr = dataArr[i].value;
          tempStr = tempStr.replace(/(\n)+/g, '\n');
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

        } else if (dataArr[i].type == "text") {
          let tempStr = dataArr[i].value;
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
          resultArr = resultArr.concat(tempRarr);
        } else if (dataArr[i].type == "image" || dataArr[i].type == "video") {
          let tempRarr = [];
          if (dataArr[i + 1].type == "add") {
            tempRarr = [dataArr[i]];
          } else {
            tempRarr = [dataArr[i], addObj];

          }

          resultArr = resultArr.concat(tempRarr)
        }
      } else {
        if (dataArr[i].type == "text") {
          let tempStr = dataArr[i].value;
          tempStr = tempStr.replace(/(\n)+/g, '\n');
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
      resultArr = [{ "type": "add", "show": false }].concat(resultArr);
    }
    if (resultArr[resultArr.length - 1].type != 'text') {
      resultArr = resultArr.concat([{ "type": "text", "value": "" }]);
    }
    this.setContent(resultArr);

    tempData = {};
    tempData[disabletip] = this.data[disabletip].replace('中...', '');
    this.setData(tempData);
    this.setData({
      'disable': false
    });

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
      selectedSpecial: that.data.specials[cid].sid
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