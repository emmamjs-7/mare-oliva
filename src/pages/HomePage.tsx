import { Row, Col } from "react-bootstrap";
import ResponsiveImage from "../parts/ResponsiveImage";

HomePage.route = {
  path: "/",
  title: "Home"
};

export default function HomePage() {
  return (
    <>
      <Row className="align-items-center justify-content-center gy-4 my-4">
        <Col xs={12} md={7} className="order-1 order-md-1">
          <ResponsiveImage
            baseName="terrace"
            widths={[640, 1024, 1600]}
            alt="Sunset sea view from the terrace"
            aspectRatio="16x9"
            className="w-100 h-100 object-fit-cover"
            loading="lazy"
          />
        </Col>

        <Col xs={12} md={5} className="d-flex order-2 order-md-2">
          <div className="text-center text-dark my-auto px-3 px-md-4">
            <h3 className="mb-3">Welcome to Mare Oliva</h3>
            <p className="mb-0">
              “Feel the warmth of Sicily under the open sky. Our terrace invites you to linger over shared plates,
              surrounded by lemon trees, terracotta, and the timeless mosaic patterns of the Mediterranean.”
            </p>
          </div>
        </Col>
      </Row>

      <Row className="align-items-center justify-content-center gy-4 my-4">
        <Col xs={12} md={7} className="order-1 order-md-2">
          <ResponsiveImage
            baseName="seaview"
            widths={[640, 1024, 1600]}
            alt="Sunset sea view from the terrace"
            aspectRatio="16x9"
            className="w-100 h-100 object-fit-cover"
            loading="lazy"
          />
        </Col>

        <Col xs={12} md={5} className="d-flex order-2 order-md-1">
          <div className="text-center text-dark my-auto px-3 px-md-4">
            <h3 className="mb-3">Dining by the Sea</h3>
            <p className="mb-0">
              “Every meal tastes different when the horizon is your backdrop. At Mare Oliva, the sea breeze and golden
              sunsets become part of your table, turning dinner into a memory that lasts far beyond the night.”
            </p>
          </div>
        </Col>
      </Row>
    </>
  );
}
