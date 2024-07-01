import request from '@/utils/request'

// 查询客户额度列表
export function listQuota(query) {
  return request({
    url: '/cust/quota/list',
    method: 'get',
    params: query
  })
}

// 查询客户额度详细
export function getQuota(quotaId) {
  return request({
    url: '/cust/quota/' + quotaId,
    method: 'get'
  })
}

// 新增客户额度
export function addQuota(data) {
  return request({
    url: '/cust/quota/add',
    method: 'post',
    data: data
  })
}

// 修改客户额度
export function updateQuota(data) {
  return request({
    url: '/cust/quota/edit',
    method: 'post',
    data: data
  })
}

// 删除客户额度
export function delQuota(quotaId) {
  return request({
    url: '/cust/quota/remove/' + quotaId,
    method: 'post'
  })
}


// 额度变更并且数字转中文大写
export function changeAmount( beforeChangeAmount , changeType , afterChangeAmount) {
  return request({
    url: '/cust/quota/changeAmount/' + beforeChangeAmount +'/' +changeType +'/' +afterChangeAmount ,
    method: 'get'
  })
}


// 额度变更
export function addChangeRecord(data) {
  return request({
    url: '/cust/quota/addChangeRecord',
    method: 'post',
    data: data
  })
}
// 额度变更
export function editExpiryDate(data) {
  console.log(data)
  return request({
    url: '/cust/quota/editExpiryDate',
    method: 'post',
    data: data
  })
}

// 额度冻结
export function freeze(data) {
  console.log(data)
  return request({
    url: '/cust/quota/freeze',
    method: 'post',
    data: data
  })
}


// 额度解冻
export function unfreeze(data) {
  console.log(data)
  return request({
    url: '/cust/quota/unfreeze',
    method: 'post',
    data: data
  })
}


// 额度终止
export function endPost(data) {
  console.log(data)
  return request({
    url: '/cust/quota/end',
    method: 'post',
    data: data
  })
}

// 额度撤销终止
export function cancelEndPost(data) {
  console.log(data)
  return request({
    url: '/cust/quota/cancelEnd',
    method: 'post',
    data: data
  })
}
