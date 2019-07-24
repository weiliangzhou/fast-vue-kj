<template>
  <section id="agent-container">
    <ul class="header-container">
      <li
        class="test-tab"
        v-for="item in typesOption"
        :key="item.id"
      >
        <input type="radio" :id="item.id" name="test-radio" :value="item.value" v-model="active">
        <label :for="item.id">{{item.label}}</label>
      </li>
    </ul>
    <div class="column-flex">
      <online v-if="active==='online'"></online>
      <offline v-else></offline>
    </div>
  </section>
</template>

<script>
import offline from "./offline-order-list";
import online from "./online-order-list";
export default {
  components: {
      offline,
      online
  },
  data() {
    return {
      badge: 0,
      active: "online",
      routerFrom: "",
      currentLevel: "",
      typesOption: [
         { label: "线上订单", id: 2, value: "online" },
        { label: "线下订单", id: 1, value: "offline" }
      ],
    };
  },
  mounted() {
  },
  computed: {
  },
  methods: {
  },
  activated() {
  }
};
</script>
<style lang='less' scoped>
section[id="agent-container"] {
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: rgba(247, 247, 247, 1);
  height: 100%;
  padding-top: 90px;
  position: relative;
  .bottom-continer {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

.column-flex {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.header-container {
  display: flex;
  justify-content: space-around;
  background: rgba(255, 255, 255, 1);
  border-bottom: 1px solid rgb(218, 216, 216);
  padding: 20px 32px 0px;
  box-sizing: border-box;
  height: 90px;
  position: fixed;
  top: 0;
  width: 100vw;
  & > li {
    display: inline-block;
    position: relative;
    width: 33.3%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    label {
      display: inline-block;
      text-align: center;
      font-size: 32px;
      line-height: 50px;
      box-sizing: border-box;
      opacity: 1;
      font-weight: 400;
      color: rgba(101, 101, 101, 1);
      height: 100%;
    }
  }
  input {
    position: absolute;
    top: 0;
    right: 0;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border-width: 0;
    opacity: 0;
    &:checked ~ label {
      position: relative;
      display: inline-block;
      text-align: center;
      font-size: 32px;
      line-height: 34px;
      box-sizing: border-box;
      opacity: 1;
      line-height: 50px;
      font-weight: 600;
      color: rgba(50, 50, 50, 1);
      height: 100%;
      &:after {
        width: 52px;
        content: "";
        border-radius: 10px;
        display: block;
        position: absolute;
        right: 50%;
        transform: translate(50%, 0); /* 使用css3的transform来实现 */
        height: 4px;
        background: #D7B686;
        bottom: 1px;
      }
    }
  }
}

.static-container {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .bar-container {
    margin: 20px 0;
    border-radius: 12px;
    background: rgba(255, 255, 255, 1);
    padding: 32px;
    ul {
      margin-bottom: 20px;
      h5 {
        height: 37px;
        opacity: 1;
        font-size: 26px;
        font-family: PingFangSC;
        color: rgba(54, 54, 54, 1);
        line-height: 37px;
        margin-left: 26px;
        margin-bottom: 6px;
      }
      li {
        margin-bottom: 16px;
        height: 34px;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}
.bar-item {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  & > div {
    flex: 1;
    display: flex;
    height: 100%;
    background: rgba(153, 153, 153, 0.3);
  }
  & > span {
      width: 230px;
      height: 100%;
      opacity: 1;
      font-size: 24px;
      font-family: PingFangSC;
      color: rgba(152, 152, 152, 1);
      line-height: 33px;
      margin-left: 12px;
  }
}
}
</style>

<style>
.page-tabbar-tab-container >>> .mint-tab-container-wrap {
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>
