import React, { useRef, useState } from "react";
import { Card, Button, Form, Alert, Modal } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import firebase from "../firebase";

//TODO: decide what to do (keep/delete/use otherwise) with the modal option

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signUp } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    setError("");
    setLoading(true);

    const res = await signUp(emailRef.current.value, passwordRef.current.value);
    console.log(res);
    if (res === undefined) {
      setError("Can't create the account. contact us if the problem persist");
      setLoading(false);
    } else if (res === "auth/email-already-in-use") {
      setError("Email is taken by another account");
      setLoading(false);
    } else if (res === "auth/invalid-email") {
      setError("Email is not valid");
      setLoading(false);
    } else if (res === "auth/weak-password") {
      setError(
        "Password is weak. We suggest using capital letters and numbers"
      );
      setLoading(false);
    } else {
      const firestore = firebase.firestore();
      const usersRef = firestore.collection("users").doc(res);
      const addingUserData = await usersRef.set({
        email: emailRef.current.value,
        role: 0,
      });

      setLoading(false);
      showModal();
    }
  }

  const showModal = () => {
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
    history.push("/");
  };

  const handlePref = (e) => {
    console.log("yes");
  };

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          {error && <Alert variant="danger">{error}</Alert>}
        </Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group id="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" ref={emailRef} required />
          </Form.Group>
          <Form.Group id="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" ref={passwordRef} required />
          </Form.Group>
          <Form.Group id="password-confirm">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password" ref={passwordConfirmRef} required />
          </Form.Group>
          <Button disabled={loading} className="w-100" type="submit">
            Sign Up
          </Button>
        </Form>
        <div className="w-100 text-center mt-2">
          Already have an account? <Link to="/login">Log In</Link>
        </div>
        <Modal
          show={isOpen}
          onHide={hideModal}
          animation={false}
          backdrop="static"
        >
          <Modal.Header>
            <Modal.Title>Congrats! You are now part of our own</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <b>You can now select your preferences</b>
            </p>
            <p>You can change them anytime through your profile</p>
          </Modal.Body>
          <Form>
            <div key={`default-checkbox`} className="mb-3 ml-4">
              <Form.Check
                inline
                type={"checkbox"}
                id={`vegan`}
                label={`Vegan`}
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
          </Form>
          <Modal.Footer>
            <Button variant="secondary" onClick={hideModal}>
              Skip
            </Button>
            <Button variant="secondary" onClick={(e) => handlePref(e)}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </Card>
    </>
  );
}
