import React, { useState } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { cloudinaryUploadFile } from "../../api/userApi";
import { dispatchAlertError, dispatchAlertSuc } from "../../app/godispatch";
import ProgressBar from "../component/ProgressBar";
import UserLayout from "../component/UserLayout";

function CloudinaryUploadPage(props) {

    const [loading, setLoading] = useState(false)
    const [percent, setPercent] = useState(0);
    const [resData, setResData] = useState(null);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [source, setSource] = useState("");

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
        form.append('title', title)
        form.append('desc', desc)
        form.append('source', source)

        // abortController = new AbortController();

        cloudinaryUploadFile(form, onUploadProgress)
            .then((res) => {
                setResData(JSON.stringify(res.data))
                dispatchAlertSuc('send success')
                setTimeout(() => {
                    setLoading(false)
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
    }

    return (
        <UserLayout>
            <Modal show={true} animation={true} fullscreen={true} size="xl" backdrop={'static'} >
                <Modal.Header>
                    <Modal.Title>Upload Cloudinary</Modal.Title>
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
                                <Form.Group>
                                    <Form.Label>title</Form.Label>
                                    <Form.Control as="textarea" rows={5}
                                        onChange={e => setTitle(e.target.value)}
                                        value={title} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>desc</Form.Label>
                                    <Form.Control as="textarea" rows={5}
                                        onChange={e => setDesc(e.target.value)}
                                        value={desc} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Source link</Form.Label>
                                    <Form.Control as="textarea" rows={1}
                                        onChange={e => setSource(e.target.value)}
                                        value={source} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <ProgressBar percent={percent} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Container>
                                    <pre className="msgDetail">
                                        {resData}
                                    </pre>
                                </Container>
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
                        </Row>
                    </Container>
                </Modal.Footer>
            </Modal>
        </UserLayout>
    );
};

export default CloudinaryUploadPage;