import request from '@/utils/request'

// 列表查询
export function listData(query) {
  return request({
    url: '/abs/task/list',
    method: 'get',
    params: query
  })
}

// 信息详情
export function getInfo(id) {
  return request({
    url: '/abs/task/detail/' + id,
    method: 'post',
    headers:{repeatSubmit:false}
  })
}

// 新增 编辑数据
export function save(data) {
  return request({
    url: '/abs/task/save',
    method: 'post',
    data: data
  })
}
