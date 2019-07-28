import listPage from "@/pages/mine/list-page";
export default [
  /**
   *    courseId 套课id
   * ['extract','energy','acalculationPower']
   */

  {
    path: "/extract",
    name: "extract",
    meta: {
      title: "总资产(btc)"
    },
    component: {
      render(h) {
        return h(listPage, {
          props: {
            type: "extract"
          }
        });
      },
      component: {
        listPage
      }
    }
  },
  {
    path: "/energy",
    name: "energy",
    meta: {
      title: "电力记录"
    },
    component: {
      render(h) {
        return h(listPage, {
          props: {
            type: "energy"
          }
        });
      },
      component: {
        listPage
      }
    }
  },
  {
    path: "/acalculationPower",
    name: "acalculationPower",
    meta: {
      title: "算力记录"
    },
    component: {
      render(h) {
        return h(listPage, {
          props: {
            type: "acalculationPower"
          }
        });
      },
      component: {
        listPage
      }
    }
  },
  {
    path: "/home",
    meta: {
      shareInfo: {},
      title: "挖矿"
    },
    children: [
      {
        path: "",
        redirect: to => "/home/index"
      },
      {
        path: "index",
        name: "home",
        meta: {
          title: "首页"
        },
        component: () => import("@/pages/home/home")
      },
      {
        path: "personal",
        name: "personal",
        meta: {
          title: "个人中心"
          // keepAlive: true
        },
        component: () => import("@/pages/mine/main")
      }
    ],
    component: () => import("@/pages/home")
  }
];
