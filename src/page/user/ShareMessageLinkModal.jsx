import React, { useImperativeHandle, useState } from 'react';
import { Button, Container, Form, Offcanvas, Tab, Tabs } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { shareMessageLink } from '../../api/userApi';
import { dispatchAlertError, dispatchAlertSuc } from '../../app/godispatch';
import Loading from '../component/Loading';
/**
 TypeError: class constructors must be invoked with 'new'
 because: 
    import { Button, Container, Form, Offcanvas, Tab, Tabs } from 'bootstrap';
*/

const ShareMessageLinkModal = React.forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        showMe,
        closeMe
    }))

    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false);
    const [shareMsgId, setShareMsgId] = useState("");
    const [type, setType] = useState(0)
    const [expire, setExpire] = useState(1)
    const { confirmCallback } = props

    function closeMe() {
        setShow(false);
    }

    const showMe = (mId) => {
        setShareMsgId(mId);
        setShow(true)
    }

    const confirmMe = () => {
        setLoading(true)
        shareMessageLink(shareMsgId, {
            expireType: parseInt(type),
            expire: parseInt(expire)
        })
            .then((res) => {
                dispatchAlertSuc('create success')
                setTimeout(() => {
                    setLoading(false)
                    closeMe()
                    confirmCallback(res.data)
                }, 1000)
            })
            .catch(err => {
                dispatchAlertError('error: ' + err.message)
                setLoading(false)
            })
    }

    function BtnLine() {
        return (
            <Container>
                {loading && <Loading />}
                {!loading &&
                    <Row>
                        <Col className='d-flex justify-content-center align-items-center'>
                            <Button variant="secondary" onClick={closeMe}>Cancel</Button>
                        </Col>
                        <Col className='d-flex justify-content-center align-items-center'>
                            <Button variant="success" onClick={confirmMe}>Confirm</Button>
                        </Col>
                    </Row>
                }
            </Container>
        )
    }

    return (
        <Offcanvas ref={ref} show={show} onHide={() => setShow(false)}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Share Settings</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Container>
                    <Row>
                        <Col>Message ID:</Col>
                        <Col>{shareMsgId}</Col>
                    </Row>
                </Container>
                <Tabs
                    defaultActiveKey="profile"
                    id="uncontrolled-tab-example"
                    className="mb-3"
                    activeKey={type}
                    onSelect={(k) => setType(k)}
                    fill
                >
                    <Tab eventKey={0} title="Times">
                        Expired after have been read
                        <Form.Control size="lg" type="number" placeholder={expire} onChange={(e) => setExpire(e.target.value)} />
                        times
                        <hr />
                        <BtnLine />
                    </Tab>
                    <Tab eventKey={1} title="Duration">
                        Expired after
                        <Form.Control size="lg" type="number" placeholder={expire} onChange={(e) => setExpire(e.target.value)} />
                        minutes
                        <hr />
                        <BtnLine />
                    </Tab>
                </Tabs>
            </Offcanvas.Body>
        </Offcanvas>
    );
});

export default ShareMessageLinkModal;