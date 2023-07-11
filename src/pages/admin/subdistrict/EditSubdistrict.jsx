import React, { useEffect, useState } from "react";
import { get, set, ref, getDatabase } from "firebase/database";
import { app } from "../../../config";

const db = getDatabase(app);
const EditSubdistrict = ({ selectedSubdistrict, setOpenEditSubdistrict }) => {
  const [subdistrict, setSubdistrict] = useState("");

  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      await set(ref(db, `/subdistrict/${selectedSubdistrict.key}`), {
        subdistrict: subdistrict,
        uuid: selectedSubdistrict.key,
      });
      close();
    } catch (error) {
      console.error("Error updating criteria:", error);
    }
  };

  const close = () => {
    setOpenEditSubdistrict(false);
  };

  useEffect(() => {
    console.log(selectedSubdistrict);
  }, []);
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex h-screen items-center justify-center">
        <div
          id="popup-modal"
          tabIndex="-1"
          className="flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto md:inset-0"
        >
          <div className="relative bg-white rounded-lg shadow ">
            <button
              type="button"
              className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="popup-modal"
              onClick={close}
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
              <form onSubmit={handleEdit}>
                <div>
                  <label htmlFor="subdistrict" className="label">
                    Kecamatan
                  </label>
                  <input
                    type="text"
                    name="subdistrict"
                    id="subdistrict"
                    className="input input-md input-bordered w-full max-w-xs"
                    value={subdistrict}
                    onChange={(e) => setSubdistrict(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-md w-full mt-4"
                >
                  Simpan
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditSubdistrict;
