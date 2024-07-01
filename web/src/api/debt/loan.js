import request from '@/utils/request'

// 查询放款查询列表
export function listLoan(query) {
  return request({
    url: '/debt/loan/list',
    method: 'get',
    params: query
  })
}

// 查询放款查询详细
export function getLoan(id) {
  return request({
    url: '/debt/loan/detail/' + id,
    method: 'post'
  })
}

// 新增放款查询
export function addLoan(data) {
  return request({
    url: '/debt/loan/add',
    method: 'post',
    data: data
  })
}

// 修改放款查询
export function updateLoan(data) {
  return request({
    url: '/debt/loan/edit',
    method: 'post',
    data: data
  })
}

// 删除放款查询
export function delLoan(id) {
  return request({
    url: '/debt/loan/remove/' + id,
    method: 'post'
  })
}
