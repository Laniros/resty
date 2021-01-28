import React from "react";
import { Form, Card, Button } from "react-bootstrap";

function RequestRestaurant() {
  return (
    <Card id="1">
      <Card.Header>
        <Form>
          <Form.Group>
            <Form.Control type="name" placeholder="Name of dish" />
          </Form.Group>
        </Form>
      </Card.Header>
      <Card.Body>
        <Form>
          <Form.Group>
            <Form.Control
              style={{ height: "100px" }}
              type="description"
              placeholder="Description"
            />
          </Form.Group>
        </Form>
        <div>
          Category:
          <Form.Check
            style={{ marginLeft: "10px" }}
            inline
            type={"checkbox"}
            id={`first`}
            label={`First`}
          ></Form.Check>
          <Form.Check
            inline
            type={"checkbox"}
            id={`main`}
            label={`Main`}
          ></Form.Check>
          <Form.Check
            inline
            type={"checkbox"}
            id={`desert`}
            label={`Desert`}
          ></Form.Check>
        </div>
        <div
          className="camera-buttons"
          style={{
            display: "table",
            width: "100%",
          }}
        ></div>
      </Card.Body>
      <Card.Footer>
        <Button onClick={() => console.log("hi")} style={{ float: "right" }}>
          Submit Dish
        </Button>
      </Card.Footer>
    </Card>
  );
}

export default RequestRestaurant;
