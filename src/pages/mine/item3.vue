<template>
  <li>
    <div>
      <h5 class="ellipsis_1"><span>提币数量</span><span>{{item.moneyDesc}}</span></h5>
      <p>{{item.createTime}}</p>
    </div>
    <button><span>查询结果</span></button>
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
      & > span:first-of-type {
        ont-family: PingFangSC-Regular;
        font-size: 28px;
        color: #797e8b;
        letter-spacing: 0;
        height: 40px;
        line-height: 40px;
        margin-right: 20px;
      }
      & > span:last-of-type {
        font-family: PingFangSC-Medium;
        font-size: 28px;
        color: #515666;
        letter-spacing: 0;
        height: 40px;
        line-height: 40px;
      }
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
      height: 40px;
      line-height: 40px;
      font-family: PingFangSC-Regular;
      font-size: 28px;
      color: #3b6ef1;
      letter-spacing: 0;
    }
  }
}
</style>
