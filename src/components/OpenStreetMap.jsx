import { MapContainer, TileLayer, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { statesData } from "../utils/data";
import React, { useState, useEffect } from "react";

const OpenStreetMap = ({ dataCluster }) => {
  const [combinedData, setCombinedData] = useState([]);
  const center = [1.5409856, 124.7020854];
  const clusterColors = ["#0FA958", "#D27C2C", "#C51F1A"];
  const cluster = [
    { Cluster: 1, district: "Bunaken" },
    { Cluster: 2, district: "Bunaken Kepulauan" },
    { Cluster: 0, district: "Malalayang" },
    { Cluster: 1, district: "Mapanget" },
    { Cluster: 2, district: "Paal 2" },
    { Cluster: 0, district: "Sario" },
    { Cluster: 1, district: "Singkil" },
    { Cluster: 2, district: "Tikala" },
    { Cluster: 0, district: "Tuminting" },
    { Cluster: 1, district: "Wanea" },
    { Cluster: 2, district: "Wenang" },
  ];

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
              fillOpacity: 0.7,
              weight: 2,
              opacity: 1,
              dashArray: 3,
            }}
            positions={coordinates}
          />
        );
      })}
    </MapContainer>
  );
};

export default OpenStreetMap;
