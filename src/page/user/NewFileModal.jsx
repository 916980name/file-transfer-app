import React, { useImperativeHandle, useState } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { uploadFile } from "../../api/userApi";
import { dispatchAlertError, dispatchAlertSuc } from "../../app/godispatch";
import ProgressBar from "../component/ProgressBar";

const NewFileModal = React.forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        showMe,
        closeMe
    }))

    const { doSearch } = props
    const [modalShow, setModalShow] = useState(false);
    const [loading, setLoading] = useState(false)
    const [percent, setPercent] = useState(0);
    const abortController = new AbortController();

    function closeMe() {
        setModalShow(false);
    }

    function showMe() {
        setModalShow(true);
    }

    function cancel() {
        if (loading) {
            if (window.confirm("Cancel the Uploading")) {
                doCancelUpload();
            }
        }
    }

    const onUploadProgress = (progressEvent) => {
        setPercent(Math.floor((progressEvent.loaded * 100) / progressEvent.total));
    }

    const upload = () => {
        setLoading(true)
        const form = new FormData()
        form.append('file', document.querySelector('#formFile').files[0])

        // abortController = new AbortController();

        uploadFile(form, onUploadProgress, abortController)
            .then((res) => {
                dispatchAlertSuc('send success')
                setTimeout(() => {
                    setLoading(false)
                    doSearch()
                    closeMe()
                }, 1500)
            })
            .catch(err => {
                dispatchAlertError(err.message ? err.message : 'send Failed');
                setLoading(false)
            }).finally(() => {
                // abortController = null;
                setPercent(0);
            })
    }

    const doCancelUpload = () => {
        if (abortController) {
            abortController.abort();
            setPercent(0);
        }
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
                    <Row>
                        <Col>
                            <ProgressBar percent={percent} />
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Container>
                    <Row>
                        <Col xs={3} md={2}>
                            <Button variant="danger" onClick={cancel} disabled={!loading}>CANCEL</Button>
                        </Col>
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