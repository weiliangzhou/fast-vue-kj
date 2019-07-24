// import router from '@/router';
// import { MessageBox } from 'mint-ui';
// import group from "./icon/qiepiancopyx5.png"
export const levelOptions = [
    { levelName: 'VIP', level: 100 },
    { levelName: '教练', level: 200 },
    { levelName: '院长', level: 300 },
    { levelName: '校长', level: 400 },
    { levelName: '基地', level: 500 },
    { levelName: '小镇', level: 600 },
    { levelName: '分公司', level: 700 }
];
// let group = require('./icon/qiepiancopyx5.png');
// let infographic = require('./icon/qiepiancopyx6.png');
// let several = require('./icon/qiepiancopyx2.png');
// let purse = require('./icon/qiepiancopyx7.png');
// let settings = require('./icon/qiepiancopyx.png');
// let onlineOrder = require('./icon/qiepiancopyx1.png');
// let authorization = require('./icon/qiepiancopyx4.png');
// let offlineOrder = require('./icon/qiepiancopyx3.png');
// let cart = require('./icon/qiepianx.png');
// export const menus = [
//     {
//         label: '分销管理',
//         icon: group,
//         key: 'group',
//         callBack: (callback = () => router.push({ name: 'agent' })) =>
//             callback()
//     },
//     {
//         label: '产品销售',
//         icon: onlineOrder,
//         key: 'onlineOrder',
//         callBack: (callback = () => router.push({ name: 'course' })) =>
//             callback()
//     },
//     {
//         label: '产品订单',
//         icon: cart,
//         key: 'cart',
//         callBack: (callback = () => router.push({ name: 'orderList' })) =>
//             callback()
//     },
//     {
//         label: '开卡收益',
//         icon: purse,
//         key: 'purse',
//         callBack: (callback = () => router.push({ name: 'card' })) =>
//             callback()
//     },
//     {
//         label: '产品收益',
//         icon: infographic,
//         key: 'infographic',
//         callBack: (
//             callback = () => router.push({ name: 'product-earnings' })
//         ) => callback()
//     },
//     {
//         label: '我要提现',
//         icon: several,
//         key: 'several',
//         callBack: (callback = () => router.push({ name: 'withdraw' })) =>
//             callback()
//     },
//     {
//         label: '素材库',
//         icon: authorization,
//         key: 'authorization',
//         callBack: (callback = () => router.push({ name: 'authorization' })) =>
//             callback()
//     },
//     {
//         label: '个人设置',
//         icon: settings,
//         key: 'settings',
//         callBack: (callback = () => router.push({ name: 'mine-info' })) =>
//             callback()
//     },
//     {
//         label: '排行榜',
//         icon: offlineOrder,
//         key: 'offlineOrder',
//         callBack: (
//             callback = () => router.push({ name: 'competitionRank' })) => callback() // MessageBox.alert('该功能暂未开放，敬请期待')
//     }
// ];

// MessageBox.alert('该功能暂未开放，敬请期待')
// .then(action => {

// }).catch(res => {

// })
export const areaCodes = [
  {
      key: '86',
      label: '中国大陆',
      pattern: /^1\d{10}$/
  },
  {
    key: "886",
    label: "中国台湾",
    pattern: /^9\d{8}$/
  },
  {
    key: "853",
    label: "中国澳门",
    pattern: /^6\d{7}$/
  },
  {
    key: "852",
    label: "中国香港",
    pattern: /^\d{8}$/
  },
  {
    key: "61",
    label: "澳大利亚",
    pattern: /^4\d{8}$/
  },
  {
    key: "60",
    label: "马来西亚",
    pattern: /^1\d{8,9}$/
  },
  {
    key: "1",
    label: "美国",
    pattern: /^\d{10}$/
  },
  {
    key: "66",
    label: "泰国",
    pattern: /^[146789]\d{8}$|^02\d{7}$/
  },
  {
    key: "82",
    label: "韩国",
    pattern: /^1\d{8,9}$/
  },
  {
    key: "65",
    label: "新加坡",
    pattern: /^\d{7,8}$/
  },
  {
    key: "81",
    label: "日本",
    pattern: /^\d{9,10}$/
  },
  {
    key: "33",
    label: "法国",
    pattern: /^\d{8,9}$/
  },
  {
    key: "39",
    label: " 意大利",
    pattern: /^\d+$/
  },
];

// var names = [{id: 1, name: 'aa', pid: 0}, {id: 2, name: 'aa', pid: 1}, {id: 3, name: 'aa', pid: 2}, {id: 4, name: 'aa', pid: 3}, {id: 5, name: 'aa', pid: 2}]
// let loop = (data, id) => [...data.filter(item => item.id == id), ...data.filter(item => item.pid == id).reduce((pre, item) => [...pre, ...loop(data, item.id)], [])]
// console.log(loop(names, 1), loop(names, 5), loop(names, 6))
