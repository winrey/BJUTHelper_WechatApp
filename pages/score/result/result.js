// pages/score/result/result.js

Page({
  data:{
    result: null,
    showCourseDialog: false,
    showScoreDialog: false,
    showGpaDialog: false,
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    if (options.result){
      let result_obj = JSON.parse(options.result);
      this.setData({
        result: result_obj,
      });
    }
  },
  onReady:function(){
    // 页面渲染完成
    console.log(this.data.result)
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  backToLogin(){
    wx.redirectTo({
      url: '../login/login'
    });
  },
  toggleCourseDialog() {
    this.setData({
      showCourseDialog: !this.data.showCourseDialog
    });
  },
  toggleScoreDialog() {
    this.setData({
      showScoreDialog: !this.data.showScoreDialog
    });
  },
  toggleGpaDialog() {
    this.setData({
      showGpaDialog: !this.data.showGpaDialog
    });
  },
})