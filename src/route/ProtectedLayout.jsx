import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { selectIsLogin, selectUserPrivileges } from "../app/user/userSlice";
import NoAuthPage from "./no-auth-page";

export const ProtectedLayout = (props) => {
    const { privilege } = props;
    const isLogin = useSelector(selectIsLogin)
    const hadPrivileges = useSelector(selectUserPrivileges)

    if (!isLogin) {
        console.log('No login')
        return <NoAuthPage/>;
    }
    const containsCommonElement = hadPrivileges.some(item => privilege.includes(item));
    if (!containsCommonElement) {
        console.log('No privilege')
        return <NoAuthPage/>;
    }
    const { component } = props;
    if(component) {
        return component
    }

    return (
        <div>
            <Outlet />
        </div>
    )
};