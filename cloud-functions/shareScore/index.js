// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  env: process.env.DATABASE_ENV_ID
})
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {

  // 这里获取到的 openId、 appId 和 unionId 是可信的，注意 unionId 仅在满足 unionId 获取条件时返回
  let { OPENID, APPID, UNIONID } = cloud.getWXContext()

  console.log(event.userDetailInfo)

  try{
    

    res = await db.collection('shared_score_results').add({
      data: {

        openId: OPENID,
        appId: APPID,
        unionId: UNIONID,

        sid: event.result.sid,
        name: event.result.name,
        institute: event.result.institute,
        major: event.result.major,
        study_class: event.result.class,
        direction: event.result.direction,

        userDetailInfo: event.userDetailInfo,
        sharedInfo: event.sharedInfo,
        result: event.result,

        version: 1,
        createdTime: new Date(),

      }
    })

    console.log("[Add Shared Data]")
    console.log(res)

    return {
      isSuccess: true,
      _id: res._id
    }

  } catch(e){

    console.log("[Add Shared Data][error]")
    console.error(e)

    return {
      isSuccess: false,
      _id: null
    }

  }
}