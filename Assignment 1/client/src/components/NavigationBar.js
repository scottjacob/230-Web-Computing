import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

// Set token to sessionStorage
const token = localStorage.getItem("token");



function Logout() {
  localStorage.clear("token");
  window.location.assign("home");
}



export const Example = (props) => {

  if (token !== null){
    return (
      <div>
        <Navbar variant="dark" bg="dark" expand="lg">
          <Navbar.Brand href="home">Stocky</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="home">Home</Nav.Link>
              <Nav.Link href="stocks">Stocks</Nav.Link>
              <Nav.Link href="quote">Quote</Nav.Link>
              <Nav.Link href="PriceHistory">Price History</Nav.Link>
            </Nav>
            <Nav className="mr-sm-2">
              <Button className="mr-sm-2" variant="secondary" role="button" onClick={Logout} id="logoutButton">Logout</Button>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
    } else {
      return (
        <div>
          <Navbar variant="dark" bg="dark" expand="lg">
            <Navbar.Brand href="home">Stocky</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="home">Home</Nav.Link>
                <Nav.Link href="stocks">Stocks</Nav.Link>
                <Nav.Link href="quote">Quote</Nav.Link>
                <OverlayTrigger placement={'bottom'} overlay={<Tooltip id="tooltip-disabled">Login to access</Tooltip>}>
                  <span  className="d-inline-block">
                    <Nav.Link eventKey="disabled" disabled>Price History (restricted)</Nav.Link>
                  </span>
                </OverlayTrigger>
              </Nav>
              <Nav className="mr-sm-2">
                <Button className="mr-sm-2" variant="primary" role="button" href="login" id="loginButton">Login</Button>
                <Button variant="warning" role="button" href="signup" id="registerButton">Register</Button>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </div>
      );
    }
}
