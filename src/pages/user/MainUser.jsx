import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue, get } from "firebase/database";
import OpenStreetMap from "../../components/OpenStreetMap";
import { app } from "../../config";

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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <OpenStreetMap />
    </div>
  );
};

export default MainUser;
