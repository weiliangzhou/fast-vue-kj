<!-- 订单列表顶部切换栏组件 -->
<template>
    <div id="topbar">
        <ul>
            <li v-for='(item, k) in arr' :key="k" :value="item" class="tabbar-list" :class="{'active': index==k}" @click="changeIndex(k)">
                <span>{{item}}</span>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
        }
    },
    props: ['arr', 'index', 'change'],
    components: {},

    computed: {},

    mounted() { },

    methods: {
        changeIndex(k) {
            this.$emit('check', k)
        }
    }
}

</script>
<style lang='less' scoped>
#topbar {
  position: fixed;
  width: 100%;
  height: 80px;
  overflow: hidden;
  z-index: 3;
  top: 90px;
  ul {
    display: flex;
    justify-content: space-between;
    background: #fff;
    padding: 0 5%;
    li {
      line-height: 70px;
      color: #656565;
      text-align: center;
      font-size: 32px;
    }
    .active {
      color: #323232;
      &:after {
        display: block;
        content: "";
        width: 52px;
        height: 8px;
        margin: 0 auto;
        background: #D7B686;
        border-radius: 8px;
        overflow: hidden;
      }
    }
  }
}
</style>
