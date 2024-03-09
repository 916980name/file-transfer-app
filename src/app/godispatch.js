import { sendAlert } from '../app/alertSlice';
import { store } from '../app/store';
import { ALERTCODE_ERR, ALERTCODE_INF, ALERTCODE_SUC } from '../page/component/AlertMe';

const dispatchAlertError = (msg) => {
    let message = resolveMsgParameter(msg)
    store.dispatch(sendAlert({ code: ALERTCODE_ERR, msg: message }))
}

const dispatchAlertSuc = (msg) => {
    store.dispatch(sendAlert({ code: ALERTCODE_SUC, msg: msg }))
}

const dispatchAlertInfo = (msg) => {
    store.dispatch(sendAlert({ code: ALERTCODE_INF, msg: msg }))
}

function resolveMsgParameter(msg) {
    let message = "Unknown Error"
    if(msg instanceof Object) {
        if(msg.hasOwnProperty('message')) {
            message = msg.message
        } else if(msg.hasOwnProperty('msg')) {
            message = msg.msg
        } else {
            message = msg
        }
    } else if (typeof msg === 'string' || msg instanceof String) {
            message = msg
    }
    return message
}

export {
    dispatchAlertError, dispatchAlertInfo, dispatchAlertSuc
};

