import logo from "./logo.svg";
import "./App.css";
import MapView from "./components/MapView";

import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";

import Header from "./components/Header";

const App = () => {
  return (
    <div>
      <Header />
      <MapView />
    </div>
  );
}

export default App;
