import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearAlert, selectAlertCode, selectAlertMsg, selectAlertShow } from '../../app/alertSlice';
import AlertMe from './AlertMe';
import './UserLayout.css';

export default function UserLayout({ children }) {
    const alertMeRef = useRef()
    const dispatch = useDispatch()
    const alertShowFlag = useSelector(selectAlertShow)
    const alertCode = useSelector(selectAlertCode)
    const alertMsg = useSelector(selectAlertMsg)

    function useAlert() {
        if (alertShowFlag) {
            alertMeRef.current.showAlertOnCode(alertCode, alertMsg);
            setTimeout(() => {
                alertMeRef.current.closeMe();
            }, 1500);
            // if dispatch inside setTimeout, Error: Should not already be working. performConcurrentWorkOnRoot
            dispatch(clearAlert())
        }
    }

    useEffect(useAlert, [useAlert])

    // https://medium.com/@nikita.vyrko/bootstrap-best-practices-59752895d4e1
    return (
        <div className='layerbottom'>
            {children}
            <AlertMe ref={alertMeRef} />
        </div>
    );
}