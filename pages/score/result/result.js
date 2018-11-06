// pages/score/result/result.js

// const DEFAULT_NICKNAME = "点击制作名片"
// const DEFAULT_COMMENT = "我是一段说明";

var app = getApp()

Page({
  data:{
    sid: null,
    currentYear: null,
    currentTerm: null,
    result: null,
    pwd: null,
    userInfo: null,
    showCourseDialog: false,
    showScoreDialog: false,
    showGpaDialog: false,
    isShared: false,// 是否是他人分享的成绩
    canModifyComment: true,
    comment: "",
    showedScore: null,
    shareScoreId: null,
  },
  showNoScoreToast: function(){
    wx.showToast({
      title: '哎～还没有出分？！请再等等吧～',
      icon: 'none',
      duration: 2000
    })
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    // console.log("options");
    let that = this;

    console.log(options);
    if (options.result){
      let result_obj = JSON.parse(options.result);
      this.setData({
        result: result_obj,
      });
      if (!result_obj || !result_obj.number_of_lesson){
        this.showNoScoreToast();
      }
      wx.nextTick(() => {
        this.updateShowScore();
      })
    }
    if (options.info) {
      let info = JSON.parse(options.info);
      this.setData({
        sid: info.sid,
        currentYear: info.currentYear,
        currentTerm: info.currentTerm,
        pwd: info.pwd,
      })
    }
    if(options.shareId){
      // 查看他人分享成绩
      let sharedId = options.shareId
      wx.nextTick(() => {
        const db = wx.cloud.database({
          env: app.globalData.envId
        })
        db.collection('shared_score_results').where({
          _id: sharedId // 填入当前用户 openid
        }).get().then(res => {
          console.log("receive database")
          console.log(res)
          if(res.data.length == 0){
            wx.showToast({
              title: '未找到该次分享成绩',
              icon: 'none',
              duration: 2000
            })
            return
          }
          let data = res.data[0];
          that.setData({
            result: data.result,
            canModifyComment: false,
            isShared: true,
            userInfo: data.userDetailInfo,
            comment: data.sharedInfo.comment,
          })
          wx.nextTick(() => {
            that.updateShowScore()
          })
        }).catch(err => {
          console.log("err")
          console.log(err)

          wx.showToast({
            title: '获取失败，请重试',
            icon: 'none',
            duration: 2000
          })
        })
      })
      
    }
    else{
      app.getUserInfo(function (userInfo) {
        console.log("get logined user info")
        console.log(userInfo)
        that.setData({
          userInfo: userInfo
        })
      })
    }
    wx.showShareMenu({
      withShareTicket: true
    });
    // wx.hideShareMenu();
    
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
  onGenUserCard: function (res) {
    console.log(res);

    this.setData({
      userInfo: res.detail.userInfo
    })

    // var appId = 'wx4f4bc4dec97d474b'
    // var sessionKey = res.detailed
    // var encryptedData =
    //   'CiyLU1Aw2KjvrjMdj8YKliAjtP4gsMZM' +
    //   'QmRzooG2xrDcvSnxIMXFufNstNGTyaGS' +
    //   '9uT5geRa0W4oTOb1WT7fJlAC+oNPdbB+' +
    //   '3hVbJSRgv+4lGOETKUQz6OYStslQ142d' +
    //   'NCuabNPGBzlooOmB231qMM85d2/fV6Ch' +
    //   'evvXvQP8Hkue1poOFtnEtpyxVLW1zAo6' +
    //   '/1Xx1COxFvrc2d7UL/lmHInNlxuacJXw' +
    //   'u0fjpXfz/YqYzBIBzD6WUfTIF9GRHpOn' +
    //   '/Hz7saL8xz+W//FRAUid1OksQaQx4CMs' +
    //   '8LOddcQhULW4ucetDf96JcR3g0gfRK4P' +
    //   'C7E/r7Z6xNrXd2UIeorGj5Ef7b1pJAYB' +
    //   '6Y5anaHqZ9J6nKEBvB4DnNLIVWSgARns' +
    //   '/8wR2SiRS7MNACwTyrGvt9ts8p12PKFd' +
    //   'lqYTopNHR1Vf7XjfhQlVsAJdNiKdYmYV' +
    //   'oKlaRv85IfVunYzO0IKXsyl7JCUjCpoG' +
    //   '20f0a04COwfneQAGGwd5oa+T8yO5hzuy' +
    //   'Db/XcxxmK01EpqOyuxINew=='
    // var iv = 'r7BXXKkLb8qrSNn05n0qiA=='

    // var pc = new WXBizDataCrypt(appId, sessionKey)

    // var data = pc.decryptData(encryptedData, iv)

    // console.log('解密后 data: ', data)
  },

  onCommentChange: function(e){
    this.setData({
      comment: e.detail.value
    });
  },

  onShareAppMessage: function (res) {
    if (this.data.userInfo && this.data.shareScoreId){
      return {
        title: this.data.comment || '我的成绩单',
        path: '/pages/score/result/result?shareId=' + this.data.shareScoreId
      }
    }
    return {
      title: '野生工大助手 - 外网查分小程序',
      path: '/pages/score/login/login'
    }
  },

  onCanNotShare: function (){

    if(!this.data.userInfo){
      wx.showToast({
        title: '请先在上方生成卡片',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    let that = this;

    if(!this.data.shareScoreId){
      
      wx.showModal({
        title: '提示',
        content: '如要使用分享功能，需要将本次查询结果上传到微信小程序服务器（但该操作依然不会在服务端保留密码）。上传后再次点击或者转发给朋友即可分享，并且卡片展示语将不可更改。您确定吗？',
        confirmText: "上传",
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            console.log(that.data.userInfo)
            wx.cloud.callFunction({
              // 要调用的云函数名称
              name: 'shareScore',
              // 传递给云函数的event参数
              data: {
                result: that.data.result,
                userDetailInfo: that.data.userInfo,
                sharedInfo: {
                  comment: that.data.comment,
                  sid: that.data.sid,
                  currentYear: that.data.currentYear,
                  currentTerm: that.data.currentTerm,
                },
              }
            }).then(res => {
              console.log(res)
              console.log(!res.result.isSuccess)
              if (!res.result.isSuccess) {
                wx.showToast({
                  title: '上传失败',
                  icon: "none",
                  duration: 2000
                })
                return
              }
              wx.showToast({
                title: '上传成功，请再次点击即可分享发送给朋友',
                icon: "none",
                duration: 2000
              })
              that.setData({
                shareScoreId: res.result._id, 
                canModifyComment: false,
              })
            }).catch(err => {
              console.log("err")
              console.log(err)
              wx.showToast({
                title: '上传失败',
                icon: "none",
                duration: 2000
              })
            })

          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

      return
    }

  },

  backToLogin(){
    // 关闭所有页面并转到
    wx.reLaunch({
      url: '../login/login'
    });
  },
  updateShowScore(){
    let score = null;
    if (!this.data.result){
      // do noting
    }
    else if (parseFloat(this.data.result.average_score_all) > parseFloat(this.data.result.average_score_term)){
      score = parseFloat(this.data.result.average_score_all)
    }
    else{
      score = parseFloat(this.data.result.average_score_term)
    }
    if(score){
      score = score.toFixed(0);
    }
    this.setData({
      showedScore: score
    })
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