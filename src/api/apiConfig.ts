let baseUrlPrefix = ''
const env = process.env.NODE_ENV === 'development' ? 'development' : 'production'
console.log('编译环境：',process.env.NODE_ENV)
switch (env) {
  case 'development':
    baseUrlPrefix = 'http://110.41.20.1:3388'
    // baseUrlPrefix = 'https://pairs.cc'
    break
  case 'production':
    baseUrlPrefix = 'https://pairs.cc'
    // baseUrlPrefix = 'https://pairs.cc'
    break
}

const api = {
  baseUrl: baseUrlPrefix,
//其他相关变量
}

export default api