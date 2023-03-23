import http from './axios'

function test (params) {
  return http({
    url: '/api/list',
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
  test,
  login
}
