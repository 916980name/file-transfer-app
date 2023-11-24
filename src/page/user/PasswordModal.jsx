import React, { useImperativeHandle, useState } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { updatePassword } from "../../api/userApi";
import { dispatchAlertError, dispatchAlertSuc } from "../../app/godispatch";
import InputWithClear from "../component/InputWithClear";

const PasswordModal = React.forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        showMe,
        closeMe
    }))

    const initRequest = {
        oldPassword: null,
        newPassword: null,
        confirmPassword: null,
    }
    const [modalShow, setModalShow] = useState(false);
    const [loading, setLoading] = useState(false)
    const [userRequest, setUserRequest] = useState(initRequest)
    const [msg, setMsg] = useState('')

    function closeMe() {
        setUserRequest(initRequest)
        setMsg('')
        setModalShow(false);
    }

    function showMe() {
        setModalShow(true);
    }

    const update = () => {
        setLoading(true)
        // validate
        let currentParam = { ...userRequest }
        if (!currentParam.oldPassword || !currentParam.newPassword || !userRequest.confirmPassword) {
            dispatchAlertError('请填写完整')
            setLoading(false)
            return
        }
        if (currentParam.newPassword.length < 12) {
            dispatchAlertError('新密码至少需要12位长度')
            setLoading(false)
            return
        }
        if (currentParam.newPassword !== currentParam.confirmPassword) {
            dispatchAlertError('新密码两次输入不同')
            setLoading(false)
            return
        }

        // request
        updatePassword(currentParam)
            .then((res) => {
                dispatchAlertSuc('更新密码成功')
                setTimeout(() => {
                    setLoading(false)
                    closeMe()
                }, 1500)
            })
            .catch(err => {
                setLoading(false)
                setMsg(err.message)
            })
    }

    return (
        <Modal ref={ref} show={modalShow} onHide={closeMe} animation={true} fullscreen={true} size="xl" backdrop={'static'} >
            <Modal.Header>
                <Modal.Title>修改密码</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <Col></Col>
                        <Col xs={9} md={4}>
                            <Form.Group>
                                <Form.Label>请输入旧密码</Form.Label>
                                <InputWithClear value={userRequest.oldPassword}
                                    field='oldPassword' password={true}
                                    setFunc={setUserRequest} />
                            </Form.Group>
                        </Col>
                        <Col></Col>
                    </Row>
                    <Row>
                        <Col></Col>
                        <Col xs={9} md={4}>
                            <Form.Group>
                                <Form.Label>请输入新密码</Form.Label>
                                <InputWithClear value={userRequest.newPassword}
                                    field='newPassword' password
                                    setFunc={setUserRequest} />
                            </Form.Group>
                        </Col>
                        <Col></Col>
                    </Row>
                    <Row>
                        <Col></Col>
                        <Col xs={9} md={4}>
                            <Form.Group>
                                <Form.Label>再次输入新密码</Form.Label>
                                <InputWithClear value={userRequest.confirmPassword}
                                    field='confirmPassword' password
                                    setFunc={setUserRequest} />
                            </Form.Group>
                        </Col>
                        <Col></Col>
                    </Row>
                </Form>
                <Row style={{marginTop: '2em'}}>
                    <Col></Col>
                    <Col xs={9} md={4}>
                        <span style={{color: '#fc6868'}}>{msg}</span>
                    </Col>
                    <Col></Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Container>
                    <Row>
                        <Col></Col>
                        <Col xs={3} md={2}>
                            <Button variant="warning" onClick={update} disabled={loading}>确定</Button>
                        </Col>
                        <Col xs={3} md={2}>
                            <Button variant="secondary" onClick={closeMe}>返回</Button>
                        </Col>
                    </Row>
                </Container>
            </Modal.Footer>
        </Modal>
    );
});

export default PasswordModal;