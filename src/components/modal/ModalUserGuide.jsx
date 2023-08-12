import React from "react";
import UserGuideOne from "../../assets/user-guide-1.png";
import UserGuideTwo from "../../assets/user-guide-2.png";
import UserGuideThree from "../../assets/user-guide-3.png";
import UserGuideFour from "../../assets/user-guide-4.png";

const ModalUserGuide = ({ setOpen }) => {
  return (
    <div className="modal" open>
      <div className="w-[1200px] p-4 rounded-md bg-white">
        <div className="flex justify-end">
          <button
            onClick={() => setOpen(false)}
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
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div>
            <img src={UserGuideOne} alt="" className="" />
            <p className="mt-3 font-semibold text-justify">
              Untuk menambah data tahunan, silahkan klik pada tombol tambah.
              Sistem akan mengarah ke halaman tambah data tahunan
            </p>
          </div>
          <div>
            <img src={UserGuideTwo} alt="" />
            <p className="mt-3 font-semibold text-justify">
              Masukkan jumlah kasus, rata-rata curah hujan (mm), kepadatan
              penduduk (Jiwa/Km ) dan klik tambah. Lakukan hal yang sama untuk
              11 kecamatan, hingga data masuk pada tabel data.
            </p>
          </div>
          <div>
            <img src={UserGuideThree} alt="" />
            <p className="mt-3 font-semibold text-justify">
              Setelah selesai menambah 11 data kecamatan dengan 3 variabel,
              silahkan masukkan tahun dari data tersebut. Klik simpan untuk
              menghasilkan klaster pada halaman data tahunan.
            </p>
          </div>
          <div>
            <img src={UserGuideFour} alt="" />
            <p className="mt-3 font-semibold text-justify">
              Setelah selesai disimpan, pada halaman data tahunan dapat memilih
              tahun untuk menampilkan data tahunan beserta nilai 3 variabel
              sesuai tahun.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalUserGuide;
