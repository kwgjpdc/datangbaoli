import request from '@/utils/request'

// 查询文件信息列表
export function listFile(query) {
  return request({
    url: '/sys/file/list',
    method: 'get',
    params: query
  })
}

// 查询文件信息详细
export function getFile(fileId) {
  return request({
    url: '/sys/file/' + fileId,
    method: 'get'
  })
}

// 新增文件信息
export function addFile(data) {
  return request({
    url: '/sys/file',
    method: 'post',
    data: data
  })
}

// 修改文件信息
export function updateFile(data) {
  return request({
    url: '/sys/file',
    method: 'put',
    data: data
  })
}

// 删除文件信息
export function delFile(fileId) {
  return request({
    url: '/sys/file/' + fileId,
    method: 'delete'
  })
}

// 查询文件信息详细
export function downloadFile(fileUrl) {
  let urlQuery = '';
  if(fileUrl){
    urlQuery='?resource=' + fileUrl
  }
  return request({
    url: '/common/download/resource' + urlQuery,
    method: 'get'
  })
}