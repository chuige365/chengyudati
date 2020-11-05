// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = async (event, context) => {
  //console.log(event)
  //console.log(context)
  // 可执行其他自定义逻辑
  // console.log 的内容可以在云开发云函数调用日志查看
  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）等信息
  const wxContext = cloud.getWXContext()
  switch (event.action) {
    case 'registuser': {
      return registuser(event)
    }
    default: {
      return {
        event,
        openid: wxContext.OPENID,
       // appid: wxContext.APPID,
        //unionid: wxContext.UNIONID,
        //env: wxContext.ENV,
      }
    }
  }

}
async function registuser(event){
  const wxContext = cloud.getWXContext()
  try {
    let user = await db.collection('user')
      .add({
        data: {
          _openid:wxContext.OPENID,
          invite_num: 0,
          nickname: event.e.nickName,
          headimgurl: event.e.avatarUrl,
          uuid: event.e.uuid,
          gender: event.e.gender,
          country: event.e.country,
          city: event.e.city,
          gold_num: event.e.gold_num,
          level: 0,
          balance: 0.00,
          all_get_balance: 0.00,
          realname: "",
          mobile: "",
          wxid: "",
          status: 1
        }
      });
    return user;
  } catch (err) {
    return err;
  }
}
