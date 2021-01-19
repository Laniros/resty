import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useAuth } from "../contexts/AuthContext";
import Dashboard from "../components/Dashboard";
import userpic from "../components/userpic.png";

export default function NavBar() {
  const { currentUser } = useAuth();
  const { logout } = useAuth();
  const history = useHistory();
  const [error, setError] = useState();
  async function logoutUser() {
    try {
      await logout();
      history.push("/");
    } catch {
      setError("Failed to log out");
    }
  }

  return (
    <>
      <Navbar bg="primary" variant="dark" style={{ minWidth: 700 }}>
        <Navbar.Brand href="/">Resty</Navbar.Brand>
        <Nav className="container-fluid">
          {currentUser && <Nav.Link href="/">Home</Nav.Link>}
          {currentUser && (
            <Nav.Link className="ml-auto" onClick={logoutUser} href="/">
              Logout
            </Nav.Link>
          )}
          {currentUser && (
            <Nav.Link className="ml-right" href="/dashboard">
              <img
                alt="icon"
                src={userpic}
                style={{ height: 20, float: "right", marginLeft: 10 }}
              />
            </Nav.Link>
          )}
          {!currentUser && (
            <Nav.Link className="ml-auto" href="/signup">
              Register
            </Nav.Link>
          )}
          {!currentUser && (
            <Nav.Link className="ml-right" href="/login">
              Login
            </Nav.Link>
          )}
        </Nav>
      </Navbar>
    </>
  );
}
