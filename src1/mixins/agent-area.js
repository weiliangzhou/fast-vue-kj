import { ChinaAddressV4Data, Value2nameFilter as value2name } from "vux";
export default {
    computed: {
        provinceLabel() {
            let province = this.inputObj.province
            if (province == '-1') {
              return "微谷省"
            } else if (province == '-2') {
              return "马来西亚省"
            } else {
              return value2name([""+this.inputObj.province], ChinaAddressV4Data) || "请选择--"
            }
        },
        cityLabel() {
            let province = this.inputObj.province
            if (province == '-1') {
              return "微谷市"
            } else if (province == '-2') {
              return "吉隆坡市"
            } else {
              return value2name([""+this.inputObj.city], ChinaAddressV4Data) || this.province || "请选择--"
            }
        },
        prefectureLabel() {
            let province = this.inputObj.province
             if (province == '-1') {
              return "微谷" + this.inputObj.prefecture
            } else if (province == '-2') {
              return "吉隆坡区"
            } else {
            return value2name([""+this.inputObj.prefecture], ChinaAddressV4Data) || this.cityLabel
            }
        },
    }
  }
