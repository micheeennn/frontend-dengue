import React, { useState, useEffect } from "react";
import { useNavigate, Route, Routes, NavLink } from "react-router-dom";
import Header from "../../components/Header";
import { MdDescription } from "react-icons/md";
import { HiMenuAlt3 } from "react-icons/hi";
import { FiFolder, FiLogOut } from "react-icons/fi";
import DataYear from "./year/DataYear";
import { AiFillCalendar, AiFillPieChart } from "react-icons/ai";
import DataSubdistrict from "./subdistrict/DataSubdistrict";
import Calculate from "./calculate/Calculate";

const MainAdmin = () => {
  const [open, setOpen] = useState(true);
  const [openModalLogout, setOpenModalLogout] = useState(false);
  const navigate = useNavigate();

  const menus = [
    {
      name: "Data Kecamatan",
      link: "/pages/subdistrict",
      icon: FiFolder,
    },
    {
      name: "Data Tahunan",
      link: "/pages/year",
      icon: AiFillCalendar,
    },
    {
      name: "Perhitungan",
      link: "/pages/calculate",
      icon: AiFillCalendar,
    },
  ];

  const logout = () => {
    sessionStorage.removeItem("AuthToken");
    navigate("/login");
  };

  useEffect(() => {
    const authToken = sessionStorage.getItem("Auth Token");

    if (!authToken) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="flex overflow-y-hidden">
      <div
        className={`bg-white min-h-screen ${
          open ? "w-72" : "w-16"
        } duration-500 shadow-md text-gray-900 px-4`}
      >
        <div className="flex justify-end py-3">
          <HiMenuAlt3
            size={26}
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <div className="flex flex-col justify-between h-[90%]">
          <div className="relative flex flex-col gap-4 mt-4">
            {menus?.map((menu, i) => (
              <NavLink
                to={menu?.link}
                key={i}
                className={` ${
                  menu?.margin && "mt-5"
                } group flex items-center text-sm  gap-3.5 font-medium p-2 hover:bg-red-600 hover:text-white rounded-md`}
                activeClassName="text-[#FF0000]"
              >
                <div>{React.createElement(menu?.icon, { size: "20" })}</div>
                <h2
                  className={`whitespace-pre ${
                    !open && "opacity-0 translate-x-28 overflow-hidden"
                  }`}
                >
                  {menu?.name}
                </h2>
                <h2
                  className={`${
                    open && "hidden"
                  } absolute z-50 left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
                >
                  {menu?.name}
                </h2>
              </NavLink>
            ))}
            <button
              onClick={() => setOpenModalLogout(true)}
              className="group flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-red-600 rounded-md"
            >
              <div>
                <FiLogOut size="20" />
              </div>
              <h2
                className={`whitespace-pre  ${
                  !open && "opacity-0 translate-x-28 overflow-hidden"
                }`}
              >
                Keluar
              </h2>
              <h2
                className={`${
                  open && "hidden"
                } absolute z-50 left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
              >
                Keluar
              </h2>
            </button>
          </div>
        </div>
      </div>
      <div className="w-full overflow-x-hidden font-semibold text-gray-900">
        <div>
          <Header />
        </div>
        <div className="p-5">
          <Routes>
            <Route path="/subdistrict" element={<DataSubdistrict />} />\
            <Route path="/year" element={<DataYear />} />
            <Route path="/calculate" element={<Calculate />} />
          </Routes>
        </div>
      </div>
      <div
        id="modalLogout"
        tabIndex="-1"
        aria-hidden="true"
        className={`flex items-center fixed top-0 left-0 right-0 z-50 ${
          openModalLogout ? "block" : "hidden"
        } w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] md:h-full`}
      >
        <div className="relative flex items-center justify-center w-full h-max">
          <div className="relative bg-white rounded-lg shadow w-80 ">
            <div className="flex items-start justify-center p-4 rounded-t">
              <h3 className="text-xl font-semibold text-center text-gray-900 ">
                Keluar
              </h3>
            </div>

            <div className="p-2 space-y-6">
              <p className="text-base leading-relaxed text-center text-gray-500 ">
                Anda yakin ingin keluar?
              </p>
            </div>

            <div className="flex items-center justify-center p-4 space-x-2 border-gray-200 rounded-b">
              <button
                data-modal-hide="defaultModal"
                type="button"
                className="w-24 btn btn-primary"
                onClick={() => logout()}
              >
                Ya
              </button>
              <button
                data-modal-hide="defaultModal"
                type="button"
                onClick={() => setOpenModalLogout(false)}
                className="w-24 btn btn-warning"
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainAdmin;
