import request from './request.js';

const userPageRequest = (params) => {
  return request({
    method: "POST",
    data: params,
    url: "/admin/user/search"
  })
}

const userAddRequest = (params) => {
  return request({
    method: "POST",
    data: params,
    url: "/admin/user"
  })
}

const userUpdateState = (param) => {

}

export { userAddRequest, userPageRequest, userUpdateState };

