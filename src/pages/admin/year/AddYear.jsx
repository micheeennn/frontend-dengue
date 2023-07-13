import React, { useEffect, useState } from "react";
import { app } from "../../../config";
import { uid } from "uid";
import { set, ref, getDatabase, onValue } from "firebase/database";
import ToastError from "../../../components/toast/ToastError";

const db = getDatabase(app);
const AddYear = ({ setOpenAddYear, yearly }) => {
  const [year, setYear] = useState(0);
  const [dataSubdistrict, setDataSubdistrict] = useState([]);
  const [errorYear, setErrorYear] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [cases, setCases] = useState({
    Bunaken: 1,
    "Bunaken Kepulauan": 0,
    Malalayang: 0,
    Mapanget: 0,
    "Paal 2": 0,
    Sario: 0,
    Singkil: 0,
    Tikala: 0,
    Tuminting: 0,
    Wanea: 0,
    Wenang: 0,
  });
  const [airHumidity, setAirHumidity] = useState({
    Bunaken: 0,
    "Bunaken Kepulauan": 0,
    Malalayang: 0,
    Mapanget: 0,
    "Paal 2": 0,
    Sario: 0,
    Singkil: 0,
    Tikala: 0,
    Tuminting: 0,
    Wanea: 0,
    Wenang: 0,
  });
  const [rainfall, setRainfall] = useState({
    Bunaken: 0,
    "Bunaken Kepulauan": 0,
    Malalayang: 0,
    Mapanget: 0,
    "Paal 2": 0,
    Sario: 0,
    Singkil: 0,
    Tikala: 0,
    Tuminting: 0,
    Wanea: 0,
    Wenang: 0,
  });

  const handleYearChange = (e) => {
    const selectedYear = e.target.value;
    setYear(selectedYear);
    if (!yearly.includes(selectedYear)) {
      setErrorYear(false);
    } else {
      setErrorYear(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (errorYear) {
      setOpenToast(true);
      setTimeout(() => {
        setOpenToast(false);
      }, 2000);
    } else {
      set(ref(db, `/data/year/${year}`), {
        cases,
        rainfall,
        airHumidity,
      });
      close();
      setYear(0);
    }
  };

  const close = () => {
    setOpenAddYear(false);
  };

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
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center h-screen">
        <div
          id="popup-modal"
          tabIndex="-1"
          className="flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto md:inset-0"
        >
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <button
              type="button"
              className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="popup-modal"
              onClick={() => close()}
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
            <div className="p-6 text-center">
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col items-center justify-center my-4 space-y-4">
                  <label htmlFor="subdistrict" className="text-left label">
                    Tahun
                  </label>
                  <input
                    type="number"
                    name="subdistrict"
                    id="subdistrict"
                    value={year}
                    className="w-full max-w-xs input input-md input-bordered"
                    onChange={handleYearChange}
                  />
                  {errorYear && (
                    <p className="text-left text-red-600">
                      Data Tahun Sudah ada
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-left">Kasus</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(cases).map(([subdistrict, value]) => (
                        <div key={subdistrict}>
                          <label
                            htmlFor={`cases-${subdistrict}`}
                            className="label"
                          >
                            {subdistrict}
                          </label>
                          <input
                            type="number"
                            name={`cases-${subdistrict}`}
                            id={`cases-${subdistrict}`}
                            value={value}
                            className="w-full max-w-xs input input-md input-bordered"
                            onChange={(e) =>
                              setCases({
                                ...cases,
                                [subdistrict]: e.target.value,
                              })
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-left">Curah Hujan</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(rainfall).map(([subdistrict, value]) => (
                        <div key={subdistrict}>
                          <label
                            htmlFor={`rainfall-${subdistrict}`}
                            className="label"
                          >
                            {subdistrict}
                          </label>
                          <input
                            type="number"
                            name={`rainfall-${subdistrict}`}
                            id={`rainfall-${subdistrict}`}
                            value={value}
                            className="w-full max-w-xs input input-md input-bordered"
                            onChange={(e) =>
                              setRainfall({
                                ...rainfall,
                                [subdistrict]: e.target.value,
                              })
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-left">Kelembapan</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(airHumidity).map(
                        ([subdistrict, value]) => (
                          <div key={subdistrict}>
                            <label
                              htmlFor={`airHumidity-${subdistrict}`}
                              className="label"
                            >
                              {subdistrict}
                            </label>
                            <input
                              type="number"
                              name={`airHumidity-${subdistrict}`}
                              id={`airHumidity-${subdistrict}`}
                              value={value}
                              className="w-full max-w-xs input input-md input-bordered"
                              onChange={(e) =>
                                setAirHumidity({
                                  ...airHumidity,
                                  [subdistrict]: e.target.value,
                                })
                              }
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full mt-4 btn btn-primary btn-md"
                >
                  Simpan
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {openToast && <ToastError message="Data tahun sudah ada" />}
    </>
  );
};

export default AddYear;
