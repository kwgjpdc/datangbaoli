import request from '@/utils/request'

// 查询列表
export function listInfo(query) {
  return request({
    url: '/loan/risk/list',
    method: 'get',
    params: query
  })
}

// 查询详细
export function getInfo(id) {
  return request({
    url: '/loan/risk/detail/' + id,
    method: 'post',
    headers:{repeatSubmit:false}
  })
}

// 新增
export function addInfo(data) {
  return request({
    url: '/loan/risk/add',
    method: 'post',
    data: data
  })
}

// 编辑
export function updateInfo(data) {
  return request({
    url: '/loan/risk/edit',
    method: 'post',
    data: data
  })
}

// 删除应收账款回款冲销
// export function delEntry(id) {
//   return request({
//     url: '/debt/entry/remove/' + id,
//     method: 'post'
//   })
// }
