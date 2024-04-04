import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { Accordion, Button, Col, Container, Row } from "react-bootstrap";
import { deleteMessage, downloadFile, getFileByPage } from "../../api/userApi";
import { dispatchAlertError } from "../../app/godispatch";
import { formatBytes, makeid } from "../../app/utils";
import ClipboardCopy from "../component/ClipboardCopy";
import Loading from "../component/Loading";
import UserLayout from "../component/UserLayout";
import NewFileModal from "./NewFileModal";
import ShareFileLinkModal from "./ShareFileLinkModal";
import ShareLoginLinkModal from "./ShareLinkModal";

export default function UserFilePage() {
    document.title = "user files"
    const [searchParam, setSearchParam] = useState({
        pageNum: 1,
        pageSize: 10
    });
    const [currentSearchParam, setCurrentSearchParam] = useState({ ...searchParam })
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)
    const newFileModal = useRef(null)
    const shareFileModalRef = useRef(null)
    const shareLoginLinkModalRef = useRef(null)


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

        getFileByPage(param)
            .then(result => {
                if (result.data) {
                    setData(result.data)
                }
            })
            .catch(err => {
                dispatchAlertError(err)
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
                    dispatchAlertError(err)
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
        if (pageNum < 1) return
        setCurrentSearchParam({ ...currentSearchParam, pageNum: pageNum })
        search(pageNum)
    }

    const showQRCode = (url) => {
        shareLoginLinkModalRef.current.showQRCode(url, "QR code for File")
    }

    const download = (fId) => {
        downloadFile(fId)
            .then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);

                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                link.href = href;
                let filename = response.headers['content-disposition'].split('filename=')[1];
                filename = decodeURI(filename)
                link.setAttribute('download', filename); //or any other extension
                document.body.appendChild(link);
                link.click();

                // clean up "a" element & remove ObjectURL
                document.body.removeChild(link);
                URL.revokeObjectURL(href);
            })
            .catch(err => {
                dispatchAlertError(err)
            })
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
                        <Button variant="outline-primary" onClick={() => newFileModal.current.showMe()}>Upload</Button>
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
                                                    <Col xs={5}>
                                                        {item.name?.substring(0, 10)} ({formatBytes(item.size)})
                                                    </Col>
                                                    <Col xs={2}>
                                                        <ClipboardCopy copyText={item.name} />
                                                    </Col>
                                                    <Col xs={2}>
                                                        <Button size="sm" onClick={() => shareFileModalRef.current.showMe(item.id)}>Share</Button>
                                                    </Col>
                                                    <Col xs={3}>
                                                        <Button disabled size="sm" variant="outline-danger" onClick={() => delMsg(item.id)}>Delete</Button>
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
                                                <br />
                                                <Row>
                                                    <Col> {item.name} </Col>
                                                </Row>
                                                <Row>
                                                    <Col> {item.size} </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <Button size="sm" onClick={() => download(item.id)}>Download</Button>
                                                    </Col>
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
            <NewFileModal ref={newFileModal} />
            <ShareFileLinkModal ref={shareFileModalRef} confirmCallback={showQRCode} />
            <ShareLoginLinkModal ref={shareLoginLinkModalRef} />
        </UserLayout>
    )
}