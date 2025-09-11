import { Row, Col } from 'react-bootstrap';

HomePage.route = {
  path: '/',
  title: 'Home'
};

export default function HomePage() {
  return <>
    <Row>
      <Col>
        <h2 className="text-primary">Home</h2>
      </Col>
    </Row>
  </>;
}