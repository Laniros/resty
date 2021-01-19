import React, { useState, useEffect } from "react";
import firebase, { fetchRole } from "../firebase";
import RestaurantCard from "./RestaurantCard";

function Home() {
  const [names, setNames] = useState("");
  const [res, setRes] = useState([]);

  const fetchData = async () => {
    const ref = firebase.database().ref("restaurants");
    await ref.once("value", (snapshot) => {
      const result = [];
      snapshot.forEach((snap) => {
        result.push(snap.val());
        setRes(snap.val());
        setNames(result);
        console.log(result);
      });
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {/*{navigator.geolocation.getCurrentPosition(function (position) {
        console.log("Latitude is: ", position.coords.latitude);
        console.log("Longitude is: ", position.coords.longitude);
      })}*/}

      {names
        ? Object.values(names).map((r, i) => {
            return (
              <div key={i}>
                {/* That's how to get the values other than lan/lat !!!!!!! */}
                <div>{r.name}</div>
                <div>{r.vegeterian ? "is veg" : "not veg"}</div>

                {Object.values(r).map((a, i) => {
                  return (
                    <div key={i}>
                      <div>{a.lng}</div>
                      <div>{a.lat}</div>
                    </div>
                  );
                })}
              </div>
            );
          })
        : ""}
    </div>
  );
}

export default Home;
