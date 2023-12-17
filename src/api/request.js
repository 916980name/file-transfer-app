import axios from 'axios';
import moment from 'moment';
import { dispatchAlertError } from '../app/godispatch';
import { store } from '../app/store';
import { logout } from '../app/user/userSlice';

const APIROOT = {
  url: process.env.REACT_APP_API_ENDPOINT,
  path: process.env.REACT_APP_API_PATH,
}

function request(context) {
  context.url = APIROOT.url + APIROOT.path + context.url;

  const instance = axios.create({
    // timeout: 5000
  });

  instance.interceptors.request.use(config => {
    const { token } = store.getState().user.info
    if (token) {
      config.headers['Authorization'] = `${token}`;
    }
    config.headers['TX-TZ'] = moment().format();
    return config;
  });

  instance.interceptors.response.use(
    res => res,
    err => {
      let data = ''
      try {
        if (err.response.status === 401 &&
          err.response.data.code === 'ERR_EXPIRED_TOKEN') {
          store.dispatch(logout())
          dispatchAlertError('Please Login Again')
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

export default request;