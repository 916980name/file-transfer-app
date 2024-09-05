import React, { useRef, useState } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { uploadFile } from "../../api/userApi";
import { dispatchAlertError, dispatchAlertSuc } from "../../app/godispatch";
import FileHandler from "../component/FileHandler";
import ProgressBar from "../component/ProgressBar";
import UserLayout from "../component/UserLayout";

const FileHandlerUploadPage = (props) => {
    const navigate = useNavigate()

    const fileHandlerRef = useRef();

    const [loading, setLoading] = useState(false)
    const [percent, setPercent] = useState(0);
    const abortController = new AbortController();

    function closeMe() {
        navigate('/user/file')
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
        fileHandlerRef.current.beginHandleAllFile()
    }

    const doUpload = async (file) => {
        setLoading(true)
        const form = new FormData()
        form.append('file', file)

        try {
            await uploadFile(form, onUploadProgress, abortController)
            dispatchAlertSuc('send success')
            fileHandlerRef.current.markFileAsHandled(file.name)
        } catch (err) {
            var basicMsg = file.name + ' send Failed'
            dispatchAlertError(err.message ? err.message + basicMsg : basicMsg);
        } finally {
            setLoading(false)
            setPercent(0);
        }
    }

    const doCancelUpload = () => {
        if (abortController) {
            abortController.abort();
            setPercent(0);
        }
    }

    return (
        <UserLayout>
            <Modal show onHide={closeMe} animation={true} fullscreen={true} size="xl" backdrop={'static'} >
                <Modal.Header>
                    <Modal.Title>Upload File</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col>
                                <Form.Group controlId="formFile" className="mb-3">
                                    <Form.Label>File Upload</Form.Label>
                                    {/* <Form.Control type="file" /> */}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <ProgressBar percent={percent} />
                            </Col>
                        </Row>
                    </Form>
                    <FileHandler ref={fileHandlerRef} customHandler={doUpload} />
                </Modal.Body>
                <Modal.Footer>
                    <Container>
                        <Row>
                            <Col xs={3} md={2}>
                                <Button variant="danger" onClick={cancel} disabled={!loading}>CANCEL</Button>
                            </Col>
                            <Col></Col>
                            <Col xs={3} md={2}>
                                <Button variant="warning" onClick={() => upload()} disabled={loading}>UPLOAD</Button>
                            </Col>
                            <Col xs={3} md={2}>
                                <Button variant="secondary" onClick={closeMe}>Close</Button>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Footer>
            </Modal>
        </UserLayout>
    );
}

export default FileHandlerUploadPage;