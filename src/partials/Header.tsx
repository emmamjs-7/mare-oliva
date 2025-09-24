import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import useNavbarToggle from "../utils/useNavbarToggle";
import { useAuth } from "../auth/AuthContext";

export default function Header() {
  const { expanded, toggle, close } = useNavbarToggle();
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    close();
    navigate("/", { replace: true });
  }

  return (
    <header>
      <Navbar
        as="nav"
        aria-label="Main navigation"
        expand="md"
        className="bg-primary"
        data-bs-theme="dark"
        fixed="top"
        expanded={expanded}
        onToggle={toggle}
      >
        <Container fluid>
          <Navbar.Brand as={NavLink} to="/" end onClick={close} className="d-flex align-items-center">
            <img src="images/olives-svgrepo-com.svg" alt="Mare Oliva logo" width={30} height={30} className="me-2" />
            Mare Oliva
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-navbar-nav" />
          <Navbar.Collapse id="main-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/" end onClick={close}>Home</Nav.Link>
              <Nav.Link as={NavLink} to="/about" onClick={close}>About Us</Nav.Link>
              <Nav.Link as={NavLink} to="/menu" onClick={close}>Restaurant Menu</Nav.Link>
              <Nav.Link as={NavLink} to="/booking" onClick={close}>Book a table</Nav.Link>

              {isAdmin && (
                <Nav.Link as={NavLink} to="/create-dish" onClick={close}>
                  Add dish to menu
                </Nav.Link>
              )}
            </Nav>

            <Nav>
              {!isAuthenticated && (
                <Nav.Link as={NavLink} to="/login" onClick={close}>
                  Login
                </Nav.Link>
              )}

              {isAuthenticated && (
                <Nav.Link onClick={handleLogout} role="button">
                  Logout
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
