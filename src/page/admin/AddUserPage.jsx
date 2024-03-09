import cn from "date-fns/locale/zh-CN";
import moment from "moment";
import React, { useImperativeHandle, useState } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { userAddRequest } from "../../api/adminApi";
import { dispatchAlertError, dispatchAlertInfo, dispatchAlertSuc } from "../../app/godispatch";
import InputWithClear from "../component/InputWithClear";
import './AddUserPage.css';

const AddUserPage = React.forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        showMe,
        closeMe
    }))

    const initRequest = {
        username: '',
        name: '',
        userSubscriptionRequest: {
            description: '开通账户订阅',
        }
    }
    const [modalShow, setModalShow] = useState(false);
    const [loading, setLoading] = useState(false)
    const [userRequest, setUserRequest] = useState(initRequest)
    const [expireDate, setExpireDate] = useState();
    const [initPassword, setInitPassword] = useState()

    function closeMe() {
        setUserRequest(initRequest)
        setExpireDate(null)
        setInitPassword(null)
        setModalShow(false);
    }

    function showMe() {
        setModalShow(true);
    }

    const createUser = () => {
        setLoading(true)
        // validate
        let currentParam = { ...userRequest }
        currentParam.userSubscriptionRequest.expireTime = moment(expireDate).toISOString()
        if (!currentParam.name || !currentParam.username || !currentParam.userSubscriptionRequest.expireTime) {
            dispatchAlertError('请填写完整')
            setLoading(false)
            return
        }

        // request
        userAddRequest(currentParam)
            .then((res) => {
                dispatchAlertSuc('添加成功')
                setInitPassword(res.data.initPassword)
            })
            .catch(err => {
                dispatchAlertError(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const copyInfo = () => {
        navigator.clipboard.writeText('用户名: ' + userRequest.username
            + ', 初始密码: ' + initPassword)
            .then(() => {
                dispatchAlertInfo('复制成功')
            })
            .catch((error) => {
                dispatchAlertError('复制失败')
            });
    }

    return (
        <Modal ref={ref} show={modalShow} onHide={closeMe} animation={true} fullscreen={true} size="xl" backdrop={'static'} >
            <Modal.Header>
                <Modal.Title>新增用户</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <Col></Col>
                        <Col xs={9} md={4}>
                            <Form.Group>
                                <Form.Label>姓名</Form.Label>
                                <InputWithClear value={userRequest.name}
                                    field='name'
                                    setFunc={setUserRequest} />
                            </Form.Group>
                        </Col>
                        <Col></Col>
                    </Row>
                    <Row>
                        <Col></Col>
                        <Col xs={9} md={4}>
                            <Form.Group>
                                <Form.Label>用户名</Form.Label>
                                <InputWithClear value={userRequest.username}
                                    field='username'
                                    setFunc={setUserRequest} />
                            </Form.Group>
                        </Col>
                        <Col></Col>
                    </Row>
                    <Row>
                        <Col></Col>
                        <Col xs={9} md={4}>
                            <Form.Group>
                                <Form.Label>用户订阅有效期至</Form.Label>
                                <Form.Control as={DatePicker}
                                    selected={expireDate}
                                    onChange={(date) => setExpireDate(date)}
                                    minDate={moment().toDate()}
                                    selectsStart
                                    dateFormat="yyyy-MM-dd"
                                    locale={cn}
                                >
                                </Form.Control>
                                <Button variant="outline-primary"
                                    onClick={() => setExpireDate(moment().add(1, 'y').add(1, 'd').toDate())}>一年</Button>
                            </Form.Group>
                        </Col>
                        <Col></Col>
                    </Row>
                    <Row>
                        <Col></Col>
                        <Col xs={9} md={4}>
                            <Form.Group>
                                <Form.Label>用户订阅描述信息</Form.Label>
                                <Form.Control as="textarea" rows={3}
                                    value={userRequest.userSubscriptionRequest.description}
                                    onChange={(e) => setUserRequest(
                                        prevState => ({
                                            ...prevState,
                                            userSubscriptionRequest: {
                                                ...prevState.userSubscriptionRequest,
                                                description: e.target.value
                                            }
                                        })
                                    )}
                                />
                            </Form.Group>
                        </Col>
                        <Col></Col>
                    </Row>
                </Form>
                {initPassword &&
                    <Row>
                        <Col></Col>
                        <Col xs={9} md={4}>
                            <Container className='showInitPswdContainer'>
                                <Row>
                                    请记录用户初始密码
                                </Row>
                                <Row onClick={copyInfo} className="pswdRow">
                                    <Col className='d-flex justify-content-center align-items-center'>{initPassword}</Col>
                                    <Col className="copyHint"> 点击复制 </Col>
                                </Row>
                                <Row>
                                    该密码只会在此出现一次，不可再次查询。用户可自行修改
                                </Row>
                            </Container>
                        </Col>
                        <Col></Col>

                    </Row>
                }
            </Modal.Body>
            <Modal.Footer>
                <Container>
                    <Row>
                        <Col></Col>
                        <Col xs={3} md={2}>
                            <Button variant="warning" onClick={createUser} disabled={loading || initPassword}>确定</Button>
                        </Col>
                        <Col xs={3} md={2}>
                            <Button variant="secondary" onClick={closeMe} disabled={loading}>取消</Button>
                        </Col>
                    </Row>
                </Container>
            </Modal.Footer>
        </Modal>
    );
});

export default AddUserPage;