import { phoneValidate } from '@/global';
export const validataFun = (state, type) => {
    let value = state.inputObj[type]
    const _this = state
    let options = {
      name: () => {
        let tips = ""
        if (!value) {
          tips = "姓名不能为空"
        }
        _this.validate[type] = tips
      },
      phone: () => {
        let tips = ""
        if (!value) {
          tips = "号码不能为空"
        } else if (!phoneValidate(state.inputObj["areaCode"], value)) {
          tips = "号码格式不对"
        }
      
        _this.validate[type] = tips
      },
      serialNum: () => {
        let tips = ""
        if (!value) {
          tips = "流水号不能为空"
        } 
        _this.validate[type] = tips
      },
      productId: () => {
        let tips = ""
        if (!value) {
          tips = "商品SKU不能为空"
        }
        _this.validate[type] = tips
      },
      serialImg: () => {
        let tips = ""
        if (!value) {
          tips = "打款凭证不能为空"
        }
        _this.validate[type] = tips
      },
      goodsId: () => {
        let tips = ""
        if (!value) {
          tips = "商品编号不能为空"
        }
        _this.validate[type] = tips
      },
      serialType: () => {
        let tips = ""
        if (!value) {
          tips = "请选择打款方式"
        }
        _this.validate[type] = tips
      },
    }
    options[type] && options[type]()
  }