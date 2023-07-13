import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue, get } from "firebase/database";
import OpenStreetMap from "../../components/OpenStreetMap";
import { app } from "../../config";
import { formatData } from "../../utils/formatData";

const db = getDatabase(app);

const MainUser = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const criteriaRef = ref(db, "data");
        const snapshot = await get(criteriaRef);

        const dataYear = [];
        snapshot.forEach((childSnapshot) => {
          const key = childSnapshot.key;
          const value = childSnapshot.val();

          if (key === "year") {
            for (const year in value) {
              const yearData = value[year];
              for (const attribute in yearData) {
                for (const district in yearData[attribute]) {
                  const value = yearData[attribute][district];
                  dataYear.push({ attribute, district, value, year });
                }
              }
            }
          }
        });

        const formattedData = formatData(dataYear);
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Formatted Data</h1>
      <ul>
        {data.map((item, index) => {
          const district = Object.keys(item)[0];
          const { airHumidity, cases, rainfall } = item[district];

          return (
            <li key={index}>
              <h2>{district}</h2>
              <p>Air Humidity: {airHumidity}</p>
              <p>Cases: {cases}</p>
              <p>Rainfall: {rainfall}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MainUser;
