import { MapContainer, TileLayer, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { statesData } from "../utils/data";

const OpenStreetMap = () => {
  const center = [40.63463151377654, -97.89969605983609];

  return (
    <MapContainer
      center={center}
      zoom={10}
      style={{ width: "100vw", height: "100vh" }}
    >
      <TileLayer
        attribution="&copy; <a href='https://www.openstreetmap.org'>OpenStreetMap</a> contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {statesData.features.map((state) => {
        const coordinates = state.geometry.coordinates[0].map((item) => [
          item[1],
          item[0],
        ]);

        return (
          <Polygon
            pathOptions={{
              fillColor: "#FD8D3C",
              fillOpacity: 0.7,
              weight: 2,
              opacity: 1,
              dashArray: 3,
              color: "white",
            }}
            positions={coordinates}
            eventHandlers={{
              mouseover: (e) => {
                const layer = e.target;
                layer.setStyle({
                  dashArray: "",
                  fillColor: "#BD0026",
                  fillOpacity: 0.7,
                  weight: 2,
                  opacity: 1,
                  color: "white",
                });
              },
              mouseout: (e) => {
                const layer = e.target;
                layer.setStyle({
                  fillOpacity: 0.7,
                  weight: 2,
                  dashArray: "3",
                  color: "white",
                  fillColor: "#FD8D3C",
                });
              },
              click: (e) => {},
            }}
          />
        );
      })}
    </MapContainer>
  );
};

export default OpenStreetMap;
