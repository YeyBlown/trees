import React from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import Header from "./Header";
import './index.css';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      markers: [[49.2331, 28.4682]], //default is set to center of the Vinnytsia
      treename: "",
      age: "",
      crownRadius: "",
      photo: "",
    };
  }

  //fetch funtion to get data and set it to state

  addMarker = (e) => {
    const { markers } = this.state;
    markers.push(e.latlng);
    this.setState({ markers });
  };

  handleSubmit = () => {};

  handleDelete = () => {};

  render() {
    return (
        <Map center={[49.2331, 28.4682]} onClick={this.addMarker} zoom={13}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          {this.state.markers.map((position, idx) => (
            <Marker key={`marker-${idx}`} position={position}>
              <Popup>
                <form> {/*this.state.popup.map((it, index) => {})*/}
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
