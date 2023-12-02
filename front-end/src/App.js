import React from 'react';
import { Navbar, Nav, Form, FormControl, Button, Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import './App.css';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="App">
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#" onClick={toggle}>☰</Navbar.Brand>
        <Form inline className="mx-auto">
          <FormControl type="text" placeholder="Search" className="mr-sm-2" />
        </Form>
        <Nav className="ml-auto">
          <Button variant="outline-success">Login</Button>
        </Nav>
      </Navbar>
      <Container fluid>
        <Row>
          <Col className={isOpen ? 'col-8' : 'col-12'}>
            <Row>
              <Col sm={12} md={6} lg={3} style={{ maxWidth: '400px' }}>
                <div className="filter">Location Filter</div>
              </Col>
              <Col sm={12} md={6} lg={3} style={{ maxWidth: '400px' }}>
                <div className="filter">Price Filter</div>
              </Col>
            </Row>
            <div className="placeholder">Map</div>
            <div>Location Info:</div>
            <div>Comments:</div>
          </Col>
          {isOpen && <Col className="col-4">Menu</Col>}
        </Row>
      </Container>
    </div>
  );
}

export default App;
