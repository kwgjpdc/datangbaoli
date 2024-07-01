import request from '@/utils/request'

// 查询应收账款查询列表
export function listDebtInfo(query) {
  return request({
    url: '/debt/info/voucherList',
    method: 'get',
    params: query
  })
}

// 查询应收账款查询详细
export function getDebtInfo(id) {
  return request({
    url: '/debt/info/detail/' + id,
    method: 'post'
  })
}

// 新增应收账款查询
export function addDebtInfo(data) {
  return request({
    url: '/debt/info/add',
    method: 'post',
    data: data
  })
}

// 修改应收账款查询
export function updateDebtInfo(data) {
  return request({
    url: '/debt/info/edit',
    method: 'post',
    data: data
  })
}




// 删除应收账款查询
export function delDebtInfo(id) {
  return request({
    url: '/debt/info/remove/' + id,
    method: 'post'
  })
}

// 查询装让
export function getferenceDebtInfo(id) {
  return request({
    url: '/debt/info/trans/' + id,
    method: 'post'
  })
}

// 修改转让
export function transferenceDebtInfo(data) {
  return request({
    url: '/debt/info/transference',
    method: 'post',
    data: data
  })
}

// 获取合同信息

export function getContList(query) {
  return request({
    url: '/cont/contractList',
    method: 'get',
    params: query
  })
}