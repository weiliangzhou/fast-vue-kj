import Vuex from 'vuex';
import Vue from 'vue';
import salesData from "./modules/salesData"
import reportFormsSearchData from "./modules/reportFormsSearchData"
Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    salesData,
    reportFormsSearchData
  }
});
