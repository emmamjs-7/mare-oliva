import { Container, Row, Col } from "react-bootstrap";
import { FaInstagram, FaPhone, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer>
      <Container fluid className="py-3 px-5 bg-primary text-white">
        <Row className="align-items-center">
          <Col>
            <small>&copy; 2025 Mare Oliva</small>
          </Col>

          <Col className="text-end">
            <address className="mb-0">
              <a href="tel:1234567890" className="text-white text-decoration-none d-block">
                <FaPhone /> 123-456-7890
              </a>
              <a href="mailto:info@oliva.com" className="text-white text-decoration-none d-block">
                <FaEnvelope /> info@oliva.com
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-decoration-none d-block"
              >
                <FaInstagram /> mareoliva
              </a>
            </address>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
