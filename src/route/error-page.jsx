import { Col, Container, Row } from "react-bootstrap";
import { useRouteError } from "react-router-dom";
import UserLayout from "../page/component/UserLayout";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <UserLayout>
      <Container id="error-page" className="d-flex align-items-center" style={{ height: '100vh' }}>
        <Row>
          <Col>
            <Row style={{ width: '100vw' }}>
              <Col className="d-flex justify-content-center">
                <h3>Page Not Found</h3>
              </Col>
            </Row>
            <Row style={{ width: '100vw' }}>
              <Col className="d-flex justify-content-center">
                <h4>{error.statusText || error.message}</h4>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </UserLayout>
  );
}