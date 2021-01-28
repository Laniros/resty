import React, { useState, useEffect, useRef } from "react";
import { Card, Alert, Form, Button } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import * as firebase from "../firebase";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import IconButton from "@material-ui/core/IconButton";

export default function AddRestaurant() {
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const [role, setRole] = useState(0);
  const [address, setAddress] = useState("");
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [picDish, setPicDish] = useState(null);

  //store all the other restarutants' coordinates to validate in the submit part
  const [dataCoords, setDataCoords] = useState(null);

  var picArr = [];

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

  const styles = {
    largeIcon: {
      padding: 30,
    },
  };

  //when submiting, validate that no restarurant with the same coordinates exist in the database
  function validateCoordinates(coords) {
    if (dataCoords === null) {
      setError("cannot load coordinates from database");
      return false;
    } else {
      console.log(dataCoords);
      console.log(dataCoords.length);
      for (var i = 0; i < dataCoords.length; i++) {
        if (
          coords.lat === dataCoords[i].lat &&
          coords.lng === dataCoords[i].lng
        ) {
          setError(
            "There is already a restaurant with the same coordinates in the database"
          );
          return false;
        }
      }
    }
    return true;
  }

  async function handleSubmitRes(e) {
    e.preventDefault();
    setLoading(true);
    if (validateCoordinates(coordinates)) {
      //TODO: Complete every reference and put it in database

      const resRef = firebase.firestore.collection("restaurants");
      await resRef
        .add({
          name: nameRef.current.value,
          coordinates: coordinates,
          vegan: veganRef.current.checked,
          vegeterian: vegeterianRef.current.checked,
          glutenFree: glutenFreeRef.current.checked,
        })
        .catch((error) => setError(error))
        .then(setLoading(false));
    } else {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (currentUser) {
      firebase.fetchRole(currentUser).then((r) => {
        setRole(r);
      });
      firebase.fetchAllCoordinates().then((d) => setDataCoords(d));
    }
  }, []);

  function uploadPicturesToStorage() {}

  //function to add 'upload pictures' in the 'adding dish' part
  function addPicButtons(n) {
    return [...Array(n)].map((e, i) => (
      <span key={i} id={i} style={{ display: "table-cell" }}>
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="icon-button-file"
          type="file"
          onChange={(e) => picArr.push(e.target.files[0])}
        />
        <label htmlFor="icon-button-file">
          <IconButton
            style={styles.largeIcon}
            color="primary"
            aria-label="upload picture"
            component="span"
          >
            <PhotoCamera />
          </IconButton>
        </label>
      </span>
    ));
  }

  //function to add the 'adding dish' part in the form
  function addDish() {
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
              id={`dessert`}
              label={`Dessert`}
            ></Form.Check>
          </div>
          <div
            className="camera-buttons"
            style={{
              display: "table",
              width: "100%",
            }}
          >
            {addPicButtons(5)}
          </div>
        </Card.Body>
        <Card.Footer>
          <Button
            onClick={() => console.log(picArr)}
            style={{ float: "right" }}
          >
            Submit Dish
          </Button>
        </Card.Footer>
      </Card>
    );
  }

  return (
    <>
      <Card style={{ marginTop: "10px" }}>
        <Card.Body>
          <h2 className="text-center mb-4">Add Restarurant</h2>

          {error ? <Alert variant="danger">{error}</Alert> : ""}

          <Form onSubmit={handleSubmitRes}>
            <Form.Group id="name">
              <Form.Label>Name of the restaurant</Form.Label>
              <Form.Control type="name" ref={nameRef} required />
            </Form.Group>
            <Form.Group id="address">
              <Form.Label>Find the place through our google search</Form.Label>
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
                        style={{ width: "100%" }}
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
              Add Restaurant
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <div className="w-100 text-center mt-2"></div>
    </>
  );
}
