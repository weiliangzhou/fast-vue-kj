let localUserInfo = null;
/* eslint-disable camelcase */
let set_userInfo_or_relogin = ({
  userAccessToken = {},
  userInfo = {},
  userRoles = [],
  ...reset
} = {}) => {
  let tempUser = localUserInfo || JSON.parse(localStorage.userInfo || "{}");
  if (userRoles.length) {
    tempUser.userRoles = userRoles;
  }
  localStorage.userInfo = JSON.stringify(
    Object.assign({}, tempUser, { ...userAccessToken, ...userInfo, ...reset })
  );
  try {
    get_local_userInfo_or_throw();
  } catch (e) {}
};
let get_local_userInfo_or_throw = () => {
  let tempUserInfo = JSON.parse(localStorage.userInfo || "{}");
  if (tempUserInfo.id) {
    localUserInfo = tempUserInfo;
    return localUserInfo;
  } else {
    throw new Error("请重新登录");
  }
};

let get_userInfo_or_relogin = () => {
  try {
    return localUserInfo || (localUserInfo = get_local_userInfo_or_throw());
  } catch (e) {
    localStorage.clear();
    location.href = `${location.origin}/login`;
  }
};

export const checkIsLogined = () => {
  let tempUserInfo = JSON.parse(localStorage.userInfo || "{}");
  if (tempUserInfo.id) {
    localUserInfo = tempUserInfo;
  }
  return !!(localUserInfo || tempUserInfo.id);
};

export const tryGetToken = () => {
  let { token } = localUserInfo || JSON.parse(localStorage.userInfo || "{}");
  return token;
};

export {
  get_userInfo_or_relogin as getUserInfo,
  set_userInfo_or_relogin as setUserInfo
};
