import { sendAlert } from '../app/alertSlice';
import { store } from '../app/store';
import { ALERTCODE_ERR, ALERTCODE_INF, ALERTCODE_SUC } from '../page/component/AlertMe';

const dispatchAlertError = (msg) => {
    store.dispatch(sendAlert({ code: ALERTCODE_ERR, msg: msg }))
}

const dispatchAlertSuc = (msg) => {
    store.dispatch(sendAlert({ code: ALERTCODE_SUC, msg: msg }))
}

const dispatchAlertInfo = (msg) => {
    store.dispatch(sendAlert({ code: ALERTCODE_INF, msg: msg }))
}

export {
    dispatchAlertError, dispatchAlertInfo, dispatchAlertSuc
};

