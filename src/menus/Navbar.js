import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useAuth } from "../contexts/AuthContext";

export default function NavBar() {
  const { currentUser } = useAuth();
  return (
    <>
      <Navbar bg="primary" variant="dark" style={{ minWidth: 700 }}>
        <Navbar.Brand href="/">Resty</Navbar.Brand>
        <Nav className="mr-auto">
          {currentUser && <Nav.Link href="/">Home</Nav.Link>}

          {!currentUser && <Nav.Link href="#features">Features</Nav.Link>}
        </Nav>
      </Navbar>
    </>
  );
}
