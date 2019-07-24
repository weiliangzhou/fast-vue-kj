<!-- 线上订单列表 -->
<template>
  <section>
    <div class="serch-container">
      <div class="search-box">
        <select @change="clearInput" name="type" v-model="chooseType">
                <option value="goodsName">产品名称</option>
                <option value="phone">手机</option>
        </select>
        <form
          action=""
          @submit.prevent="onSubmit"
        ><input
            type="search"
            autocomplete="off"
            v-model.trim="searchInput"
            :placeholder="placeholderText"
            ref="searchInput"
          /></form><button @click="onCancel">取消</button>
      </div>
      <div class="list-container">
        <ul v-show="serchList.length"
             v-infinite-scroll="loadBottom"
            infinite-scroll-disabled="scrollDisabled"
            :infinite-scroll-immediate-check="true"
            infinite-scroll-distance="10"
        >
          <li
            v-for="(item, index) in serchList"
            :key="index"
          >
            <div class="top">
              <img
                class="cover"
                :src="item.avatar || 'https://img.mall.xc2018.com.cn/mall/upload/20190513/140756_99_gxee.png'"
                alt=""
              >
              <span class="name ellipsis_1">{{item.userName}}</span>
              <span class="phone">{{item.userPhone}}</span>
              <span style="flex: 1;"></span>
              <span class="earnings">{{item.allotDesc}}</span>
              <!-- <span class="orderStatus">{{item.orderStatusDesc}}</span> -->
              <!-- 上方注释游东方的锅 -->
            </div>
            <div class="center">
              <img
                class="goodsImg"
                :src="item.picUrl"
                alt=""
              >
              <div class="right-container">
              <li><h5 class="ellipsis_1">{{item.name}}</h5><span>&yen;{{item.actualPriceDesc}}</span></li>
              <li><p class="ellipsis_2">{{item.brief}}</p><span>x1</span></li>
              <li><p>{{item.createdAt.split(' ')[0]}}</p><span>{{item.orderStatusDesc}}</span></li>
            </div>
              <!-- <div class="goodsinfo">
                <div class="goodsTitle">{{item.name}}</div>
                <div class="classAddress">{{item.brief}}</div>
                <div class="creatOrderTime">{{item.createdAt.split(' ')[0]}}</div>
              </div>
              <div class="orderInfo">
                <div class="price">&yen;{{item.actualPriceDesc}}</div>
                <div class="goodsNum">x1</div>
                上方注释游东方的锅
                <div class="goodsStatus">{{item.orderStatusDesc}}</div>
              </div> -->
            </div>
          </li>
         <p v-show="orderList.total!==-1">没有更多</p>
      </ul>
      <no-more v-show="serchList.length === 0"></no-more>
      </div>
    </div>
  </section>
</template>

<script>
// import topbar from "../topbar/topbar.vue";
// import searchBar from "../search-bar/index.vue";
import { findProductOrderListPage } from "@/api";
import { Indicator } from "mint-ui";
import { Toast, resolveTimeout } from "@/global"; // resolveTimeout, rejectTimeout  getObject, MyError
// import { Search } from "vux";
export default {
  data() {
    return {
      chooseType: 'goodsName',
      searchInput: "",
      orderList: {
        isLoading: false,
        list: [],
        searchList: [],
        pageNum: 0,
        total: -1
      },
    };
  },
  // components: { topbar, Search, searchBar },

  computed: {
      serchList() {
        return this.orderList.list;
      },
      scrollDisabled() {
          return this.orderList.total !== -1 || this.orderList.isLoading;
      },
      placeholderText() {
          return {
             "phone": '请输入手机号',
             "goodsName": "请输入产品名称"
          }[this.chooseType]
      }
  },

  mounted() {
    // this.fetchList();
  },
  destroyed() {},
  methods: {
    getResult(val) {
      console.log("on-change", val);
      this.results = val ? getResult(this.value) : [];
    },
    clearInput() {
        this.searchInput = ""
    },
    onSubmit() {
      Indicator.open();
      Promise.all([
        this.fetchList({
          isReset: true,
          agentLevel: this.agentLevel,
          isSearch: this.isSearch,
          searchKey: this.searchInput,
          type: this.type,
          options: { startTime: this.startTime, endTime: this.endTime }
        }),
        resolveTimeout(1)
      ])
        .then(res => {
          Indicator.close();
        })
        .catch(err => {
          Toast(err);
          Indicator.close();
        });
    },
    loadBottom() {
      let { isLoading = false, total = -1, list = [] } = this.orderList;
      if (!isLoading && total === -1 && list.length) {
        this.fetchList({
          isSearch: this.isSearch,
          agentLevel: this.agentLevel,
          searchKey: this.searchInput,
          type: this.type,
          options: { startTime: this.startTime, endTime: this.endTime }
        });
      } else {
        // this.$refs.loadmore.onBottomLoaded()
      }
    },
    onCancel() {
      if (this.searchInput) {
        this.searchInput = "";
        this.$refs.searchInput.focus();
      } else {
        this.$router.go(-1);
      }
    },
    clearAgent() {
      Object.assign(this.orderList, {
        isLoading: false,
        list: [],
        searchList: [],
        pageNum: 0,
        total: -1
      });
    },
    fetchList({ isReset = false } = {}) {
      let content = this.orderList
      let {
        isLoading = false,
        list = [],
        pageNum = 0,
        total = -1
      } = content;

      if (!isReset && isLoading) {
        return Promise.reject(new MyError("不能重复请求", 1));
      } else if (!isReset && total !== -1) {
        return Promise.reject(new MyError("已经没有数据", 1));
      } else {
        if (isReset) {
          pageNum = 0;
          total = -1;
          list = [];
          Object.assign(content, {
                list: [...list],
                pageNum,
                total: -1
          });
        }
        content.isLoading = true;
        let pageSize = 15;
        return findProductOrderListPage({
          pageSize,
          pageNum: pageNum + 1,
          [this.chooseType]: this.searchInput
        })
          .then(({ items: res }) => {
            let tempList = [...list, ...res];
            Object.assign(content, {
              list: tempList,
              pageNum: res.length ? pageNum + 1 : pageNum,
              total: res.length && res.length >= pageSize ? -1 : tempList.length,
              isLoading: false
            });
          })
          .catch(err => {
            content.isLoading = false;
            throw err;
          });
      }
    }
  },
  activated() {
    this.$nextTick().then(res => {
      this.clearAgent(this.type);
    });
  }
};
</script>
<style lang='less' scoped>
section {
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: rgba(247, 247, 247, 1);
}

.list-container {
  display: flex;
  flex: 1;
  position: relative;
  width: 100%;
  margin-bottom: 34px;
  margin-top: 106px;
  // -webkit-overflow-scrolling: touch; //该属性随着手指离开还会保持滚动
  & > ul {
    padding-bottom: 24px;
    box-sizing: border-box;
    // height: 100%;
    // flex: 1;
    width: 100%;

    & > li {
      width: 718px;
      padding-left: 32px;
      background: #fff;
      float: right;
      margin-bottom: 20px;
      overflow: hidden;
      .top {
        width: 100%;
        height: 64px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e0e0e0; /* no */
        img {
          width: 32px;
          height: 32px;
          overflow: hidden;
          border-radius: 32px;
          // margin-top: 16px;
          margin-right: 16px;
        }
        span {
          color: #363636;
          line-height: 64px;
          margin-right: 10px;
        }
        .name {
          max-width: 200px;
        }
        .earnings {
          height:33px;
          font-size:24px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(236,193,132,1);
          line-height:33px;
        }
        .orderStatus {
          flex: 99;
          text-align: right;
          margin-right: 32px;
        }
      }
      .center {
        display: flex;
        //   width: ;
        height: 150px;
        margin: 24px 0 0;
        padding-bottom: 24px;
        img {
          width: 245px;
          height: 150px;
          margin-right: 16px;
        }

        .goodsinfo {
          width: 302px;
          margin-left: 16px;
          flex: 2;
          .goodsTitle {
            height: 45px;
            font-size: 32px;
            color: rgba(54, 54, 54, 1);
            line-height: 45px;
            margin-bottom: 15px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .classAddress {
            height: 40px;
            font-size: 28px;
            color: rgba(152, 152, 152, 1);
            line-height: 40px;
            margin-bottom: 23px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .creatOrderTime {
            height: 40px;
            font-size: 24px;
            color: rgba(152, 152, 152, 1);
            line-height: 33px;
          }
        }
        .orderInfo {
          width: 140px;
          text-align: right;
          padding-right: 20px;
          color: #989898;
          .goodsStatus {
            margin-top: 52px;
            color: #fa4f4e;
          }
        }
      }
      .bottom {
        // height: 80px;
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        align-content: center;
        overflow: hidden;
        border-top: 1px dotted #e0e0e0; /* no */
        div {
          margin: 13px 0;
        }
        .btn {
          width: 187px;
          height: 54px;
          border-radius: 54px;
          text-align: center;
          line-height: 52px;
          margin-right: 32px;
        }
        .checkOrder {
          background: #fff;
          color: #363636;
          border: 1px solid #979797; /* no */
        }
        .upOrder {
          background: linear-gradient(to bottom, #f4554c 0%, #e01721 100%);
          color: #fff;
          border: none;
        }
      }
    }
    & > p {
      margin: 16px 0;
      font-size: 28px;
      text-align: center;
    }
  }
}
.right-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: 16px;
  width: 0;
  & > li {
    display: flex;
    p {
      flex: 1;
    }
    span {
      color: #989898;
    }
  }
  & > li:nth-of-type(1) {
    h5 {
    height: 45px;
    font-size: 32px;
    color: rgba(54, 54, 54, 1);
    line-height: 45px;
    font-weight: 400;
    flex: 1;
    margin-right: 10px;
    }

  }
  & > li:nth-of-type(2) {
    p {
      font-size: 28px;
      color: rgba(152, 152, 152, 1);
      line-height: 40px;
      margin-right: 10px;
    }
  }

  & > li:nth-of-type(3) {
    p {
      height: 33px;
      font-size: 24px;
      color: rgba(152, 152, 152, 1);
      line-height: 33px;
    }
    span {
      color: #fa4f4e;
    }
  }
}
// .list-container {
//   background: #f7f7f7;
//   flex: 1;
//     display: flex;
//     position: relative;
//     top: 0;
//     right: 0;
//     margin-top: 114px;
//   ul {
//         flex: 1;
//         width: 750px;
//         min-height: 100%;
//         position: absolute;
//         top: 0;
//         right: 0;
//         margin-bottom: 20px;
//         box-sizing: border-box;
//         // height: 100%;
//     // background: #fff;
//     li {
//       width: 718px;
//       padding-left: 32px;
//       background: #fff;
//       float: right;
//       margin-bottom: 20px;
//       overflow: hidden;
//       .top {
//         width: 100%;
//         height: 64px;
//         display: flex;
//         align-items: center;
//         border-bottom: 1px solid #e0e0e0; /* no */
//         img {
//           width: 32px;
//           height: 32px;
//           overflow: hidden;
//           border-radius: 32px;
//           // margin-top: 16px;
//           margin-right: 16px;
//         }
//         span {
//           color: #363636;
//           line-height: 64px;
//           margin-right: 10px;
//         }
//         .orderStatus {
//           flex: 99;
//           text-align: right;
//           margin-right: 32px;
//         }
//         .earnings {
//           height:33px;
//           font-size:24px;
//           font-family:PingFangSC-Regular;
//           font-weight:400;
//           color:rgba(236,193,132,1);
//           line-height:33px;
//         }
//       }
//       .center {
//         display: flex;
//         //   width: ;
//         height: 150px;
//         margin: 24px 0 0;
//         padding-bottom: 24px;
//         // border-bottom: 1px dotted #e0e0e0; /* no */
//         img {
//           width: 245px;
//           height: 150px;
//         }
//         .goodsinfo {
//           width: 302px;
//           margin-left: 16px;
//           flex: 2;
//           .goodsTitle {
//             height: 45px;
//             font-size: 32px;
//             color: rgba(54, 54, 54, 1);
//             line-height: 45px;
//             margin-bottom: 15px;
//             overflow: hidden;
//             text-overflow: ellipsis;
//             white-space: nowrap;
//           }
//           .classAddress {
//             height: 40px;
//             font-size: 28px;
//             color: rgba(152, 152, 152, 1);
//             line-height: 40px;
//             margin-bottom: 23px;
//             overflow: hidden;
//             text-overflow: ellipsis;
//             white-space: nowrap;
//           }
//           .creatOrderTime {
//             height: 40px;
//             font-size: 24px;
//             color: rgba(152, 152, 152, 1);
//             line-height: 33px;
//           }
//         }
//         .orderInfo {
//           width: 140px;
//           text-align: right;
//           padding-right: 20px;
//           color: #989898;
//           .goodsStatus {
//             margin-top: 52px;
//             color: #fa4f4e;
//           }
//         }
//       }
//       .bottom {
//         height: 80px;
//         display: flex;
//         flex-direction: row-reverse;
//         align-items: center;
//         align-content: center;
//         .btn {
//           width: 187px;
//           height: 54px;
//           border-radius: 54px;
//           text-align: center;
//           line-height: 52px;
//           margin-right: 32px;
//         }
//         .checkOrder {
//           background: #fff;
//           color: #363636;
//           border: 1px solid #979797; /* no */
//         }
//         .upOrder {
//           background: linear-gradient(to bottom, #f4554c 0%, #e01721 100%);
//           color: #fff;
//           border: none;
//         }
//       }
//     }
//     & > p {
//       margin: 16px 0 0;
//       font-size: 28px;
//       text-align: center;
//     }
//   }
// }

.serch-container {
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: rgba(247, 247, 247, 1);
  .search-box {
    width: 100%;
    display: flex;
    background: rgba(225, 225, 225, 0.5);
    padding: 14px 16px;
    overflow: hidden;
    box-sizing: border-box;
    position: fixed;
    top: 0;
    right: 0;
    select {
      width: 164px;
      padding: 0;
      border: none;
      background: #fff;
      color: #989898;
      // appearance: none;
      // -moz-appearance: none;
      // -webkit-appearance: none;
      position: relative;
      z-index: 99;
    }
    form {
      flex: 1;
      box-sizing: border-box;
      padding-left: 32px;
      input {
        &::-webkit-search-cancel-button {
          display: none;
        }
        -webkit-appearance: none;
        width: 100%;
        height: 60px;
        opacity: 1;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(239, 239, 239, 1);
        border-radius: 8px;
        box-shadow: 0px 2px 0px 0px rgba(225, 225, 225, 0.5);
        font-size: 30px;
        line-height: 32px;
        color: rgba(54, 54, 54, 1);
        font-weight: 500;
        margin-right: 20px;
      }
    }

    button {
      width: 160px;
      background: transparent;
      border: none;
      font-size: 32px;
      line-height: 34px;
      color: green;
    }
  }
}
.choose-type {
    width: 132px;
    height: 72px;
    margin-left: 32px;
    background: #fff;
    border-radius: 8px;
    font-size: 28px;
    line-height: 72px;
    position: relative;
    overflow: hidden;
    select {
      width: 164px;
      height: 100%;
      opacity: 0;
      padding: 0;
      border: none;
      background: #fff;
      color: #989898;
      appearance: none;
      -moz-appearance: none;
      -webkit-appearance: none;
      position: relative;
      z-index: 99;
    }
    span {
      color: #989898;
      position: absolute;
      display: block;
      width: 90px;
      height: 100%;
      text-align: center;
      line-height: 78px;
      top: 0;
      left: 0;
    }
    i {
      position: absolute;
      right: 10px;
      top: 0;
      display: block;
      font-size: 48px;
      height: 100%;
      line-height: 78px;
      color: #989898;
    }
  }
</style>
