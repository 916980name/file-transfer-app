import { Button } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectIsLogin, selectUserName } from "../../app/user/userSlice";
import './AdminHeader.css';
import AdminMenu from './AdminMenu';

export default function AdminHeader() {
    const name = useSelector(selectUserName)
    const isLogin = useSelector(selectIsLogin)
    const navigate = useNavigate();

    let content;
    if (isLogin) {
        content = (
            <Row className="d-flex justify-content-end align-items-center">
                <Col xs="auto">
                    <AdminMenu username={name} />
                </Col>
            </Row>
        )
    } else {
        content = (
            <Row>
                <Col className="d-flex justify-content-end align-items-center">
                    <Button variant="light" onClick={() => navigate("/login")}>登录</Button>
                </Col>
            </Row>
        )
    }

    return (
        <Container>
            <Row className="headerbox">
                <Col></Col>
                <Col xs={12} md={8}>
                    <Row className='align-items-center'>
                        <Col xs={3} md={3}>
                            <Row className='fw-bold'>
                                <span onClick={() => navigate("/")}>主页</span>
                            </Row>
                        </Col>
                        <Col className='d-flex justify-content-center align-items-center'>
                            <span>{document.title}</span>
                        </Col>
                        <Col xs={3} md={3}>
                            {content}
                        </Col>
                    </Row>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    )
}