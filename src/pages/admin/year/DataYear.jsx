import React, { useEffect, useState } from "react";
import { ref, onValue, set } from "firebase/database";
import axios from "axios";
import {
  AiOutlinePlusCircle,
  AiOutlineDelete,
  AiOutlineEdit,
} from "react-icons/ai";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import AddYear from "./AddYear";
import DeleteYear from "./DeleteYear";
import EditYear from "./EditYear";
import { normalizeData } from "../../../utils/normalize";
import { db } from "../../../config";
import { uid } from "uid";

const DataYear = () => {
  // State variables
  const [dataYear, setDataYear] = useState([]);
  const [dataCluster, setDataCluster] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [openAddYear, setOpenAddYear] = useState(false);
  const [openDeleteYear, setOpenDeleteYear] = useState(false);
  const [openEditYear, setOpenEditYear] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(11);
  const [yearly, setYearly] = useState([]);
  const [selectedYear, setSelectedYear] = useState(yearly[0]);
  const [year, setYear] = useState("");
  const [dataTerm, setDataTerm] = useState([]);

  useEffect(() => {
    fetchDataYear(selectedYear);
    fetchDataCluster(selectedYear);
    console.log(dataTerm);
  }, [selectedYear]);

  useEffect(() => {
    // Set the selectedYear to the first year in yearly array if it is empty
    if (yearly.length > 0 && !selectedYear) {
      setSelectedYear(yearly[0]);
    }
  }, [yearly]);

  useEffect(() => {
    combineData();
  }, [dataYear, dataCluster]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataYear.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  // Data handling functions
  const handleCluster = (data) => {
    set(ref(db, `/cluster/${year}`), {
      data,
    });
  };

  const handleYearly = (data) => {
    set(ref(db, `/yearly/${year}`), {
      data,
    });
  };

  const pushData = (item) => {
    setDataTerm([...dataTerm, item]);
  };

  const clustering = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/cluster", {
        data: normalizeData(dataTerm),
      });
      handleYearly(dataTerm);
      handleCluster(response.data.kecamatan_cluster);
      setDataTerm([]);
    } catch (error) {
      console.log(error);
    }
  };

  // Data fetching functions
  const fetchDataYear = (selectedYear) => {
    try {
      const Ref = ref(db, "yearly");
      onValue(Ref, (snapshot) => {
        const data = snapshot.val();
        if (!data) {
          console.log("Data not available.");
          return;
        }

        const years = Object.keys(data);
        setYearly(years);

        if (selectedYear && data[selectedYear] && data[selectedYear].data) {
          const yearData = data[selectedYear].data;
          setDataYear(yearData);
        } else {
          console.log("Data not available for the selected year.");
        }
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDataCluster = (selectedYear) => {
    try {
      const Ref = ref(db, "cluster");
      onValue(Ref, (snapshot) => {
        const data = snapshot.val();
        if (
          data &&
          selectedYear &&
          data[selectedYear] &&
          data[selectedYear].data
        ) {
          const yearData = data[selectedYear].data;
          setDataCluster(yearData);
        } else {
          console.log("Data not available for the selected year.");
        }
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Combine Data
  const combineData = () => {
    const newData = dataCluster.map((clusterData) => {
      const matchingDistrictData = dataYear.find(
        (districtData) => districtData.district === clusterData.district
      );

      if (matchingDistrictData) {
        return {
          ...clusterData,
          Values: [
            matchingDistrictData.cases,
            matchingDistrictData.rainfall,
            matchingDistrictData.population,
          ],
        };
      }

      return clusterData;
    });
    console.log(newData);
    setCombinedData(newData);
  };
  return (
    <>
      {!openAddYear && (
        <>
          {yearly.length === 0 ? null : (
            <>
              <h3>Data Tahunan</h3>
              <form>
                <div className="flex flex-col mt-4 space-y-3">
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
          <div className="flex items-center justify-end">
            <button className="btn" onClick={() => setOpenAddYear(true)}>
              <AiOutlinePlusCircle className="icon" />
            </button>
          </div>
          {combinedData.length === 0 ? (
            <>
              <p className="p-4 mt-4 text-center border-2">Tidak ada data</p>
            </>
          ) : (
            <>
              <div className="mt-4 overflow-x-auto shadow-md">
                <table className="table">
                  <thead>
                    <tr className="text-center">
                      <th></th>
                      <th>Kecamatan</th>
                      <th>Jumlah Kasus</th>
                      <th>Curah Hujan</th>
                      <th>Kepadatan Penduduk</th>
                      <th>Cluster</th>
                    </tr>
                  </thead>
                  <tbody>
                    {combinedData.map((item, index) => (
                      <tr className="text-center">
                        <td>{index + 1}</td>
                        <td>{item?.district}</td>
                        <td>{item?.Values[0]}</td>
                        <td>{item?.Values[1]}</td>
                        <td>{item?.Values[2]}</td>
                        <td>{item?.Cluster}</td>
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
                {dataYear.length > itemsPerPage * currentPage && (
                  <button
                    onClick={handleNextPage}
                    className="btn btn-primary btn-sm"
                  >
                    <MdKeyboardArrowRight />
                  </button>
                )}
              </div>
            </>
          )}
        </>
      )}

      {openAddYear && (
        <>
          <div>
            <div>
              <label htmlFor="" className="label">
                Tahun
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full max-w-[200px] input input-bordered"
              />
            </div>
            <div className="mt-6">
              <button
                onClick={(e) => clustering()}
                className="w-full max-w-[200px] btn"
              >
                Simpan
              </button>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="flex-1 mt-4 overflow-x-auto shadow-md">
              <table className="table">
                <thead>
                  <tr className="text-center">
                    <th></th>
                    <th>Kecamatan</th>
                    <th>Jumlah Kasus</th>
                    <th>Curah Hujan</th>
                    <th>Kepadatan Penduduk</th>\
                  </tr>
                </thead>
                <tbody>
                  {dataTerm.map((item, index) => (
                    <tr>
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
            {dataTerm.length > 11 ? null : (
              <AddYear
                pushData={pushData}
                setOpenAddYear={setOpenAddYear}
                data={dataTerm}
              />
            )}
          </div>
        </>
      )}
      {openDeleteYear && (
        <DeleteYear
          selectedYear={selectedYear}
          setOpenDeleteYear={setOpenDeleteYear}
        />
      )}
      {openEditYear && <EditYear />}
    </>
  );
};

export default DataYear;
