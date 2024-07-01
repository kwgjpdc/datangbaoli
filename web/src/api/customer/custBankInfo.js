import request from '@/utils/request'

// 查询客户银行账户信息列表
export function listCustBankInfo(query) {
  return request({
    url: '/cust/bank/list',
    method: 'get',
    params: query
  })
}

// 查询客户银行账户信息详细
export function getCustBankInfo(accountId) {
  return request({
    url: '/cust/bank/' + accountId,
    method: 'get'
  })
}

// 新增客户银行账户信息
export function addCustBankInfo(data) {
  return request({
    url: '/cust/bank',
    method: 'post',
    data: data
  })
}

// 修改客户银行账户信息
export function updateCustBankInfo(data) {
  return request({
    url: '/cust/bank',
    method: 'put',
    data: data
  })
}

// 删除客户银行账户信息
export function delCustBankInfo(accountId) {
  return request({
    url: '/cust/bank/' + accountId,
    method: 'delete'
  })
}
// 新增获取编号
export function getBankSeq() {
  return request({
    url: '/cust/bank/seq',
    method: 'get'
  })
}


