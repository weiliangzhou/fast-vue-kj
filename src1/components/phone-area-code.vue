<!--  -->
<template>
  <div
    class="area_code_one"
  ><div @click="setAreaCodeChooseIsShow(true)"><span>+{{currentValue}}</span> <i class="iconfont icon-Pathx"></i></div>
    <actionsheet
      v-model="areaCodeChooseShow"
      :menus='areaCodeChooseList'
      @on-click-menu='areaCodeChoose'
      show-cancel
    >
      <p
        slot="header"
        v-html="`<h4>选择国家/地区</h4>`"
      >
      </p>
    </actionsheet>
  </div>
</template>
<script>
import { Actionsheet } from "vux";
import { areaCodes } from "@/conf/static";
// eslint-disable-next-line
let areaCodeChooseList = areaCodes.reduce((pre, { key, label }) => pre = [...pre, `${label} +${key}`], []);
let codes = areaCodes.map(({key}) => Number(key))
export default {
  name: "area-code",
  data() {
    return {
      areaCodeChooseList,
      areaCodeChooseShow: false // 控制区号选择器的显示与否
    };
  },
  model: {
    prop: "currentValue",
    event: "change"
  },
  props: {
    currentValue: [String, Number],
    isDisabled: {
      default: false
    }
  },
  components: {
    Actionsheet
  },

  computed: {},

  mounted() {},

  methods: {
    areaCodeChoose(index, menuItem) {
        if (index!=="cancel") {
            this.$emit("change", codes[index] || codes.shift())
        }
    },
    setAreaCodeChooseIsShow(isShow = false) {
      if (!this.isDisabled) {
        this.areaCodeChooseShow = !!isShow;
      }
    }
  }
};
</script>
<style lang='less' scoped>
.area_code_one {
  width: 185px;
  height: 48px;
  font-size: 34px;
  color: rgba(54, 54, 54, 1);
  line-height: 48px;
  flex: 1;
  & > div {
      width: 100%;
      height: 100%;
    span {
        float: left;
    }
    i {
        float: left;
        float: left;
        font-size: 16px;
        line-height: 44px;
        transform: scale(0.7);
    }
  }
}
</style>

<style>
.area_code_one .weui-actionsheet__menu {
  height: 50vh;
  overflow-x: hidden;
  overflow-y: scroll;
}
</style>
