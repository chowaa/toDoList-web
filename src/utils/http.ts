import axios from "axios";

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3002/api', // 将模型接口地址替换为实际地址
  timeout: 50000, // 可选的超时配置
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // 对响应数据做些什么
    return response;
  },
  (error) => {
    // 对响应错误做些什么
    return Promise.reject(error);
  }
);

// const apiClient = axios.create({
//     baseURL: 'http://localhost:3002/api',
//     headers: {
//         'content-type': 'application/json',
//     }
// })

export default axiosInstance
