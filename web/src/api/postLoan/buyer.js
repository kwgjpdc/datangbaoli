import request from '@/utils/request'

// 列表查询
export function listData(query) {
  return request({
    url: '/loan/interest/list',
    method: 'get',
    params: query
  })
}

// 信息详情
export function getInfo(id) {
  return request({
    url: '/loan/interest/detail/' + id,
    method: 'post',
    headers:{repeatSubmit:false}
  })
}

// 新增数据
export function addInfo(data) {
  return request({
    url: '/loan/interest/add',
    method: 'post',
    data: data
  })
}

// 编辑数据
export function updateInfo(data) {
  return request({
    url: '/loan/interest/edit',
    method: 'post',
    data: data
  })
}
