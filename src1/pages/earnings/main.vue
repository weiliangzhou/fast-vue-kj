<!--  -->
<template>
  <section id="earnings-page-container">
    <header class="tabs-container">
      <router-link to="/statics-report/card" exact replace>
        <label for=""><span>售卡报表</span></label>
      </router-link>
      <router-link to="/statics-report/referrer" replace>
        <label for=""><span>托管报表</span></label>
      </router-link>
      <router-link to="/statics-report/statistic" replace>
        <label for=""><span>分销报表</span></label>
      </router-link>
    </header>
    <router-view></router-view>
  </section>
</template>
<script>
export default {
  data() {
    return {
      //    { label: "预估收益", key: "promise" },
      // { label: "售卡收益", key: "card" },
      // { label: "托管收益", key: "referrer" }
    };
  },
  computed: {},

  mounted() {},

  methods: {}
};
</script>

<style lang="less" scoped>
#earnings-page-container {
  width: 100vw;
  min-height: 100vh;
  // display: flex;
  flex-direction: column;
  box-sizing: border-box;
  // padding: 0 24px 0;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background: rgba(244, 244, 244, 1);
  align-items: center;
  position: relative;
  padding-top: 32px;
}
.tabs-container {
  display: flex;
  justify-content: space-around;
  background: rgba(255, 255, 255, 1);
  padding: 12px 0;
  box-sizing: content-box;
//   width: 100%;
  margin: 0 0 24px 0;
  border-radius: 6px;
  overflow: hidden;
  border-left: 32px solid rgba(244, 244, 244, 1);
  border-right: 32px solid rgba(244, 244, 244, 1);
  & > a {
    display: inline-block;
    position: relative;
    width: 33.3%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 56px;
    text-decoration: none;
    label {
      text-align: center;
      box-sizing: border-box;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      span {
        height: 40px;
        font-size: 28px;
        color: rgba(152, 152, 152, 1);
        line-height: 40px;
        letter-spacing: 0.34px;
        width: 100%;
      }
    }
  }
  .router-link-active {
    text-decoration: none;
    label {
      background: rgba(248, 248, 248, 1);
      span {
        font-weight: 600;
        height: 40px;
        opacity: 1;
        font-size: 28px;
        font-family: PingFangSC;
        color: rgba(50, 50, 50, 1);
        line-height: 40px;
        letter-spacing: 0.34px;
      }
    }
  }
}
</style>
