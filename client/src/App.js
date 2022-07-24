import * as React from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import Header from "./Header";
import "./index.css";
import { getMarkers, createTree, deleteTree } from "./superFetchers";

const defaultLat = 49.2331;
const defaultLng = 28.4682;
const defaultRadius = 100;



class App extends React.Component {
  componentDidMount() {
    let newTrees = getMarkers(defaultLat, defaultLng, defaultRadius);
    if (!newTrees){
      newTrees = []
    }
    console.log(newTrees)
    for (let i=0; i<newTrees.length; i++) {
      this.addTree(newTrees[i]);
    }
  }

  constructor(props) {    
    super(props);
    this.state = {
      //default is set to center of the Vinnytsia
      markers: [[49.2331, 28.4682]],
      currentMarker: null,
      treename: "",
      age: 0,
      crownRadius: "",
      photo: "",
    };
  }

  setCurrentMarkerField = (k, v) => {
    const currentMarker = this.state.currentMarker
    currentMarker.k = v
    this.setState({
      currentMarker: currentMarker
    })
  }

  getCurrentMarker = () => {
    console.log("adding current marker to map")
    if (this.state.currentMarker != null) {
      return (
        <Marker position={[this.state.currentMarker.lat, this.state.currentMarker.lng]}>
          <Popup>
            <form>
              <input
                type="text"
                placeholder="Enter a treename"
                onChange={(e) => {
                  this.setCurrentMarkerField("treename", e.target.value);
                }}
              >
              {this.state.currentMarker.treename}
              </input>
              <input
                type="text"
                placeholder="Age"
                onChange={(e) => {
                  this.setCurrentMarkerField("age", e.target.value);
                }}
              >
              {this.state.currentMarker.age}
              </input>
              <input
                type="text"
                placeholder="Tree Crown Radius"
                onChange={(e) => {
                  this.setCurrentMarkerField("crownRadius", e.target.value );
                }}
              >
              {this.state.currentMarker.crownRadius}
              </input>
              <input
                type="file"
                placeholder="Photo"
                onChange={(e) => {
                  this.setCurrentMarkerField("photo", e.target.value);
                }}
              >
              {this.state.currentMarker.photo}
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
    console.log("adding marker")
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    if(this.state.currentMarker) {
      const currentMarker = this.state.currentMarker
      currentMarker.lat = lat
      currentMarker.lng = lng
      this.setState({ currentMarker: currentMarker })
    } else {
      this.setState({
        currentMarker: {
          lat: lat,
          lng: lng,
          treename: "",
          age: 0,
          crownRadius: "",
          photo: "",
        }
      })
      console.log(this.state.currentMarker.toString())
    }
    
  };

  addTree = (newTree) => {
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
      currentMarker: null
    })
  }

  handleSubmit = (e) => {
    if(this.state.currentMarker) {
      const m = this.state.currentMarker
      const newTree = createTree(m.lat, m.lng, m.treename, m.age, m.crownRadius)
      this.addTree(newTree)
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
