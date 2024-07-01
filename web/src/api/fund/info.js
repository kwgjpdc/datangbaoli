import request from '@/utils/request'

// 查询应收账款查询列表
export function listFundPoolInfo(query) {
  return request({
    url: '/fund/pool/list',
    method: 'get',
    params: query
  })
}


// 查询资金提款列表
export function listFundDrawInfo(query) {
  return request({
    url: '/fund/draw/list',
    method: 'get',
    params: query
  })
}

// 查询资金付款列表
export function listFundRepaymentInfo(query) {
  return request({
    url: '/fund/pay/list',
    method: 'get',
    params: query
  })
}

// 查询应收账款查询详细
export function getDebtInfo(id) {
  return request({
    url: '/fund/pool/' + id,
    method: 'get'
  })
}

export function getFundPoolInfo(id) {
  return request({
    url: '/fund/pool/' + id,
    method: 'get'
  })
}

export function getFundDrawInfo(id) {
  return request({
    url: '/fund/draw/' + id,
    method: 'get'
  })
}

export function getFundPayInfo(id) {
  return request({
    url: '/fund/pay/' + id,
    method: 'get'
  })
}

// 新增应收账款查询
export function addFundInfo(data) {
  return request({
    url: '/fund/pool/add',
    method: 'post',
    data: data
  })
}

// 新增付款条目
export function addFundPayInfo(data) {
  return request({
    url: '/fund/pay/add',
    method: 'post',
    data: data
  })
}
// 新增提款条目
export function addFundDrawInfo(data) {
  return request({
    url: '/fund/draw/add',
    method: 'post',
    data: data
  })
}
// 修改应收账款查询
export function updateFundPoolInfo(data) {
  return request({
    url: '/fund/pool/edit',
    method: 'post',
    data: data
  })
}

export function updateFundPayInfo(data) {
  return request({
    url: '/fund/pay/edit',
    method: 'post',
    data: data
  })
}

export function updateFundDrawInfo(data) {
  return request({
    url: '/fund/draw/edit',
    method: 'post',
    data: data
  })
}

export function updateDebtInfo(data) {
  return request({
    url: '/fund/pool/edit',
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

export function delFundPoolInfo(id) {
  return request({
    url: '/fund/pool/remove/' + id,
    method: 'post'
  })
}

export function delFundDrawInfo(id) {
  return request({
    url: '/fund/draw/remove/' + id,
    method: 'post'
  })
}

export function delFundPayInfo(id) {
  return request({
    url: '/fund/pay/remove/' + id,
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

export function listFundPoolsum(query) {
  return request({
    url: '/fund/pool/sum',
    method: 'get',
    params: query
  })
}