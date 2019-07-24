import {
    dataFormat,
    LevelToName,
    shadowPhoneOfMiddle,
    Yuan,
    TimeFormat
} from './dateformat';
import Vue from 'vue';
Vue.filter('TimeFormat', TimeFormat);
Vue.filter('Yuan', Yuan);
Vue.filter('dataFormat', dataFormat);
Vue.filter('LevelToName', LevelToName);
Vue.filter('shadowPhoneOfMiddle', shadowPhoneOfMiddle);
