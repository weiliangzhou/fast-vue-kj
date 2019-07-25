const env = process.env.NODE_ENV
console.log(env)
export default {
  env: env,
  baseURL: env === 'development' ? '/dev' : '',
  /**
   * 图片上传接口根据不同命令控制不同地址
   */
  uploadImg: env === 'development' ? '/teacher/image/upload' : '/teacher/image/upload',
  fetchUrl: env === 'development' ? '' : '',
  appId: env === 'development'? 'wx2531d3b9ec1a6f93' : 'wx2531d3b9ec1a6f93',
  merchantId: env === 'development'? '1365616402' : '1365616402',
  DHuploadFile: (env === 'development' || env === 'developmentTest') ? 'https://xcx.wegoo.cn/wx/file/upload' : 'https://xcx.wegoo.cn/wx/file/upload' // @杜衡 https://xcx.wegoo.cn/devtest/wx/file/upload
}
