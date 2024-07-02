import Axios from 'axios';
// import NProgress from "../progress";
import { showFailToast, showLoadingToast } from 'vant';
import 'vant/es/toast/style';
import { getToken } from '../auth';

let number = 0;
let toast = '';

const showLoad = () => {
  number++;
  toast = showLoadingToast({
    duration: 0,
    message: '加载中···'
  });
};

const hideLoad = () => {
  number--;
  if (number <= 0) {
    number = 0;
    if (toast) {
      toast.close();
    }
  }
};

// 默认 axios 实例请求配置
const configDefault = {
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },
  timeout: 20000,
  baseURL: import.meta.env.VITE_BASE_API,
  data: {}
};

class Http {
  constructor(config) {
    Http.axiosConfigDefault = config;
    Http.axiosInstance = Axios.create(config);
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }
  // 当前实例
  static axiosInstance;
  // 请求配置
  static axiosConfigDefault;

  // 请求拦截
  httpInterceptorsRequest() {
    Http.axiosInstance.interceptors.request.use(
      config => {
        //NProgress.start();
        // 是否需要设置 token
        const isToken = (config.headers || {}).isToken === false;

        if (getToken() && !isToken) {
          config.headers['Authorization'] = 'Bearer ' + getToken();
        }
        // 发送请求前，可在此携带 token
        // if (token) {
        //   config.headers['token'] = token
        // }

        const loading = (config.headers || {}).loading === false ? false : true;
        if (loading) {
          showLoad();
        }
        return config;
      },
      error => {
        hideLoad();
        showFailToast(error.message);
        return Promise.reject(error);
      }
    );
  }

  // 响应拦截
  httpInterceptorsResponse() {
    Http.axiosInstance.interceptors.response.use(
      response => {
        hideLoad();
        // NProgress.done();
        // 与后端协定的返回字段
        const { code, msg } = response.data;
        // 判断请求是否成功 （code 200 请求成功）
        // const isSuccess = code === 200;
        if (code === 200) {
          return Promise.resolve(response.data);
        } else {
          // 处理请求错误
          if (code === 401) {
            showFailToast('登录状态已过期');
          } else {
            showFailToast(msg || '系统发生错误');
          }
          return Promise.reject(response.data);
        }
      },
      error => {
        hideLoad();
        //NProgress.done();
        // 处理 HTTP 网络错误
        console.log('err' + error);
        let { message } = error;

        if (message == 'Network Error') {
          message = '后端接口连接异常';
        } else if (message.includes('timeout')) {
          message = '系统接口请求超时';
        } else if (message.includes('Request failed with status code')) {
          message = '系统接口' + message.substr(message.length - 3) + '异常';
        }
        showFailToast(message);
        return Promise.reject(error);
      }
    );
  }

  // 通用请求函数
  request(paramConfig) {
    const config = { ...Http.axiosConfigDefault, ...paramConfig };
    return new Promise((resolve, reject) => {
      Http.axiosInstance
        .request(config)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // 通用请求函数
  requestFile(paramConfig) {
    const config = { ...Http.axiosConfigDefault, ...paramConfig };
    config.headers['Content-Type'] = 'multipart/form-data';
    console.log(config);
    return new Promise((resolve, reject) => {
      Http.axiosInstance
        .request(config)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}

export const http = new Http(configDefault);
