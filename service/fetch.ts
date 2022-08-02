import axios from 'axios';

const requestInstance = axios.create({
  baseURL: '/',
});

requestInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// 拦截器，参数1成功的回调，参数2失败的回调
requestInstance.interceptors.response.use(
  (response) => {
    if (response?.status === 200) {
      return response.data;
    } else {
      return {
        code: -1,
        msg: '未知错误',
        data: null,
      };
    }
  },
  (error) => Promise.reject(error)
);

export default requestInstance;
