import React from "react";
import { Row, Spinner } from "react-bootstrap";

const Loading = () => {
    return (
        <Row className='d-flex justify-content-center align-items-center'>
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </Row>
    )
};

export default Loading;