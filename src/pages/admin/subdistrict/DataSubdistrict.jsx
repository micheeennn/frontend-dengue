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
import { MdDelete } from "react-icons/md";

const db = getDatabase(app);
const DataSubdistrict = () => {
  const [dataSubdistrict, setDataSubdistrict] = useState([]);
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

      data.sort((a, b) => {
        const subdistrictA = a.value.subdistrict.toLowerCase();
        const subdistrictB = b.value.subdistrict.toLowerCase();
        if (subdistrictA < subdistrictB) {
          return -1;
        }
        if (subdistrictA > subdistrictB) {
          return 1;
        }
        return 0;
      });

      setDataSubdistrict(data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      {dataSubdistrict.length === 0 ? (
        <>
          <p className="text-center">Tidak ada data</p>
        </>
      ) : (
        <>
          <div className="mt-4 overflow-x-auto shadow-md">
            <table className="table ">
              <thead>
                <tr className="text-lg text-center text-black">
                  <th></th>
                  <th>Kecamatan</th>
                </tr>
              </thead>
              <tbody>
                {dataSubdistrict.map((item, index) => (
                  <tr key={index + 1}>
                    <td>{index + 1}</td>
                    <td className="text-center">{item.value.subdistrict}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
};

export default DataSubdistrict;
