import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { selectIsLogin } from "../../app/user/userSlice";
import NavIcon from './NavIcon';
import './UserHeader.css';

export default function UserHeader() {
    const isLogin = useSelector(selectIsLogin)
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    let content;
    if (isLogin) {
        content = (
            <NavIcon onClick={() => navigate("/user")} text='我的'
                src='/public-static/icons8-user.png'
                srcColor='/public-static/icons8-user-color-filled.png'
                ownPath='/user' currentPath={currentPath} />
        )
    } else {
        content = (
            <NavIcon onClick={() => navigate("/login")} text='登录'
                src='/public-static/icons8-login.png'
                srcColor='/public-static/icons8-login-color-filled.png'
                ownPath='/login' currentPath={currentPath} />
        )
    }

    return (
        <Container className="headerbox">
            <Row className='align-items-center'>
                <Col xs={3} md={3}>
                    <NavIcon onClick={() => navigate("/")} text='主页'
                        src='/public-static/icons8-home.png'
                        srcColor='/public-static/icons8-home-color-filled.png'
                        ownPath='/' currentPath={currentPath} />
                </Col>
                <Col className='d-flex justify-content-center align-items-center'>
                    <span>{document.title}</span>
                </Col>
                <Col xs={3} md={3}>
                    {content}
                </Col>
            </Row>
        </Container>
    )
}