<template>
  <section id='container'>
         <div class="search-box">
         
        <form
          action=""
          @submit.prevent="onSearch"
        >
          <i class="iconfont icon-sousuocopyx1"></i>
          <input
            type="search"
            autocomplete="off"
            v-model.trim="searchInput"
            placeholder="请输入名称搜索"
            ref="searchInput"
          /></form><button @click="onCancel">取消</button>
      </div>
      <ul v-show="currentList.length" v-infinite-scroll="loadMore" infinite-scroll-disabled="isLoading" :infinite-scroll-immediate-check="true" infinite-scroll-distance="10">
        <li v-for="(item, index) in currentList" :key="item.id">
          <div class="title-container"><span>{{index+1}}</span>
            <h5 class="ellipsis_1" v-html="item.goodsName"></h5>
          </div>
          <div class="statis-container">
            <p><span>学习人数： {{item.studyPeopleNum}}人</span></p>
            <p><span>学习时长： {{item.studyTime | TimeFormat}}</span></p>
            <p><span>销量： {{item.orderNum}}个</span></p>
            <p><span>交易金额： {{item.amount | Yuan}}</span></p>
          </div>
        </li>
      </ul>
      <no-more v-show="currentList.length === 0"></no-more>
  </section>
</template>
<script>

import { searchLearnReport } from "@/api";
import { Toast } from "@/global"; // resolveTimeout
export default {
  data() {
    return {
      searchInput: "",
      dataList: {
        isLoading: false,
        list: [],
        pageNum: 0,
        total: 8
      }
    };
  },
  filters: {

  },
  computed: {
    currentLabel() {
      return this.year ? this.year + "-" + this.month : "未选条件";
    },
    currentList() {
      let { list = [] } = this["dataList"];
      return list;
    },
    isLoading() {
      let { isLoading, total } = this["dataList"];
      return isLoading || total !== -1;
    }
  },
  methods: {
     highLight(msg, highLightStr, count = 8) {
        msg = msg || ""
        let index = msg.indexOf(highLightStr)
        if (index>10) {
            msg = '......' + msg.substr(index-count)
        }
        return msg.replace(new RegExp(highLightStr, 'gi'), `<span style="color: #ECC184">$&</span>`)
      },
     onCancel() {
      if (this.searchInput) {
        this.searchInput = "";
        this.$refs.searchInput.focus()
      } else {
         this.$router.go(-1)
      }
    },
    onSearch() {
        this.fetchList(true)
    },
    loadMore() {
        console.log("loadMore")
      let { isLoading = false, total = -1, list = [] } = this.dataList;
      if (!isLoading && total === -1 && list.length) {
        this.fetchList();
      } else {
        // this.$refs.loadmore.onBottomLoaded()
      }
    },
    // 拉起列表数据
    fetchList(isReset = false) {
      let content = this.dataList;
      let { isLoading = false, list = [], pageNum = 0, total = -1 } = content;
      if (!isReset && isLoading) {
        return Promise.reject(new MyError("不能重复请求", 1));
      } else if (!isReset && total !== -1) {
        return Promise.reject(new MyError("已经没有数据", 1));
      } else {
        if (isReset) {
          list = [];
          pageNum = 0;
          Object.assign(content, { list: [...list], pageNum, total: -1 });
        }
        content.isLoading = true;
        let pageSize = 15;
        return searchLearnReport({
          pageSize,
          pageNum: pageNum + 1,
          date: sessionStorage.reportDate || '',
          goodsName: this.searchInput
        })
          .then(res => {
            res = res.map(item => {
              item.goodsName = this.highLight(item.goodsName, this.searchInput)
              return item
            })
            let tempList = [...list, ...res];
            Object.assign(content, {
              list: tempList,
              pageNum: res.length ? pageNum + 1 : pageNum,
              total: res.length >= pageSize ? -1 : tempList.length,
              isLoading: false
            });
            return res;
          })
          .catch(err => {
            Toast(err);
            content.isLoading = false;
          });
      }
    }
  },
  mounted() {
    // this.fetchList(true);
  }
};
</script>
<style lang="less" scoped>
@import url("./learn-report.less");
section[id="container"] {
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  flex: 1;
  background: #f7f7f7;
  padding-top: 100px;
}
.search-box {
    width: 100%;
    display: flex;
    background: rgba(225, 225, 225, 1);
    padding: 14px 16px;
    box-sizing: border-box;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 5;
    form {
      flex: 1;
      box-sizing: border-box;
      padding-left: 56px;
      background: #fff;
      position: relative;
      border-radius: 8px;
      border: 1px solid rgba(239, 239, 239, 1);
      box-shadow: 0px 2px 0px 0px rgba(225, 225, 225, 0.5);
      i{
        position: absolute;
        left: 8px;
        top: 50%;
        width: 35px;
        height: 35px;
        transform: translate(0, -50%);
        color: #989898;
      }
      input {
        &::-webkit-search-cancel-button {
          display: none;
        }
        -webkit-appearance: none;
        width: 100%;
        height: 60px;
        opacity: 1;
        background: rgba(255, 255, 255, 1);
        border: none;
        font-size: 30px;
        line-height: 32px;
        color: rgba(54, 54, 54, 1);
        font-weight: 500;
        margin-right: 20px;
      }
    }

    button {
      width: 140px;
      background: transparent;
      border: none;
      font-size: 32px;
      line-height: 34px;
      color: green;
    }
}

</style>
