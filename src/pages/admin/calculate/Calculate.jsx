import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { app } from "../../../config";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import { parseData } from "../../../utils/parse";
import axios from "axios";

const db = getDatabase(app);
const Calculate = () => {
  const [data, setData] = useState([]);
  const [parsedData, setParsedData] = useState([]);
  const [yearly, setYearly] = useState([]);
  const [selectedYear, setSelectedYear] = useState(yearly[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(11);
  const [result, setResult] = useState(null);

  const fetchData = () => {
    const criteriaRef = ref(db, "data");
    onValue(criteriaRef, (snapshot) => {
      const data = [];
      const yearly = [];

      snapshot.forEach((childSnapshot) => {
        const key = childSnapshot.key;
        const value = childSnapshot.val();

        if (key === "year") {
          for (const year in value) {
            const yearData = value[year];
            yearly.push(year);
            if (year === selectedYear) {
              for (const attribute in yearData) {
                for (const district in yearData[attribute]) {
                  const value = yearData[attribute][district];
                  data.push({ attribute, district, value, year });
                }
              }
            }
          }
        }
      });
      setParsedData(parseData(data));
      setYearly(yearly);
      setData(data);
      // Inisialisasi centroid awal
    });
  };

  const postData = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/data", {
        data: parsedData,
      });
      setResult(response.data);
      console.log(result);
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

      {data.length === 0 ? (
        <>
          <p className="text-center mt-9">Tidak ada data</p>
        </>
      ) : (
        <>
          <div className="mt-4 overflow-x-auto shadow-md">
            <table className="table">
              {/* head */}
              <thead>
                <tr className="text-center">
                  <th></th>
                  <th>Atribut</th>
                  <th>Distrik</th>
                  <th>Nilai</th>
                  <th>Tahun</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={index + 1}>
                    <td>{index + 1}</td>
                    <td className="text-center">
                      {item.attribute === "airHumidity"
                        ? "Kelembapan Air"
                        : null}
                      {item.attribute === "cases" ? "Jumlah Kasus" : null}
                      {item.attribute === "rainfall" ? "Curah Hujan" : null}
                    </td>
                    <td className="text-center">{item.district}</td>
                    <td className="text-center">{item.value}</td>
                    <td className="text-center">{item.year}</td>
                    {/* <td className="flex items-center justify-center space-x-4">
                      <button
                        onClick={() => fetchSelectedDelete(item)}
                        className="p-2 text-white bg-red-600 rounded-md"
                      >
                        <AiOutlineDelete size={20} />
                      </button>
                      <button
                        onClick={() => fetchSelectedEdit(item)}
                        className="p-2 text-white bg-green-600 rounded-md"
                      >
                        <AiOutlineEdit size={20} />
                      </button>
                    </td> */}
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
                  <h5 className="mb-4 text-xl font-bold">Jumlah Cluster</h5>
                  <h5>{result.num_clusters}</h5>
                </div>
                <h5 className="mb-4 text-xl font-bold">Pusat Kluster</h5>
                <table className="w-full table-auto">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Kluster</th>
                      <th className="px-4 py-2">Koordinat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.initial_cluster_centers.map((center, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 border">
                          Kluster {index + 1}
                        </td>
                        <td className="px-4 py-2 border">
                          [{center[0]}, {center[1]}]
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-8">
                  <h5 className="mb-4 text-xl font-bold">
                    Data yang Dikluster
                  </h5>
                  <table className="w-full table-auto">
                    <thead>
                      <tr>
                        <th className="px-4 py-2">Kluster</th>
                        <th className="px-4 py-2">Kecamatan</th>
                        <th className="px-4 py-2">Nilai</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.kecamatan_cluster.map((kecamatan, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 border">
                            Kluster {kecamatan.Cluster}
                          </td>
                          <td className="px-4 py-2 border">
                            {kecamatan.Kecamatan}
                          </td>
                          <td className="px-4 py-2 border">
                            [{kecamatan.Values[0]}, {kecamatan.Values[1]}]
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Calculate;
