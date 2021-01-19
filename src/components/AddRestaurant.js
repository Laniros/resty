import React, { useState, useEffect, useRef } from "react";
import { Card, Alert, Form, Button } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import firebase from "../firebase";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

export default function AddRestaurant() {
  const [error] = useState("");
  const { currentUser } = useAuth();
  const [role, setRole] = useState(0);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const nameRef = useRef();

  const veganRef = useRef();
  const vegeterianRef = useRef();
  const glutenFreeRef = useRef();

  //food types:
  const chineseRef = useRef();
  const italianRef = useRef();

  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latlng = await getLatLng(results[0]);
    setAddress(value);
    setCoordinates(latlng);
  };
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const db = firebase.database();
    var ref = db.ref("restaurants");

    //TODO: Complete every reference and put it in database
    //Add google location to address field
    await ref.push({
      name: nameRef.current.value,
      coordinates: coordinates,
      vegan: veganRef.current.checked,
      vegeterian: vegeterianRef.current.checked,
      glutenFree: glutenFreeRef.current.checked,
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
      <Card style={{ width: "30rem" }}>
        <Card.Body>
          <h2 className="text-center mb-4">Add Restarurant</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {role > 0 && (
            <Form onSubmit={handleSubmit}>
              <Form.Group id="name">
                <Form.Label>Name of the restaurant</Form.Label>
                <Form.Control type="name" ref={nameRef} required />
              </Form.Group>
              <Form.Group id="address">
                <Form.Label>
                  Find the place through our google search
                </Form.Label>

                <div>
                  <PlacesAutocomplete
                    value={address}
                    onChange={setAddress}
                    onSelect={handleSelect}
                  >
                    {({
                      getInputProps,
                      suggestions,
                      getSuggestionItemProps,
                      loading,
                    }) => (
                      <div>
                        <input
                          {...getInputProps({ placeholder: "Type address" })}
                        />
                        <div>
                          {loading ? <div>...loading </div> : null}
                          {suggestions.map((suggestion, index) => {
                            const style = {
                              backgroundColor: suggestion.active
                                ? "#41b6e6"
                                : "#fff",
                            };
                            return (
                              <div
                                key={index}
                                {...getSuggestionItemProps(suggestion, {
                                  style,
                                })}
                              >
                                {suggestion.description}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </PlacesAutocomplete>
                </div>
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
                  ref={vegeterianRef}
                />
                <Form.Check
                  inline
                  type={"checkbox"}
                  id={`Gluten-Free`}
                  label={`Gluten-Free`}
                  ref={glutenFreeRef}
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
