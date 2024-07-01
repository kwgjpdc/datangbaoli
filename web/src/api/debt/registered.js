import request from '@/utils/request'

// 中登网登记查询列表
export function listRegistered(query) {
  return request({
    url: '/debt/register/list',
    method: 'get',
    params: query
  })
}

// 查询中登网登记信息详情
export function getRegistered(id) {
  return request({
    url: '/debt/register/detail/' + id,
    method: 'post',
    headers:{repeatSubmit:false}
  })
}

// 登记操作
export function addRegistered(data) {
  return request({
    url: '/debt/register/add',
    method: 'post',
    data: data
  })
}

// 变更信息
export function updateRegistered(data) {
  return request({
    url: '/debt/register/edit',
    method: 'post',
    data: data
  })
}
