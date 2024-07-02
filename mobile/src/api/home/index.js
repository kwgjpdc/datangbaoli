import { http } from '@/utils/http';

/**
 * 新增首页统计
 * @returns
 */
export function addHome(params) {
  return http.request({
    url: '/mobile/stat/add',
    method: 'post',
    data: params
  });
}

/**
 * 编辑首页统计
 * @returns
 */
export function updateHome(params) {
  return http.request({
    url: '/mobile/stat/edit',
    method: 'post',
    data: params
  });
}

/**
 * 查询首页业务数据列表
 * @returns
 */
export function getHomeList(params) {
  return http.request({
    url: '/mobile/stat/list',
    method: 'get',
    params: params
  });
}

/**
 * 查询首页业务数据详情
 * @returns
 */
export function getHomeDetail(id) {
  return http.request({
    url: '/mobile/stat/' + id,
    method: 'get'
  });
}

/**
 * 查询保理业务金额
 * @returns
 */
export function getHomeAmount() {
  return http.request({
    url: '/mobile/stat/factoringAmount',
    method: 'get'
  });
}

/**
 * 查询用户是否是业务人员
 * @returns
 */
export function getBusinessInfo() {
  return http.request({
    url: '/mobile/stat/getIfBusiness',
    method: 'get'
  });
}

/**
 * 查询用户提示信息
 * @returns
 */
export function queryAlertMessage() {
  return http.request({
    url: '/mobile/noti/getNotification',
    method: 'get'
  });
}
