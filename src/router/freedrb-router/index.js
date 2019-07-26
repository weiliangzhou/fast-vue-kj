import listPage from "@/pages/mine/list-page"
export default [
    /**
     *    courseId 套课id
     * ['extract','energy','acalculationPower']
     */ 
    {
      path: "/extract",
      name: "extract",
      meta: {
          title: "总资产(btc)",
      },
      component: {
         render(h) {
          return h(listPage, {props: {
              type: "extract"
          }})
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
        title: "电力记录",
    },
    component: {
       render(h) {
        return h(listPage, {props: {
            type: "energy"
        }})
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
      title: "算力记录",
  },
  component: {
     render(h) {
      return h(listPage, {props: {
          type: "acalculationPower"
      }})
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
      title: "分销系统"
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
          shareInfo: {
            title: "测试的分享标题",
            desc: "分销描述，sb二师兄",
            sharePath: "/"
          },
          title: "分销系统"
        },
        component: () => import("@/pages/home/home")
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
          title: "分销系统"
          // keepAlive: true
        },
        component: () => import("@/pages/mine/main")
      }
    ],
    component: () => import("@/pages/home")
  }
];
