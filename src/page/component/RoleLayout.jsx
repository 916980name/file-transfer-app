import { useSelector } from 'react-redux';
import { PRIVILEGE_ADMIN } from '../../app/privileges';
import { selectUserPrivileges } from '../../app/user/userSlice';
import AdminLayout from './AdminLayout';
import UserLayout from './UserLayout';

export default function RoleLayout({ children }) {
    const hadPrivileges = useSelector(selectUserPrivileges)

    if (hadPrivileges && hadPrivileges.includes(PRIVILEGE_ADMIN)) {
        return (
            <AdminLayout>
                {children}
            </AdminLayout>
        )
    } else {
        return (
            <UserLayout>
                {children}
            </UserLayout>
        )
    }
}