import Head from "next/head";

import Map from "../components/Map";

import styles from "../../styles/Home.module.css";

import Header from "../components/Map/Header";

const DEFAULT_CENTER = [49.2331, 28.4682];

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Map className={styles.homeMap} center={DEFAULT_CENTER} zoom={12}>
        {({ TileLayer, Marker, Popup }) => (
          <>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={DEFAULT_CENTER}>
              <Popup>
                Simple popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          </>
        )}
        {/* <FullscreenControl /> */}
      </Map>
    </div>
  );
}
