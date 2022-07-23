import React from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";

import { useState, useRef } from "react";

// import Popup from "react-leaflet-editable-popup";

import { marker } from "leaflet";
import CreateMarker from "./LocationMarkers";

const DEFAULT_CENTER = [49.2331, 28.4682];


class MapView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      new_marker: null,
    };
  }

  render() {
    const LocationMarkers = () => {
      const map = useMapEvents({
        click: (e) => {
          map.locate();
          const { lat, lng } = e.latlng;

          this.setState({
            markers: [...this.state.markers, CreateMarker(lat, lng)],
          });
          console.log(
            "You clicked the map at LAT: " + lat + " and LONG: " + lng
          );
        },
        locationfound: (location) => {
          console.log("location found:", location);
        },
      });

      return null;
    };

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
        <li>{this.state.markers}</li>
      </MapContainer>
    );
  }
}

export default MapView;
