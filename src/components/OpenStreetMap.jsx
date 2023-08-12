import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { statesData } from "../utils/data";

const OpenStreetMap = ({ dataCluster }) => {
  console.log(dataCluster);
  const [combinedData, setCombinedData] = useState([]);
  const center = [1.5409856, 124.7020854];
  const clusterColors = ["#0FA958", "#D27C2C", "#C51F1A"];

  useEffect(() => {
    combineDataAndUpdateStatesData(dataCluster);
  }, [dataCluster]);

  const combineDataAndUpdateStatesData = (dataArray) => {
    // Assuming initialStatesData is available

    // Create a copy of the original statesData to avoid modifying it directly
    const updatedStatesData = { ...statesData };

    // Combine the dataArray with the initialStatesData.features
    updatedStatesData.features.forEach((feature) => {
      const matchedDataIndex = dataArray.findIndex(
        (dataObj) =>
          dataObj.district.toLowerCase() ===
          feature.properties.name.toLowerCase()
      );

      if (matchedDataIndex !== -1) {
        feature.properties = {
          ...feature.properties,
          ...dataArray[matchedDataIndex],
        };
      }
    });

    setCombinedData(updatedStatesData);
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
              fillOpacity: 0.7,
              weight: 2,
              color: "black", // Border color
              opacity: 1,
              dashArray: 3,
            }}
            positions={coordinates}
          >
            <Popup>
              <div className="p-2">
                {state?.properties?.Values?.[0] ? (
                  <>
                    <table className="table">
                      <thead className="font-semibold text-base text-[#000]">
                        <tr>
                          <th>Kecamatan</th>
                          <th>Jumlah Kasus</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{state?.properties?.name}</td>
                          <td className="text-center">
                            {state?.properties?.Values?.[0] || ""}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </>
                ) : (
                  <h3 className="text-lg font-bold">
                    {state?.properties?.name}
                  </h3>
                )}
              </div>
            </Popup>
          </Polygon>
        );
      })}
    </MapContainer>
  );
};

export default OpenStreetMap;
