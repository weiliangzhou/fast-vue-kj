import { axios, getObject, phoneValidate, MyError, getUserInfo, setUserInfo } from '@/global';
import { LevelToName } from "@/filters/dateformat"

// 缓存一个Promise  此处代码位置尽量不要动
const cachePromise = (PrmiseFun, initValue = () => null, setStore = () => null) => {
    let inited = initValue()
    if (inited) {
        inited = Promise.resolve(inited)
    }
    let temp = inited;
    let result = inited;
     return (isReset = false) => {
         if (isReset) {
            temp = null;
            result = null;
         }
      let { token } = getUserInfo();
      if (!token) {
        return Promise.reject(new Error("no login"))
      } else if (result) {
          return result;
      } else if (temp) {
        return temp
      } else {
        temp = PrmiseFun().then(res => {
          result = Promise.resolve(res);
          temp = null;
          setStore(res)
            return res
          }).catch(err => {
            temp = null;
            throw err;
          })
          return temp;
      }
    }
}

// 用户登录
const loginApi = (data) => {
    return axios.request({
        url: '/api/auth/phoneMsgLogin',
        method: 'post',
        data
    })
};

// 获取验证码
const sendMsgCode = (data) => {
    return axios.request({
        url: '/api/auth/sentVerifyCode',
        method: 'get',
        data
    });
};

// 获取我的上级以及推广人
const getMyReferrer = () => {
    return axios
        .request({
            url: '/api/user/getMyReferrer',
            method: 'post',
            data: {}
        })
        .then(res => {
            // 重组下返回值， 将saleUser的 levelName 从顶层对象移下去
            let { saleUser = {}, levelName, referrerUser = {} } = res;
            saleUser.levelName = levelName;
            return {saleUserInfo: saleUser, referrerInfo: referrerUser};
        });
};
// 获取首页上的个人信息
const getMyInfo = () => {
    return axios
        .request({
            url: '/api/user/getHomeInfo',
            method: 'post',
            data: {}
        })
        .then(res => {
            // 重组返回值， 将levelName 放下去
            let { user, ...options } = res;
            let { saleUser, levelName } = user;
            return { ...options, user: { ...saleUser, levelName } };
        });
};
/**
 * @description  获取某个人的直属代理人级别以及对应的人数（统计）
 * @param { userId: String } 用户Id 有就是获取指明的人的，没有就是获取当前用户的
 *
 * @returns Promise<[] levelOptions>
 */
const getMyDirectAgentNum = ({ userId="" } = {}) => {
    return axios.request({
        url: '/api/user/getMyDirectAgentNum',
        method: 'get',
        data: {
            uid: userId || undefined
        }
    });
};

/**
 *
 * @param {Object} 其他过滤参数条件
 * @param {Boolean} returnSource 是否直接返回原对象
 */
const getMyDirectAgentList = ({
    agentLevel = '',
    startTime = '',
    endTime = '',
    pageSize = 10,
    pageNum = 1,
    userId = "",
    searchKey = "",
    state = ""
}, returnSource = false) => {
    let url = agentLevel == "-1" ? 'api/user/userReferrer/findSaleUserReferrerListByUid' : '/api/user/getMyDirectAgentList';
    agentLevel = agentLevel == "-1" ? "" : agentLevel;
    return axios
        .request({
            url,
            method: 'get',
            data: {
                agentLevel: agentLevel || undefined,
                startTime: startTime || undefined,
                endTime: endTime || undefined,
                pageSize: pageSize || undefined,
                pageNum: pageNum || undefined,
                uid: userId || undefined,
                phone: searchKey || undefined,
                state: state || undefined
            }
        })
        .then(res => {
            if (url == 'api/user/userReferrer/findSaleUserReferrerListByUid') {
                if (returnSource) {
                    return res;
                }
                res = res && res.items ? res.items : []
            }
            if (!res) {
                res = []
            }
            return res.map(({ saleUser, referrerUser: { realName, nickName, cellPhone: referrerPhone = "" } = {}, ...resetOptions }) => {
                return { ...resetOptions, ...saleUser, referrerPhone, referrerNickName: realName || nickName || "", isIntroduced: url == 'api/user/userReferrer/findSaleUserReferrerListByUid' };
            })
        }
        )
};

/**
 * @description 查找我的直属vip, 新增vip时选做推荐人用
 * @param {searchKey: String} 过滤条件 手机号 支持模糊查询
 */
const findMyVip = ({
    searchKey = "",
}) => {
    let url = "api/user/findMyVip";
    return axios
        .request({
            url,
            method: 'get',
            data: {
                phone: searchKey || undefined,
            }
        })
};

export const captchaStart = (data = {}) => {
    return axios.request({
        url: '/api/auth/captcha_start',
        method: 'get',
        data: {
            ...data
        }
    })
}

/**
 * @description 查找我的直属团队, 新增团队时选做推荐人用
 * @param {searchKey: String} 过滤条件 手机号 支持模糊查询
 */
const findMyTeamAgent = ({
    searchKey = "",
}) => {
    let url = "/api/user/findMyTeamAgent";
    return axios
        .request({
            url,
            method: 'get',
            data: {
                phone: searchKey || undefined,
            }
        })
};
/**
 * @description 查询新增或补卡对应的级别和卡数信息 新增vip 代理的时候用
 * @param {agentId: String} 补卡的时候用， 有这参数就是补卡， 没有就是新增
 */
const getLevelList = ({ agentId = '' }) => {
    return axios.request({
        url: '/api/user/getLevelList',
        method: 'get',
        data: {
            agentId: agentId || undefined
        }
    });
};

/**
 * @description 查询当前用户的个人排名
 */
const getMyRank = ({
    searchDate = ""
} = {}) => {
    let url = '/api/card/cardRank/getMyRank';
    return axios.request({
        url,
        method: 'get',
        data: {
            searchDate: searchDate || "2019-02"
        }
    }).then(({saleCardRankList = {}, saleGoodsRankListVo = {}}) => [saleCardRankList, saleGoodsRankListVo]);
};

/**
 * @description 猛虎团排行榜列表查询
 */
const findFierceTigerListDataPage = ({
    pageSize = 20,
    pageNum = 1,
}) => {
    return axios.request({
        url: "/api/goods/goodsRank/findFierceTigerListDataPage",
        method: 'get',
        data: {
            pageSize,
            pageNum,
        }
    })
};
/**
 * @description 普通排行榜列表查询
 */
const findRankListPage = ({
    level = '200',
    pageSize = 10,
    pageNum = 1,
    searchDate = "",
    type = 0
}) => {
    return axios.request({
        url: ["/api/card/cardRank/findSaleCardRankListPage", "/api/goods/goodsRank/findGoodsRankListDataPage"][Number(type) || 0],
        method: 'get',
        data: {
            level,
            pageSize,
            pageNum,
            searchDate: searchDate || "2019-02"
        }
    }).then(res => res.items);
};

/**
 * @description 小镇添加业务员,查找供应商
 */
const findUpSaleUserList = ({
    agentLevel = '',
    pageSize = 10,
    pageNum = 1,
    cellPhone = ""

}) => {
    let url = '/api/user/findUpSaleUserList';
    return axios.request({
        url,
        method: 'get',
        data: {
            agentLevel,
            pageSize,
            pageNum,
            cellPhone
        }
    }).then(res => res.items);
};

/**
 * @description 小镇添加业务员
 */
const addSalesman = options => {
    let url = '/api/user/addSalesman';
    let data = [
        'userName',
        'saleType',
        'cellPhone',
        'agentLevel',
        'saleCardNum',
        'remittanceImg',
        'saleCardNum',
        'agentId',
        'referrerPhone',
        "areaCode"
    ].reduce((prevalue, item) => {
        if (![''].includes(options[item])) {
            prevalue[item] = options[item];
        }
        return prevalue;
    }, {});
    if (!phoneValidate(data.areaCode, data.cellPhone)) {
        return Promise.reject(new MyError("号码格式不正确", 3))
     }
    return axios.request({
        url,
        method: 'get',
        data: {
            ...data,
        }
    });
};

/**
 * @description 新增或补卡对应的表单信息提交 新增vip、代理， 补卡的时候用
 * @param {agentId: String} 补卡的时候用， 有这参数就是补卡， 没有就是新增
 */
const addUser = options => {
    let url = options.agentId ? '/api/user/order/supplyCard' : '/api/user/add';
    let data = [
        'userName',
        'saleType',
        'cellPhone',
        'agentLevel',
        'province',
        'city',
        'prefecture',
        'address',
        'saleCardNum',
        'remittanceImg',
        'saleCardNum',
        'agentId',
        'referrerPhone',
        "areaCode",
        "cardType"
    ].reduce((prevalue, item) => {
        if (![''].includes(options[item])) {
            prevalue[item] = options[item];
        }
        return prevalue;
    }, {});
    if (!phoneValidate(data.areaCode, data.cellPhone)) {
        return Promise.reject(new MyError("号码格式不正确", 3))
     }
    return axios.request({
        url,
        method: 'get',
        data: {
            ...data,
            userType: options.agentId ? undefined : options.userType,
        }
    });
};

/**
 * @description 修改代理区域的接口
 * @param {'province', 'city', 'prefecture': String} 数字的字符串
 */
const updateAgentArea = options => {
    let url = '/api/user/improveAddress';
    let data = ['province', 'city', 'prefecture'].reduce((prevalue, item) => {
        if (![''].includes(options[item])) {
            prevalue[item] = options[item];
        }
        return prevalue;
    }, {});
    return axios.request({
        url,
        method: 'get',
        data
    });
};

// 查询保证金相关信息
const getCurrentUserDeposit = () => {
    return axios.request({
        url: '/api/agentDeposit/getCurrentUserDeposit',
        method: 'get',
        data: {}
    });
};

/**
 * @description 提交保证金表单接口
 */
const paymentDeposit = options => {
    let url = '/api/agentDeposit/paymentDeposit';
    let {serialNum: paymentNo = "", serialImg: paymentImg = "", serialType: paymentType = ""} = options;
    return axios.request({
        url,
        method: 'post',
        data: {
            paymentNo: paymentNo || undefined,
            paymentImg: paymentImg || undefined,
            paymentType: paymentType || undefined
        }
    });
};

/**
 * @description 查询猛虎团排行榜活动信息
 */
const findFierceTigerGoodsInfo = () => {
    return axios.request({
        url: '/api/goods/goodsRank/findFierceTigerGoodsInfo',
        method: 'post',
        data: {
        }
    });
};

/**
 * @description 获取代理区域接口
 */
const getAgentArea = () => {
    return axios.request({
        url: '/api/user/selectAddress',
        method: 'get',
        data: {}
    });
};

/**
 * @description 代下单表单提交接口
 */
const buyOffline = options => {
    let url = options.orderNo ? '/api/product_order/uploadProve' : '/api/product_order/placeOrder';
    let data = [
        'name',
        'phone',
        'serialNum',
        'serialImg',
        'productId',
        'goodsId',
        'serialType',
        'orderNo',
        "areaCode"
    ].reduce((prevalue, item) => {
        if (![''].includes(options[item])) {
            prevalue[item] = options[item];
        }
        return prevalue;
    }, {});
    if (!phoneValidate(data.areaCode, data.phone)) {
        return Promise.reject(new MyError("号码格式不正确", 3))
     }
    return axios.request({
        url,
        method: 'get',
        data
    });
};
/**
 * @description 获取充卡记录接口
 * @param {uid: String} 所要查询的用户uid
 */
const getRechargeRecord = ({
    uid = '',
    orderType = '',
    pageSize = 10,
    pageNum = 1
}) => {
    return axios.request({
        url: '/api/user/order/getCardOrderList',
        method: 'get',
        data: {
            agentId: uid || undefined,
            orderType: orderType || undefined,
            pageSize: pageSize || undefined,
            pageNum: pageNum || undefined
        }
    });
};

/**
 * @description 获取线下课程接口
 */
const findOfflineProductList = ({ pageSize = 10, pageNum = 1 }) => {
    return axios
        .request({
            url: '/api/product/findOfflineProductList',
            method: 'get',
            data: {
                pageSize: pageSize || undefined,
                pageNum: pageNum || undefined
            }
        })
        .then(({ items = [] }) => items);
};
/**
 * @description 获取线上课程接口
 */
const findOnlineProductList = ({ pageSize = 10, pageNum = 1 }) => {
    return axios
        .request({
            url: '/api/product/findOnlineProductList',
            method: 'get',
            data: {
                pageSize: pageSize || undefined,
                pageNum: pageNum || undefined
            }
        })
        .then(({ items = [] }) => items);
};

/**
 * @description 获取公司奖励打款记录接口
 */
const saleBillList = ({ pageSize = 10, pageNum = 1 }) => {
    return axios
        .request({
            url: '/api/user/saleBill/getMySaleBillList',
            method: 'get',
            data: {
                pageSize: pageSize || undefined,
                pageNum: pageNum || undefined
            }
        }).then(res => res.items || [])
};

/**
 * @description 获取订单基本信息接口， 补充打款凭证的时候用
 */
const getOrderBaseInfo = ({ orderNo = '' }) => {
    return axios
        .request({
            url: '/api/product_order/getOrderBaseInfo',
            method: 'get',
            data: {
                orderNo: orderNo || undefined
            }
        })
        .then(res => {
            let { name, orderNo, phone, price, goodsName } = res;
            return { name, orderNo, phone, price, title: goodsName };
        });
};

/**
 * @description 提交银行卡信息表单接口
 */
const addBankInfo = options => {
    let url = '/api/bankInfo/addBankInfo';
    let data = [
        "realName",
        "phone",
       "bankCard",
        "identityCard",
        "bankCity",
        "bankBranck",
        "bankType",
        "id"
    ].reduce((prevalue, item) => {
        if (!['', undefined].includes(options[item])) {
            prevalue[item] = options[item];
        }
        return prevalue;
    }, {});
    return axios.request({
        url,
        method: 'get',
        data
    });
};
/**
 * @description 完善信息表单提交接口
 */
const importUserInfo = options => {
    let url = '/api/user/importUserInfo';
    let data = [
        "idCardNum",
        "province",
        "prefecture",
        "detailAddress",
        "city",
        "phone",
        "realName",
        "idCardType"
    ].reduce((prevalue, item) => {
        if (![''].includes(options[item])) {
            prevalue[item] = options[item];
        }
        return prevalue;
    }, {});
    return axios.request({
        url,
        method: 'get',
        data
    });
};
/**
 * @description 检查是否已经激活接口
 */
const checkIsActive = cachePromise(() => {
    let url = '/api/user/checkIsActive';
    return axios.request({
        url,
        method: 'get',
        data: {}
    })
    // .then(res => {
    //     res.isActive = false;
    //     return res;
    // });
})
// , () => {
//     let temp = sessionStorage.getItem("checkIsActive")
//     return temp ? JSON.parse(temp) : null;
// }, item => {
//     sessionStorage.setItem("checkIsActive", JSON.stringify(item))
// });

/**
 * @description 获取我的（订单）收益统计
 */
const getOrderStatis = () => {
    let url = '/api/orderAllot/getOrderStatis';
    return axios.request({
        url,
        method: 'get',
        data: {}
    }).then(res => {
        let { dayMoneyDesc, monthMoneyDesc, historyDesc } = res;
         return { todayCount: dayMoneyDesc, monthCount: monthMoneyDesc, totalCount: historyDesc }
    });
};
/**
 * @description 获取我的（推广）收益统计
 */
const getExtendCardCount = () => {
    let url = '/api/user/cardRefAward/getCardRefAwardByCardNum';
    return axios.request({
        url,
        method: 'get',
        data: {}
    });
};

/**
 * @description 获取我的（售卡）收益统计
 */
const getCardStatis = () => {
    let url = '/api/user/order/getSaleCardCount';
    return axios.request({
        url,
        method: 'get',
        data: {}
    });
};

/**
 * @description 获取我的银行卡信息接口
 */
const getBankInfo = () => {
    let url = '/api/bankInfo/getBankInfo';
    return axios.request({
        url,
        method: 'get',
    });
};
/**
 * @description 获取我的订单（预估收益）列表
 */
const getAllCardOrderList = ({
    pageSize = 10,
    pageNum = 1,
    statsDate = ""
}) => {
    return axios.request({
        url: '/api/user/order/getAllCardOrderList',
        method: 'get',
        data: {
            pageSize: pageSize || undefined,
            pageNum: pageNum || undefined,
            statsDate: statsDate || undefined
        }
    }).then(res => {
        return res.map(item => Object.assign(getObject(item, ["userName", "levelName", "createdAt", ["cardNum", "count"], "id"]), {productName: "会员卡"}))
    });
};

/**
 * @description 获取我的售卡（收益）列表
 */

const findExtendCardOrderList = ({ pageSize = 10, pageNum = 1, statsDate }) => {
    let url = '/api/user/cardRefAward/findCardRefAwardListPage';
    return axios.request({
        url,
        method: 'get',
        data: {
            pageSize: pageSize || undefined,
            pageNum: pageNum || undefined,
            statsDate: statsDate || undefined
        }
    }).then(({items = []} = {}) => {
        return items.map(({cardNum: count = "",
        createdAt = "",
        produceLevel = 300,
        produceRealName: userName = "",
        id = 9}) => ({count, createdAt, id, userName, productName: "会员卡", levelName: LevelToName(produceLevel)}))
    });
};
/**
 * @description 获取我的预估（收益）列表
 */
const findOrderAllotList = ({ pageSize = 10, pageNum = 1, statsDate }) => {
    let url = '/api/orderAllot/findOrderAllotList';
    return axios.request({
        url,
        method: 'get',
        data: {
            pageSize: pageSize || undefined,
            pageNum: pageNum || undefined,
            statsDate: statsDate || undefined
        }
    }).then(({items = []} = {}) => {
        return items.map(item => getObject(item, ["userName", "productName", "levelName", "createdAt", ["moneyDesc", "count"], 'stateDesc', 'state', 'orderSn', 'money', "id"]))
    });
};

/**
 * @description 获取对应统计的 月份统计
 * @param { statsDate : string} 统计月份 如： 2019-05;
 * @param { url: String } 要统计对应类型的url接口地址
 */
const getMonthTotalMoney = ({ statsDate }, url) => {
    return axios.request({
        url,
        method: 'get',
        data: {
            statsDate: statsDate || undefined
        }
    })
};

/**
 * @description 获取待我处理的引荐列表
 */
const findPendingReferrerListByUid = ({ pageSize = 10, pageNum = 1 }) => {
    let url = '/api/user/referrerAsk/findPendingReferrerListByUid';
    return axios.request({
        url,
        method: 'get',
        data: {
            pageSize: pageSize || undefined,
            pageNum: pageNum || undefined,
        }
    }).then(res => {
        return res.items
    });
};

/**
 * @description 同意或拒绝引荐， 同意的时候要多长几个参数 acceptState --> 0 拒绝， acceptState --> 1 同意
 */
const disposeReferrer = ({ askId = "", remittanceImg = "", acceptState = 0, cardNum = "", cardType = "" }) => {
    let url = '/api/user/referrerAsk/disposeReferrer';
    return axios.request({
        url,
        method: 'post',
        data: {
            askId: askId || undefined,
            remittanceImg: remittanceImg || undefined,
            acceptState,
            cardNum: cardNum || undefined,
            cardType: cardType || undefined
        }
    }).then(
        res => res.items
    );
};

/**
 * @description 向上级引荐
 */
const requestReferrer = ({ agentId = "", agentLevel = "" }) => {
    let url = '/api/user/referrerAsk/requestReferrer';
    return axios.request({
        url,
        method: 'get',
        data: {
            referrerUid: agentId || undefined,
            referrerLevel: agentLevel || undefined,
        }
    })
};

/**
 * @description 获取对应等级的推荐上级
 */
const getRefUpSaleUserInfoVo = ({ level = "" }) => {
    let url = '/api/user/getRefUpSaleUserInfoVo';
    return axios.request({
        url,
        method: 'get',
        data: {
            level: level || undefined,
        }
    })
};
/**
 * @description  获取要推荐的人的信息（姓名， 手机号等）
 */
const getSaleUserInfoVo = ({ uid = "" }) => {
    let url = '/api/user/getSaleUserInfoVo';
    return axios.request({
        url,
        method: 'get',
        data: {
            uid: uid || undefined,
        }
    })
};
/**
 * @description  获取待处理的引荐人数
 */
const findPendingReferrerNumByUid = () => {
    let url = '/api/user/referrerAsk/findPendingReferrerNumByUid';
    return axios.request({
        url,
        method: 'get',
        data: {
        }
    })
};
// 查询我推荐记录
const findMyReferrerListByUid = ({
    acceptState = "",
    pageNum = 1,
    pageSize = 15,
}) => {
    let url = '/api/user/referrerAsk/findMyReferrerListByUid';
    return axios.request({
        url,
        method: 'get',
        data: {
            acceptState,
            pageNum,
            pageSize,
        }
    }).then(res => res.items)
};

// 修改未激活的用户信息（手机号， 姓名）
const updateUserInfo = ({
    agentId: uid = "",
    cellPhone = "",
    userName: realName = "",
    areaCode = ""
}) => {
    let url = '/api/user/updateUserInfo';
    if (!phoneValidate(areaCode, cellPhone)) {
        return Promise.reject(new MyError("号码格式不正确", 3))
    }
    return axios.request({
        url,
        method: 'get',
        data: {
            cellPhone: cellPhone || undefined,
            uid: uid || undefined,
            realName: realName || undefined,
            areaCode: areaCode || undefined,
        }
    })
};

// 获取个人信息， 设置页面用
const getSetUpInfoVo = () => {
    let url = '/api/user/getSetUpInfoVo';
    return axios.request({
        url,
        method: 'get',
        data: {
        }
    })
};
// 设置当前用户的名字
const updateSaleUser = ({realName}) => {
    let url = '/api/user/updateSaleUser';
    return axios.request({
        url,
        method: 'post',
        data: {
            realName: realName || undefined,
        }
    })
};

// 统计团队（城市）分布
const findAgencyRegionStatisticsVo = () => {
    let url = '/api/user/findAgencyRegionStatisticsVo';
    return axios.request({
        url,
        method: 'get',
        data: {
        }
    })
};

// 统计团队（人数）报表
const findAgentNumStatistics = () => {
    let url = '/api/user/findAgentNumStatistics';
    return axios.request({
        url,
        method: 'get',
        data: {
        }
    })
};

// 消息列表
const messageList = ({messageType = ""} = {}) => {
    let url = '/api/user/message/findMessageList';
    return axios.request({
        url,
        method: 'get',
        data: {
            messageType
        }
    })
};
// 标记列表已读
const updateMessageIsRead = (id) => {
    let url = '/api/user/message/updateMessageIsRead';
    return axios.request({
        url,
        method: 'get',
        data: { id }
    })
};
// 奖励发卡
const saleUserCard = ({ agentId, saleCardNum, remark }) => {
    let url = '/api/user/saleUserCard/rechargeSaleUserCard';
    return axios.request({
        url,
        method: 'post',
        data: {
            buyerUid: agentId || undefined,
            cardNum: saleCardNum || undefined,
            remark
        }
    })
};

// 刷新token
const refreshToken = cachePromise(() => {
    let { refreshToken = "", expiresAt = "" } = getUserInfo()
      if (refreshToken) {
          if (expiresAt&&(new Date(expiresAt.replace(/-/g, "/"))).getTime() - Date.now()>0) {
              return Promise.resolve("无需更新")
          }
        return axios.request({
            url: '/api/auth/refresh_token',
            method: 'get',
            data: { refreshToken }
        }).then(newUserInfo => {
            setUserInfo(newUserInfo)
        })
      } else {
          return Promise.reject(new MyError("请先登录", 3))
      }
});

// 消息数量
const countMessageIsNotRead = () => {
    let url = '/api/user/message/countMessageIsNotRead';
    return axios.request({
        url,
        method: 'post',
        data: {}
    })
};

// 获取订单统计
const countMyOrder = () => {
    let url = '/api/product_order/countMyOrder';
    return axios.request({
        url,
        method: 'post',
        data: {}
    })
};
// 获取所有订单（改版后）
const getAllOrder = ({ pageSize = 10, pageNum = 1 }) => {
    let url = '/api/product_order/findProductOrderListPage';
    return axios.request({
        url,
        method: 'get',
        data: {
            pageSize: pageSize || undefined,
            pageNum: pageNum || undefined,
        }
    }).then(res => {
        return res.items
    });
};

export {
    loginApi,
    sendMsgCode,
    getMyReferrer,
    getMyInfo,
    getMyDirectAgentList,
    getMyDirectAgentNum,
    getLevelList,
    addUser,
    getRechargeRecord,
    findOfflineProductList,
    findOnlineProductList,
    buyOffline,
    updateAgentArea,
    getAgentArea,
    saleBillList,
    getOrderBaseInfo,
    addBankInfo,
    getBankInfo,
    getOrderStatis,
    findOrderAllotList,
    getAllCardOrderList,
    getCardStatis,
    importUserInfo,
    checkIsActive,
    findPendingReferrerListByUid,
    disposeReferrer,
    requestReferrer,
    getRefUpSaleUserInfoVo,
    getSaleUserInfoVo,
    findPendingReferrerNumByUid,
    getMonthTotalMoney,
    findExtendCardOrderList,
    getExtendCardCount,
    findMyVip,
    findMyTeamAgent,
    paymentDeposit,
    getCurrentUserDeposit,
    findMyReferrerListByUid,
    updateUserInfo,
    getSetUpInfoVo,
    findAgencyRegionStatisticsVo,
    findAgentNumStatistics,
    addSalesman,
    findUpSaleUserList,
    findRankListPage,
    getMyRank,
    updateSaleUser,
    findFierceTigerListDataPage,
    findFierceTigerGoodsInfo,
    messageList,
    updateMessageIsRead,
    refreshToken,
    saleUserCard,
    countMessageIsNotRead,
    countMyOrder,
    getAllOrder
};

/*
withdraw api 提现相关的api
*/

// 账单列表
const findSaleUserBillList = ({year = "", pageSize = 15, pageNum = 1}) => {
    return axios.request({
        url: "/api/user/userBill/findSaleUserBillList",
        method: 'post',
        data: {
            year,
            pageSize,
            pageNum
        }
    }).then(res => res.items||[])
};

// 提现记录
const findSaleUserDrawList = ({year = "", pageSize = 15, pageNum = 1}) => {
    return axios.request({
        url: "/api/user/userDraw/findSaleUserDrawList",
        method: 'post',
        data: {
            year,
            pageSize,
            pageNum
        }
    }).then(res => res.items||[])
};
// 提现明细
const findSaleUserDrawDetail = (drawId) => {
    return axios.request({
        url: "/api/user/userDraw/findSaleUserDrawDetail",
        method: 'post',
        data: {
            drawId
        }
    })
};
// 提现申请
const rechargeSaleUserCard = (bills) => {
    return axios.request({
        url: "/api/userDraw/rechargeSaleUserCard",
        method: 'post',
        data: {
            bills: bills || []
        }
    })
};
// 提现申请
const addUserDraw = (bills) => {
    return axios.request({
        url: "/api/user/userDraw/addUserDraw",
        method: "post",
        data: {
            bills: bills || []
        }
    })
};
// 根据id或许提现详情
const getUserDrawInfo = (id) => {
    return axios.request({
        url: "/api/user/userDraw/getUserDrawInfo",
        data: {
            id
        }
    })
};

// 根据Id确认提现
const affirmUserDraw = (id) => {
    return axios.request({
        url: "/api/user/userDraw/affirmUserDraw",
        data: {
            id
        }
    })
};

// 获取提现页统计
const getUserWallet = () => {
    return axios.request({
        url: "/api/user/userBill/getUserBillVo",
        method: "get",
        data: {
        }
    })
};

// 获取弹框海报
const getSalePoster = cachePromise(() => {
    return axios.request({
        url: "/api/poster/getSalePoster",
        method: "get",
        data: {
        }
    }).then(res => {
        if (res&&res.id) {
            return res
        } else {
            throw new Error("没有数据")
        }
    })
});

export {
    findSaleUserDrawList,
    findSaleUserBillList,
    findSaleUserDrawDetail,
    rechargeSaleUserCard,
    addUserDraw,
    getUserDrawInfo,
    affirmUserDraw,
    getUserWallet,
    getSalePoster
}

// 我的权益包
const findMyVipBenefitList = ({pageSize = 15, pageNum = 1} = {}) => {
    return axios.request({
        url: "/api/benefit/findMyVipBenefitList",
        method: "get",
        data: {
            pageNum,
            pageSize
        }
    })
};

// 开通权益包
const createVipBenefit = ({agentId, btId, remittanceImg} = {}) => {
    return axios.request({
        url: "/api/benefit/createVipBenefit",
        method: "post",
        data: {
            buyUid: agentId || undefined,
            btId,
            remittanceImg
        }
    })
};

// 查询可购买权益包
const findEnableVipBenefitList = (uid) => {
    return axios.request({
        url: "/api/benefit/findEnableVipBenefitList",
        method: "get",
        data: {
            uid
        }
    })
};

// 查询已购权益包记录
const findVipBenefitOrderList = (uid) => {
    return axios.request({
        url: "/api/benefit/findVipBenefitOrderList",
        method: "get",
        data: {
            uid
        }
    })
};

// 获取售卡详情
const getCardOrderDetail = (id) => {
    return axios.request({
        url: "/api/user/order/getCardOrderDetail",
        method: "get",
        data: {
            id
        }
    })
};
// 获取订单（收益）详情
const getOrderDetailInfo = (orderSn) => {
    return axios.request({
        url: "/api/product_order/getOrderDetailInfo",
        method: "get",
        data: {
            orderSn
        }
    })
};

// 我的学习数据统计
const learnReport = ({ pageSize = 15, pageNum = 1, date, productType, orderBy, } = {}) => {
    return axios.request({
        url: "/api/studyReport/findStudyReportList",
        method: "get",
        data: {
            pageNum,
            pageSize,
            time: date,
            productType,
            orderBy
        }
    }).then(res => {
        return res.items || []
    })
    // return Promise.resolve(Array.from({ length: pageNum > 3 ? pageSize-1:pageSize }, (item, index) => ({id: (pageNum-1)*pageSize+index, rank: (pageNum-1)*pageSize+index+1, goodsName: "hello的水电费，hello士大夫撒是的发生发的啥地方萨芬", studyPeopleNum: 12, studyTime: 34, orderNum: 324, amount: 123244})))
};

// 我的学习搜索
const searchLearnReport = ({ pageSize = 15, pageNum = 1, date, goodsName, } = {}) => {
    return axios.request({
        url: "/api/studyReport/findStudyReportListByGoodsName",
        method: "get",
        data: {
            pageNum,
            pageSize,
            time: date,
            goodsName,
        }
    }).then(res => {
        return res.items || []
    })
    // return Promise.resolve(Array.from({ length: pageNum > 3 ? pageSize-1:pageSize }, (item, index) => ({id: (pageNum-1)*pageSize+index, rank: (pageNum-1)*pageSize+index+1, goodsName: "hello的水电费，hello士大夫撒是的发生发的啥地方萨芬", studyPeopleNum: 12, studyTime: 34, orderNum: 324, amount: 123244})))
};

// 学习总统计
const getStudyReportInfo = ({ date, productType, orderBy, } = {}) => {
    return axios.request({
        url: "/api/studyReport/getStudyReportInfo",
        method: "get",
        data: {
            time: date,
            productType,
            orderBy
        }
    })
};
// 权益包详情(按月统计)
const getVipBenefitInfo = ({type, year, month}) => {
    // 1:分销开卡数详情 2:H5开爱看书详情 3:android开卡数详情 4:ios开卡数详情 5:350权益包详情
    return axios.request({
        url: "/api/datadivision/statistics/getVipBenefitInfo",
        method: "get",
        data: {
            type, year, month
        }
    })
}
export {
    findMyVipBenefitList,
    createVipBenefit,
    findEnableVipBenefitList,
    findVipBenefitOrderList,
    getCardOrderDetail,
    learnReport,
    searchLearnReport,
    getStudyReportInfo,
    getOrderDetailInfo,
    getVipBenefitInfo
}