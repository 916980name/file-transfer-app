
import React, { useImperativeHandle, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import './AlertMe.css';

export const ALERTCODE_SUC = 'ALERTCODE_SUC';
export const ALERTCODE_ERR = 'ALERTCODE_ERR';
export const ALERTCODE_INF = 'ALERTCODE_INF';

const AlertMe = React.forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        showAlertSuc,
        showAlertFail,
        showAlertInfo,
        showAlertOnCode,
        closeMe
    }))
    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertVariant, setAlertVariant] = useState('danger');

    function closeMe() {
        setShowAlert(false);
    }

    function showAlertOnCode(code, msg) {
        switch (code) {
            case ALERTCODE_ERR:
                showAlertFail(msg);
                break;
            case ALERTCODE_SUC:
                showAlertSuc(msg);
                break;
            default:
                showAlertInfo(msg);
        }
    }

    function showAlertSuc(msg) {
        setAlertVariant('success');
        setAlertMsg(msg)
        setShowAlert(true);
    }

    function showAlertFail(msg) {
        setAlertVariant('danger');
        setAlertMsg(msg)
        setShowAlert(true);
    }

    function showAlertInfo(msg) {
        setAlertVariant('info');
        setAlertMsg(msg)
        setShowAlert(true);
    }

    return (
        <div className='my-alert' ref={ref}>
            <Alert variant={alertVariant} onClose={() => setShowAlert(false)}
                show={showAlert}>
                {alertMsg}
            </Alert>
        </div>
    );
});

export default AlertMe;