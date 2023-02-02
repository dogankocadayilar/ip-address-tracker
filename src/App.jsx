import Tracker from "./components/Tracker";
import { MapContainer, TileLayer, Marker, useMap, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import locationIcon from "./assets/images/icon-location.svg";
import "leaflet/dist/leaflet.css";
import "./App.css";

const markerIcon = new L.Icon({
  iconUrl: locationIcon,
  iconRetinaUrl: locationIcon,
  popupAnchor: [-0, -0],
  iconSize: [40, 50],
});

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.flyTo(center, zoom);
  return null;
}

function App() {
  const [coords, setCoords] = useState(null);
  const [info, setInfo] = useState({
    ip: "",
    location: {
      region: "",
      country: "",
      timezone: "",
    },
    isp: "",
  });

  useEffect(() => {
    if (info.ip.length > 0) {
      setCoords([info.location.lat, info.location.lng]);
    }
  }, [info]);

  return (
    <div>
      <Tracker info={info} setInfo={setInfo} />
      {coords !== null && (
        <MapContainer center={coords} zoom={13} className="mapContainer">
          <ChangeView center={coords} zoom={13} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={coords} icon={markerIcon}>
            <Popup>
              {info.location.region}, {info.location.country}
              <br />
              {info.isp}
            </Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
}

export default App;
