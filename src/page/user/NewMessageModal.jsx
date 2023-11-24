import React, { useImperativeHandle, useState } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { putMessage } from "../../api/userApi";
import { dispatchAlertError, dispatchAlertSuc } from "../../app/godispatch";

const NewMessageModal = React.forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        showMe,
        closeMe
    }))

    const initRequest = {
        info: null,
    }
    const [modalShow, setModalShow] = useState(false);
    const [loading, setLoading] = useState(false)
    const [msgRequest, setMsgRequest] = useState(initRequest)

    function closeMe() {
        setMsgRequest(initRequest)
        setModalShow(false);
    }

    function showMe() {
        setModalShow(true);
    }

    const send = () => {
        setLoading(true)
        // validate
        let currentParam = { ...msgRequest }
        if (!msgRequest.info) {
            dispatchAlertError('please type your message')
            setLoading(false)
            return
        }
        if (msgRequest.info.length < 1) {
            dispatchAlertError('message at least length 1')
            setLoading(false)
            return
        }
        // request
        putMessage(currentParam)
            .then((res) => {
                dispatchAlertSuc('send success')
                setTimeout(() => {
                    setLoading(false)
                    closeMe()
                }, 1500)
            })
            .catch(err => {
                setLoading(false)
            })
    }

    return (
        <Modal ref={ref} show={modalShow} onHide={closeMe} animation={true} fullscreen={true} size="xl" backdrop={'static'} >
            <Modal.Header>
                <Modal.Title>send message</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>message</Form.Label>
                                <Form.Control as="textarea" rows={15}
                                    onChange={e => setMsgRequest(prevState => ({
                                        ...prevState,
                                        info: e.target.value
                                    }))}
                                    value={msgRequest.info} />
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Container>
                    <Row>
                        <Col></Col>
                        <Col xs={3} md={2}>
                            <Button variant="warning" onClick={send} disabled={loading}>Send</Button>
                        </Col>
                        <Col xs={3} md={2}>
                            <Button variant="secondary" onClick={closeMe}>Close</Button>
                        </Col>
                    </Row>
                </Container>
            </Modal.Footer>
        </Modal>
    );
});

export default NewMessageModal;