import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  RemoveRedEyeRounded as RemoveRedEyeRoundedIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import { server } from "../../constants/config";
import { adminExists } from "../../redux/reducers/auth";
import { IconButton } from "@mui/material";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [toShowPassword, setToShowPassword] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Loading...");
    const obj = { email, password };
    try {
      const response = await axios.post(`${server}/api/v1/admin/login`, obj, {
        withCredentials: true,
      });

      if (response?.data?.success) {
        dispatch(adminExists(response?.data?.response?.user));
        toast.success(response?.data?.response?.message, { id: toastId });
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 2000);
      } else {
        toast.error(response?.data?.message, { id: toastId });
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message, { id: toastId });
    }
  };
  return (
    <div className="flex flex-col items-center mt-44">
      <div className="flex justify-center space-x-8 mb-4">
        <button className="text-lg font-semibold text-black border-b-2 border-yellow-500 pb-1">
          Admin-Login
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-8 w-96">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="text"
              id="username"
              className="w-full text-xs h-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Email Address"
            />
          </div>

          <div className="mb-4">
            <div>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type={toShowPassword ? "text" : "password"}
                id="password"
                className="w-full text-xs h-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Password"
              />
            </div>
            <div className="absolute top-[20.5rem] left-[55.5rem]">
              <IconButton onClick={() => setToShowPassword(!toShowPassword)}>
                {toShowPassword ? (
                  <VisibilityOffIcon sx={{ color: "black" }} />
                ) : (
                  <RemoveRedEyeRoundedIcon sx={{ color: "black" }} />
                )}
              </IconButton>
            </div>
          </div>

          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
            />
            <label className="ml-2 text-sm text-gray-700">Remember me</label>
          </div>

          <button
            type="submit"
            className="w-full  bg-yellow-500 hover:bg-black hover:text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
