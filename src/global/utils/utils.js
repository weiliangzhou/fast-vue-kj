import { Toast as toast } from "mint-ui";
export const throwIfMissParamter = () => {
  throw new Error("missingParamter");
};

export const copyTextToClipboard = text => {
  var textArea = document.createElement("textarea");
  textArea.style.position = "fixed";
  textArea.style.top = 0;
  textArea.style.left = 0;

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = "2em";
  textArea.style.height = "2em";

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = 0;

  // Clean up any borders.
  textArea.style.border = "none";
  textArea.style.outline = "none";
  textArea.style.boxShadow = "none";

  // Avoid flash of white box if rendered for any reason.
  textArea.style.background = "transparent";
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    var successful = document.execCommand("copy", true, "复制成功");
    var msg = successful ? "successful" : "unsuccessful";
    console.log(successful, "Fallback: Copying text command was " + msg);
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
  }

  document.body.removeChild(textArea);
};
let currentToast = null
export const Toast = (
  msg = "",
  {
    position = "middle",
    doration = 200,
    className = undefined,
    iconClass = undefined
  } = {}
) => {
    if(currentToast) {
        currentToast.close();
        currentToast = null
    }
  if (typeof msg === "string") {
      currentToast = toast({
      message: msg,
      position,
      doration,
      className,
      iconClass
    });
  } else if ([0, 1, 2, 3, 4, 5].includes(msg.level)) {
      currentToast = toast({
      message: msg.message,
      position,
      doration,
      className,
      iconClass
    });
  }
  return currentToast
};

export const ToastPromise = (
  msg = "",
  {
    position = "middle",
    doration = 200,
    className = undefined,
    iconClass = undefined
  } = {}
) => {
  if (typeof msg === "string") {
    toast({
      message: msg,
      position,
      doration,
      className,
      iconClass
    });
    return resolveTimeout(doration / 1000);
  } else if ([0, 1, 2, 3, 4, 5].includes(msg.level)) {
    toast({
      message: msg.message,
      position,
      doration,
      className,
      iconClass
    });
    return resolveTimeout(doration / 1000);
  } else {
    return new Promise(() => {});
  }
};

export const getObject = (
  obj = {},
  path = [],
  filterUndefined = [undefined, ""]
) => {
  let tempObj = path.reduce((provalue, item) => {
    let key = "";
    let value = "";
    if (typeof item == "string") {
      key = item;
      value = obj[item];
    } else if (item.length == 1 && item[0]) {
      key = item[0];
      value = obj[item[0]];
    } else if (item.length == 2 && item[0] && item[1]) {
      key = item[1];
      value = obj[item[0]];
    }
    if (key && !filterUndefined.includes(value)) {
      provalue[key] = value;
    }
    return provalue;
  }, {});
  return tempObj;
};

export const convertToUndefined = (
  obj = {},
  filterUndefined = [undefined, ""]
) => {
  let tempObj = {};
  for (const [key, value] in Object.entries(obj)) {
    if (filterUndefined.includes(value)) {
      tempObj[key] = undefined;
    }
  }
  return tempObj;
};
export const resolveTimeout = (time, data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(data), time * 1000);
  });
};
export const rejectTimeout = (time, data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(data), time * 1000);
  });
};

// 缓存一个Promise
export const cachePromise = PrmiseFun => {
  let temp = null;
  let result = null;
  return (isReset = false) => {
    if (isReset) {
      temp = null;
      result = null;
    }
    let { token } = get_userInfo_or_relogin();
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

export const historyRoute = (to, from) => {
  // 记录了之后， 对于各种情况导致的重定向登录页的时候，等登录完成后可以回过去,当对于路由被拦截对此重定向之后回失效，所以不做此用； 或者说 可以做用户的页面活动（浏览记录之类的)
  const maxRoute = 5; // 最多记录多少个路由
  const tempData = {
    // 将本次所有路由对象保存起来包括from, to
    to: { name: to.name, params: to.params, query: to.query }
  };
  let localRouter = JSON.parse(localStorage.routers || "[]"); // 一开始的时候默认为空
  if (localRouter.length) {
    // 如果有记录了 做下处理
    if (localRouter[localRouter.length - 1].to.name === to.name) {
      // 上次保存的跟这一次保存的是同一个路由（处理用户的刷新问题)
      localRouter.pop(); // 对于这种情况 我选择用后面的覆盖之前的上次的路由 所以先将上次路由弹出去
    } else if (localRouter.length > maxRoute) {
      // 如果超过最大路由数, 先将最前面的弹出去
      localRouter.shift();
    }
  }
  if (!["agreement-detail"].includes(to.name)) {
    // 该页面是登录页的  协议页面 单独将该页面排除， 对于不想处理的页面可以来此添加
    localRouter.push(tempData);
  }
  localStorage.routers = JSON.stringify(localRouter); // 序列化回localStorage
};

// import route from "./router"
export const setRedirectRouter = () => {
  let { name, query, params } = route.currentRoute;
  if (name) {
    // 如果有当前的路由就将当前路由取出来
    redirectRoute = JSON.stringify({ name, query, params });
  } else {
    // 没有就直接保存当前页面的路径
    redirectRoute = location.href.substr(location.origin.length);
  }
  /* 
    // 后面可以在登录成功之后恢复
    let redirectRoute = JSON.parse(localStorage.redirectRoute || "") 
    if (redirectRoute) {
        if (typeof redirectRoute == "object") {
            route.replace(redirectRoute)
        } else if (typeof redirectRoute === "string") {
            route.replace({path: redirectRoute})
        }
    }
    */
};
