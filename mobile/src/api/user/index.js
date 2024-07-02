import { http } from '@/utils/http';

export function userLoginAuth(params) {
  return http.request({
    url: '/mobilelogin',
    headers: {
      isToken: false,
      repeatSubmit: false
    },
    method: 'post',
    data: params
  });
}

export function getUserInfo() {
  return http.request({
    url: '/system/user/profile',
    method: 'get'
  });
}

export function updateUserInfo(data) {
  return http.request({
    url: '/system/user/profile',
    method: 'put',
    data
  });
}

// 用户头像上传
export function uploadAvatar(data) {
  return http.requestFile({
    url: '/system/user/profile/avatar',
    method: 'post',
    data: data
  });
}

export function checkUserIsCustomer() {
  return http.request({
    url: '/mobile/cust/getIfCustomer',
    method: 'get'
  });
}

// 用户资料上传
export function uploadUserFile(data) {
  return http.requestFile({
    url: '/mobile/cust/file/upload',
    method: 'post',
    data: data
  });
}
