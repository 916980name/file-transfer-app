import { QRCodeCanvas } from 'qrcode.react';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';

const ShareLoginLinkModal = React.forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        showQRCode,
        closeMe
    }))

    const qrCodeShowSize = 256;

    const [printModalShow, setPrintModalShow] = useState(false);
    const [printUrl, setPrintUrl] = useState("undefined");
    const [qrCodeSize, setQrCodeSize] = useState(qrCodeShowSize);
    const templateCanvasRef = useRef(null);
    const qrCanvasRef = useRef(null);
    const templateCanvasColRef = useRef(null);
    const qrCodeCanvasColRef = useRef(null);
    useEffect(() => {
        checkElements();
    }, [printModalShow]);
    const [titleString, setTitleString] = useState("");

    function checkElements() {
        console.log("call check ele");
        templateCanvasColRef.current = document.getElementById("templateCanvasColId");
        qrCodeCanvasColRef.current = document.getElementById("qrCodeCanvasColId");
        qrCanvasRef.current = document.getElementById('qrPrintId');
        console.log("check qrCanvasRef: " + qrCanvasRef.current);
        console.log("check qrCanvasColRef: " + qrCodeCanvasColRef.current);
        console.log("check templateCanvasColRef: " + templateCanvasColRef.current);
    }

    function closeMe() {
        setPrintModalShow(false);
    }

    function showMe(next) {
        console.log("check url: " + printUrl);
        setPrintModalShow(true);
        if (next !== undefined) next();
    }

    function handlePrintModalClose() {
        setPrintModalShow(false);
    }

    const showQRCode = (url) => {
        setQrCodeSize(qrCodeShowSize);
        setTitleString("QR Code for login")
        setPrintUrl(url);
        showMe(() => setTimeout(() => {
            qrCodeCanvasColRef.current.style.display = "";
        }, 500));
    }

    return (
        <Modal ref={ref} show={printModalShow} onHide={handlePrintModalClose} animation={true} size="xl" backdrop={'static'} >
            <Modal.Header closeButton>
                <Modal.Title>{titleString}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className="justify-content-md-center">
                    <Col md="auto">
                        {printUrl}
                    </Col>
                </Row>
                <Row className="justify-content-md-center">
                    <Col id="qrCodeCanvasColId" md="auto" style={{ display: 'none' }}>
                        <QRCodeCanvas id="qrPrintId" level="L" value={printUrl} size={qrCodeSize} />
                    </Col>
                </Row>
                <Row className="justify-content-md-center">
                    <Col id="templateCanvasColId" md="auto" style={{ display: 'none' }}>
                        <canvas ref={templateCanvasRef}></canvas>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );
});

export default ShareLoginLinkModal;