import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import {
  AiOutlinePlusCircle,
  AiOutlineDelete,
  AiOutlineEdit,
} from "react-icons/ai";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import { app } from "../../../config";
import AddYear from "./AddYear";
import DeleteYear from "./DeleteYear";
import EditYear from "./EditYear";

const db = getDatabase(app);
const DataYear = () => {
  const [dataYear, setDataYear] = useState([]);
  const [selectedYear, setSelectedYear] = useState({});
  const [openAddYear, setOpenAddYear] = useState(false);
  const [openDeleteYear, setOpenDeleteYear] = useState(false);
  const [openEditYear, setOpenEditYear] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(11); // Number of items to show per page
  const [yearly, setYearly] = useState(0);

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
            for (const attribute in yearData) {
              for (const district in yearData[attribute]) {
                const value = yearData[attribute][district];
                data.push({ attribute, district, value, year });
              }
            }
          }
        }
      });
      setYearly(yearly);
      setDataYear(data);
    });
  };

  const fetchSelectedDelete = (selectedYear) => {
    setSelectedYear(selectedYear);
    setOpenDeleteYear(true);
  };

  const fetchSelectedEdit = (selectedYear) => {
    setSelectedYear(selectedYear);
    setOpenEditYear(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Get current items based on pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataYear.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <>
      <div className="flex items-center justify-end">
        <button className="btn" onClick={() => setOpenAddYear(true)}>
          <AiOutlinePlusCircle className="icon" />
        </button>
      </div>
      {dataYear.length === 0 ? (
        <>
          <p className="text-center">Tidak ada data</p>
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
      {openAddYear && (
        <AddYear yearly={yearly} setOpenAddYear={setOpenAddYear} />
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
