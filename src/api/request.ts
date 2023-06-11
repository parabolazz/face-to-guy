import Taro from '@tarojs/taro';
import apiConfig from './apiConfig'

//网络请求拦截器
const interceptor: Taro.interceptor = function (chain: Taro.Chain) {
  const requestParams = chain.requestParams
  let token = Taro.getStorageSync('TOKEN')//拿到本地缓存中存的token
  requestParams.header = {
    ...requestParams.header,
    Authorization: token //将token添加到头部
  }
  return chain.proceed(requestParams).then(res => { return res })
}

Taro.addInterceptor(interceptor)

const request = async <T>(method, url, params) => {
  //由于post请求时习惯性query参数使用params，body参数使用data，而taro只有data参数，使用contentType作为区分，因此此处需要做一个判断
  // let contentType = params?.data ? 'application/json' : 'application/json application/x-www-form-urlencoded';
  let contentType = 'application/json';
  if (params) contentType = params?.headers?.contentType || contentType;
  const option = {
    method,
    isShowLoading: false,
    url: apiConfig.baseUrl + url,
    data: params && (params?.data || params?.params),
    header: {
      'content-type': contentType,
    },
    success(res) {
      console.log('success', res?.statusCode)
    //根据不同返回状态值3进行操作
      switch (res?.statusCode) {
        case 401: {
          const currPages = Taro.getCurrentPages();
          const currPage = currPages[currPages.length - 1].route;
          currPage !== 'pages/login/index' && Taro.navigateTo({
            url: '/pages/login/index'
          })
          return
        }
      }
      if(res?.statusCode !== 200) {
        Taro.showToast({
          title: '出错了！',
          icon: 'error',
          duration: 2000
        })
        return Promise.reject(res)
      }
    },
    fail(e) {
      console.log('fail', e)
      if(e.errno !== 0 || e.errMsg) {
        Taro.showToast({
          title: '出错了！',
          icon: 'error',
          duration: 2000
        })
      }
    }
  }
  const resp = await Taro.request<T>(option);
  return resp.data;//根据个人需要返回
}

export default {
  get: <T>(url, config = {}) => {
    return request<T>('GET', url, config);
  },
  post: <T>(url, config = {}) => {
    return request<T>('POST', url, config);
  },
  put: <T>(url, config = {}) => {
    return request<T>('PUT', url, config);
  },
  delete: <T>(url, config = {}) => {
    return request<T>('DELETE', url, config);
  },
  patch: <T>(url, config = {}) => {
    return request<T>('PATCH', url, config);
  },
}
