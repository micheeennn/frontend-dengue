import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../../config/index";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import { normalizeData } from "../../../utils/normalize";
import axios from "axios";

const Calculate = () => {
  const [data, setData] = useState([]);
  const [yearly, setYearly] = useState([]);
  const [selectedYear, setSelectedYear] = useState(yearly[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(11);
  const [result, setResult] = useState(null);

  const fetchData = (selectedYear) => {
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
          setData(yearData);
        } else {
          // Handle the case where the data for the selected year is missing or not in the expected format.
          // For example, you might set a default value or display an error message.
          console.log("Data not available for the selected year.");
        }
      });
    } catch (error) {
      // Handle any potential errors that might occur during data retrieval.
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // Fetch initial data
    fetchData(selectedYear);

    // Set the selectedYear to the first year in yearly array if it is empty
    if (yearly.length > 0 && !selectedYear) {
      setSelectedYear(yearly[0]);
    }
  }, [selectedYear]);

  const postData = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/cluster", {
        data: normalizeData(data),
      });
      setResult(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Get current items based on pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    fetchData();
  }, [selectedYear]);

  return (
    <div>
      {yearly.length === 0 ? null : (
        <>
          <form>
            <div className="flex flex-col space-y-3">
              <label htmlFor="year" className="">
                Tahun
              </label>
              <select
                name="year"
                id="year"
                className="w-full max-w-xs select select-bordered"
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
        </>
      )}
      {data.length === 0 ? (
        <>
          <p className="p-4 text-center border-2 mt-9">Tidak ada data</p>
        </>
      ) : (
        <>
          <div className="mt-4 overflow-x-auto shadow-md">
            <table className="table">
              {/* head */}
              <thead>
                <tr className="text-center">
                  <th></th>
                  <th>Kecamatan</th>
                  <th>Jumlah Kasus</th>
                  <th>Curah Hujan</th>
                  <th>Kepadatan Penduduk</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={index + 1}>
                    <td>{index + 1}</td>
                    <td>{item?.district}</td>
                    <td className="text-center">{item?.cases}</td>
                    <td className="text-center">{item?.rainfall}</td>
                    <td className="text-center">{item?.population}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-4">
            {currentPage > 1 && (
              <button
                onClick={handlePrevPage}
                className="mr-2 btn btn-sm btn-primary"
              >
                <MdKeyboardArrowLeft />
              </button>
            )}
            {data.length > itemsPerPage * currentPage && (
              <button
                onClick={handleNextPage}
                className="btn btn-primary btn-sm"
              >
                <MdKeyboardArrowRight />
              </button>
            )}
          </div>
          {result === null ? (
            <div className="flex items-center justify-center">
              <button
                className="btn btn-primary mt-[30px]"
                onClick={() => postData()}
              >
                Hitung
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <button
                className="btn btn-primary mt-[30px]"
                onClick={() => {
                  setResult(null);
                }}
              >
                Tutup
              </button>
            </div>
          )}
          {result === null ? null : (
            <>
              <div className="container p-4 mx-auto">
                <div>
                  <h5 className="mb-4 text-xl font-bold">Jumlah Klaster</h5>
                  <p>{result?.num_clusters}</p>
                </div>
                <h5 className="mb-4 text-xl font-bold">Pusat Klaster</h5>
                <table className="w-full table-auto">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Klaster</th>
                      <th className="px-4 py-2">Koordinat</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 border">Klaster 0</td>
                      <td className="px-4 py-2 border">[0, 0, 0]</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border">Klaster 1</td>
                      <td className="px-4 py-2 border">[0.5, 0.5, 0.5]</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border">Klaster 2</td>
                      <td className="px-4 py-2 border">[1, 1, 1]</td>
                    </tr>
                  </tbody>
                </table>

                <div className="mt-8">
                  <h5 className="mb-4 text-xl font-bold">
                    Data yang Diklaster
                  </h5>
                  <table className="w-full table-auto">
                    <thead>
                      <tr>
                        <th className="px-4 py-2">Klaster</th>
                        <th className="px-4 py-2">Kecamatan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result?.kecamatan_cluster.map((kecamatan, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 border">
                            Klaster {kecamatan?.Cluster}
                          </td>
                          <td className="px-4 py-2 border">
                            {kecamatan?.district}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
          {/* 
          <div>
            <h5 className="mb-4 text-xl font-bold">Silhouette Score</h5>
            <p>{result?.silhouette_avg}</p>
          </div> */}
        </>
      )}
    </div>
  );
};

export default Calculate;
