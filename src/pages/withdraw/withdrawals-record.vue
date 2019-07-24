<!-- 提现首页 -->
<template>
  <section id="withdraw-record-page">
    <div class="list-title">
      <span>日期</span>
      <span>状态</span>
      <span>金额</span>
      <span>税后金额</span>
      <span>查看</span>
    </div>
    <div class="list-container">
      <ul
        v-show="currentList.length"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="isLoading"
        :infinite-scroll-immediate-check="true"
        infinite-scroll-distance="10"
      >
        <record-item v-for="item in currentList" :key="item.id" v-bind="item" />
      </ul>
      <no-more v-show="currentList.length === 0"></no-more>
    </div>
  </section>
</template>

<script>
import { findSaleUserDrawList } from "@/api"
import { MyError } from "@/global"; // resolveTimeout, rejectTimeout, getObject, Toast
import recordItem from "./record-item"
export default {
  data() {
    return {
      withdrawList: {
        // 预估收益
        isLoading: false, // 是否在请求中
        list: [], // 数据保存数组
        pageNum: 0, // 当前页码
        total: -1
      },
      selected: [],
      regularTipsIsShow: true,
      bindBankIsShow: false
    };
  },
  components: {recordItem},

  computed: {
    currentList() {
      let { list = [] } = this["withdrawList"];
      return list;
    },
    isLoading() {
      let { isLoading, total } = this["withdrawList"];
      return isLoading || total !== -1;
    }
  },

  mounted() {
    this.fetchList()
  },

  methods: {
    trigger() {
      console.log(22);
    },
    loadMore() {
      let { isLoading = false, total = -1 } = this["withdrawList"];
      if (!isLoading && total === -1) {
        this.fetchList();
      }
    },
    // 拉起列表数据
    fetchList(isReset = false) {
      let content = this["withdrawList"];
      let { isLoading = false, list = [], pageNum = 0, total = -1 } = content;
      if (!isReset && isLoading) {
        return Promise.reject(new MyError("不能重复请求", 1));
      } else if (!isReset && total !== -1) {
        return Promise.reject(new MyError("已经没有数据", 1));
      } else {
        if (isReset) {
          list = [];
          pageNum = 0;
          Object.assign(content, {
              list: [...list],
              pageNum,
              total: -1
          });
        }
        content.isLoading = true;
          return findSaleUserDrawList({
            pageSize: 15,
            pageNum: pageNum + 1
          })
          .then(res => {
            let tempList = [...list, ...res];
            Object.assign(content, {
              list: tempList,
              pageNum: res.length ? pageNum + 1 : pageNum,
              total: res.length ? -1 : tempList.length,
              isLoading: false
            });
          })
          .catch(err => {
            Toast(err);
            content.isLoading = false;
          });
      }
    }
  }
};
</script>
<style lang='less' scoped>
#withdraw-record-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 32px 24px 0;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background: rgba(244, 244, 244, 1);
  align-items: center;
  position: relative;
}
.list-title {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 20px 0 24px;
  span {
    flex: 1;
    font-size: 28px;
    color: rgba(101, 101, 101, 1);
    line-height: 40px;
    letter-spacing: 0.69px;
    text-align: center;
  }
}
.list-container {
  display: flex;
  flex: 1;
  position: relative;
  width: 100%;
  overflow-y: scroll; //该属性随着手指离开立即停止
  -webkit-overflow-scrolling: touch; //该属性随着手指离开还会保持滚动
  ul {
    padding-bottom: 24px;
    box-sizing: border-box;
    height: 100%;
    flex: 1;
    position: absolute;
    width: 100%;
  }
}
</style>
