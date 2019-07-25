export const dataFormat = function (value, fmt = "yyyy-MM-dd") {
  try {
    if (typeof value === "string") {
      value = value.replace(/-/g, "/")
    }
    let getDate = new Date(value);
    if (!(getDate instanceof Date) || getDate == 'Invalid Date') {
      /* eslint-disable no-new */
      throw new Error("时间格式错误")
    }
    let o = {
      'M+': getDate.getMonth() + 1,
      'd+': getDate.getDate(),
      'h+': getDate.getHours(),
      'm+': getDate.getMinutes(),
      's+': getDate.getSeconds(),
      'q+': Math.floor((getDate.getMonth() + 3) / 3),
      'S': getDate.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (getDate.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt;
  } catch (e) {
    return value.split(" ")[0]
  }
};

export const LevelToName = function (value) {
  let temp = {
    "100": "VIP",
    "200": "教练",
    "300": "院长",
    "400": "校长",
    "500": "基地",
    "600": "小镇",
    "700": "分公司"
  }
  return temp["" + value] || value;
};
export const shadowPhoneOfMiddle = (tel) => {
  if (tel) {
    tel = "" + tel;
    tel = [...tel]
    tel.splice(3, 4, "****")
    return tel.join("")
  } else {
    return ""
  }
}

export const TimeFormat = (s) => {
  var hour = Math.floor(s / 3600);
  var minute = Math.floor(s / 60) - hour * 60;
  return [
    hour ? hour + "时" : "",
    minute ? minute + "分" : "",
  ].join('') || 0
}
export const Yuan = function (value, unit = 100, [left = "¥", right = ""] = []) {
  if (unit) {
    value = ((value || 0) / unit).toFixed(2)
  }
  let tempValue = Number(value.toString().split('.')[0])
  value = Number(value) == tempValue ? tempValue : value
  return left + value + right
};
