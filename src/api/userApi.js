import request from './request.js';

const LoginRequest = (params) => {
  return request({
    method: "POST",
    data: params,
    url: "/trysignin"
  })
}

const LogoutRequest = () => {
  return request({
    method: "GET",
    url: "/logout"
  })
}

const getUser = () => {
  return request({
    method: 'GET',
    url: '/user/me'
  })
}

const updatePassword = (params) => {
  return request({
    method: 'PATCH',
    data: params,
    url: '/user/password'
  })
}

const getMessageByPage = (params) => {
  return request({
    method: 'POST',
    data: params,
    url: '/msg'
  })
}

const putMessage = (params) => {
  return request({
    method: 'PUT',
    data: params,
    url: '/msg'
  })
}

const deleteMessage = (id) => {
  return request({
    method: 'DELETE',
    url: '/msg/' + id
  })
}

const shareLoginLink = () => {
  return request({
    method: 'GET',
    url: '/share/login'
  })
}

const shareMessageLink = (mId, params) => {
  return request({
    method: 'POST',
    url: '/msg/share/' + mId,
    data: params
  })
}

const getFileByPage = (params) => {
  return request({
    method: 'POST',
    data: params,
    url: '/file/query'
  })
}

const downloadFile = (fId) => {
  return request({
    method: 'GET',
    url: '/file/' + fId,
    responseType: 'blob'
  })
}

const uploadFile = (formData) => {
  return request({
    method: 'POST',
    url: '/file',
    data: formData
  })
}

export {
  LoginRequest, LogoutRequest, deleteMessage, downloadFile, getFileByPage, getMessageByPage,
  getUser, putMessage, shareLoginLink, shareMessageLink, updatePassword,
  uploadFile
};

