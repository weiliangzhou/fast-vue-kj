import Axios from "axios";
import envConfig from "_conf/config";
import { MyError } from "./log";
import { login } from "./wx";
import { tryGetToken } from "./localUser";
const transform = (data = {}) => {
  return Object.entries(data || {}).reduce((params, [key, value]) => {
    return ![undefined, ""].includes(value)
      ? (params.append(key, value), params)
      : params;
  }, new URLSearchParams());
};
const service = Axios.create({ baseURL: envConfig.baseURL, timeout: 10000 });
// 请求拦截器
service.interceptors.request.use(
  config => {
    let { method = "get", type = "formData" } = config;
    const token = tryGetToken();
    token &&
      token !== "undefined" &&
      !/^https?:\/\//.test(config.url) &&
      (config.headers["Authorization"] = "" + token);
    if (method == "post") {
      type !== "json" && (config.transformRequest = [transform]);
      let typesObj = {
        json: "application/json",
        formData: "application/x-www-form-urlencoded"
      };
      config.headers["Content-Type"] = typesObj[type] || typesObj["formData"];
    } else {
      config.params = transform(config.data || {});
      delete config.data;
    }
    return config;
  },
  error => Promise.reject(new MyError(error.message, 4, error.msg))
);
// 响应拦截器
service.interceptors.response.use(
  response => {
    const { code: errno, msg: errmsg, data } = response.data;
    if ([101, 403, -1].includes(errno)) {
      localStorage.clear();
      login();
      return new Promise(() => {});
    } else {
      return !errno ? data : Promise.reject(new MyError(errmsg, 4, errno));
    }
  },
  error => {
    const { status = "defaultError" } = error || error.response || {};
    let errs = {
      400: "请求错误",
      404: `请求地址出错`,
      408: "请求超时",
      500: "服务器内部错误",
      501: "服务未实现",
      502: "网关错误",
      503: "服务不可用",
      504: "网关超时",
      505: "HTTP版本不受支持",
      defaultError: "未知错误"
    };
    return Promise.reject(new MyError(errs[status] || errs["defaultError"], 0));
  }
);
export { service as axios };
