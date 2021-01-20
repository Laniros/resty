import React, { useState, useEffect } from "react";
import { Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import firebase, { fetchRole } from "../firebase";

export default function Dashboard() {
  const [error] = useState("");
  const { currentUser } = useAuth();
  const [role, setRole] = useState(0);

  useEffect(() => {
    if (currentUser) {
      fetchRole(currentUser).then((r) => {
        setRole(r);
      });
    }
  }, []);

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email: {currentUser.email}</strong>
          {role > 0 && (
            <Link to="/add-restaurants" className="btn btn-primary w-100 mt-3">
              Add restaurants
            </Link>
          )}
          <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
            Update Profile
          </Link>
          <Link to="/prefernces" className="btn btn-primary w-100 mt-3">
            Update Preferences
          </Link>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2"></div>
    </>
  );
}
