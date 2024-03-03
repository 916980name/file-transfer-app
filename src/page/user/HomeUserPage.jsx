import { useRef, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogoutRequest, shareLoginLink } from "../../api/userApi";
import { sendAlert } from "../../app/alertSlice";
import { logout, selectUserName } from "../../app/user/userSlice";
import { ALERTCODE_ERR } from "../component/AlertMe";
import Loading from "../component/Loading";
import UserLayout from "../component/UserLayout";
import './HomeUserPage.css';
import PasswordModal from "./PasswordModal";
import ShareLinkModal from "./ShareLinkModal";

export default function HomeUser() {
    document.title = 'user home'
    const [loading, setLoading] = useState(false)
    const userName = useSelector(selectUserName)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const passwordModalRef = useRef(null);
    const shareLoginLinkModalRef = useRef(null);

    const goLogout = () => {
        LogoutRequest()
            .catch(e => {
                console.log(e)
            })
            .finally(() => {
                dispatch(logout());
                navigate("/")
            })
    }

    const goChangePassword = () => {
        passwordModalRef.current.showMe();
    }

    const goMyMessage = () => {
        navigate('/user/message')
    }

    const goMyFile = () => {
        navigate('/user/file')
    }

    const goShareLogin = () => {
        if (loading) return
        setLoading(true)
        shareLoginLink()
        .then(res => {
            let url = res.data;
            shareLoginLinkModalRef.current.showQRCode(url, "QR code for Login")
        }).catch(err => {
            dispatch(sendAlert({ code: ALERTCODE_ERR, msg: "generate login link failed"}))
        }).finally(() => {
            setLoading(false)
        })
    }

    return (
        <UserLayout>
            <div className="allArea">
                <Container fluid>
                    <Row>
                        <Col>
                            <Row className="userInfoRow g-0">
                                <Col></Col>
                                <Col xs={2} md={1} className="d-flex justify-content-end align-items-center">
                                    <span className="userInfoText">Welcome,</span>
                                </Col>
                                <Col xs={6} md={3} className="d-flex justify-content-start align-items-center">
                                    <span className="userInfoText">{userName}</span>
                                </Col>
                                <Col xs={2}>
                                    <Button variant="outline-danger" size="lg" onClick={goLogout}>log out</Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
                <Container>
                    <Row className="userOptArea">
                        <Col>
                            {loading && <Loading />}
                            {!loading &&
                                <Row className="userOptText userOptItem" onClick={goShareLogin}>
                                    <Col xs={1}></Col>
                                    <Col>login link</Col>
                                    <Col className="d-flex justify-content-end align-items-center">
                                        <img className="imageArrow" src='/public-static/icons8-arrow-right.png' alt=""></img>
                                    </Col>
                                </Row>
                            }
                            <Row className="userOptItemDivider"></Row>
                            <Row className="userOptText userOptItem" onClick={goChangePassword}>
                                <Col xs={1}></Col>
                                <Col>change password</Col>
                                <Col className="d-flex justify-content-end align-items-center">
                                    <img className="imageArrow" src='/public-static/icons8-arrow-right.png' alt=""></img>
                                </Col>
                            </Row>
                            <Row className="userOptItemDivider"></Row>
                            <Row className="userOptText userOptItem" onClick={goMyMessage}>
                                <Col xs={1}></Col>
                                <Col>message</Col>
                                <Col className="d-flex justify-content-end align-items-center">
                                    <img className="imageArrow" src='/public-static/icons8-arrow-right.png' alt=""></img>
                                </Col>
                            </Row>
                            <Row className="userOptItemDivider"></Row>
                            <Row className="userOptText userOptItem" onClick={goMyFile}>
                                <Col xs={1}></Col>
                                <Col>file</Col>
                                <Col className="d-flex justify-content-end align-items-center">
                                    <img className="imageArrow" src='/public-static/icons8-arrow-right.png' alt=""></img>
                                </Col>
                            </Row>

                        </Col>
                    </Row>
                </Container>
            </div>
            <PasswordModal ref={passwordModalRef} />
            <ShareLinkModal ref={shareLoginLinkModalRef} />
        </UserLayout>
    )
}