import React from "react";
import IconManado from "../assets/ic_manado.png";
import IconBaktiHusada from "../assets/ic_bakti_husada.png";
import { MdInfoOutline } from "react-icons/md";

const Header = () => {
  return (
    <>
      <div
        className="flex items-center justify-between  bg-[#820000] h-20 px-10"
        style={{ boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px" }}
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-3">
            <img src={IconManado} alt="" className="w-12" />
            <img src={IconBaktiHusada} alt="" className="w-[60px]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Sistem Informasi Geografis Pemetaan Penyebaran DBD Kota Manado
            </h2>
          </div>
        </div>
        <div className="text-white">
          <MdInfoOutline size={35} />
        </div>
      </div>
    </>
  );
};

export default Header;
