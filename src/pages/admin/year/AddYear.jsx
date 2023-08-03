import React, { useEffect, useState } from "react";
import { app } from "../../../config";
import { uid } from "uid";
import { set, ref, getDatabase, onValue } from "firebase/database";
import ToastError from "../../../components/toast/ToastError";
import { db } from "../../../config";

const AddYear = ({ setOpenAddYear, pushData }) => {
  const [dataDistrict, setDataDistrict] = useState([]);
  const [item, setItem] = useState({
    id: 0,
    district: "",
    cases: 0,
    rainfall: 0,
    population: 0,
  });
  const [id, setId] = useState(0);

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

      setDataDistrict(data);
      if (data.length > 0) {
        setItem((prevItem) => ({
          ...prevItem,
          district: data[0].value.subdistrict,
        }));
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const pushToArray = (e) => {
    e.preventDefault();
    pushData(item);
    setId((prevId) => prevId + 1);
    setItem((prevItem) => ({ ...prevItem, id }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="p-4 overflow-y-scroll transition-transform bg-white shadow top-20 w-[400px] transform-none">
        <div className="flex justify-start">
          <button
            onClick={() => setOpenAddYear(false)}
            className="w-12 h-12 text-xl bg-white rounded-xl btn text-primary "
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>
        <div>
          <form onSubmit={pushToArray}>
            <div>
              <label htmlFor="" className="label">
                Kecamatan
              </label>
              <select
                name="district"
                value={item.district}
                onChange={handleChange}
                className="w-full input input-bordered"
              >
                {dataDistrict.map((item, index) => (
                  <option key={index + 1} value={item.value.subdistrict}>
                    {item.value.subdistrict}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="" className="label">
                Jumlah Kasus
              </label>
              <input
                type="number"
                name="cases"
                value={item.cases}
                onChange={handleChange}
                className="w-full input input-bordered"
              />
            </div>
            <div>
              <label htmlFor="" className="label">
                Curah Hujan
              </label>
              <input
                type="number"
                name="rainfall"
                value={item.rainfall}
                onChange={handleChange}
                className="w-full input input-bordered"
              />
            </div>
            <div>
              <label htmlFor="" className="label">
                Kepadatan Penduduk
              </label>
              <input
                type="number"
                onChange={handleChange}
                name="population"
                value={item.population}
                className="w-full input input-bordered"
              />
            </div>
            <button type="submit" className="w-full mt-8 btn btn-primary">
              Tambah
            </button>
          </form>
        </div>
      </div>
      {/* {openToast && <ToastError message="Data tahun sudah ada" />} */}
    </>
  );
};

export default AddYear;
