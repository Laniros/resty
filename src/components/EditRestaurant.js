import React, { useEffect, useState } from "react";
import * as firebase from "../firebase";
import { Form, Spinner, Button, Card } from "react-bootstrap";

function EditRestaurant() {
  const [allData, setAllData] = useState(null);
  const [resData, setResData] = useState(null);
  const [selectedRes, setSelectedRes] = useState(null);
  useEffect(() => {
    firebase.fetchResData().then((d) => {
      setAllData(d);
    });
  }, []);

  function renderRestarurantDetails(name) {
    return allData.filter((c) => {
      return c["name"] === name;
    });
  }

  return (
    <div>
      {allData ? (
        <div>
          <p>Select Restaurant to edit:</p>
          <Form>
            <Form.Control
              as="select"
              htmlSize={allData.length}
              onChange={(e) => setSelectedRes(e.target.value)}
              required
            >
              {Object.values(allData).map((d, i) => {
                return <option key={i}>{d.name}</option>;
              })}
            </Form.Control>
          </Form>

          {Object.values(renderRestarurantDetails(selectedRes)).map((d, i) => {
            return (
              <Card key={i} style={{ marginTop: "30px" }}>
                <Card.Header>{d.name}</Card.Header>
                <Card.Body>{d.vegan ? "vegan" : "not vegan"}</Card.Body>
              </Card>
            );
          })}
        </div>
      ) : (
        <Spinner
          animation="border"
          role="status"
          style={{ justifyContent: "center", marginTop: "20px" }}
        >
          <span className="sr-only">Loading...</span>
        </Spinner>
      )}
    </div>
  );
}

export default EditRestaurant;
