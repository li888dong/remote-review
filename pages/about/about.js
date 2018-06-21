// pages/about/about.js
Page({
  data:{
      content:{
          title:'河南手机报远程发稿系统小程序版使用指南',
          content:[
              {
                  type:'text',
                  value:"提示：教程为手机录屏及解说，流量不充足请在wifi下观看，全部视频总计大小约为500MB"
              },
              {
                  type:'text',
                  value:"1.首次进入小程序"
              },
              {
                  type:'video',
                  value:"https://www.hnsjb.cn/video/weapp-guide/bs_enter.mp4"
              },
              
              {
                  type:'text',
                  value:"2.新建稿件"
              },
              {
                  type:'video',
                  value:"https://www.hnsjb.cn/video/weapp-guide/bs_new.mp4"
              },
              {
                  type:'text',
                  value:"3.创建无图文章"
              },
              {
                  type:'video',
                  value:"https://www.hnsjb.cn/video/weapp-guide/bs_new_no.mp4"
              },
              {
                  type:'text',
                  value:"4.创建单图文章"
              },
              {
                  type:'video',
                  value:"https://www.hnsjb.cn/video/weapp-guide/bs_new_single.mp4"
              },
              {
                  type:'text',
                  value:"5.创建多图文章"
              },
              {
                  type:'video',
                  value:"https://www.hnsjb.cn/video/weapp-guide/bs_new_mulite.mp4"
              },
              {
                type: 'text',
                value: "6.删除图片或视频"
              },
              {
                type: 'video',
                value: "https://www.hnsjb.cn/video/weapp-guide/delete-img.mp4"
              },
              {
                type: 'text',
                value: "7.删除文章"
              },
              {
                type: 'video',
                value: "https://www.hnsjb.cn/video/weapp-guide/delete-post.mp4"
              },
              {
                  type:'text',
                  value:"8.文章通过驳回转审"
              },
              {
                  type:'video',
                  value:"https://www.hnsjb.cn/video/weapp-guide/bs_new_reject.mp4"
              },
              {
                  type:'text',
                  value:"9.搜索"
              },
              {
                  type:'video',
                  value:"https://www.hnsjb.cn/video/weapp-guide/bs_new_search.mp4"
              },
              {
                  type:'text',
                  value:"10.修改密码"
              },
              {
                  type:'video',
                  value:"https://www.hnsjb.cn/video/weapp-guide/resetpassword.mp4"
              }
          ],
          inputtime:'2017-12-11',
          username:'产品支撑部',
          copyright:'version 1.0.2'
      }
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
});