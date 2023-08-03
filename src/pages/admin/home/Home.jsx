import React, { useState, useEffect } from "react";
import { ref, onValue, get } from "firebase/database";
import { db } from "../../../config";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Jumlah Kasus DBD / Kecamatan",
    },
  },
};

const labels = [
  "Bunaken",
  "Bunaken Kepulauan",
  "Malalayang",
  "Mapanget",
  "Paal 2",
  "Sario",
  "Singkil",
  "Tikala",
  "Tuminting",
  "Wanea",
  "Wenang",
];

const Home = () => {
  const [dataYearly, setDataYearly] = useState([]);
  const [selectedYear, setSelectedYear] = useState(2020);
  const [yearly, setYearly] = useState([]);
  const [cases, setCases] = useState([]);
  const [totalCases, setTotalCases] = useState(0);

  const data = {
    labels,
    datasets: [
      {
        label: "Kecamatan",
        data: cases,
        backgroundColor: "#C28282",
      },
    ],
  };
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

        // Create an array to store the cases
        const casesArray = [];

        // Push the "cases" data to the array
        yearData.forEach((item) => {
          casesArray.push(parseInt(item.cases));
        });

        setCases(casesArray);
      }
    });
    console.log(dataYearly);
  };

  useEffect(() => {
    fetchDataYear(selectedYear);
    if (yearly.length > 0 && !selectedYear) {
      setSelectedYear(yearly[0]);
    }
  }, [selectedYear]);

  useEffect(() => {
    fetchDataYear();
  }, []);
  return (
    <>
      <div className="flex justify-between my-4">
        <h3>Selamat Datang</h3>
        <div>
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
        </div>
      </div>
      <div className="grid gap-4">
        <div className="p-4 border-2 h-[400px] flex justify-center">
          <Bar options={options} data={data} />
        </div>
        <div className="grid grid-cols-2">
          <div className="p-4 shadow-md">
            <h5 className="text-center">Jumlah Kasus DBD</h5>
            <p className="text-center">{totalCases}</p>
          </div>
          <div className="p-4 shadow-md">
            <h5 className="text-center">Variabel Pendukung </h5>
            <ul className="text-center">
              <li>Curah Hujan</li>
              <li>Kepadatan Penduduk</li>
              <li>Kasus DBD</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
