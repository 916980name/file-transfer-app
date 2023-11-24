import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { Accordion, Button, Col, Container, Row } from "react-bootstrap";
import { deleteMessage, getMessageByPage } from "../../api/userApi";
import { dispatchAlertError } from "../../app/godispatch";
import { makeid } from "../../app/utils";
import ClipboardCopy from "../component/ClipboardCopy";
import Loading from "../component/Loading";
import UserLayout from "../component/UserLayout";
import NewMessageModal from "./NewMessageModal";

export default function UserMessagePage() {
    const [searchParam, setSearchParam] = useState({
        pageNum: 1,
        pageSize: 10
    });
    const [currentSearchParam, setCurrentSearchParam] = useState({...searchParam})
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)
    const newMessageModal = useRef(null)

    const search = (pageNo, newSearchParam) => {
        setLoading(true)
        if (!pageNo) {
            pageNo = 1;
        }
        let param
        if (newSearchParam) {
            param = { ...newSearchParam, pageNum: pageNo }
        } else {
            param = { ...currentSearchParam, pageNum: pageNo }
        }

        getMessageByPage(param)
            .then(result => {
                if (result.data) {
                    setData(result.data)
                }
            })
            .catch(err => {
                dispatchAlertError(err.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        clickSearch()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const clickSearch = () => {
        setCurrentSearchParam({ ...searchParam })
        search(0, searchParam)
    }

    const delMsg = (msgId) => {
        if (window.confirm("Confirm delete ! ")) {
            setLoading(true)
            deleteMessage(msgId)
                .then(res => { clickSearch() })
                .catch(err => {
                    dispatchAlertError(err.message)
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }

    const nextPage = (isGoNext) => {
        let pageNoBias = 1
        if (!isGoNext) pageNoBias = -1
        let pageNum = currentSearchParam.pageNum + pageNoBias
        if(pageNum < 1) return
        setCurrentSearchParam({ ...currentSearchParam, pageNum: pageNum })
        search(pageNum)
    }

    const copyMsg = (str) => {

    }

    return (
        <UserLayout>
            <Container style={{ marginBottom: '1em', borderBottom: '1px solid' }}>
                <Row>
                    <Col xs={4} >
                        Page No. {currentSearchParam.pageNum}
                    </Col>
                    <Col xs={2} >
                        {currentSearchParam.pageNum > 1 &&
                            <Button variant="primary" onClick={() => nextPage(false)}>&nbsp;&lt;&lt;&nbsp;</Button>
                        }
                    </Col>
                    <Col xs={2} >
                        <Button variant="primary" onClick={() => nextPage(true)}>&nbsp;&gt;&gt;&nbsp;</Button>
                    </Col>
                    <Col className="d-flex justify-content-end align-items-center">
                        <Button variant="outline-primary" onClick={() => newMessageModal.current.showMe()}>new message</Button>
                    </Col>
                </Row>
            </Container>
            {loading && <Loading />}
            {!loading && data &&
                <>
                    <Accordion>
                        {
                            data.map((item, index) => {
                                return (
                                    <Accordion.Item eventKey={makeid(5)}>
                                        <Accordion.Header>
                                            <Container>
                                                <Row>
                                                    <Col>
                                                        {item.info?.substring(0, 10)}
                                                    </Col>
                                                    <Col className="d-flex justify-content-end align-items-center">
                                                        <ClipboardCopy copyText={item.info}/>
                                                    </Col>
                                                    <Col className="d-flex justify-content-end align-items-center">
                                                        <Button variant="outline-danger" onClick={() => delMsg(item.id)}>Delete</Button>
                                                    </Col>
                                                </Row>
                                            </Container>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <Container>
                                                <Row>
                                                    <Col>
                                                        Create Time: {moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss.SSS")}
                                                    </Col>
                                                </Row>
                                                <br/>
                                                <Row>
                                                    <Col> {item.info} </Col>
                                                </Row>
                                            </Container>
                                        </Accordion.Body>
                                    </Accordion.Item>

                                )
                            })
                        }
                    </Accordion>
                </>
            }
            <NewMessageModal ref={newMessageModal} />
        </UserLayout>
    )
}