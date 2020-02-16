// 云函数入口文件
const cloud = require('wx-server-sdk')
// const rp = require('request-promise');
// const URL = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx4948d2fa3967c1b7&secret=a16051b9f6370156759c40597ffaf262"

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {

  // let accessToken = await rp(URL).then((res) => {
  //   return JSON.parse(res).access_token
  // })

  const wxContext = cloud.getWXContext()
  const result = await cloud.openapi.wxacode.getUnlimited({
    scene: wxContext.OPENID,
  })

  const upload = await cloud.uploadFile({
    cloudPath: 'qrcode/' + Date.now() + '-' + Math.random() + '.png',
    fileContent: result.buffer
  })
  return upload.fileID
}