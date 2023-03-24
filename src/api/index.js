import http from './axios'

function getDeviceList (params) {
  return http({
    url: '/device-list',
    method: 'get',
    params
  })
}

function login (params) {
  return http({
    url: '/login',
    method: 'post',
    data: params
  })
}

function tanslate (params) {
  return http({
    url: 'http://api.fanyi.baidu.com/api/trans/vip/translate',
    method: 'get',
    params
  })
}

export {
  getDeviceList,
  login,
  tanslate
}
