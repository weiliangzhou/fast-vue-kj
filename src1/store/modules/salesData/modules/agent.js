import { getMyDirectAgentList, getMyDirectAgentNum } from "@/api";
import { MyError } from "@/global"; // resolveTimeout, rejectTimeout getObject, Toast
export default {
  namespaced: true,
  state: {
      agent: {
        type: "agent",
        agentLevel: "",
        userListInfo: {
          type: "agent",
            isSearch: false,
            isLoading: false,
            startTime: "",
            endTime: "",
            list: [],
            searchList: [],
            pageNum: 0,
            total: -1
          },
        selectOptions: []
      },
      agentUser: {
        type: "agentUser",
        agentLevel: "",
        userId: "",
        userListInfo: {
          type: "agentUser",
            isSearch: false,
            isLoading: false,
            startTime: "",
            endTime: "",
            list: [],
            searchList: [],
            pageNum: 0,
            total: -1,
          },
          selectOptions: []
      },
      searchAgent: {
        type: "searchAgent",
        agentLevel: "",
        userId: "",
        userListInfo: {
          type: "searchAgent",
            isSearch: false,
            isLoading: false,
            startTime: "",
            endTime: "",
            list: [],
            searchList: [],
            pageNum: 0,
            total: -1,
            showSearch: false,
          },
          selectOptions: []
      }
      
  },
  actions: {
    fetchAgentList(
        { state, dispatch },
        {
          userId = "",
          isReset = false,
          isSearch = false,
          options = {},
          type = "agent", // agent | agentUser,
          searchKey = ""
        } = {}
      ) {
        let orderKey = type;
        let content = state[orderKey].userListInfo
        let agentLevel = state[type].agentLevel;
        let {
            isLoading = false,
            list = [],
            pageNum = 0,
            total = -1,
          } = content;
          if (type === "agentUser") {
            userId = state[orderKey].userId
          }

          if (!isReset && isLoading) {
            return Promise.reject(new MyError("不能重复请求", 1));
          } else if (!isReset && total !== -1) {
            return Promise.reject(new MyError("已经没有数据", 1));
          } else {
            if (isReset) {
              pageNum = 0;
              total = -1;
              list = [];
              Object.assign(content, {
                list: [...list],
                pageNum,
                total: -1
              });
            }
            content.isLoading = true;
            let pageSize = 15;
            return getMyDirectAgentList({
                userId,
              pageSize,
              pageNum: pageNum + 1,
              agentLevel,
              ...options,
              searchKey: searchKey
            })
              .then(res => {
                let tempList = [...list, ...res];
                Object.assign(content, {
                  list: tempList,
                  pageNum: res.length ? pageNum + 1 : pageNum,
                  total: res.length&&res.length>=pageSize ? -1 : tempList.length, // 
                  isLoading: false
                });
              })
              .catch(err => {
                content.isLoading = false;
                throw err;
              });
          }  
      },
      fetchStatistics({ state, dispatch },
        {
          userId = "",
          isReset = false,
          type = "agent" // agent | agentUser
        } = {}) {
            let orderKey = type;
            if (type === "agentUser") {
              userId = state[orderKey].userId
            }
            getMyDirectAgentNum({userId}).then(res => {
                let options = res.map(item => {
                  item.percent = item.count / item.totalCount;
                  item.levelLabel = item.levelName + " " + item.count;
                  item.a = "1";
                  return item;
                });
                state[orderKey].selectOptions = [...options];
              });
      }
  },
  mutations: {
    setAgentUser (state, userId) {
        state.agentUser.userId = userId
    },
    clearAgentUser (state) {
        state.agentUser.userId = ""
    },
    clearAgent(state, type) {
      Object.assign(state[type].userListInfo, {
              isSearch: false,
              isLoading: false,
              startTime: "",
              endTime: "",
              list: [],
              searchList: [],
              pageNum: 0,
              total: -1
            });
    },
    setAgentLevel(state, {type, agentLevel= ""} = {}) {
      state[type].agentLevel = agentLevel
    },
    setSearchVisible(state, value = false) {
      let key = "agent"
      if (state.agentUser.userId) {
        key = "agentUser"
      }
      state[key].showSearch = value;
      if (value) {
        state[key].userListInfo.searchList = value;
      }
    }
  },
  getters: {
    agent: state => {
        return state.agent
      },
      agentUser: state => {
          return state.agentUser
      }
  }
  
}
