<!--  -->
<template>
    <div class="list-container">
      <ul
      v-show="list.length"
        v-infinite-scroll="loadBottom"
        infinite-scroll-disabled="scrollDisabled"
        :infinite-scroll-immediate-check="true"
        infinite-scroll-distance="10"
      >
          <li
            v-for="(item, index) in list"
            :key="index"
          >
          <div class="img-container">
            <img :src="item.saleUser.avatar || 'https://img.mall.xc2018.com.cn/mall/upload/20190513/140756_99_gxee.png'">
            <div v-if="type=='agent'" :style="item.saleUser.isActive?'background:rgba(85,177,79,1);':''"><span>{{["未激活", "已激活"][item.saleUser.isActive]}}</span></div>
          </div>
            <div class="user-Info">
              <h5  class="ellipsis_1">{{item.saleUser.nickName || item.saleUser.userName}}</h5>
              <span>{{item.saleUser.agentLevel | LevelToName}}</span>
              <p>{{item.saleUser.cellPhone}}</p>
            </div>
            <div style="flex: 1;"></div>
            <div class="other-info">
              <p class="ellipsis_1">推广人：{{item.saleReferrerAsk.pushRealName}} {{item.saleReferrerAsk.pushLevel | LevelToName}}</p>
              <span>{{item.saleReferrerAsk.pushPhone}}</span>
              <div  v-if="type=='agent' && item.saleReferrerAsk.acceptState === 2" class="button-group">
                <button @click="rejectAgent(item)">拒绝</button>
                <button @click="resolveAgent(item)">同意</button>
              </div>
               <div  v-else class="button-group">
                <button style="color: rgba(152,152,152,1);border-bottom: none;">已{{["拒绝", "同意"][item.saleReferrerAsk.acceptState]}}</button>
              </div>
            </div>
          </li>
          <p v-show="total!==-1">没有更多</p>
      </ul>
      <no-more v-show="list.length === 0"></no-more>
    </div>
</template>
<script>
export default {
  name: "gent-list",
  props: {
    type: {
        type: String,
        default: "agent"
    },
    total: {
        type: Number,
        default: -1,
    },
    list: {
        type: Array,
        default: () => []
    },
    scrollDisabled: {
        type: Boolean,
        default: false
    }
  },
  methods: {
    backToAgent() {
      this.$router.replace({name: "agent", replace: true})
    },
    loadBottom() {
      this.$emit('loadBottom')
    },
    resolveAgent({saleUser = {}, saleReferrerAsk = {}} = {}) {
      //  disposeReferrer({askId: item.id, acceptState: 1}).then(res => {

      // })
      let { id: askId, referrerLevel = "", pushPhone = "", } = saleReferrerAsk;
      let { nickName, cellPhone = "", uid } = saleUser;
        this.$router.push({
          name: "resolve-agent",
          query: { askId, nickName, cellPhone, referrerLevel, referrerPhone: pushPhone, uid }
        });
    },
    rejectAgent({saleUser = {}, saleReferrerAsk = {}} = {}) {
     this.$emit("rejectAgent", saleReferrerAsk.id)
    }
  },
};
</script>
<style lang='less' scoped>
    .list-container {
      background: #fff;
      flex: 1;
      display: flex;
      position: relative;
      ul{
        flex: 1;
        width: 100%;
        min-height: 100%;
        margin-bottom: 20px;
        height: 100%;
        position: absolute;
      li {
        display: flex;
        padding: 22px 32px 12px;
        box-sizing: border-box;

        border-bottom: 2px solid rgba(224, 224, 224, 1);
        & > :last-child {
          border-bottom: none;
        }
        .img-container{
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
            background: rgba(152,152,152,1);
            margin-top: 12px;
            border-radius: 8px;
           span {
            opacity: 1;
            font-size: 22px;
            line-height: 24px;
            color: rgba(255,255,255,1);
            overflow: hidden;
            white-space:nowrap;
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
        .user-Info {
          display: flex;
          flex: 6;
           & > h5 {
          }
          p {
            color: rgba(152,152,152,1);
          }
          span {
            margin: 4px 0 12px;
            color: rgba(101,101,101,1);
          }
        }
        .other-info {
          align-items: flex-end;
          max-width: 50%;
          & > h5 {
            width: 90%;
          }
          & > p{
            color: rgba(152,152,152,1);
          }
          & > span {
            text-align: right;
            margin: 12px 0 10px;
            color: rgba(152,152,152,1);
          }
          .button-group{
            &>button {
              // background: linear-gradient(
              //   left,
              //   rgba(247, 129, 96, 1),
              //   rgba(250, 63, 67, 1)
              // );
              border: none;
              background: none;
              height: 44px;
              font-size: 26px;
              font-weight: Regular;
              color: rgba(199,0,10,1);
              line-height: 37px;
              letter-spacing: 0.42px;
              border-bottom: 2px solid  rgba(199,0,10,1);
              &:last-child {
                margin-left: 20px;
              }
            }
          }
          &> button {
             border: none;
              background: none;
              height: 44px;
              font-size: 26px;
              color: rgba(152,152,152,1);
              line-height: 37px;
              letter-spacing: 0.42px;
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

</style>
