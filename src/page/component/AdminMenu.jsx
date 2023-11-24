import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogoutRequest } from '../../api/userApi';
import { logout, selectUserPrivileges } from "../../app/user/userSlice";
import { makeid } from '../../app/utils';
import { routerList } from "../../route/route-list";

function hasPrivilege(userPrivilege, requiredPrivilege) {
    return userPrivilege.some(item => requiredPrivilege.includes(item));
}

export default function AdminMenu(props) {
    const username = props.username;
    const navigate = useNavigate();
    const hadPrivileges = useSelector(selectUserPrivileges)
    const dispatch = useDispatch();

    const goLogout = () => {
        LogoutRequest()
            .finally(() => {
                dispatch(logout());
                navigate("/")
            })
    }

    const constructMenu = (parent, routes, userPrivilege) => {
        let result = [];
        for (const route of routes) {
            if (route.path === '/') continue
            if (route.notShow) continue
            if (route.privilege && !hasPrivilege(userPrivilege, route.privilege)) continue
            let temp = [];
            if (parent === '') {
                temp.push(
                    <Dropdown.Header key={makeid(5)}>{route.name}</Dropdown.Header>
                )
            } else {
                temp.push(
                    <Dropdown.Item key={makeid(5)} onClick={() => navigate(parent + route.path)}>
                        {route.name}
                    </Dropdown.Item>
                )
            }
            if (route.child) {
                let childList = constructMenu(route.path + '/', route.child, userPrivilege)
                temp.push(
                    <ul key={makeid(5)}>
                        {childList}
                    </ul>
                )
                if (childList.length < 1) {
                    temp = []
                }
            }
            result.push(temp)
        }
        return result
    }

    const menuList = constructMenu('', routerList, hadPrivileges)
    const logoutMenu = (
        <Dropdown.Item key={1000} onClick={goLogout}>
            退出
        </Dropdown.Item>
    )

    return (
        <DropdownButton
            as={ButtonGroup}
            key={1}
            id={`dropdown-variants-1`}
            variant={'light'}
            title={'菜单'}
        >
            <Dropdown.Header>{username}</Dropdown.Header>
            {menuList}
            <Dropdown.Divider />
            {logoutMenu}
        </DropdownButton>
    )
}