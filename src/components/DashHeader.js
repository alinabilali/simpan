import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Logo from '../assets/img/simpanlogo.png';
import { useSendLogoutMutation } from '../features/auth/authApiSlice';

const DashHeader = () => {
  const navigate = useNavigate();

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) navigate('/');
  }, [isSuccess, navigate]);

  if (isLoading) return <p>Logging Out...</p>;

  if (isError) return <p>Error: {error.data?.message}</p>;

  const content = (
    <>
      <Navbar key="lg" bg="light" expand="lg" className="mb-3">
        <Container fluid>
          <Navbar.Brand>
            <Link to="/dash">
              <img src={Logo} width="200" alt="SIMPAN logo" />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-lg`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-lg`}
            aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-lg`}>
                SIMPAN
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-center flex-grow-1 pe-4">
                <Nav.Link as={Link} to="/dash">
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/dash/food">
                  Food List
                </Nav.Link>
                <Nav.Link as={Link} to="/dash/food/recipe">
                  Get Recipe
                </Nav.Link>
                <NavDropdown
                  title="Add Food"
                  id={`offcanvasNavbarDropdown-expand-lg`}
                >
                  <NavDropdown.Item>
                    {' '}
                    <Nav.Link as={Link} to="/dash/food/scan">
                      Scan Food
                    </Nav.Link>
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <Nav.Link as={Link} to="/dash/food/new">
                      Write Food Info
                    </Nav.Link>
                  </NavDropdown.Item>
                </NavDropdown>

                <Nav.Link as={Link} onClick={sendLogout}>
                  Logout
                </Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );

  return content;
};
export default DashHeader;
