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

export {
  getDeviceList,
  login
}
