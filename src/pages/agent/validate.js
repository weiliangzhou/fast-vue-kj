import { phoneValidate } from '@/global';
export const validataFun = (state, type) => {
    let value = state.inputObj[type]
    const _this = state
    let options = {
      userName: () => {
        let tips = ""
        if (!value) {
          tips = "姓名不能为空"
        } else if (value.length < 2) {
          tips = "姓名不能少于2个"
        }
        _this.validate[type] = tips
      },
      address: () => {
        let tips = ""
        if (!value) {
          tips = "城市不能为空"
        }
        _this.validate[type] = tips
      },
      cardType: () => {
        let tips = ""
        if (!value) {
          tips = "卡类型不能为空"
        }
        _this.validate[type] = tips
      },
      cellPhone: () => {
        let tips = ""
        if (!value) {
          tips = "号码不能为空"
        } else if (!phoneValidate(state.inputObj["areaCode"], value)) {
          tips = "号码格式不对"
        }
        _this.validate[type] = tips
      },
      cardNum: () => {
        let tips = ""
        if (!value) {
          tips = "卡数不能为空"
        } else if (!/^(0|([1-9][0-9]*))$/.test(""+value)) {
          tips = "卡数只能为数字"
        } else if (_this.cardRes < value) {
          tips = "卡数不足"
        }
        _this.validate[type] = tips
      },
      saleCardNum: () => {
        let tips = ""
        if (!value) {
          tips = "卡数不能为空"
        } else if (!/^(0|([1-9][0-9]*))$/.test(""+value)) {
          tips = "卡数只能为数字"
        } else if (_this.cardRes < value) {
          tips = "卡数不足"
        }
        _this.validate[type] = tips
      },
      referrerPhone: () => {
        let tips = ""
        // if (value&&!/^[1][0-9]{10}$/.test(value)) {
        //   tips = "引荐号码格式不对"
        // }
        _this.validate[type] = tips
      },
      agentLevel: () => {
        let tips = ""
        if (!value) {
          tips = "分销不能为空"
        }
        _this.validate[type] = tips
      },
      province: () => {
        let tips = ""
        if (!value) {
          tips = "省份不能为空"
        }
        _this.validate[type] = tips
      },
      city: () => {
        let tips = ""
        if (!value) {
          tips = "市区不能为空"
        }
        _this.validate[type] = tips
      },
      prefecture: () => {
        let tips = ""
        if (!value) {
          tips = "县区不能为空"
        }
        _this.validate[type] = tips
      },
      remittanceImg: () => {
        let tips = ""
        if (!value) {
          tips = "凭证截图不能为空"
        }
        _this.validate[type] = tips
      },
      agentId: () => {
        let tips = ""
        if (!value) {
          tips = "补卡对象不能为空"
        }
        _this.validate[type] = tips
      },
      btId: () => {
        let tips = ""
        if (!value) {
          tips = "必须选个权益包"
        }
        _this.validate[type] = tips
      },
    }
    options[type] && options[type]()
  }
