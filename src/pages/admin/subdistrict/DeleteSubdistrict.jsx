import React from "react";
import { app } from "../../../config";
import { ref, getDatabase, remove } from "firebase/database";

const db = getDatabase(app);

const DeleteSubdistrict = ({
  selectedSubdistrict,
  setOpenDeleteSubdistrict,
}) => {
  const close = () => {
    setOpenDeleteSubdistrict(false);
  };

  const handleDelete = async () => {
    try {
      await remove(ref(db, `subdistrict/${selectedSubdistrict.key}`));
      console.log("Subkriteria berhasil dihapus");
      close();
    } catch (error) {
      console.error("Error menghapus subkriteria:", error);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex h-screen items-center justify-center">
        <div
          id="popup-modal"
          tabIndex="-1"
          className="flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto md:inset-0"
        >
          <div className="relative bg-white rounded-lg shadow ">
            <div className="p-6 text-center">
              <h3 class="mb-5 text-lg font-normal text-gray-500 ">
                Anda yakin ingin menghapus data ini?
              </h3>
              <div className="flex space-x-4 justify-center items-center">
                <button
                  onClick={(e) => handleDelete()}
                  className="btn btn-primary w-20"
                >
                  Ya
                </button>
                <button
                  onClick={() => close()}
                  className="btn btn-warning w-20"
                >
                  Tidak
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteSubdistrict;
