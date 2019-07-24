
export const validataFun = (state, type) => {
    let value = state.inputObj[type]
    const _this = state
    let options = {
      realName: () => {
        let tips = ""
        if (!value) {
          tips = "姓名不能为空"
        } else if (value.length < 2) {
          tips = "姓名不能少于2个"
        }
        _this.validate[type] = tips
      },
      bankCity: () => {
        let tips = ""
        if (!value) {
          tips = "开户城市不能为空"
        }
        _this.validate[type] = tips
      },
      phone: () => {
        let tips = ""
        if (!value) {
          tips = "号码不能为空"
        }
        //  else if (!/^[1][0-9]{10}$/.test(value)) {
        //   tips = "号码格式不对"
        // }
        _this.validate[type] = tips
      },
      bankCard: () => {
        let tips = ""
        if (!value) {
          tips = "卡号不能为空"
        }
        _this.validate[type] = tips
      },
      identityCard: () => {
        let tips = ""
        if (!value) {
          tips = "身份证号不能为空"
        }
        _this.validate[type] = tips
      },
      bankType: () => {
        let tips = ""
        if (!value) {
          tips = "开户行不能为空"
        }
        _this.validate[type] = tips
      },
      bankBranck: () => {
        let tips = ""
        if (!value) {
          tips = "开户支行不能为空"
        }
        _this.validate[type] = tips
      },
    }
    options[type] && options[type]()
  }
