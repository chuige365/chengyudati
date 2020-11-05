// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  switch (event.action) {

    default: {
      return paihang(event)
    }
  }
  
}
async function paihang(event) {
  const db = cloud.database()
  const _ = db.command
  const $ = _.aggregate
  db.collection('user').aggregate()
    .lookup({
      from: 'userdengji',
      let: {
         dengji: '$level'
      },
      pipeline: $.pipeline()
        .match(_.expr($.and([
          $.lte(['$max', '$$dengji']),
          $.gte(['$min', '$$dengji'])
        ]))),
      as: 'grade',
    }).end().then(res => {
      return res
    }).catch(err => console.error(err))
}