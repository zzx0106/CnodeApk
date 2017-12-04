import axios from "axios";
const BASE_URL = 'https://cnodejs.org/api/v1/';
// 创建接口连接实例
let axiosInstance = axios.create({
    baseURL: BASE_URL, 
    timeout: 10000, 
    withCredentials: false, //带cookie
    headers: {
        Accept: "application/json, text/javascript, */*",
        "Content-Type": "application/json;charset=utf-8"
    }
});
// 超时时间 http请求拦截器
axiosInstance
    .interceptors
    .request
    .use(config => {
        return config;
    }, error => {
        console.error({content: "加载超时", duration: 3});
        return Promise.reject(error);
    });
// http响应拦截器
axiosInstance
    .interceptors
    .response
    .use(data => {
        return data;
    }, error => {
        console.error({content: "响应超时", duration: 3});
        return Promise.reject(error);
    });

export function get(url) {
    return axiosInstance.get(url)
}
export function post(url, body) {
    return axiosInstance.post(url, JSON.stringify(body))
}