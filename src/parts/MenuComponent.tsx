import type { MenuItem } from "../interfaces/Menu";
import { Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

type Props = { item: MenuItem; };

export default function MenuComponent({ item }: Props) {
  const { id, name, description, price_euro } = item;
  const price = Number(price_euro ?? 0);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const card = (
    <Card className="menu-component border-info" data-id={id}>
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        {description && <Card.Text>{description}</Card.Text>}
        <Card.Text>Price: €{price.toFixed(2)}</Card.Text>
      </Card.Body>
    </Card>
  );

  return (
    <Row>
      <Col className="text-center mb-3">
        {isAdmin ? (
          <Link
            to={`/menu/${id}/edit`}
            className="text-reset text-decoration-none"
          >
            {card}
          </Link>
        ) : (
          card
        )}
      </Col>
    </Row>
  );
}
