// import * as g from './utils/g'
// import * as tools from './utils/tools'
// import * as dom from './utils/dom'
// import * as utils from './utils/utils'
// import * as wejax from './utils/wejax'
/**
 *
 */
import axios from "axios";
import config from "@/conf/config";
import { tryCompressImg } from "./utils/compress_img"
import { rejectTimeout } from "./utils/utils"
import { MyError } from "./utils/log"
export * from './utils/wx';
export * from './utils/tools';
export * from './utils/utils';
export * from './utils/wejax';
export * from './utils/wg-vaildate';
export * from './utils/log';
export * from './utils/getImg'
export * from './utils/localUser'

export const uploadFile = (file) => {
    let param = new FormData(); // 创建form对象
    return tryCompressImg(file).then(compressedImg => {
      param.append("file", compressedImg); // 对应后台接收图片名
    }).then(res => {
    return Promise.race([axios
      .post(config.baseURL + "/api/file/upload", param)
      .then(res => {
        if (!res.data.errno) {
          if (res.data.data) {
            return res.data.data;
          } else {
            throw new MyError("获取图片资源失败", 3)
          }
        } else {
            throw new MyError(res.data.errmsg ||"上传图片出错", 3)
        }
      }), rejectTimeout(15, new MyError("上传图片超时，请重试", 3))])
    }).catch(err => {
        var tempError = err;
        var errmsg = ""
        if (tempError&&tempError.stack) {
            errmsg = tempError.stack
        } else {
            errmsg = err
        }
        let errFormData = new FormData(); // 创建form对象
        errFormData.append("error", errmsg); // 对应后台接收图片名
        axios
        .post(" http://47.98.55.127:5000/pushError", errFormData)
        .catch(res => {})
        if (err instanceof Error && "errno" in err) {
            tempError = err
        } else if (typeof err == "string") {
            tempError = new MyError(err || "上传图片时出错", 3)
        } else {
            tempError = new MyError("上传图片未知错误", 3)
        }
        throw tempError;
    })
}

  export {
      tryCompressImg
  }
