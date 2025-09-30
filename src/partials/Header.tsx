import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import useNavbarToggle from "../utils/useNavbarToggle";
import { useAuth } from "../auth/AuthContext";
import HeaderImage from "../parts/HeaderImage";

export default function Header() {
  const { expanded, toggle, close } = useNavbarToggle();
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();

  async function handleLogout(): Promise<void> {
    await logout();
    close();
    navigate("/", { replace: true });
  }

  return (
    <header className="position-relative">
      <div className="position-absolute top-0 start-0 w-100 z-3">
        <Navbar
          as="nav"
          expand="md"
          className="navbar-glass"
          data-bs-theme="light"
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
                <Nav.Link as={NavLink} to="/about" onClick={close}>Contact</Nav.Link>
                <Nav.Link as={NavLink} to="/menu" onClick={close}>Menu</Nav.Link>
                <Nav.Link as={NavLink} to="/booking" onClick={close}>Book a table</Nav.Link>
                {isAdmin && <Nav.Link as={NavLink} to="/create-dish" onClick={close}>Add dish to menu</Nav.Link>}
              </Nav>
              <Nav>
                {!isAuthenticated
                  ? <Nav.Link as={NavLink} to="/login" onClick={close}>Login</Nav.Link>
                  : <Nav.Link onClick={handleLogout} role="button">Logout</Nav.Link>}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
      <HeaderImage />

      <div className="header-overlay position-absolute top-0 start-0 w-100 h-100" />
    </header >
  );
}
