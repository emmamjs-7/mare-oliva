import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
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
          expand="lg"
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
            <Navbar.Collapse id="main-navbar-nav" className="w-100">
              <div className="w-100 d-lg-flex align-items-lg-center flex-lg-nowrap">
                <Nav className="me-lg-3 flex-grow-1 flex-lg-wrap gap-lg-2">
                  <Nav.Link as={NavLink} to="/" end onClick={close}>Home</Nav.Link>
                  <Nav.Link as={NavLink} to="/about" onClick={close}>Contact</Nav.Link>
                  <Nav.Link as={NavLink} to="/menu" onClick={close}>Menu</Nav.Link>
                  <Nav.Link as={NavLink} to="/booking" onClick={close}>Book a table</Nav.Link>

                  {isAdmin && (
                    <NavDropdown title="Admin" align="end">
                      <NavDropdown.Item as={NavLink} to="/create-dish" onClick={close}>
                        Add dish to menu
                      </NavDropdown.Item>
                      <NavDropdown.Item as={NavLink} to="/adminbooking" onClick={close}>
                        Edit bookings
                      </NavDropdown.Item>
                    </NavDropdown>
                  )}
                </Nav>

                <Nav className="ms-lg-auto align-items-lg-center gap-lg-2 flex-shrink-0 text-nowrap">
                  {isAuthenticated && (
                    <Nav.Link as={NavLink} to="/mypage" onClick={close}>My bookings</Nav.Link>
                  )}
                  {!isAuthenticated ? (
                    <Nav.Link as={NavLink} to="/login" onClick={close}>Login</Nav.Link>
                  ) : (
                    <Nav.Link onClick={handleLogout} role="button">Logout</Nav.Link>
                  )}
                </Nav>
              </div>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>

      <HeaderImage />
      <div className="header-overlay position-absolute top-0 start-0 w-100 h-100" />
    </header>
  );
}
