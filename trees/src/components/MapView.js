import React from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";

// import Popup from "react-leaflet-editable-popup";

import LocationMarkers from "./LocationMarkers";

const DEFAULT_CENTER = [49.2331, 28.4682];

const MapView = () => {
  return (
    <MapContainer center={DEFAULT_CENTER} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={DEFAULT_CENTER}>
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
      {/* <Marker
        position={[50.5, 30.5]}
        eventHandlers={{
          click: () => {
            console.log("clicked on the marker");
            return (
              <Popup removable editable open>
                <h1>Want to remove?</h1>
              </Popup>
            );
          },
        }}
      /> */}
      <LocationMarkers />
    </MapContainer>
  );
};

export default MapView;
