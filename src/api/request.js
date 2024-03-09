import axios from 'axios';
import moment from 'moment';
import { dispatchAlertError } from '../app/godispatch';
import { store } from '../app/store';
import { loginRefresh, logout } from '../app/user/userSlice';

const APIROOT = {
  url: process.env.REACT_APP_API_ENDPOINT,
  path: process.env.REACT_APP_API_PATH,
}

function request(context) {
  if (!context.noPrefixUrl) {
    context.url = APIROOT.url + APIROOT.path + context.url;
  }

  const instance = axios.create({
    // timeout: 5000
  });

  instance.interceptors.request.use(config => {
    const { token } = store.getState().user.info
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    config.headers['TX-TZ'] = moment().format();
    if (context.responseType !== undefined) {
      config.responseType = context.responseType
    }
    return config;
  });

  instance.interceptors.response.use(
    res => res,
    err => {
      let data = ''
      try {
        if (err.response.status === 401) {
          const { refreshToken } = store.getState().user.info
          if ((context.noAuthAgain === undefined || !context.noAuthAgain)
            && (refreshToken !== undefined && refreshToken !== "")) {
            return refreshTokenRequest(context)
          } else {
            store.dispatch(logout())
            dispatchAlertError('Please Login Again')
          }
        }
        data = err.response.data;
      } catch (e) {
        data = err;
      }
      return Promise.reject(data)
    }
  );

  return instance(context);
}

function refreshTokenRequest(context) {
  const { token, refreshToken } = store.getState().user.info
  return axios({
    url: APIROOT.url + APIROOT.path + "/refreshToken",
    method: "GET",
    headers: {
      'Authorization': `Bearer ${token}`,
      'Refresh': refreshToken
    }
  })
    .then(res => {
      const token = res.headers['authorization'];
      const refreshToken = res.headers['refresh'];
      let data = {
        token: token,
        refreshToken: refreshToken
      }
      store.dispatch(loginRefresh(data))
      context.noAuthAgain = true
      context.noPrefixUrl = true
      return request(context)
    })
    .catch(err => {
      let data = ''
      try {
        if (err.response.status === 401) {
          store.dispatch(logout())
          dispatchAlertError('Please Login Again')
        }
        data = err.response.data;
      } catch (e) {
        data = err;
      }
      return Promise.reject(data)
    })
}

export default request;