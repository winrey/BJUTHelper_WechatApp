// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try{

    const db = wx.cloud.database()
    let res = await db.collection('shared_score_results').where({
      _id: event.shareId
    }).get()
    if (res.data.length == 0){
      return {
        isSuccess: false,
        details: "没有找到该结果",
        result: null,
      }
    }

    let data = res.data[0];
    return {
      isSuccess: true,
      details: "数据库连接失败",
      result: data,
    }
  }
  catch(e){
    return {
      isSuccess: false,
      details: "数据库连接失败",
      result: null,
    }
  }
    
}