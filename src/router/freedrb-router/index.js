
import message from "@/pages/message"
import earnings from "@/pages/earnings"
export default [
    {
        path: "/logout",
        name: "logout",
        meta: {
            keepAlive: true,
            shareInfo: {},
            title: "退出"
        },
        component: {
            render(h) {
                return h("div")
            },
            beforeRouteEnter (to, from, next) {
                localStorage.clear()
                window.location.href = window.location.origin + "/login"
            }
        }
    },
    {
        path: "/detailReport",
        name: "detailReport",
        meta: {
            shareInfo: {},
            title: "详情"// 数据报表详情页（分销，各端，350权益包数据报表详情）
        },
        component: () =>
            import("@/v0.7/reportForms/detailReport")
    },
    {
        path: "/agent-add",
        name: "agent-add",

        meta: {
            shareInfo: {}
        },
        component: () =>
            import("@/pages/agent/add")
    },

    {
        path: "/sale-card-detail",
        name: "sale-card-detail",
        meta: {
            shareInfo: {},
            title: "售卡详情"
        },
        component: () =>
            import("@/pages/earnings/sale-card-detail")
    },
    {
        path: "/earnings-detail",
        name: "earnings-detail",
        meta: {
            shareInfo: {},
            title: "收益详情"
        },
        component: () =>
            import("@/pages/earnings/earnings-detail")
    },
    {
        path: "/agent",
        name: "agent",
        meta: {
            keepAlive: true,
            title: "分销管理",
            shareInfo: {}
        },
        children: [],
        component: () =>
        import("@/pages/agent/tabs")
    },
    {
        path: "/agent-user/:userId",
        name: "agent-user",
        meta: {
            shareInfo: {}
        },
        children: [],
        component: () =>
            import("@/pages/agent/agent-user")
    },
    {
        path: "/course",
        name: "course",
        meta: {
            keepAlive: true,
            title: "产品销售",
            shareInfo: {}
        },
        component: () =>
            import("@/pages/course")
    },
    {
        path: "/buy",
        name: "buy",
        meta: {
            keepAlive: false,
            title: "代下单",
            shareInfo: {}
        },
        component: () =>
            import("@/pages/course/add")
    },
    {
        path: "/poster",
        name: "poster",
        meta: {
            keepAlive: false,
            title: "海报",
            shareInfo: {}
        },
        component: () =>
            import("@/pages/course/poster")
    },
    {
        path: "/agent-area",
        name: "agent-area",
        meta: {
            keepAlive: true,
            shareInfo: {},
            title: "分销区域"
        },
        component: () =>
            import("@/pages/mine/agent-area")
    },
    {
        path: "/perfect-userInfo",
        name: "perfect-userInfo",
        meta: {
            shareInfo: {},
            title: "完善信息"
        },
        component: () =>
            import("@/pages/mine/perfect-userInfo")
    },
    {
        path: "/authorization",
        name: "authorization",
        meta: {
            keepAlive: true,
            shareInfo: {},
            title: "授权证书"
        },
        component: () =>
            import("@/pages/authorization")
    },
    {
        path: "/search-agent",
        name: "search-agent",
        meta: {
            keepAlive: true,
            shareInfo: {},
            title: "分销搜索"
        },
        component: () =>
            import("@/pages/agent/search-agent")
    },
    {
        path: "/search-order",
        name: "search-order",
        meta: {
            keepAlive: true,
            title: "搜索订单",
            shareInfo: {}
        },
        component: () =>
            import("@/pages/order/search-order")
    },
    {
        path: "/recive-agent",
        name: "recive-agent",
        meta: {
            shareInfo: {},
            title: "审核托管列表"
        },
        component: () =>
            import("@/pages/agent/recive-agent")
    },
    {
        path: "/recommend-agent",
        name: "recommend-agent",
        meta: {
            shareInfo: {},
            title: "申请托管"
        },
        component: () =>
            import("@/pages/agent/recommend-agent")
    },
    {
        path: "/select-agent",
        name: "select-agent",
        meta: {
            shareInfo: {},
            title: "可引荐列表"
        },
        component: () =>
            import("@/pages/agent/select-agent")
    },
    {
        path: "/resolve-agent",
        name: "resolve-agent",
        meta: {
            shareInfo: {},
            title: "同意审核托管"
        },
        component: () =>
            import("@/pages/agent/resolve-agent")
    },
    {
        path: "/referrer-record",
        name: "referrer-record",
        meta: {
            shareInfo: {},
            title: "申请托管"
        },
        component: () =>
            import("@/pages/agent/referrer-record")
    },
    {
        path: "/edit-agent",
        name: "edit-agent",
        meta: {
            shareInfo: {},
            title: "编辑分销"
        },
        component: () =>
            import("@/pages/agent/edit")
    },
    {
        path: "/mine-info",
        name: "mine-info",
        meta: {
            shareInfo: {},
            title: "设置"
        },
        component: () =>
            import("@/pages/mine/mine-info")
    },
    {
        path: "/earnest",
        name: "earnest",
        meta: {
            keepAlive: true,
            shareInfo: {},
            title: "保证金"
        },
        component: () =>
            import("@/pages/mine/earnest-money")
    },
    {
        path: "/sales-rank",
        name: "salesRank",
        meta: {
            keepAlive: true,
            shareInfo: {},
            title: "排行榜"
        },
        component: () =>
            import("@/pages/sales-rank")
    },
    {
        path: "/competition-rank",
        name: "competitionRank",
        meta: {
            shareInfo: {},
            title: "猛虎团排行榜"
        },
        component: () =>
            import("@/pages/sales-rank/competition-rank.vue")
    },
    {
        path: "/add-salesman",
        name: "add-salesman",
        meta: {
            shareInfo: {},
            title: "新增业务员"
        },
        component: () =>
            import("@/pages/agent/add-salesman")
    },
    {
        path: "/admin-menu",
        name: "adminMenu",
        meta: {
            shareInfo: {},
            title: "后台管理",
            keepAlive: true,
        },
        component: () =>
            import("@/pages/mine/admin-menu")
    },
    {
        path: "/reward-card",
        name: "reward-card",
        meta: {
            title: "奖励卡发送",
        },
        component: () =>
            import("@/pages/agent/reward")
    },
    {
        path: "/messages",
        name: "messages",
        meta: {
            shareInfo: {},
            title: "消息"
        },
        component: {
            render(h) {
                return h(message, {props: {
                    type: "all"
                }})
            }
        }
    },
    {
        path: "/messages/reward",
        name: "reward-messages",
        meta: {
            shareInfo: {},
            title: "奖励消息",
        },
        component: {
            render(h) {
                return h(message, {props: {
                    type: "reward"
                }})
            }
        }
    },
    {
        path: "/messages/notice",
        name: "notice-messages",
        meta: {
            shareInfo: {},
            title: "通知消息",
        },
        component: {
            render(h) {
                return h(message, {props: {
                    type: "notice"
                }})
            }
        }
    },
    {
        path: "/withdraw",
        name: "withdraw",
        meta: {
            shareInfo: {},
            title: "我要提现",
        },
        component: () =>
            import("@/pages/withdraw")
    },
    {
        path: "/do-withdraw",
        name: "do-withdraw",
        meta: {
            shareInfo: {},
            title: "提现申请",
        },
        component: () =>
            import("@/pages/withdraw/do-withdraw")
    },
    {
        path: "/open-interest",
        name: "open-interest",
        meta: {
            shareInfo: {},
            title: "开通权益",
        },
        component: () =>
            import("@/pages/agent/open-interest")
    },
    {
        path: "/my-interest",
        name: "my-interest",
        meta: {
            shareInfo: {},
            title: "我的权益",
        },
        component: () =>
            import("@/pages/mine/interest-list")
    },
    {
        path: "/withdraw-record",
        name: "withdraw-record",
        meta: {
            shareInfo: {},
            title: "提现记录",
        },
        component: () =>
            import("@/pages/withdraw/withdrawals-record")
    },
    {
        path: "/product-earnings",
        name: "product-earnings",
        meta: {
            keepAlive: false,
            title: "产品收益",
            shareInfo: {}
        },
        component: {
           render(h) {
            return h(earnings, {props: {
                earningsViewType: "promise"
            }})
           },
           component: {
               earnings
           }
        }
    },
    {
        path: "/statics-report",
        meta: {
            shareInfo: {},
            title: "我的报表",
        },
        children: [
            {
                path: "",
                redirect: to => "/statics-report/card",
            },
            {
                path: "card",
                name: "card",
                meta: {
                    shareInfo: {},
                    title: "售卡报表",
                },
                component: {
                    render(h) {
                     return h(earnings, {props: {
                         earningsViewType: "card"
                     }})
                    },
                    component: {
                        earnings
                    }
                 }
            },
            {
                path: "referrer",
                name: "referrer",
                meta: {
                    shareInfo: {},
                    title: "托管报表",
                },
                component: {
                    render(h) {
                     return h(earnings, {props: {
                         earningsViewType: "referrer"
                     }})
                    },
                    component: {
                        earnings
                    }
                 }
            },
            {
                path: "statistic",
                name: "statistic",
                meta: {
                    shareInfo: {},
                    title: "分销报表",
                    // keepAlive: true
                },
                component: () => import("@/pages/earnings/statistic")
            },
        ],
        component: () =>
            import("@/pages/earnings/main")
    },

    {
        path: "/home",
        meta: {
            shareInfo: {},
            title: "分销系统",
        },
        children: [
            {
                path: "",
                redirect: to => "/home/index",
            },
            {
                path: "index",
                name: "home",
                meta: {
                    shareInfo: {},
                    title: "分销系统",
                },
                component: () =>
                import("@/pages/home/home")
            },
            {
                path: "course",
                name: "home-course",
                meta: {
                    shareInfo: {},
                    title: "分销系统",
                    keepAlive: true
                },
                component: () => import("@/pages/course")
            },
            {
                path: "personal",
                name: "personal",
                meta: {
                    shareInfo: {},
                    title: "分销系统",
                    // keepAlive: true
                },
                component: () => import("@/pages/mine/main")
            },
        ],
        component: () =>
            import("@/pages/home")
    },
]
