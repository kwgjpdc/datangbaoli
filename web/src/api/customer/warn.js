import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listWarning(query) {
  return request({
    url: '/cust/warning/list',
    method: 'get',
    params: query
  })
}

// 查询【请填写功能名称】详细
export function getWarning(warningId) {
  return request({
    url: '/cust/warning/detail/' + warningId,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addWarning(data) {
  return request({
    url: '/cust/warning/add',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateWarning(data) {
  return request({
    url: '/cust/warning/edit',
    method: 'post',
    data: data
  })
}

// 删除【请填写功能名称】
export function delWarning(warningId) {
  return request({
    url: '/cust/warning/remove/' + warningId,
    method: 'post'
  })
}

// 新增获取编号
export function getWarningSeq(deptId) {
    return request({
      url: '/cust/warning/seq?deptId='+deptId,
      method: 'get'
    })
  }
  