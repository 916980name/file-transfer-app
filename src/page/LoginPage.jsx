import { useEffect, useRef, useState } from "react";
import { Button, Container, FloatingLabel, Spinner } from "react-bootstrap";
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoginRequest } from "../api/userApi";
import { sendAlert } from "../app/alertSlice";
import { PRIVILEGE_ADMIN, PRIVILEGE_USER } from "../app/privileges";
import { loginSuc, selectIsLogin, selectUserPrivileges } from "../app/user/userSlice";
import './LoginPage.css';
import { ALERTCODE_ERR } from "./component/AlertMe";
import UserLayout from "./component/UserLayout";

export default function LoginPage() {
    document.title = 'Login'
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLogin = useSelector(selectIsLogin)
    const hadPrivileges = useSelector(selectUserPrivileges)
    const [validated, setValidated] = useState(false);
    const formRef = useRef();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isLogin) {
            console.log('has login')
            if (hadPrivileges.includes(PRIVILEGE_ADMIN)) {
                navigate("/admin")
            } else if (hadPrivileges.includes(PRIVILEGE_USER)) {
                navigate("/user")
            } else {
                navigate("/")
            }
        }
    }, [isLogin, hadPrivileges, navigate])

    const goLogin = () => {
        setLoading(true)
        if (formRef.current.checkValidity() === false) {
            setLoading(false)
            return
        }
        setValidated(true);
        LoginRequest(
            {
                username: username,
                password: password
            }
        ).then(res => {
            const token = res.headers['authorization'];
            let data = res.data;
            data.token = token;
            dispatch(loginSuc(data))
            if (data.privileges.includes(PRIVILEGE_ADMIN)) {
                navigate("/admin")
            } else if (data.privileges.includes(PRIVILEGE_USER)) {
                navigate("/user")
            } else {
                alert('not permitted')
            }
        }).catch(err => {
            let data = ''
            try {
                data = err.message || "Failed";
            }  finally {
                dispatch(sendAlert({ code: ALERTCODE_ERR, msg: data }))
            }
        }).finally(() => {
            setLoading(false)
        })
    }

    return (
        <UserLayout>
            <Container fluid className="backcontainer h-100 d-flex align-items-center justify-content-center">
                <Row className='loginbox'>
                    <Col></Col>
                    <Col xs={10} md={6}>
                        <Form ref={formRef} noValidate validated={validated}>
                            <FloatingLabel className="floatinput" controlId="floatingUsername" label="username">
                                <Form.Control className="textinput" type="text" placeholder="" required
                                    value={username} onChange={e => setUsername(e.target.value)} />
                                <Form.Control.Feedback type="invalid">
                                    need username
                                </Form.Control.Feedback>
                            </FloatingLabel>
                            <FloatingLabel className="floatinput" controlId="floatingPassword" label="password">
                                <Form.Control className="textinput" type="password" placeholder="" required
                                    value={password} onChange={e => setPassword(e.target.value)} />
                                <Form.Control.Feedback type="invalid">
                                    need password
                                </Form.Control.Feedback>
                            </FloatingLabel>
                            <Row className="d-flex align-items-center justify-content-center">
                                <Button className="loginbtn" onClick={goLogin} disabled={loading}>
                                    {loading &&
                                        <Spinner animation="border" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </Spinner>
                                    }
                                    {!loading && 'Login' }
                                </Button>
                            </Row>
                        </Form>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
        </UserLayout>
    )
}