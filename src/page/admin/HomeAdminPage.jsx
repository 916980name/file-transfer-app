import { Button } from "react-bootstrap"
import { Link } from "react-router-dom"
import AdminLayout from "../component/AdminLayout"

export default function HomeAdmin() {
    document.title = '管理员主页'
    return (
        <AdminLayout>
            <Link to={'/admin/setting'}>
                <Button size="lg">
                    系统设置
                </Button>
            </Link>
        </AdminLayout>
    )
}