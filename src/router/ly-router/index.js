
export default [
    {
        path: "/login",
        name: "login",
        meta: {
            keepAlive: true,
            title: "登录",
            shareInfo: {}
        },
        component: () =>
            import("@/pages/login/login")
    },
    // {
    //     path: "/company-rewards",
    //     name: "company-rewards",
    //     meta: {
    //         keepAlive: true,
    //         title: "我的账单",
    //         shareInfo: {}
    //     },
    //     component: () =>
    //         import("@/pages/company-rewards/index")
    // },
    {
        path: "/binding-bankCard",
        name: "binding-bankCard",
        meta: {
            keepAlive: true,
            title: "银行卡信息",
            shareInfo: {}
        },
        component: () =>
            import("@/pages/binding-bankCard/index")
    },
]
