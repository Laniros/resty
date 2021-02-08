import React, { useState, useEffect } from "react";
import { Card, Alert, Form, Button, Spinner } from "react-bootstrap";
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
  const [loading, setLoading] = useState(false);
  const [numOfDish, setNumOfDish] = useState(1);
  const [data, setData] = useState({
    name: "",
    vegan: false,
    vegeterian: false,
    kosher: false,
    delivery: false,
    glutenFree: false,
    coordinates: {
      lat: 0,
      lng: 0,
    },
    type: [],
    menu: "",
  });

  //store all the other restarutants' coordinates to validate in the submit part
  const [dataCoords, setDataCoords] = useState(null);

  const history = useHistory();

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latlng = await getLatLng(results[0]);
    setAddress(value);
    setData((prevState) => {
      return { ...prevState, coordinates: latlng };
    });
  };

  const styles = {
    largeIcon: {
      padding: 30,
    },
  };

  //helper function to set the data addres
  //TODO: decide if needed. if so, update state correctly
  function changeAddress(address) {
    setAddress(address);
  }

  //when submiting, validate that no restarurant with the same coordinates exist in the database
  function validateCoordinates(coords) {
    if (dataCoords === null) {
      setError("cannot load coordinates from database");
      return false;
    } else if (coords === null) {
      setError("Cannot load coordinates from the address stated");
      return;
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
    if (validateCoordinates(data.coordinates)) {
      //TODO: Complete every reference and put it in database

      const resRef = firebase.firestore.collection("restaurants");
      await resRef
        .add(Object.assign({}, data))
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

  function handlePicturesUpload(pic, index, menuIndex) {
    console.log(index);
    console.log(menuIndex);
    firebase.addToStorage(pic, data.name).then((url) => {
      setData((prevState) => {
        return Object.assign({}, prevState, {
          menu: {
            ...prevState.menu,
            [menuIndex]: {
              starCount: 0,
              reviews: [],
              [index]: { pic: url },
            },
          },
        });
      });
    });
  }

  function displayDishes() {
    let dishes = [];
    for (let i = 0; i < numOfDish; i++) {
      dishes.push(
        <Card key={i} id={i}>
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
                  as="textarea"
                />
              </Form.Group>
            </Form>
            <div>
              Category:
              <Form.Check
                style={{ marginLeft: "10px" }}
                inline
                type={"checkbox"}
                id={`first` + i}
                label={`First`}
              ></Form.Check>
              <Form.Check
                inline
                type={"checkbox"}
                id={`main` + i}
                label={`Main`}
              ></Form.Check>
              <Form.Check
                inline
                type={"checkbox"}
                id={`dessert` + i}
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
              {[...Array(5)].map((c, index) => (
                <span key={index} id={index} style={{ display: "table-cell" }}>
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id={"icon-button-file" + i + index}
                    type="file"
                    onChange={(e) =>
                      handlePicturesUpload(e.target.files[0], index, i)
                    }
                  />

                  <label htmlFor={"icon-button-file" + i + index}>
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
              ))}
            </div>
          </Card.Body>
          <Card.Footer>
            <Button
              onClick={() => console.log(data.menu)}
              style={{ float: "right" }}
            >
              Add Dish
            </Button>
          </Card.Footer>
        </Card>
      );
    }
    return dishes || null;
  }

  function addMoreDish() {
    setNumOfDish(numOfDish + 1);
  }

  return (
    <>
      {role > 0 ? (
        <Card style={{ marginTop: "10px" }}>
          <Card.Body>
            <h2 className="text-center mb-4">Add Restarurant</h2>

            {error ? <Alert variant="danger">{error}</Alert> : ""}

            <Form onSubmit={handleSubmitRes}>
              <Form.Group id="name">
                <Form.Label>Name of the restaurant</Form.Label>
                <Form.Control
                  type="name"
                  onChange={(e) => {
                    const name = e.target.value;
                    setData((prevState) => {
                      return { ...prevState, name: name };
                    });
                  }}
                  required
                />
              </Form.Group>
              <Form.Group id="address">
                <Form.Label>
                  Find the place through our google search
                </Form.Label>
                <div>
                  <PlacesAutocomplete
                    value={address}
                    onChange={(e) => changeAddress(e)}
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
                  onChange={(e) => {
                    const vegan = e.target.checked;
                    setData((prevState) => {
                      return Object.assign({}, prevState, {
                        vegan: vegan,
                      });
                    });
                  }}
                ></Form.Check>
                <Form.Check
                  inline
                  label="Vegeterian"
                  type={"checkbox"}
                  id={`vegeterian`}
                  onChange={(e) => {
                    const vegeterian = e.target.checked;
                    setData((prevState) => {
                      return Object.assign({}, prevState, {
                        vegeterian: vegeterian,
                      });
                    });
                  }}
                />
                <Form.Check
                  inline
                  type={"checkbox"}
                  id={`glutenFree`}
                  label={`Gluten-Free`}
                  onChange={(e) => {
                    const glutenFree = e.target.checked;
                    setData((prevState) => {
                      return Object.assign({}, prevState, {
                        glutenFree: glutenFree,
                      });
                    });
                  }}
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
              <Button disabled={loading} className="w-100" type="sumbit">
                Add Restaurant
              </Button>
            </Form>
          </Card.Body>
          {displayDishes()}
          <Button
            onClick={() => addMoreDish()}
            style={{ justifyContent: "center" }}
          >
            +
          </Button>
        </Card>
      ) : (
        <Spinner
          animation="border"
          role="status"
          style={{ justifyContent: "center", marginTop: "20px" }}
        >
          <span className="sr-only">Loading...</span>
        </Spinner>
      )}
    </>
  );
}
