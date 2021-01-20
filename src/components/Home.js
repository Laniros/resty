import React, { useState, useEffect } from "react";
import firestore, { fetchResData, fetchRole } from "../firebase";
import RestaurantCard from "./RestaurantCard";

function Home() {
  const [names, setNames] = useState("");
  const [data, setData] = useState([]);

  const fetchData = async () => {};

  useEffect(() => {
    fetchResData().then((d) => {
      setData(d);
    });
  }, []);

  return (
    <div>
      {data
        ? Object.values(data).map((r, i) => {
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
      {/*{navigator.geolocation.getCurrentPosition(function (position) {
        console.log("Latitude is: ", position.coords.latitude);
        console.log("Longitude is: ", position.coords.longitude);
      })}*/}
    </div>
  );
}

export default Home;
