import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { statesData } from "../utils/data";

const OpenStreetMap = ({ dataCluster }) => {
  const [combinedData, setCombinedData] = useState([]);
  const center = [1.5409856, 124.7020854];
  const clusterColors = ["#0FA958", "#D27C2C", "#C51F1A"];

  useEffect(() => {
    combineDataAndUpdateStatesData(dataCluster);
  }, [dataCluster]);
  const combineDataAndUpdateStatesData = (dataArray) => {
    // Assuming initialStatesData is available

    // Combine the dataArray with the initialStatesData.features
    dataArray.forEach((dataObj) => {
      const matchedFeatureIndex = statesData.features.findIndex(
        (feature) =>
          feature.properties.name.toLowerCase() ===
          dataObj.district.toLowerCase()
      );
      if (matchedFeatureIndex !== -1) {
        const updatedFeatures = [...statesData.features];
        updatedFeatures[matchedFeatureIndex].properties = {
          ...updatedFeatures[matchedFeatureIndex].properties,
          ...dataObj,
        };
        setCombinedData({ ...statesData, features: updatedFeatures });
      }
    });

    console.log(combinedData);
  };
  return (
    <MapContainer
      center={center}
      zoom={10}
      style={{ width: "100%", height: "100vh" }}
    >
      <TileLayer
        attribution="&copy; <a href='https://www.openstreetmap.org'>OpenStreetMap</a> contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {statesData.features.map((state, index) => {
        const coordinates = state.geometry.coordinates[0].map((item) => [
          item[1],
          item[0],
        ]);

        const clusterColor = clusterColors[state.properties.Cluster]; // Get a color based on the cluster index

        return (
          <Polygon
            key={index}
            pathOptions={{
              fillColor: clusterColor,
              fillOpacity: 0.2,
              weight: 2,
              color: "black", // Border color
              opacity: 1,
              dashArray: 3,
            }}
            positions={coordinates}
          >
            <Popup>
              <div className="p-2">
                {/* Customize the content of your popup here */}
                <h3 className="text-lg font-bold text-center">
                  {state.properties.name}
                </h3>
                <table className="table">
                  <thead className="font-semibold text-base text-[#000]">
                    <tr>
                      <th>Kecamatan</th>
                      <th>Jumlah Kasus</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Bunaken</td>
                      <td className="text-center">10</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Popup>
          </Polygon>
        );
      })}
    </MapContainer>
  );
};

export default OpenStreetMap;
