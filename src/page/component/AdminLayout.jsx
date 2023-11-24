import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearAlert, selectAlertCode, selectAlertMsg, selectAlertShow } from '../../app/alertSlice';
import AdminHeader from './AdminHeader';
import AlertMe from './AlertMe';

export default function AdminLayout({ children }) {
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

    return (
        <div>
            <AdminHeader />
            {children}
            <AlertMe ref={alertMeRef} />
        </div>
    );
}