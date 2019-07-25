<template>
    <footer class="tabs-container">
      <router-link to="/data-report" replace>
        <i class="iconfont icon-shujugaikuang"></i>
        <span>数据概况</span>
      </router-link>
      <router-link to="/learn-report" replace>
        <i class="iconfont icon-xuexishuju img1"></i>
        <span>学习数据</span>
      </router-link>
      <router-link to="/data-detail" replace>
        <i class="iconfont icon-shujuqushi"></i>
        <span>数据趋势</span>
      </router-link>
    </footer>
</template>
<script>
export default {
    
}
</script>
<style lang="less" scoped>
.tabs-container {
  height: 96px;
  display: flex;
  justify-content: space-around;
  box-sizing: content-box;
  background: rgba(251, 251, 251, 1);
  width: 100vw;
  border-radius: 6px;
  overflow: hidden;
  position: fixed;
  bottom: 0;
  right: 0;
  padding-top: 6px;
  & > a {
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    font-size: 22px;
    color: #c7c7c7;
    line-height: 30px;
    letter-spacing: 0.53px;
    span {
      margin-top: 10px;
    }
    i {
      font-size: 44px;
    }
  }
  .router-link-active {
    text-decoration: none;
    color: #D7B686;
  }
}
</style>
