const log = {};

/**
 * @description 返回这个样式的颜色值
 * @param {String} type 样式名称 [ primary | success | warning | danger | text ]
 */
function typeColor(type = 'default') {
    //   let color = ''
    //   switch (type) {
    //     case 'default': color = '#35495E'; break
    //     case 'primary': color = '#3488ff'; break
    //     case 'success': color = '#43B883'; break
    //     case 'warning': color = '#e6a23c'; break
    //     case 'danger': color = '#f56c6c'; break
    //     default:; break
    //   }
    //   return color
    let colorOptions = {
        default: '#35495E',
        primary: '#3488ff',
        success: '#43B883',
        warning: '#e6a23c',
        danger: '#f56c6c'
    };
    return colorOptions[type] || colorOptions['default'];
}

/**
 * @description 打印一个 [ title | text ] 样式的信息
 * @param {String} title title text
 * @param {String} info info text
 * @param {String} type style
 */
log.capsule = function(title, info, type = 'primary') {
    console.log(
        `%c ${title} %c ${info} %c`,
        'background:#35495E; padding: 1px; border-radius: 3px 0 0 3px; color: #fff;',
        `background:${typeColor(
            type
        )}; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff;`,
        'background:transparent'
    );
};

/**
 * @description 打印彩色文字
 */
log.colorful = function(textArr) {
    console.log(
        `%c${textArr.map(t => t.text || '').join('%c')}`,
        ...textArr.map(t => `color: ${typeColor(t.type)};`)
    );
};

/**
 * @description 打印 default 样式的文字
 */
log.default = function(text) {
    log.colorful([{ text }]);
};

/**
 * @description 打印 primary 样式的文字
 */
log.primary = function(text) {
    log.colorful([{ text, type: 'primary' }]);
};

/**
 * @description 打印 success 样式的文字
 */
log.success = function(text) {
    log.colorful([{ text, type: 'success' }]);
};

/**
 * @description 打印 warning 样式的文字
 */
log.warning = function(text) {
    log.colorful([{ text, type: 'warning' }]);
};

/**
 * @description 打印 danger 样式的文字
 */
log.danger = function(text) {
    log.colorful([{ text, type: 'danger' }]);
};

// var MyModules = (function Manager() {
//     var modules = {};
//     function define(name, deps, impl) {
//         for (var i = 0; i < deps.length; i++) {
//             deps[i] = modules[deps[i]];
//         }
//         modules[name] = impl.apply(impl, deps);
//     }
//     function get(name) {
//         return modules[name];
//     }
//     return {
//         define: define,
//         get: get
//     };
// })();

// MyModules.define('bar', [], function() {
//     function hello(who) {
//         return 'Let me introduce: ' + who;
//     }
//     return {
//         hello: hello
//     };
// });
// MyModules.define('foo', ['bar'], function(bar) {
//     var hungry = 'hippo';
//     function awesome() {
//         console.log(bar.hello(hungry).toUpperCase());
//     }
//     return {
//         awesome: awesome
//     };
// });
// var bar = MyModules.get('bar');
// var foo = MyModules.get('foo');
// console.log(bar.hello('hippo')); // Let me introduce: hippo
// foo.awesome(); // LET ME INTRODUCE: HIPPO

export { log };
// import store from '@/store'
// import util from '@/libs/util'
// export default {
//   install (Vue, options) {
//     Vue.config.errorHandler = function (err, vm, info) {
//       Vue.nextTick(() => {
//         // 添加 log
//         store.dispatch('d2admin/log/add', {
//           type: 'error',
//           err,
//           vm,
//           info
//         })
//         // 只在开发模式下打印 log
//         if (process.env.NODE_ENV === 'development') {
//           util.log.capsule('D2Admin', 'ErrorHandler', 'danger')
//           util.log.danger('>>>>>> 错误信息 >>>>>>')
//           console.log(info)
//           util.log.danger('>>>>>> Vue 实例 >>>>>>')
//           console.log(vm)
//           util.log.danger('>>>>>> Error >>>>>>')
//           console.log(err)
//         }
//       })
//     }
//   }
// }

/*
    我感觉很有必要写个自第一异常类（有等级的）如果要让抓该异常那就明确定义 不然有些不想处理的系统异常 没法过滤  比如 can not read property of undefined or null
*/
export class MyError extends Error {
    constructor(msg, level = 0, errno = -1, detail = '') {
        // 0系统错误 - log | 1 - not essential | 2 - tips | 3 - err 4 后端返回的错误
        super(msg);
        this.level = level;
        this.detail = detail;
        this.errno = errno;
    }
}
