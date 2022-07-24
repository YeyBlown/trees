import * as React from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import Header from "./Header";
import "./index.css";
import { getMarkers, createTree, deleteTree } from "./superFetchers";

const defaultLat = 49.2331;
const defaultLng = 28.4682;
const defaultRadius = 100;



class App extends React.Component {

  refresh = () => {
    window.location.reload(false);
  }

  componentDidMount() {
    const inSetMarkers = (newTrees) => {
      console.log('got some new trees')
      console.log(newTrees)
      if (!newTrees){
        newTrees = []
      }
    for (let i=0; i<newTrees.length; i++) {
      this.addTree(newTrees[i]);
    }
    }
    getMarkers(defaultLat, defaultLng, defaultRadius, inSetMarkers);

  }

  constructor(props) {    
    super(props);
    this.state = {
      //default is set to center of the Vinnytsia
      markers: [],
      currentMarker: null,
      treename: "",
      age: 0,
      crownRadius: 0,
      photo: "",
    };
  }

  setCurrentMarkerField = (k, v) => {
    console.log("setting current marker")
    console.log(k)
    console.log(v)
    const currentMarker = this.state.currentMarker
    currentMarker[k] = v
    this.setState({
      currentMarker: currentMarker
    })
  }

  getCurrentMarker = (currentMarker) => {
    console.log("adding current marker to map")
    if (currentMarker != null) {
      return (
        <Marker key={`${currentMarker.id}`} position={[currentMarker.lat, currentMarker.lng]}>
          <Popup>
            <form>
              <input
                type="text"
                placeholder="Enter a treename"
                onChange={(e) => {
                  this.setCurrentMarkerField("treename", e.target.value);
                }}
                value={currentMarker.treename}
              />
              <input
                type="text"
                placeholder="Age"
                onChange={(e) => {
                  this.setCurrentMarkerField("age", e.target.value);
                }}
                value={currentMarker.age}
              />
              <input
                type="text"
                placeholder="Tree Crown Radius"
                onChange={(e) => {
                  this.setCurrentMarkerField("crownRadius", e.target.value );
                }}
                value={currentMarker.crownRadius}
              />
              {/*<input*/}
              {/*  type="file"*/}
              {/*  placeholder="Photo"*/}
              {/*  onChange={(e) => {*/}
              {/*    this.setCurrentMarkerField("photo", e.target.value);*/}
              {/*  }}*/}
              {/*>*/}
              {/*{currentMarker.photo}*/}
              {/*</input>*/}
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
    return <div/>;
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
      photo: ""
    }
    console.log('creating new tree')
    console.log(newTree)
    this.setState({
      markers: [...this.state.markers, myNewMarker],
      currentMarker: null
    })
    console.log('new state markers')
    console.log(this.state.markers)
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const cm = this.state.currentMarker
    console.log('cm')
    console.log(cm)
    if(this.state.currentMarker) {
      console.log('saving marker')
      const m = this.state.currentMarker
      createTree(parseFloat(m.lat), parseFloat(m.lng), m.treename, parseInt(m.age), parseInt(m.crownRadius), this.addTree)
    } else {
      alert("Please click on the map to add a marker")
    }
  }

  refreshMarkers = (e) => {
    e.preventDefault();
    const lat = this.refs.map.leafletElement.getCenter().lat;
    const lng = this.refs.map.leafletElement.getCenter().lng;
    const inSetMarkers = (newTrees) => {
      if (!newTrees) {
        newTrees = []
        for (let i = 0; i < newTrees.length; i++) {
          this.addTree(newTrees[i]);
        }
      }
      ;
      console.log(newTrees);
    }
    this.setState({markers: []});
    getMarkers(lat, lng, defaultRadius, inSetMarkers);
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
          {this.getCurrentMarker(this.state.currentMarker)}
          {this.state.markers.map(marker => this.getCurrentMarker(marker))}
            {/*<Marker key={`marker-${marker.id}`} position={[marker.lat, marker.lng]}>*/}
            {/*  <Popup>*/}
            {/*    <form>*/}
            {/*      {" "}*/}
            {/*      /!*this.state.popup.map((it, index) => {})*!/*/}
            {/*      <input*/}
            {/*        type="text"*/}
            {/*        placeholder="Enter a treename"*/}
            {/*        onChange={(e) => {*/}
            {/*      this.setCurrentMarkerField("treename", e.target.value );*/}
            {/*        }}*/}
            {/*      />*/}
            {/*      <input*/}
            {/*        type="text"*/}
            {/*        placeholder="Age"*/}
            {/*        onChange={(e) => {*/}
            {/*      this.setCurrentMarkerField("age", e.target.value );*/}
            {/*        }}*/}
            {/*      />*/}
            {/*      <input*/}
            {/*        type="text"*/}
            {/*        placeholder="Tree Crown Radius"*/}
            {/*        onChange={(e) => {*/}
            {/*      this.setCurrentMarkerField("crownRadius", e.target.value );*/}
            {/*        }}*/}
            {/*      />*/}
            {/*      /!*<input*!/*/}
            {/*      /!*  type="file"*!/*/}
            {/*      /!*  placeholder="Photo"*!/*/}
            {/*      /!*  onChange={(e) => {*!/*/}
            {/*      /!*    this.setState({ photo: e.target.value });*!/*/}
            {/*      /!*  }}*!/*/}
            {/*      />*/}
            {/*      <button type="submit" onClick={this.handleSubmit}>*/}
            {/*        Submit*/}
            {/*      </button>*/}
            {/*      <button type="submit" onClick={this.handleDelete}>*/}
            {/*        Delete*/}
            {/*      </button>*/}
            {/*    </form>*/}
            {/*  </Popup>*/}
            {/*</Marker>*/}
          {/*))}*/}
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
