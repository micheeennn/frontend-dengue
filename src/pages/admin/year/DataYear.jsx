import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import {
  AiOutlinePlusCircle,
  AiOutlineDelete,
  AiOutlineEdit,
} from "react-icons/ai";
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

  const fetchData = () => {
    const criteriaRef = ref(db, "year");
    onValue(criteriaRef, (snapshot) => {
      const data = [];
      snapshot.forEach((childSnapshot) => {
        const key = childSnapshot.key;
        const value = childSnapshot.val();

        data.push({
          key,
          value,
        });
      });
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
  return (
    <>
      <div className="flex justify-end items-center">
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
          <div className="overflow-x-auto shadow-md mt-4">
            <table className="table ">
              {/* head */}
              <thead>
                <tr className="text-center">
                  <th></th>
                  <th>Tahun</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {dataYear.map((item, index) => (
                  <tr key={index + 1}>
                    <td>{index + 1}</td>
                    <td className="text-center">{item.value.year}</td>
                    <td className="flex justify-center items-center space-x-4">
                      <button
                        onClick={() => fetchSelectedDelete(item)}
                        className="bg-red-600 text-white p-2 rounded-md"
                      >
                        <AiOutlineDelete size={20} />
                      </button>
                      <button
                        onClick={() => fetchSelectedEdit(item)}
                        className="bg-green-600 text-white p-2 rounded-md"
                      >
                        <AiOutlineEdit size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {openAddYear && <AddYear setOpenAddYear={setOpenAddYear} />}
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
