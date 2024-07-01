import request from '@/utils/request'

// 查询融资回款冲销列表
export function listRepay(query) {
  return request({
    url: '/loan/repay/list',
    method: 'get',
    params: query
  })
}

// 查询融资回款冲销详细
export function getRepay(id) {
  return request({
    url: '/loan/repay/detail/' + id,
    method: 'post',
    headers:{repeatSubmit:false}
  })
}

// 新增融资回款冲销
export function addRepay(data) {
  return request({
    url: '/loan/repay/add',
    method: 'post',
    data: data
  })
}

// 编辑融资回款冲销
export function updateRepay(data) {
  return request({
    url: '/loan/repay/edit',
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
