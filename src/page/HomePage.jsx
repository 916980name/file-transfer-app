import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import './HomePage.css';
import RoleLayout from './component/RoleLayout';

function Home() {
    document.title = 'file transfer'

    const navigate = useNavigate();

    return (
        <RoleLayout>
            <Container>
                <Row>
                    <Col>
                        <Button onClick={() => navigate("/login")}>Login</Button>
                    </Col>
                </Row>
            </Container>
        </RoleLayout>
    )
}

export default Home;