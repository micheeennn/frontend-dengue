import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import OpenStreetMap from "../../components/OpenStreetMap";
import { db } from "../../config";
import Header from "../../components/Header";
import Loading from "../../components/loading/Loading";

const MainUser = () => {
  const [dataYearly, setDataYearly] = useState([]);
  const [selectedYear, setSelectedYear] = useState(2020);
  const [yearly, setYearly] = useState([]);
  const [dataCluster, setDataCluster] = useState([]);
  const [totalCases, setTotalCases] = useState(0);
  const [clusterCounts, setClusterCounts] = useState({
    cluster0Count: 0,
    cluster1Count: 0,
    cluster2Count: 0,
  });

  useEffect(() => {
    const calculateClusterCounts = () => {
      let cluster0Count = 0;
      let cluster1Count = 0;
      let cluster2Count = 0;

      dataCluster.forEach((item) => {
        switch (item.Cluster) {
          case 0:
            cluster0Count++;
            break;
          case 1:
            cluster1Count++;
            break;
          case 2:
            cluster2Count++;
            break;
          default:
            break;
        }
      });

      setClusterCounts({ cluster0Count, cluster1Count, cluster2Count });
    };

    calculateClusterCounts();
  }, [dataCluster]);

  const { cluster0Count, cluster1Count, cluster2Count } = clusterCounts;

  const fetchDataYear = (selectedYear) => {
    try {
      const Ref = ref(db, "yearly");
      onValue(Ref, (snapshot) => {
        const data = snapshot.val();
        if (!data) {
          // Handle the case where the data is null or not available.
          // For example, you might set a default value or display an error message.
          console.log("Data not available.");
          return;
        }

        const years = Object.keys(data);
        setYearly(years);

        if (selectedYear && data[selectedYear] && data[selectedYear].data) {
          const yearData = data[selectedYear].data;
          setDataYearly(yearData);

          // Calculate the total cases for the selected year
          const totalCase = yearData.reduce((acc, item) => {
            return acc + parseInt(item.cases);
          }, 0);

          setTotalCases(totalCase);
        } else {
          // Handle the case where the data for the selected year is missing or not in the expected format.
          // For example, you might set default values for yearly data and total cases.
          setDataYearly([]);
          setTotalCases(0);
          console.log("Data not available for the selected year.");
        }
      });
    } catch (error) {
      // Handle any potential errors that might occur during data retrieval.
      console.error("Error fetching data:", error);
    }
  };

  const fetchDataCluster = (selectedYear) => {
    try {
      const Ref = ref(db, "cluster");
      onValue(Ref, (snapshot) => {
        const data = snapshot.val();
        if (!data) {
          // Handle the case where the data is null or not available.
          // For example, you might set a default value or display an error message.
          console.log("Data not available.");
          return;
        }

        if (selectedYear && data[selectedYear] && data[selectedYear].data) {
          const yearData = data[selectedYear].data;
          setDataCluster(yearData);
        } else {
          // Handle the case where the data for the selected year is missing or not in the expected format.
          // For example, you might set default values for cluster data.
          setDataCluster([]);
          console.log("Data not available for the selected year.");
        }
      });
    } catch (error) {
      // Handle any potential errors that might occur during data retrieval.
      console.error("Error fetching data:", error);
    }

    // Note: dataCluster here might log 'undefined' if the data is not available yet or if there are potential issues in the asynchronous data retrieval.
    console.log(dataCluster);
  };

  useEffect(() => {
    // Fetch initial data
    fetchDataYear(selectedYear);
    fetchDataCluster(selectedYear);
    // Set the selectedYear to the first year in yearly array if it is empty
    if (yearly.length > 0 && !selectedYear) {
      setSelectedYear(yearly[0]);
    }
  }, [selectedYear]);

  useEffect(() => {}, []);

  return (
    <>
      <Header />
      <div className="flex px-4 pt-8 pb-16">
        <div className="flex-1">
          <OpenStreetMap dataCluster={dataCluster} />
        </div>
        <div className="w-[400px]">
          <div className="bg-[#F2DEBA] h-1/2 p-8">
            <h3 className="text-3xl font-bold text-center">LEGENDA</h3>
            <p className="mt-8 font-medium text-justify">
              Tingkat Keparahan Penyebaran Berdasarkan 4 Variabel Pendukung
              dalam Analisis Tingkat Penyebaran Dengan Metode K-Means Clustering
            </p>
            <div className="mt-6">
              <ul className="flex flex-col space-y-4">
                <li className="flex items-center space-x-6">
                  <div className="bg-[#C51F1A] w-8 h-8"></div>
                  <p className="text-lg font-semibold">Tinggi</p>
                </li>
                <li className="flex items-center space-x-6">
                  <div className="bg-[#D27C2C] w-8 h-8"></div>
                  <p className="text-lg font-semibold">Sedang</p>
                </li>
                <li className="flex items-center space-x-6">
                  <div className="bg-[#0FA958] w-8 h-8"></div>
                  <p className="text-lg font-semibold">Rendah</p>
                </li>
              </ul>
            </div>
          </div>
          {dataYearly.length === 0 ? (
            <>
              <div className="flex flex-col items-center justify-center border-2 h-1/2">
                <Loading />
              </div>
            </>
          ) : (
            <>
              <div className="px-4 py-8 bg-white border-2 border-black h-1/2 ">
                <form>
                  <div className="flex flex-col space-y-3">
                    <label htmlFor="year" className="">
                      Tahun
                    </label>
                    <select
                      name="year"
                      id="year"
                      className="w-full max-w-[200px] select select-bordered"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                    >
                      <option disabled selected>
                        Tahun
                      </option>
                      {yearly.map((item) => (
                        <option value={item}>{item}</option>
                      ))}
                    </select>
                  </div>
                </form>

                <div className="p-6 mt-4 font-semibold border-2 border-black rounded-xl">
                  <h5 className="text-center ">Jumlah Kasus</h5>
                  <p className="text-4xl text-center">{totalCases}</p>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="p-6 text-center border-2 border-black rounded-xl font-semibold bg-[#F9E9E8]">
                    <h6 className="text-center ">Cluster Tinggi</h6>
                    <p className="text-2xl ">{cluster2Count}</p>
                  </div>
                  <div className="p-6 text-center border-2 border-black rounded-xl font-semibold bg-[#FBF2EA]">
                    <h6 className="text-center">Cluster Sedang</h6>
                    <p className="text-2xl ">{cluster1Count}</p>
                  </div>
                  <div className="p-6 text-center border-2 border-black rounded-xl font-semibold bg-[#E7F6EE]">
                    <h6 className="text-center">Cluster Rendah</h6>
                    <p className="text-2xl "> {cluster0Count}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MainUser;
