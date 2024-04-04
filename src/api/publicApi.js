import request from './request.js';

const CheckShareLinkRequest = (params) => {
  return request({
    method: "GET",
    data: params,
    url: "/ls/" + params
  })
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               

const CheckMessageShareLinkRequest = (params) => {
  return request({
    method: "GET",
    data: params,
    url: "/ms/" + params
  })
}

const CheckFileShareLinkRequest = (params) => {
  return request({
    method: "GET",
    data: params,
    url: "/fs/" + params,
    responseType: 'blob'
  })
}

export { CheckFileShareLinkRequest, CheckMessageShareLinkRequest, CheckShareLinkRequest };

