import { latLng } from "leaflet"; //Marker
import { useState } from "react";
import { useMapEvents, Popup, Marker } from "react-leaflet";
// import { Marker } from "leaflet";
import L from "leaflet";
import icon from "./constants";
import "../App.css";
import { useRef } from "react";

// const [markers, setMarkers] = useState([]);

function onClick(e) {
  <Popup>Smth</Popup>;
}

const CreateMarker = (lat, lng) => {
  return (
    <Marker key={Math.random()} position={[lat, lng]}>
      <Popup>
        <div className="">
          <div>
            <input type="text" placeholder="Treename" />
            <input type="text" placeholder="What work?" />
            <input type="text" placeholder="Age" />
            <input type="text" placeholder="Radius" />
            <input type="text" placeholder="Upload the picture" />
          </div>
          <button
            onClick={(e) => {
              console.log("removed");
            }}
          >
            Remove <br />
          </button>
          <button
            onClick={(e) => {
              console.log("submitted");
            }}
          >
            Submit
          </button>
        </div>
      </Popup>
    </Marker>
  );
};

const getPopup = () => {
  return (
    <Popup>
      <div className="">
        <div>
          <input type="text" placeholder="Treename" />
          <input type="text" placeholder="What work?" />
          <input type="text" placeholder="Age" />
          <input type="text" placeholder="Radius" />
          <input type="text" placeholder="Upload the picture" />
        </div>
        <button
          onClick={(e) => {
            console.log("removed");
          }}
        >
          Remove <br />
        </button>
        <button
          onClick={(e) => {
            console.log("submitted");
          }}
        >
          Submit
        </button>
      </div>
    </Popup>
  );
};

const LocationMarkers = () => {
  const popupElRef = useRef(null);
  const hideElement = () => {
    if (!popupElRef.current || !map) return;
    popupElRef.current._close();
    // map.closePopup();
  };
  const map = useMapEvents({
    click: (e) => {
      map.locate();
      const { lat, lng } = e.latlng;
      const newMarker = CreateMarker(lat, lng);
      //   const markers = new L.FeatureGroup().addTo(map);

      //   newMarker(setMarkers)

      //   const marker = L.marker([lat, lng]).addTo(map);
      //   marker.bindPopup("qeqeqeqeq"); // it works but it is not good
      console.log("You clicked the map at LAT: " + lat + " and LONG: " + lng);
    },
    locationfound: (location) => {
      console.log("location found:", location);
    },
  });

  return null;
};

export default CreateMarker;

// import React from "react";

// import { useState } from "react";

// import { useMapEvents } from "react-leaflet-events";

// const LocationMarkers = () => {
//   const initialMarkers: LatLng[] = [new LatLng(51.505, -0.09)];
//   const [markers, setMarkers] = useState(initialMarkers);

//   const map = useMapEvents({
//     click(e) {
//       markers.push(e.latlng);
//       setMarkers((prevValue) => [...prevValue, e.latlng]);
//     },
//   });

//   return {markers.map(marker => <Marker position={marker} ></Marker>)};
// };

// export default LocationMarkers;
