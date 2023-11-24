import { Button, Col, Container, Row } from "react-bootstrap";
import UserLayout from "../page/component/UserLayout";

export default function NoAuthPage() {

  return (
    <UserLayout>
      <Container className="d-flex align-items-center" style={{ height: '100vh' }}>
        <Row>
          <Col>
            <Row style={{ width: '100vw' }}>
              <Col className="d-flex justify-content-center">
                <h3>Login Expired</h3>
              </Col>
            </Row>
            <Row style={{ width: '100vw' }}>
              <Col className="d-flex justify-content-center">
                <h4>Please 
                  <Button variant="outline-success">
                    <a href="/login"> Login Again</a>
                  </Button>
                  后使用
                </h4>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </UserLayout>
  );
}