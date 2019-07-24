
<template>
  <footer class="flex-row flex-ar footer">
    <div @click="push">
      <!-- <img class="img1" src="../img/miaoshu2.png" alt="" /> -->
      <i class="iconfont icon-zhuangkuangmiaoshucopyx img1"></i>
      <span class="top">数据概况</span>
    </div>
    <div>
      <!-- <img class="img2" src="../img/data2.png" alt="" /> -->
      <i class="iconfont icon-wodeshujucopyx img2"></i>
      <span class="active top">数据趋势</span>
    </div>
  </footer>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    push() {
      this.$router.replace({ name: 'data-report' })
    }
  }
}
</script>

<style lang='less' scoped>
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 100px;
  background: #fff;
  border-top: 2px solid rgba(228, 228, 228, 1);
  padding-top: 8px;
  text-align: center;
  box-sizing: border-box;
  display: flex;
}
.footer div {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.footer .img1 {
  // display: block;
  // height: 38px;
  // width: 38px;
  font-size: 38px;
  color: #c7c7c7;
  //margin-bottom: 8px;
}
.footer .img2 {
  // display: block;
  // height: 37px;
  // width: 37px;
  font-size: 38px;
  background: #D7B686;
  -webkit-background-clip: text;
  color: transparent;
  //margin-bottom: 8px;
}
.top {
  margin-top: 6px;
}
.footer span {
  color: #989898;
}
.footer span.active {
  color: #D7B686;
}
</style>
