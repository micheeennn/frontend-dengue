import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import {
  AiOutlinePlusCircle,
  AiOutlineDelete,
  AiOutlineEdit,
} from "react-icons/ai";
import { app } from "../../../config";
import DeleteSubdistrict from "./DeleteSubdistrict";
import EditSubdistrict from "./EditSubdistrict";
import AddSubdistrict from "./AddSubdistrict";

const db = getDatabase(app);
const DataSubdistrict = () => {
  const [dataSubdistrict, setDataSubsdistrict] = useState([]);
  const [selectedSubdistrict, setSelectedSubdistrict] = useState({});
  const [openAddSubdistrict, setOpenAddSubsdistrict] = useState(false);
  const [openDeleteSubdistrict, setOpenDeleteSubdistrict] = useState(false);
  const [openEditSubdistrict, setOpenEditSubdistrict] = useState(false);

  const fetchData = () => {
    const criteriaRef = ref(db, "subdistrict");
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
      setDataSubsdistrict(data);
      console.log(dataSubdistrict);
    });
  };

  const fetchSelectedDelete = (selectedSubdistrict) => {
    setSelectedSubdistrict(selectedSubdistrict);
    setOpenDeleteSubdistrict(true);
  };

  const fetchSelectedEdit = (selectedSubdistrict) => {
    setSelectedSubdistrict(selectedSubdistrict);
    setOpenEditSubdistrict(true);
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <div className="flex justify-end items-center">
        <button className="btn" onClick={() => setOpenAddSubsdistrict(true)}>
          <AiOutlinePlusCircle className="icon" />
        </button>
      </div>
      {dataSubdistrict.length === 0 ? (
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
                  <th>Kecamatan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {dataSubdistrict.map((item, index) => (
                  <tr key={index + 1}>
                    <td>{index + 1}</td>
                    <td className="text-center">{item.value.subdistrict}</td>
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
      {openAddSubdistrict && (
        <AddSubdistrict setOpenAddSubdistrict={setOpenAddSubsdistrict} />
      )}
      {openDeleteSubdistrict && (
        <DeleteSubdistrict
          selectedSubdistrict={selectedSubdistrict}
          setOpenDeleteSubdistrict={setOpenDeleteSubdistrict}
        />
      )}
      {openEditSubdistrict && (
        <EditSubdistrict
          selectedSubdistrict={selectedSubdistrict}
          setOpenEditSubdistrict={setOpenEditSubdistrict}
        />
      )}
    </>
  );
};

export default DataSubdistrict;
