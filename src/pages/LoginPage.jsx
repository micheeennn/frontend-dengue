import React, { useState } from "react";
import { app } from "../config";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import ToastError from "../components/toast/ToastError";
import IconManado from "../assets/ic_manado.png";
import IconBaktiHusada from "../assets/ic_bakti_husada.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth(app);
  let navigate = useNavigate();
  const handlerLoginSubmit = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        navigate("/pages/subdistrict");
        sessionStorage.setItem(
          "Auth Token",
          userCredential._tokenResponse.refreshToken
        );
      })
      .catch((error) => {
        if (error.code === "auth/wrong-password") {
          <ToastError messge="Kata Sandi Salah" />;
        }

        if (error.code === "auth/user-not-found") {
          <ToastError messge="Pengguna Tidak Ditemukan" />;
        }

        if (error.code === "auth/invalid-email") {
          <ToastError messge="Email Tidak Ditemukan" />;
        }
      });
  };
  return (
    <>
      <div className="h-20 w-full bg-[#820000]"></div>
      <div className="flex items-center justify-center h-1/2">
        <div className="mt-16">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <img src={IconManado} alt="" />
              <img src={IconBaktiHusada} alt="" />
            </div>
            <div className="w-1 h-[110px] bg-black"></div>
            <div>
              <h1 className="text-4xl font-bold">Sistem Informasi Geografis</h1>
              <p className="text-xl font-semibold">
                Pemetaan Penyebaran DBD Kota Manado
              </p>
            </div>
          </div>
          <div className="px-8 mt-10 py-6 mx-auto shadow-md text-left box_shadow text-white bg-[#820000] rounded-lg w-[450px]">
            <h3 className="text-2xl font-bold text-center text-first">
              Halaman Masuk
            </h3>
            <form className="">
              <div className="">
                <div>
                  <label htmlFor="email" className="w-full label">
                    Email
                  </label>
                  <input
                    type="text"
                    id="email"
                    placeholder="admin@gmail.com"
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-black input input-bordered"
                  />
                </div>
                <div className="mt-4">
                  <label htmlFor="password" className="w-full label">
                    Kata Sandi
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="******"
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-black input input-bordered"
                  />
                </div>
                <div className="mt-6">
                  <button
                    onClick={handlerLoginSubmit}
                    className="w-full btn btn-primary"
                  >
                    Masuk
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
