import { React, useEffect } from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import Header from "./Header";
import "./index.css";
import { getMarkers, createTree, deleteTree } from "./superFetchers";

const defaultLat = 49.2331;
const defaultLng = 28.4682;
const defaultRadius = 100;

useEffect(() => {
  getMarkers(defaultLat, defaultLng, defaultRadius);
}, []);

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      //default is set to center of the Vinnytsia
      markers: [[49.2331, 28.4682]],
      currenMarker: null,
      treename: "",
      age: "",
      crownRadius: "",
      photo: "",
    };
  }

  getCurrentMarker = () => {
    if (this.state.currentMarker) {
      return (
        <Marker position={this.state.currentMarker}>
          <Popup>
            <form>
              <input
                type="text"
                placeholder="Enter a treename"
                onChange={(e) => {
                  this.setState({ treename: e.target.value });
                }}
              >
              {this.state.newMarker.treename}
              </input>
              <input
                type="text"
                placeholder="Age"
                onChange={(e) => {
                  this.setState({ age: e.target.value });
                }}
              >
              {this.state.newMarker.age}
              </input>
              <input
                type="text"
                placeholder="Tree Crown Radius"
                onChange={(e) => {
                  this.setState({ crownRadius: e.target.value });
                }}
              >
              {this.state.newMarker.crownRadius}
              </input>
              <input
                type="file"
                placeholder="Photo"
                onChange={(e) => {
                  this.setState({ photo: e.target.value });
                }}
              >
              {this.state.newMarker.photo}
              </input>
              <button type="submit" onClick={this.handleSubmit}>
                Submit
              </button>
              <button type="submit" onClick={this.handleDelete}>
                Delete
              </button>
            </form>
          </Popup>
        </Marker>
      );
    }
    return null;
  }

  //fetch funtion to get data and set it to state

  addMarker = (e) => {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    if(this.state.newMarker) {
      const currentMarker = this.state.newMarker
      currentMarker.lat = lat
      currentMarker.lng = lng
      this.setState({ newMarker: currentMarker })
    } else {
      this.setState({
        newMarker: {
          lat: lat,
          lng: lng,
          treename: "",
          age: 0,
          crownRadius: "",
          photo: "",
        }
      })
    }
    
  };

  handleSubmit = (e) => {
    if(this.state.newMarker) {
      const m = this.state.newMarker
      const newTree = createTree(m.lat, m.lng, m.treename, m.age, m.crownRadius)
      const myNewMarker = {
        id: newTree.id,
        lat: newTree.location_lat,
        lng: newTree.location_lon,
        treename: newTree.plant_type,
        age: newTree.creation_year,
        crownRadius: newTree.core_radius,
        photo: null
      }
      this.setState({
        markers: [...this.state.markers, myNewMarker],
        newMarker: null
      })
    } else {
      alert("Please click on the map to add a marker")
    }
  }

  refreshMarkers = (e) => {
    const lat = this.refs.map.leafletElement.getCenter().lat;
    const lng = this.refs.map.leafletElement.getCenter().lng;
    const newMarkers = getMarkers(lat, lng, defaultRadius);
    this.setState({ markers: newMarkers });
  };

  render() {
    return (
      <div>
        <button type="submit" onClick={this.refreshMarkers}>
          Refresh
        </button>
        <Map
          ref="map"
          center={[49.2331, 28.4682]}
          onClick={this.addMarker}
          zoom={13}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          {this.getCurrentMarker()}
          {this.state.markers.map((position, idx) => (
            <Marker key={`marker-${idx}`} position={position}>
              <Popup>
                <form>
                  {" "}
                  {/*this.state.popup.map((it, index) => {})*/}
                  <input
                    type="text"
                    placeholder="Enter a treename"
                    onChange={(e) => {
                      this.setState({ treename: e.target.value });
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Age"
                    onChange={(e) => {
                      this.setState({ age: e.target.value });
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Tree Crown Radius"
                    onChange={(e) => {
                      this.setState({ crownRadius: e.target.value });
                    }}
                  />
                  <input
                    type="file"
                    placeholder="Photo"
                    onChange={(e) => {
                      this.setState({ photo: e.target.value });
                    }}
                  />
                  <button type="submit" onClick={this.handleSubmit}>
                    Submit
                  </button>
                  <button type="submit" onClick={this.handleDelete}>
                    Delete
                  </button>
                </form>
              </Popup>
            </Marker>
          ))}
        </Map>
      </div>
    );
  }
}

export default App;

// import React from "react";
// import { Map, Marker, Popup, TileLayer } from "react-leaflet";
// import { Icon } from "leaflet";
// import * as parkData from "./data/skateboard-parks.json";
// import "./App.css";

// export const icon = new Icon({
//   iconUrl: "/skateboarding.svg",
//   iconSize: [25, 25],
// });

// export default function App() {
//   const [activePark, setActivePark] = React.useState(null);

//   return (
//     <Map center={[45.4, -75.7]} zoom={12}>
//       <TileLayer
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />

//       {parkData.features.map((park) => (
//         <Marker
//           key={park.properties.PARK_ID}
//           position={[
//             park.geometry.coordinates[1],
//             park.geometry.coordinates[0],
//           ]}
//           onClick={() => {
//             setActivePark(park);
//           }}
//           icon={icon}
//         />
//       ))}

//       {activePark && (
//         <Popup
//           position={[
//             activePark.geometry.coordinates[1],
//             activePark.geometry.coordinates[0],
//           ]}
//           onClose={() => {
//             setActivePark(null);
//           }}
//         >
//           <div>
//             <h2>{activePark.properties.NAME}</h2>
//             <p>{activePark.properties.DESCRIPTIO}</p>
//           </div>
//         </Popup>
//       )}
//     </Map>
//   );
// }
