import React, { useState } from "react";
import { app } from "../config";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import ToastError from "../components/toast/ToastError";

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
        navigate("/pages/data-criteria");
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg w-96 rounded-lg">
        <h3 className="text-2xl font-bold text-center text-first">Masuk</h3>
        <form action="">
          <div className="">
            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                type="text"
                id="email"
                placeholder="admin@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full max-w-xs"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="password" className="label">
                Kata Sandi
              </label>
              <input
                type="password"
                id="password"
                placeholder="******"
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full max-w-xs"
              />
            </div>
            <div className="mt-6">
              <button
                onClick={handlerLoginSubmit}
                className="btn btn-primary w-full"
              >
                Masuk
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
