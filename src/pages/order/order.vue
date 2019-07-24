<!-- 订单列表 -->
<template>
  <section id="order-page">
    <div id="searchInput-container"> <button id="searchInput" type="button" @click="searchAction" placeholder="订单搜索">订单搜索</button> </div>
    <div class="list-container">
      <ul
        v-show="list.length"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="canNotLoadMore"
        :infinite-scroll-immediate-check="true"
        infinite-scroll-distance="10"
      >
        <li
          v-for="(item, index) in list"
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
          <div
            class="bottom"
            v-if="item.orderStatus==1||item.orderStatus==10||item.serialImage"
          >
            <div
              class="btn upOrder"
              v-if="item.orderStatus==1"
              @click='upOrder(item.orderSn)'
            >上传付款凭证</div>
            <div
              class="btn upOrder"
              v-else-if="item.orderStatus==10"
              @click='upOrder(item.orderSn)'
            >重新上传凭证</div>
            <div
              class="btn checkOrder"
              v-if="item.serialImage"
              @click="showImg(item.serialImage)"
            >查看付款凭证</div>
          </div>
        </li>
        <p v-show="total!==-1">没有更多的数据了</p>
      </ul>
      <no-more v-show="list.length === 0"></no-more>
    </div>
  </section>
</template>

<script>
// import { findSaleUserBillList, addUserDraw, getBankInfo, getUserWallet } from "@/api"
import { Toast, MyError, isWX } from "@/global"; // resolveTimeout, rejectTimeout, getObject,
import { getAllOrder } from "@/api";
import wx from 'weixin-js-sdk'
export default {
  data() {
    return {
      isLoading: false, // 是否在请求中
      list: [], // 数据保存数组
      pageNum: 0, // 当前页码
      total: -1 // 数据总数 标识分页是否还有数据， -1 表示还有下一页
    };
  },
  computed: {
    // 当前类型收益是否在加载中
    canNotLoadMore() {
      let { isLoading, total } = this;
      return isLoading || total !== -1;
    }
  },

  mounted() {
      this.fetchList(true)
  },

  methods: {
    searchAction() {
        this.$router.push({ name: "search-order" });
    },
    showImg(imgs) {
      if (isWX) {
          imgs = (imgs || '').split(',')
            if (imgs.length) {
                wx.previewImage({"urls": imgs, "current": imgs[0]});
          }
      } else {
        Toast("只能在微信中预览")
      }
    },
    upOrder(orderSn) {
        // 跳转上传付款凭证
        this.$router.push({
            name: 'buy',
            query: {
                orderNo: orderSn
            }
        })
    },
    loadMore() {
      // console.log(23)
      this.fetchList();
    },
    // 获取列表数据
    fetchList(isReset) {
      let content = this;
      let { total, list, isLoading, pageNum } = content;

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
        return getAllOrder({
          pageNum: pageNum + 1,
          pageSize: 15
        })
          .then((earnings = []) => {
            Object.assign(content, {
              isLoading: false,
              list: [...list, ...earnings],
              pageNum: earnings.length ? content.pageNum + 1 : pageNum,
              total: earnings.length >= 15 ? -1 : earnings.length
            });
            content.isLoading = false;
            return earnings;
          })
          .catch(err => {
            Toast(err);
            content.isLoading = false;
            throw err;
          });
      }
    }
  }
};
</script>
<style lang='less' scoped>
#order-page {
  width: 100vw;
  min-height: 100vh;
  flex: 1;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background: rgba(244, 244, 244, 1);
  align-items: center;
  position: relative;
}
#searchInput-container {
        position: fixed;
         background: #fff;
         padding: 16px 32px;
          width: 100%;
          display: flex;
          box-sizing: border-box;
          z-index: 10;
        button {
            flex: 1;
          height: 72px;
          font-size: 32px;
          font-weight: Regular;
          color: rgba(153, 153, 153, 1);
          line-height: 45px;
          letter-spacing: -0.77px;
          text-align: center;
          border-width: 0;
          box-sizing: border-box;
          background: #fff;
          border-radius: 12px;
          background: rgba(242, 242, 242, 1);
        }

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
</style>
