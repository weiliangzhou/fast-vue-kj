<!--  -->
<template>
  <section>
    <header v-if="type=='all'">
      <button @click="pushRoute('reward-messages')"><i class="iconfont icon-jiangliguizex"></i><label>奖励<span v-if="rewardBadge" class="badge">{{rewardBadge}}</span></label></button>
      <button @click="pushRoute('notice-messages')"><i class="iconfont icon-yaoqingjianglix"></i><label>通知<span v-if="noticeBadge" class="badge">{{noticeBadge}}</span></label></button>
    </header>
    <div class="list-container">
      <ul
        v-show="currentList.length"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="isLoading"
        :infinite-scroll-immediate-check="true"
        infinite-scroll-distance="10"
      >
        <li
          @click="readMessage(item)"
          v-for="item in currentList"
          :key="item.id"
        >
          <h5 :style="`${item.isRead? '' : 'color: #D7B686;;'  }`">{{item.title}}</h5>
          <span>{{item.createdAt | dataFormat }}</span>
          <p>{{item.message}}</p>
        </li>
      </ul>
       <no-more v-show="currentList.length === 0"></no-more>
    </div>
  </section>
</template>
<script>
// acceptCellPhone: "13336198875"
// acceptRealName: "微谷教育"
// acceptUid: 4
// createdAt: "2019-03-05 14:55:29"
// deleted: 0
// id: 1
// isRead: 0
// message: "测试测试车床前明月光，疑是地上霜，举头望明月，低头思故乡"
// messageType: 0
// title: "测试"
import { messageList as getMessageList, updateMessageIsRead, countMessageIsNotRead } from "@/api"
export default {
    props: {
        type: {
            type: String,
            default: "all"
        }
    },
  data() {
    return {
        rewardBadge: 0,
        noticeBadge: 0,
      messageList: {
        isLoading: false,
        list: [
        ],
        pageNum: 0,
        total: -1
      }
    };
  },

  components: {},

  computed: {
    currentList() {
      let { list = [] } = this["messageList"];
      return list;
    },
    isLoading() {
      let { isLoading, total } = this["messageList"];
      return isLoading || total !== -1;
    }
  },

  mounted() {
    let types = {
      all: "",
      reward: "1",
      notice: "0"
    }
    countMessageIsNotRead().then(({noticeNum, rewardNum, totalNum} = {}) => {
      Object.assign(this, {rewardBadge: rewardNum, noticeBadge: noticeNum})
    })
    getMessageList({ messageType: types[this.type] }).then(({ messageList = [], messageNum = 0 }) => {
      this.messageList.list = messageList
    })
  },

  methods: {
    loadMore() {
      let { isLoading = false, total = -1 } = this['messageList'];
      if (!isLoading && total === -1) {
        this.fetchList();
      }
    },
    readMessage({id, isRead, messageType = 0, flag = 0}) {
      if (!isRead) {
        updateMessageIsRead(id).then(res => {
          let types = {
            all: "",
            reward: "1",
            notice: "0"
          }
          getMessageList({ messageType: types[this.type] }).then(({ messageList = [], messageNum = 0 }) => {
            this.messageList.list = messageList
          })
          if (this.type == "all") {
            countMessageIsNotRead().then(({noticeNum, rewardNum, totalNum} = {}) => {
              Object.assign(this, {rewardBadge: rewardNum, noticeBadge: noticeNum})
            })
          }
        })
      }
      // let routes = [
      //   "", // 0

      // ]
      // if (messageType == 0) {
      //   this.$router.push({name: "referrer-record"})
      // } else {
      //   this.$router.push({name: "card-earnings", hash: "#referrer"})
      // }
    },
    // 拉起列表数据
    fetchList(isReset = false) {
      let content = this[this.courseType + "Course"];
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
        let pageSize = 10
        return getMessageList({
                pageSize,
                pageNum: pageNum + 1
              })
          .then(res => {
            let tempList = [...list, ...res];
            Object.assign(content, {
              list: tempList,
              pageNum: res.length ? pageNum + 1 : pageNum,
              total: res.length >= pageSize ? -1 : tempList.length,
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
section {
  display: flex;
  flex-direction: column;
  width: 100vw;
  min-height: 100vh;
  box-sizing: border-box;
  background: rgba(244, 244, 244, 1);
  header {
      width: 100%;
      display: flex;
      justify-content: space-around;
      background: rgba(255,255,255,1);
      height: 120px;
      padding: 26px 32px;
      box-sizing: border-box;
      margin-bottom: 20px;
      button {
          border: none;
          background: none;
          flex: 1;
           &:last-child {
          border-left: 1px solid rgba(224, 224, 224, 1); /*no*/
        }
         label {
                width: 70px;
                height: 48px;
                opacity: 1;
                font-size: 34px;
                font-family: PingFangSC;
                color: rgba(54,54,54,1);
                line-height: 48px;
                letter-spacing: 0.55px;
                position: relative;
                margin-left: 48px;
                font-weight: 600;
          }
          i {
              font-weight: 600;
              font-size: 48px;
          }
      }
  }
  .list-container {
    display: flex;
    flex: 1;
    position: relative;
    background: rgba(244, 244, 244, 1);
    box-sizing: border-box;
    flex-direction: column;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    ul {
      box-sizing: border-box;
      height: 0;
      flex: 1;
      // position: absolute;
      // padding-bottom: 24px;
      li {
        display: flex;
        flex-direction: column;
        padding: 24px 64px 24px 32px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 2px 3px 12px 0px rgba(217, 217, 217, 0.5);
        border-radius: 8px 8px 0 0;
        overflow: hidden;
        position: relative;
        // border-bottom: 1px solid rgba(224, 224, 224, 1); /*no*/
        h5 {
          height: 45px;
          opacity: 1;
          font-size: 32px;
          font-family: PingFangSC;
          // color: #D7B686;;
          line-height: 45px;
          letter-spacing: 0.52px;
        }
        & > span {
          height: 40px;
          opacity: 1;
          font-size: 28px;
          font-family: PingFangSC;
          color: rgba(152, 152, 152, 1);
          line-height: 40px;
          letter-spacing: 0.45px;
          margin: 2px 0 9px;
        }
        p {
          opacity: 1;
          font-size: 28px;
          font-family: PingFangSC;
          color: rgba(101, 101, 101, 1);
          line-height: 40px;
          letter-spacing: 0.45px;
        }
        &:after {
            margin: 0 32px;
            border-bottom: 1px solid rgba(224,224,224,1); /*no*/
            width: calc(100% - 64px);
            box-sizing: border-box;
            height: 0;
            left: 0;
            position: absolute;
            bottom: 0;
            display: block;
            content: "";
        }
        &:last-child {
            border-bottom: none; /*no*/
            &:after {
            display: none;
            content: "";
            }
        }
      }
    }
  }
  .badge {
  display: inline-block;
  text-align: center;
  background: #D7B686;
  color: #fff;
  font-size: 12px;/*no*/
  height: 16px;/*no*/
  line-height: 16px;/*no*/
  border-radius: 8px;/*no*/
  padding: 0 4px;/*no*/
  // background-clip: padding-box;
  vertical-align: middle;
  position: absolute;
  font-weight: 400;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
 // border: 1px solid rgba(197, 197, 197, 1); /*no*/
}

}
</style>
