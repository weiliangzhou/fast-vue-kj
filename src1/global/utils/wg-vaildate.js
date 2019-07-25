import { areaCodes } from '@/conf/static';
// eslint-disable-next-line
const patternsObj = areaCodes.reduce((pre, { key, pattern }) => (pre[key] = pattern, pre), {});
export const phoneValidate = ((patterns = {}) => (areaCode, phone) =>
    !patterns[areaCode] || patterns[areaCode].test(phone))(patternsObj);
