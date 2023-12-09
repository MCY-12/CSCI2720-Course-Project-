import React from 'react';
import { Navbar, Nav, NavDropdown, Offcanvas, Form, InputGroup, FormControl, Button, Container, Stack, Row, Col } from 'react-bootstrap';
import { useState } from 'react';

import './App.css';

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

//https://react-bootstrap.github.io/docs/getting-started/introduction
//if you need help on how the react bootstrap code is written ^^

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);
  const handleShow = () => setIsOpen(true);

  const [priceFilterTitle, setPriceFilterTitle] = useState("Under");

  const handlePriceFilterSelect = (eventKey) => {
    setPriceFilterTitle(eventKey);
  };
  /*
  
  */
  return (
    <div className="App">
      <Navbar bg="light" expand="lg">
        <Navbar.Brand className="ms-3" href="#" onClick={handleShow}>☰☰</Navbar.Brand>
        <Form inline className="me-auto" style={{width: "65%", minWidth: "300px", maxWidth: "600px"}}>
          <FormControl type="text" placeholder="Search" className="me-sm-2" />
        </Form>
        <Nav className="ml-auto">
          <Button className="me-3" variant="outline-success">Login</Button>
        </Nav>
      </Navbar>

      <Offcanvas show={isOpen} onHide={handleClose} style={{width: "75%"}}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Index</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form className="d-flex mb-3">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
          Temporary placeholder text. Will have filter/search + table with links in future. Backend people please handle the search code. Can someone help me add in the feature where if the window is sm or smaller then the offcanvas will take up the whole screen instead of 75%? Thanks.
        </Offcanvas.Body>
      </Offcanvas>

      <Stack direction="horizontal" gap={3}>
        <DropdownButton
          id="location-filter"
          variant="secondary"
          title="Location Filter"
          className="my-2 ms-3"
        >
          <Dropdown.Item href="#/action-1" active>Location 1 (change these)</Dropdown.Item>
          <Dropdown.Item href="#/action-2">Location 2</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item href="#/action-3">Location 3</Dropdown.Item>
          <Dropdown.Item href="#/action-4">Location 4</Dropdown.Item>
        </DropdownButton>

        <InputGroup className="my-2 me-3" style={{maxWidth: "500px"}}>
          <InputGroup.Text>Price:</InputGroup.Text>
          <DropdownButton variant="secondary" title={priceFilterTitle} id="price-filter-dropdown" onSelect={handlePriceFilterSelect}>
            <Dropdown.Item eventKey="Under">Under</Dropdown.Item>
            <Dropdown.Item eventKey="Over">Over</Dropdown.Item>
            <Dropdown.Item eventKey="Exactly">Exactly</Dropdown.Item>
          </DropdownButton>
          <FormControl placeholder="$" aria-label="price-filter-input-field"/>
        </InputGroup>
      </Stack>
      
      <Container fluid>
          <Col>
            <div className="placeholder">Map</div>
          </Col>    
      </Container>
      <Container fluid className="mx-3 pb-4 bg-light">
        <Row>
          <h3 className="my-2 fw-bold">Location Info:</h3>
          <p>blah blah blah</p>
          <p>someone set up the google maps api please</p>
          <p>blah blah blah</p>
          <p>blah blah blah</p>
        </Row>
        <Container fluid>
          <Container fluid className="border bg-secondary text-light">
            <Row>
              <h4 className="my-2 fw-bold">Comments:</h4>
              <p>This bg color kinda ugly ngl, and bootstrap color options kinda sucks</p>
              <p>Maybe I'll change the color manually using css later</p>
              <p>Everyone feel free to experiment and find a color u like :)</p>
            </Row>
          </Container>
            
        
        </Container>
      </Container>
      
      
      {isOpen && <Col className="col-4">Menu</Col>}
    </div>
  );
}

export default App;
