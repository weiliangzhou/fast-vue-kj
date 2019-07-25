export default [
//     {
//     path: "/offline-order-list",
//     name: "offlineOrderList",
//     meta: {
//         keepAlive: false,
//         title: "线下支付订单列表",
//         shareInfo: {}
//     },
//     component: () =>
//         import("@/pages/order/offline-order-list")
// },
// {
//     path: "/online-order-list",
//     name: "onlineOrderList",
//     meta: {
//         keepAlive: false,
//         title: "线上支付订单列表",
//         shareInfo: {}
//     },
//     component: () =>
//         import("@/pages/order/online-order-list")
// },
 {
    path: "/order-list",
    name: "orderList",
    meta: {
        keepAlive: true,
        title: "订单列表",
        shareInfo: {}
    },
    component: () =>
        import("@/pages/order/order")
}, {
    path: '/data-report',
    name: 'data-report',
    meta: {
        title: '数据概况'
    },
    component: () =>
        import('@/v0.7/reportForms/data-report-v2/index.vue')
}, {
    path: '/data-detail',
    name: 'data-detail',
    meta: {
        title: '数据趋势'
    },
    component: () =>
        import('@/v0.7/reportForms/data-detail/index.vue')
}, {
    path: '/learn-report',
    name: 'learn-report',
    meta: {
        title: '学习数据'
    },
    component: () =>
        import('@/v0.7/reportForms/learn-report.vue')
}, {
    path: '/search-report',
    name: 'search-report',
    meta: {
        title: '搜索'
    },
    component: () =>
        import('@/v0.7/reportForms/search.vue')
}]
