<template>
  <li>
    <div>
      <h5 class="ellipsis_1">{{item.taskDesc}}</h5>
      <p>{{item.updateTime}}</p>
    </div>
    <button><span>+{{item.energyValue}}</span></button>
  </li>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
<style lang="less" scoped>
li {
  display: flex;
  align-items: center;
  padding: 34px 0;
  & > div {
    flex: 1;
    margin-right: 20px;
    width: 0;
    h5 {
      font-family: PingFangSC-Regular;
      font-size: 32px;
      color: #515666;
      letter-spacing: 0;
      height: 46px;
      line-height: 46px;
      margin-bottom: 8px;
      max-width: 80%;
    }
    p {
      font-family: PingFangSC-Regular;
      font-size: 24px;
      color: #a0a3af;
      letter-spacing: 0;
      height: 32px;
      line-height: 32px;
    }
  }
  button {
    border: none;
    background: none;
    span {
      font-family: PingFangSC-Medium;
      font-size: 36px;
      color: #20c472;
      letter-spacing: 0;
      text-align: right;
      height: 50px;
      line-height: 50px;
    }
  }
}
</style>
