import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../../config";

const AddYear = ({ setOpenAddYear, pushData, data }) => {
  const [dataDistrict, setDataDistrict] = useState([]);
  const [item, setItem] = useState({
    district: "",
    cases: 0,
    rainfall: 0,
    population: 0,
  });
  const [id, setId] = useState(0);

  const fetchData = () => {
    try {
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
        console.log(data);
        if (data.length > 0) {
          setItem((prevItem) => ({
            ...prevItem,
            district: data[0].value.subdistrict,
          }));
        } else {
          // Handle the case where the data is empty or not available.
          // For example, you might set a default value or display an error message.
          console.log("Data not available.");
        }
      });
    } catch (error) {
      // Handle any potential errors that might occur during data retrieval.
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const pushToArray = async (e) => {
    e.preventDefault();

    // Check if the district already exists in the dataDistrict array
    const districtExists = data.some(
      (_item) => _item.district === item.district
    );

    console.log(districtExists);
    if (districtExists) {
      setId((prevId) => prevId + 1);
      setItem((prevItem) => ({
        ...prevItem,
        district: dataDistrict[id].value.subdistrict,
        cases: 0,
        rainfall: 0,
        population: 0,
      }));
    } else {
      try {
        await pushData(item);
        setItem((prevItem) => ({
          ...prevItem,
          district: dataDistrict[id].value.subdistrict,
          cases: 0,
          rainfall: 0,
          population: 0,
        }));
        setId((prevId) => prevId + 1);
        if (id > 10) {
          return;
        }
      } catch (error) {
        // Handle any errors that might occur during data processing or submission.
        console.error("Error pushing data:", error);
      }
    }
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
              <input
                type="text"
                name="district"
                value={item.district}
                onChange={handleChange}
                className="w-full input input-bordered"
              />
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
