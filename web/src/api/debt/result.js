import request from '@/utils/request'

// 查询划转结果查询列表
export function listResult(query) {
  return request({
    url: '/loan/result/list',
    method: 'get',
    params: query
  })
}

// 查询划转结果查询详细
export function getResult(id) {
  return request({
    url: '/loan/result/detail/' + id,
    method: 'post',
    headers:{repeatSubmit:false}
  })
}

// 新增划转结果查询
export function addResult(data) {
  return request({
    url: '/loan/result/add',
    method: 'post',
    data: data
  })
}

// 修改划转结果查询
export function updateResult(data) {
  return request({
    url: '/loan/result/edit',
    method: 'post',
    data: data
  })
}

// 删除划转结果查询
export function delResult(id) {
  return request({
    url: '/loan/result/remove/' + id,
    method: 'post'
  })
}
