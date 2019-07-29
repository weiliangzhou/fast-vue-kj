import { axios, getObject, MyError, getUserInfo, setUserInfo } from "@/global";

// 缓存一个Promise  此处代码位置尽量不要动
const cachePromise = (
  PrmiseFun,
  initValue = () => null,
  setStore = () => null
) => {
  let inited = initValue();
  if (inited) {
    inited = Promise.resolve(inited);
  }
  let temp = inited;
  let result = inited;
  return (isReset = false) => {
    if (isReset) {
      temp = null;
      result = null;
    }
    let { token } = getUserInfo();
    if (!token) {
      return Promise.reject(new Error("no login"));
    } else if (result) {
      return result;
    } else if (temp) {
      return temp;
    } else {
      temp = PrmiseFun()
        .then(res => {
          result = Promise.resolve(res);
          temp = null;
          setStore(res);
          return res;
        })
        .catch(err => {
          temp = null;
          throw err;
        });
      return temp;
    }
  };
};

// 用户登录
export const login = ({ code, referUid }) => {
  debugger;
  return axios.request({
    url: "/api/pub/login",
    method: "get",
    data: {
      code,
      referUid,
      registerFrom: 1
    }
  });
};

//
export const energyConsume = hours => {
  return axios.request({
    url: "/api/user/energy/consume",
    method: "get",
    data: {
      hours
    }
  });
};

export const energyInfo = () => {
  return axios.request({
    url: "/api/user/energy/info",
    method: "get",
    data: {}
  });
};

export const homepageInfo = () => {
  return axios.request({
    url: "/api/user/homepage/info",
    method: "get",
    data: {}
  });
};

export const completeTask = taskId => {
  return axios.request({
    url: "/api/user/task/complete",
    method: "get",
    data: {
      taskId
    }
  });
};

export const getCurrentUserInfo = () => {
  return axios.request({
    url: "/api/user/user/user_account/info",
    method: "get",
    data: {}
  });
};

export const energyGetPage = ({ pageNum = 1, pageSize = 10 }) => {
  return axios
    .request({
      url: "/api/user/energy/getPage",
      method: "get",
      data: {
        pageSize,
        pageNum
      }
    })
    .then(({ ableEnergy: data, userEnergyIPage: { records = [] } = {} }) => {
      return {
        data,
        records
      };
    });
};

export const getExtractPage = ({ pageNum = 1, pageSize = 10 }) => {
  return axios
    .request({
      url: "/api/user/account/getExtractPage",
      method: "get",
      data: {
        pageSize,
        pageNum
      }
    })
    .then(
      ({ balance: data, total, userAccountIPage: { records = [] } = {} }) => {
        return {
          data,
          records,
          total
        };
      }
    );
};
export const acalculationPower = ({ pageNum = 1, pageSize = 10 }) => {
  return axios
    .request({
      url: "/api/user/calculationPower/getPage",
      method: "get",
      data: {
        pageSize,
        pageNum
      }
    })
    .then(
      ({
        ablePower: data,
        userCalculationPowerIPage: { records = [] } = {}
      }) => {
        return {
          data,
          records
        };
      }
    );
};

// 获取微信jsApiList
export const getWXConfig = url => {
  return axios.request({
    url: "/api/pub/getGzhJsApiToken",
    method: "get",
    data: {
      url
    }
  });
};

/**
 * @description 检查是否已经激活接口
 */
// const checkIsActive = cachePromise(() => {
//   let url = "/api/user/checkIsActive";
//   return axios.request({
//     url,
//     method: "get",
//     data: {}
//   });
//   // .then(res => {
//   //     res.isActive = false;
//   //     return res;
//   // });
// });
// , () => {
//     let temp = sessionStorage.getItem("checkIsActive")
//     return temp ? JSON.parse(temp) : null;
// }, item => {
//     sessionStorage.setItem("checkIsActive", JSON.stringify(item))
// });

/**
 * @description 获取我的预估（收益）列表
 */
const findOrderAllotList = ({ pageSize = 10, pageNum = 1, statsDate }) => {
  let url = "/api/orderAllot/findOrderAllotList";
  return axios
    .request({
      url,
      method: "get",
      data: {
        pageSize: pageSize || undefined,
        pageNum: pageNum || undefined,
        statsDate: statsDate || undefined
      }
    })
    .then(({ items = [] } = {}) => {
      return items.map(item =>
        getObject(item, [
          "userName",
          "productName",
          "levelName",
          "createdAt",
          ["moneyDesc", "count"],
          "stateDesc",
          "state",
          "orderSn",
          "money",
          "id"
        ])
      );
    });
};

// 刷新token
// const refreshToken = cachePromise(() => {
//   let { refreshToken = "", expiresAt = "" } = getUserInfo();
//   if (refreshToken) {
//     if (
//       expiresAt &&
//       new Date(expiresAt.replace(/-/g, "/")).getTime() - Date.now() > 0
//     ) {
//       return Promise.resolve("无需更新");
//     }
//     return axios
//       .request({
//         url: "/api/auth/refresh_token",
//         method: "get",
//         data: { refreshToken }
//       })
//       .then(newUserInfo => {
//         setUserInfo(newUserInfo);
//       });
//   } else {
//     return Promise.reject(new MyError("请先登录", 3));
//   }
// });
