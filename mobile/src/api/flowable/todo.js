import { http } from '@/utils/http';

// 查询待办任务列表
export function getTodoList(query) {
  return http.request({
    headers: {
      loading: false
    },
    url: '/flowable/task/todoList',
    method: 'get',
    params: query
  });
}

// 流程节点表单
export function flowTaskForm(query) {
  return http.request({
    url: '/flowable/task/flowTaskForm',
    method: 'get',
    params: query
  });
}

/**
 * 资金管理-获取资金提款详情
 * @param {} id
 * @returns
 */
export function getFundDrawInfo(id) {
  return http.request({
    url: '/fund/draw/' + id,
    method: 'get'
  });
}

/** 
根据字典类型查询字典数据信息
*/
export function getDicts(dictType) {
  return http.request({
    // headers: {
    //   loading: false,
    // },
    url: '/system/dict/data/type/' + dictType,
    method: 'get'
  });
}
/**
 * 资金管理-资金池查询
 * @param {*} id
 * @returns
 */
export function getFundPoolInfo(id) {
  return http.request({
    url: '/fund/pool/' + id,
    method: 'get'
  });
}

/**
 * 资金管理-资金还款
 * @param {*} id
 * @returns
 */
export function getFundPayInfo(id) {
  return http.request({
    url: '/fund/pay/' + id,
    method: 'get'
  });
}

// 查询合同详细
export function getContract(id) {
  return http.request({
    url: '/cont/' + id,
    method: 'get'
  });
}

// 查询客户基本信息列表
export function listInfo(query) {
  return http.request({
    url: '/cust/customer/list',
    method: 'get',
    params: query
  });
}

// 提交审核
export function checkTask(data) {
  return http.request({
    url: '/flowable/task/complete',
    method: 'post',
    data: data
  });
}

// 查询项目尽调详细
export function getDiligence(id) {
  return http.request({
    url: '/project/diligence/detail/' + id,
    method: 'post'
  });
}

/**
 * 查询授信信息
 * @param {*} customerId
 * @returns
 */
export function getShouxinInfo(customerId) {
  return http.request({
    url: '/cust/credit/detail/' + customerId,
    method: 'post'
  });
}

// 查询放款查询详细
export function getLoan(id) {
  return http.request({
    url: '/debt/loan/detail/' + id,
    method: 'post'
  });
}

// 查利率变更详情
export function getRateInfo(id) {
  return http.request({
    url: '/loan/change/detail/' + id,
    method: 'post'
  });
}

// 查询利息调整详细
export function getInterestInfo(id) {
  return http.request({
    url: '/loan/adjust/detail/' + id,
    method: 'post'
  });
}

// 查询到期日调整
export function getDateInfo(id) {
  return http.request({
    url: '/loan/expire/detail/' + id,
    method: 'post'
  });
}

// 查询尾款要素调整详细
export function getArrears(id) {
  return http.request({
    url: '/debt/arrears/detail/' + id,
    method: 'post'
  });
}

// 查询应收账款要素调整详细
export function getAdjust(id) {
  return http.request({
    url: '/debt/info/adjust/' + id,
    method: 'post'
  });
}
