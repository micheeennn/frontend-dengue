import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/LoginPage";
import MainAdmin from "../src/pages/admin/MainAdmin";
import MainUser from "./pages/user/MainUser";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/*" element={<MainUser />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pages/*" element={<MainAdmin />} />
      </Routes>
    </>
  );
};

export default App;
