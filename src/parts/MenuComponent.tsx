import type { MenuItem } from "../interfaces/Menu";
import { Row, Col, Card } from "react-bootstrap";

type Props = { item: MenuItem; };

export default function MenuComponent({ item }: Props) {
  const {
    id, name, description, price_euro,
  } = item;

  const priceNumber =
    typeof price_euro === "number" ? price_euro : Number(price_euro ?? 0);

  return (
    <Row>
      <Col className="text-center mb-3">
        <Card className="menu-component" data-id={id}>
          <Card.Body>
            <Card.Title>{name}</Card.Title>
            {description && <Card.Text>{description}</Card.Text>}
            <Card.Text>Price: ${priceNumber.toFixed(2)}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
