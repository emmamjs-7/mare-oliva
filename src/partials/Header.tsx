import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import useNavbarToggle from "../utils/useNavbarToggle";

export default function Header() {
  const { expanded, toggle, close } = useNavbarToggle();

  return (
    <header>
      <Navbar
        expand="md"
        className="bg-primary"
        data-bs-theme="dark"
        fixed="top"
        expanded={expanded}
        onToggle={toggle}
      >
        <Container fluid>

          <Navbar.Brand as={NavLink} to="/" end onClick={close}>
            <img src="images/olives-svgrepo-com.svg" alt="olive bransch"
              width={30}
              height={30}
              className="me-2"
            />
            Mare Oliva
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/" end onClick={close}>
                Home
              </Nav.Link>
              <Nav.Link as={NavLink} to="/menu" onClick={close}>
                Menu
              </Nav.Link>
              <Nav.Link as={NavLink} to="/about" onClick={close}>
                About
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};


