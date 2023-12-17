import React, { useImperativeHandle, useState } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { uploadFile } from "../../api/userApi";
import { dispatchAlertError, dispatchAlertSuc } from "../../app/godispatch";

const NewFileModal = React.forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        showMe,
        closeMe
    }))

    const [modalShow, setModalShow] = useState(false);
    const [loading, setLoading] = useState(false)

    function closeMe() {
        setModalShow(false);
    }

    function showMe() {
        setModalShow(true);
    }

    const upload = () => {
        setLoading(true)
        const form = new FormData()
        form.append('file', document.querySelector('#formFile').files[0])
        
        /*
        axios.postForm('/api/file', {
            'file': document.querySelector('#formFile').files[0]
        })
        .finally(() => {
            setLoading(false)
        })
            */
        uploadFile(form)
            .then((res) => {
                dispatchAlertSuc('send success')
                setTimeout(() => {
                    setLoading(false)
                    closeMe()
                }, 1500)
            })
            .catch(err => {
                dispatchAlertError('send Failed')
                setLoading(false)
            })
    }

    return (
        <Modal ref={ref} show={modalShow} onHide={closeMe} animation={true} fullscreen={true} size="xl" backdrop={'static'} >
            <Modal.Header>
                <Modal.Title>Upload File</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <Col>
                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Label>File Upload</Form.Label>
                                <Form.Control type="file" />
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
                            <Button variant="warning" onClick={upload} disabled={loading}>UPLOAD</Button>
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

export default NewFileModal;