import React from "react";
import { Button, Form } from "react-bootstrap";
function Footer() {
  return (
    <footer
      className="fixed-bottom"
      style={{
        flexShrink: 0,
        textAlign: "center",
        backgroundColor: "#0275d8",
        color: "white",
        height: "20em",
        width: "100%",
        position: "relative",
      }}
    >
      <Form
        style={{
          display: "flex",
          marginRight: "50px",
          float: "right",
        }}
      >
        <Form.Group>
          <Form.Label>Contact Us:</Form.Label>
          <Form.Control as="select">
            <option></option>
            <option>Info is incorrect</option>
            <option>Add a restarurant</option>
            <option>Other</option>
          </Form.Control>
          <Form.Control
            as="textarea"
            style={{ height: "100px" }}
            type="message"
            placeholder="Message"
            rows={3}
            required
          ></Form.Control>

          <Button style={{ display: "flex", float: "right" }}>Button</Button>
        </Form.Group>
      </Form>
    </footer>
  );
}

export default Footer;
