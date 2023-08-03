import React, { useState, useEffect } from "react";
import { ref, onValue, get } from "firebase/database";
import OpenStreetMap from "../../components/OpenStreetMap";
import { db } from "../../config";
import Header from "../../components/Header";

const MainUser = () => {
  const [dataYearly, setDataYearly] = useState([]);
  const [selectedYear, setSelectedYear] = useState(2020);
  const [yearly, setYearly] = useState([]);
  const [dataCluster, setDataCluster] = useState([]);
  const [totalCases, setTotalCases] = useState(0);

  const fetchDataYear = (selectedYear) => {
    const Ref = ref(db, "yearly");
    onValue(Ref, (snapshot) => {
      const data = snapshot.val();
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
      }
    });
    console.log(dataYearly);
  };

  const fetchDataCluster = (selectedYear) => {
    const Ref = ref(db, "cluster");
    onValue(Ref, (snapshot) => {
      const data = snapshot.val();
      if (selectedYear && data[selectedYear] && data[selectedYear].data) {
        const yearData = data[selectedYear].data;
        setDataCluster(yearData);
      }
    });

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
                <p className="text-2xl ">159</p>
              </div>
              <div className="p-6 text-center border-2 border-black rounded-xl font-semibold bg-[#FBF2EA]">
                <h6 className="text-center">Cluster Sedang</h6>
                <p className="text-2xl ">159</p>
              </div>
              <div className="p-6 text-center border-2 border-black rounded-xl font-semibold bg-[#E7F6EE]">
                <h6 className="text-center">Cluster Rendah</h6>
                <p className="text-2xl ">159</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainUser;
