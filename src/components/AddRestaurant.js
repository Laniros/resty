import React, { useState, useEffect, useRef } from "react";
import { Card, Alert, Form, Button } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import firebase from "../firebase";

export default function AddRestaurant() {
  const [error] = useState("");
  const { currentUser } = useAuth();
  const [role, setRole] = useState(0);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const nameRef = useRef();
  const addressRef = useRef();
  const veganRef = useRef();
  const vegeterianRef = useRef();
  const glutenFreeRef = useRef();
  const chineseRef = useRef();
  const italianRef = useRef();

  async function handleSubmit(e) {
    e.preventDefault();
    const db = firebase.database();
    var ref = db.ref("restaurants");
    var resRef = ref.child(nameRef.current.value);

    //TODO: Complete every reference and put it in database
    await resRef.set({
      address: addressRef.current.value,
      vegan: veganRef.current.checked,
    });
  }

  const usersRef = firebase.database().ref(`users`);
  useEffect(() => {
    usersRef.once("value", (snap) => {
      snap.forEach(function () {
        firebase
          .database()
          .ref("users")
          .child(currentUser.uid)
          .once("value", (snap) => {
            if (snap.val()) setRole(snap.val().role);
          });
      });
    });
  }, []);

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Add Restarurant</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {role > 0 && (
            <Form onSubmit={handleSubmit}>
              <Form.Group id="name">
                <Form.Label>Name</Form.Label>
                <Form.Control type="name" ref={nameRef} required />
              </Form.Group>
              <Form.Group id="address">
                <Form.Label>Address</Form.Label>
                <Form.Control type="address" ref={addressRef} required />
              </Form.Group>
              <div key={`default-checkbox1`} className="mb-3 ml-4">
                <p>Is it:</p>
                <Form.Check
                  inline
                  type={"checkbox"}
                  id={`vegan`}
                  label={`Vegan`}
                  ref={veganRef}
                ></Form.Check>
                <Form.Check
                  inline
                  label="Vegeterian"
                  type={"checkbox"}
                  id={`vegeterian`}
                />
                <Form.Check
                  inline
                  type={"checkbox"}
                  id={`Gluten-Free`}
                  label={`Gluten-Free`}
                ></Form.Check>
              </div>
              <div key={`default-checkbox2`} className="mb-3 ml-4">
                <p>Food type:</p>
                <Form.Check
                  inline
                  type={"checkbox"}
                  id={`italian`}
                  label={`Italian`}
                ></Form.Check>
                <Form.Check
                  inline
                  label="Chinese"
                  type={"checkbox"}
                  id={`chinese`}
                />
                <Form.Check
                  inline
                  type={"checkbox"}
                  id={`thai`}
                  label={`Thai`}
                ></Form.Check>
              </div>
              <Button disabled={loading} className="w-100" type="submit">
                Sign Up
              </Button>
            </Form>
          )}
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2"></div>
    </>
  );
}
