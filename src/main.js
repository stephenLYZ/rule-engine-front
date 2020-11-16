import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from '@/router';
import axios from 'axios';


import App from './App.vue';

Vue.use(ElementUI);

Vue.config.productionTip = false;

//默认头像
Vue.prototype.$defaultAvatar = "/static/avatar.jpg";

//请求后端服务器接口前缀
const requestBaseURL = "http://49.234.81.14:8010/";
Vue.prototype.$requestBaseURL = requestBaseURL;

//axios配置
Vue.prototype.$axios = axios;
//设置cookie跨域
axios.defaults.withCredentials = true;
axios.defaults.baseURL = requestBaseURL;

// 请求之前
axios.interceptors.request.use(config => {
  return config;
}, error => {
  // 请求错误
  return Promise.reject(error);
});
//服务器响应
axios.interceptors.response.use(response => {
  let data = response.data;
  let code = data.code;
  let message = data.message;
  if (code === 200) {
    return data;
  } else if (code === 4009||code===10010004||code===99990402||code===10011039) {
    router.push({path: '/login'});
    ElementUI.Message({
      type: 'warning',
      message: message
    });
  }else {
    ElementUI.Message({
      type: 'error',
      message: message
    });
  }
}, error => {
  console.log(error);
  router.push({path: '/500'});
  //响应出现错误
  return Promise.reject(error);
});

new Vue({
  el: '#app',
  router,
  axios,
  render: h => h(App)
});

