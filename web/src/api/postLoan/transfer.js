import request from '@/utils/request'

// 列表查询
export function listData(query) {
  return request({
    url: '/abs/transfer/list',
    method: 'get',
    params: query
  })
}

// 信息详情
export function getInfo(id) {
  return request({
    url: '/abs/transfer/detail/' + id,
    method: 'post',
    headers:{repeatSubmit:false}
  })
}

// 保存数据
export function updateInfo(data) {
  return request({
    url: '/abs/transfer/addOrUpdate',
    method: 'post',
    data: data
  })
}
