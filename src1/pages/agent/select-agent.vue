<!-- 引荐人的来选择要引荐的人 -->
<template>
  <section>
    <div class="search-box">
        <form
          action=""
          @submit.prevent="onSubmit"
        ><input
            type="search"
            autocomplete="off"
            v-model.trim="searchInput"
            placeholder="请输入手机号搜索"
            ref="searchInput"
          /></form><button @click="onCancel">取消</button>
      </div>
    <div class="list-container">
      <ul
        v-show="serchList.length"
        v-infinite-scroll="loadBottom"
        infinite-scroll-disabled="scrollDisabled"
        :infinite-scroll-immediate-check="true"
        infinite-scroll-distance="10"
      >
        <label
          v-for="(item) in serchList"
          :key="item.id"
          :for="item.id"
        >
          <li>
            <div class="img-container">
              <img :src="item.avatar || 'https://img.mall.xc2018.com.cn/mall/upload/20190513/140756_99_gxee.png'">
              <div
                :style="item.isActive?'background:rgba(85,177,79,1);':''"
              ><span>{{["未激活", "已激活"][item.isActive]}}</span></div>
            </div>
            <div class="user-Info">
              <h5>{{item.nickName || item.userName}}</h5>
              <span>{{item.agentLevel | LevelToName}}</span>
              <p>{{item.cellPhone}}</p>
            </div>
            <div style="flex: 1;"></div>
            <div class="input-container"> <input
              :id="item.id"
              type="radio"
              :value="item.id"
              v-model="agentSelected"
              name="classCity"
            /><span></span></div>
          </li>
        </label>
        <p v-show="listInfo.total!==-1">没有更多</p>
      </ul>
      <no-more v-show="serchList.length === 0"></no-more>
    </div>
    <button @click="selectedAction">确定</button>
  </section>
</template>

<script>
import { getMyDirectAgentList } from "@/api";
import { MyError } from "@/global"; 
/*
import { Indicator } from "mint-ui";
import { Toast, resolveTimeout } from "@/global"; // resolveTimeout, rejectTimeout  getObject, MyError
*/
export default {
  data() {
    return {
      agentSelected: "", // 选择引荐的代理id
      searchInput: "", // 搜索框里内容（暂时没有）
      listInfo: { // 待选的列表项
        isLoading: false,
        list: [],
        searchList: [],
        pageNum: 0,
        total: -1
      }
    };
  },
  computed: {
    serchList() {
      return this.listInfo.list;
    },
    scrollDisabled() {
      return this.listInfo.total !== -1 || this.listInfo.isLoading;
    }
  },

  mounted() {
     this.$nextTick().then(res => {
      this.clearAgent(this.type);
      this.fetchList();
    });
  },
  methods: {
     // 选择要引荐的人 保存在 sessionStorage 里
    selectedAction() {
      let currentItem = this.listInfo.list.find(item => item.id === this.agentSelected);
      if (currentItem) {
        let { uid } = currentItem;
        sessionStorage.setItem("agentId", uid)
         this.$router.go(-1)
      }
    },
    onSubmit() {
      sessionStorage.setItem("agentId", '')
      this.agentSelected = ''
      this.fetchList({isReset: true})
    },
    onCancel() {
      if (this.searchInput) {
        this.searchInput = "";
        this.$refs.searchInput.focus()
      } else {
         this.referrerSelectVisible = false;
      }
    },
    loadBottom() { // 加载更多
      let { isLoading = false, total = -1, list = [] } = this.listInfo;
      if (!isLoading && total === -1 && list.length) {
        this.fetchList({
          isSearch: this.isSearch,
          agentLevel: this.agentLevel,
          searchKey: this.searchInput,
          options: { startTime: this.startTime, endTime: this.endTime }
        });
      } else {
        // this.$refs.loadmore.onBottomLoaded()
      }
    },
     // 获取数据
    fetchList({ isReset = false } = {}) {
      let content = this.listInfo
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
        return getMyDirectAgentList({
          pageSize,
          pageNum: pageNum + 1,
          searchKey: this.searchInput,
          state: 1,
        })
          .then((res) => {
            let tempList = [...list, ...res];
            Object.assign(content, {
              list: tempList,
              pageNum: res.length ? pageNum + 1 : pageNum,
              total:
                res.length && res.length >= pageSize ? -1 : tempList.length,
              isLoading: false
            });
          })
          .catch(err => {
            content.isLoading = false;
            throw err;
          });
      }
    },
    clearAgent() {
      Object.assign(this.listInfo, {
        isLoading: false,
        list: [],
        searchList: [],
        pageNum: 0,
        total: -1
      });
    },
  },
  // activated() {
  //   this.$nextTick().then(res => {
  //     this.clearAgent(this.type);
  //     this.fetchList();
  //   });
  // }
};
</script>
<style lang='less' scoped>
section {
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;
  background: rgba(247, 247, 247, 1);
  &>button {
    margin: 0;
    padding: 32px auto 34px;
    border-width: 0;
    width: 100vw;
    font-size: 32px;
    background: #D7B686;
    line-height: 32px;
    height: 100px;
    box-sizing: border-box;
    color: #fff;
    border-radius: 0px;
    position: fixed;
    bottom: 0;
  }
}

.list-container {
  background: #fff;
  flex: 1;
  display: flex;
  position: relative;
  margin-top: 100px;
  // margin-top: 116px;
  // top: 0;
  // right: 0;
  // background: red;
  margin-bottom: 100px;
  ul {
    flex: 1;
    width: 100%;
    min-height: 100%;
    margin-bottom: 20px;
    height: 100%;
    // top: 0;
    // right: 0;
    // position: absolute;
    label {
      li {
        display: flex;
        padding: 22px 32px 12px;
        box-sizing: border-box;
        align-items: center;
        border-bottom: 2px solid rgba(224, 224, 224, 1);
        & > :last-child {
          border-bottom: none;
        }
        .img-container {
          display: flex;
          flex-direction: column;
          margin-right: 16px;
          div {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 5px 5px;
            text-align: center;
            box-sizing: content-box;
            background: rgba(152, 152, 152, 1);
            margin-top: 12px;
            border-radius: 8px;
            span {
              opacity: 1;
              font-size: 22px;
              line-height: 24px;
              color: rgba(255, 255, 255, 1);
              overflow: hidden;
            }
          }
          img {
            display: block;
            width: 88px;
            height: 88px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 50%;
            overflow: hidden;
          }
        }

        & > div {
          display: flex;
          flex-direction: column;
        }

        .input-container{
            position: relative;
              & > input[type="radio"] {
                width: 40px;
                height: 40px;
                opacity: 0;
                }

                span {
                position: absolute;
                right: 0;
                top: 0;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: 1px solid #999;/*no*/
                box-sizing: border-box;
                }

                input:checked + span {
                background-color: rgba(199,0,10,1);
                border: 1px solid rgba(199,0,10,1);/*no*/
                box-sizing: border-box;
                }

                input:checked + span::after {
                position: absolute;
                content: "";
                width: 10px;
                height: 20px;
                top: 3px;
                left: 9px;
                border: 4px solid #fff;
                border-top: none;
                border-left: none;
                transform: rotate(45deg);
                }
        }
      }
    }
      & > p {
          margin: 16px 0 0;
          font-size: 28px;
          text-align: center;
        }
  }
}

.search-box {
    width: 100%;
    display: flex;
    background: rgba(225, 225, 225, 1);
    padding: 14px 16px;
    overflow: hidden;
    box-sizing: border-box;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1;
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
</style>
