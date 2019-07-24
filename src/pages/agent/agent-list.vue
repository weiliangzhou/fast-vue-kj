<!-- 代理渲染列表 -->
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
          <div class="userInfo-container">
             <div class="img-container" @click="goPoster(item.isActive,item.uid)">
            <img :src="item.avatar || 'https://img.mall.xc2018.com.cn/mall/upload/20190513/140756_99_gxee.png'">
            <div v-if="type=='agent'" :style="item.isActive?'background:rgba(85,177,79,1);':''"><span>{{["未激活", "已激活"][item.isActive]}}</span></div>
          </div>
            <div class="user-Info">
              <h5 class="ellipsis_1" >{{item.realName || item.nickName || item.userName}}</h5>
              <span>{{item.agentLevel | LevelToName}}</span>
              <p>{{item.cellPhone}}</p>
            </div>
            <div style="flex: 1;"></div>
            <div class="other-info">
              <p class="ellipsis_1">{{item.createdAt | dataFormat}}</p>

               <div class="button-group">
                  <span class="span-text">团{{item.teamNum||0}}人&emsp;剩{{item.cardNum||0}}张</span>
                  <button  v-if="type=='agent'&&!item.isIntroduced" @click="agentOfUser(item.agentNum, item.uid, item.nickName)">分销{{item.agentNum||0}}人</button>
              </div>

              <div  v-if="type=='agent'&&!item.isIntroduced" class="button-group">
                 <button v-if="!item.isActive" @click="editAgentOfUser(item)">编辑</button>
                <button @click.stop="openInterest(item)">开权益</button>
                <button @click="addCard(2,item)">立即充卡</button>
              </div>
              <button v-else>分销{{item.agentNum}}人</button>
            </div>
          </div>
          <p v-if="shouldShowAddress" style="line-height: 1.2;">收货地址：{{item.addressDesc}}</p>
          </li>
          <p v-show="total!==-1">没有更多</p>
      </ul>
      <no-more v-show="list.length === 0"></no-more>
    </div>
</template>
<script>
import { checkIsActive } from "@/api";
import { Toast } from "@/global"; 
export default {
  name: "gent-list",
  props: {
    type: { // 类型 用来区别 是直属列 还是二级代理列表 直属列表会显示更多，能操作
        type: String,
        required: true
    },
    total: { // 总数
        type: Number,
        default: -1,
    },
    list: { // 数据列表
        type: Array,
        default: () => []
    },
    scrollDisabled: { // 是否能下拉加载更多
        type: Boolean,
        default: false
    },
    shouldShowAddress: { // 是否需要显示地址
      type: Boolean,
        default: true
    }
  },
  methods: {
     // 对未激活的人能点去海报页面
    goPoster(isActive = 0, userId) {
      if (this.type === "agent" && !isActive) {
       this.$router.push({
            name: "poster",
            hash: "#" + userId,
            query: { type: "agent-add" }
        })
      }
    },
     // 下拉加载事件
    loadBottom() {
      this.$emit('loadBottom')
    },
     // 进入二级分销页面
    agentOfUser(agentNum, userId, userName) {
      if (agentNum) {
        this.$router.push({
          name: "agent-user",
          params: { userId, userName }
        });
      }
    },
        // 开通权益
    openInterest({
        uid: agentId = "",
        referrerPhone = "",
        referrerNickName = "",
        areaCode = "",
        cellPhone = "",
        realName = "",
        nickName = ""
      } = {}) {
      this.$router.push({
        name: "open-interest",
        query: { agentId, referrerNickName, referrerPhone, areaCode, cellPhone, userName: realName || nickName }
      });
    },
    // 编辑未激活代理
    editAgentOfUser({isActive, cellPhone, uid: agentId, realName, nickName, areaCode = ""}) {
        if (this.type === "agent" && !isActive) {
       this.$router.push({
            name: "edit-agent",
            query: { cellPhone, agentId, realName: realName || nickName, areaCode }
        })
      }
    },
     // 充卡
    addCard(type = 0, {uid: userId = "", referrerPhone = "", referrerNickName: nickName = ""} = {}) {
      let query = { type };
      if (type == 2) {
        query.agentId = userId;
        query.referrerPhone = referrerPhone;
        query.nickName = nickName;
      }
       checkIsActive().then(res => {
          if (res.agentLevel > 200) {
            this.$router.push({
              name: "agent-add",
              query: { ...query }
            });
          } else {
          Toast('您的等级不支持充卡')
        }
        });
    }
  },
};
</script>
<style lang='less' scoped>
    .list-container {
      flex: 1;
      display: flex;
      position: relative;
      // top: 0;
      // right: 0;
      // background: red;
      ul{
        flex: 1;
        width: 100%;
        min-height: 100%;
        margin-bottom: 20px;
        height: 100%;
        // top: 0;
        // right: 0;
        // position: absolute;
        padding: 0 32px 12px;
        li {
           background: #fff;
        box-sizing: border-box;
        box-shadow: 1px 2px 6px 0px rgba(193,193,193,0.5); /* no */
        border-bottom: 2px solid rgba(224, 224, 224, 1);
        margin-bottom: 20px;
        padding: 22px 24px 24px;
        border-radius: 12px;
        overflow: hidden;
      .userInfo-container {
        display: flex;
        & > :last-child {
          border-bottom: none;
           margin-bottom: 0;
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
            font-size: 20px;
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
          justify-content: space-around;
        }
        .user-Info {
          display: flex;
          p {
            color: rgba(152,152,152,1);
          }
          span {
            margin: 4px 0 12px;
            color: rgba(101,101,101,1);
          }
          & > h5 {
            max-width: 180px;
          }
        }
        .other-info {
          align-items: flex-end;
          & > h5 {
          }
          & > p{
            color: rgba(152,152,152,1);
          }
          .span-text {
            text-align: right;
            // margin: 12px 0 10px;
            color: rgba(152,152,152,1);
            height: 44px;
              font-size: 26px;
              font-weight: Regular;
              // color: #DDA657;
              line-height: 37px;
              letter-spacing: 0.42px;
              position: relative;
              margin-right: 12px;
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
              color: #DDA657;
              line-height: 37px;
              letter-spacing: 0.42px;
              position: relative;
              margin-right: 12px;
              &:last-child {
                margin-right: 0;
              }
              &:after {
                content: "";
                display: block;
                position: absolute;
                 height: 1px; /* no */
                 background: #DDA657;
                 width: 100%;
                 right: 0;
                 bottom: 4px;
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
        margin: 20px 0 0;
        font-size: 24px;
        color: rgba(101,101,101,1);
        line-height: 26px;
        letter-spacing: 0.29px;
        padding: 23px 10px 0 0;
        border-top: 1px solid rgba(224, 224, 224, 1); /* no */
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
