import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { server } from "../../constants/config";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { userExists } from "../../redux/reducers/auth";
import { Box, IconButton } from "@mui/material";
import {
  RemoveRedEyeRounded as RemoveRedEyeRoundedIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phonenumber, setPhonenumber] = useState("");

  const [toShowPassword, setToShowPassword] = useState(false);

  const dispatch = useDispatch();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append("email", email);
      form.append("password", password);

      const config = {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        form,
        config
      );

      dispatch(userExists(data?.response?.user));
      toast.success(data?.response?.message);
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Oops! Something went wrong"
      );
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append("name", name);
      form.append("email", email);
      form.append("password", password);
      form.append("phonenumber", phonenumber);

      const config = {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${server}/api/v1/user/register`,
        form,
        config
      );
      navigate("/");
      dispatch(userExists(data?.response?.user));
      toast.success(data?.response?.message);
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Oops! Something went wrong"
      );
    }
  };

  const toggleHandler = () => setIsLogin(!isLogin);

  const LoginBox = (
    <div className="flex flex-col items-center mt-44">
      <div className="flex justify-center space-x-8 mb-4">
        <button
          onClick={toggleHandler}
          className="text-lg font-semibold text-black border-b-2 border-yellow-500 pb-1"
        >
          Login
        </button>
        <button
          onClick={toggleHandler}
          className="text-lg font-semibold text-gray-500 hover:text-black"
        >
          Register
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-8 w-96">
        <form onSubmit={handleLoginSubmit}>
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
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type={toShowPassword ? "text" : "password"}
              id="password"
              className="w-full text-xs h-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Password"
            />
            <div className="absolute top-[21.5rem] left-[55.5rem]">
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
            className="w-full  bg-yellow-500 hover:bg-black hover:text-white font-semibold py-2 px-4 rounded-lg focus:outline-none  transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );

  const RegsiterBox = (
    <div className="flex flex-col items-center mt-44">
      <div className="flex justify-center space-x-8 mb-4">
        <button
          onClick={toggleHandler}
          className="text-lg font-semibold text-gray-500 hover:text-black"
        >
          Login
        </button>
        <button
          onClick={toggleHandler}
          className="text-lg font-semibold text-black border-b-2 hover:text-black border-yellow-500"
        >
          Register
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-8 w-96">
        <form onSubmit={handleRegisterSubmit}>
          <div className="mb-6">
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              id="username"
              className="w-full text-xs h-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Username"
            />
          </div>
          <div className="mb-6">
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="text"
              id="Email Address"
              className="w-full text-xs h-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Email Address"
            />
          </div>

          <div className="mb-4">
            <input
              onChange={(e) => setPhonenumber(e.target.value)}
              value={phonenumber}
              type="text"
              id="phonenumber"
              className="w-full text-xs h-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Contact Number"
            />
          </div>

          <div className="mb-4">
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type={toShowPassword ? "text" : "password"}
              id="password"
              className="w-full text-xs h-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Password"
            />
            <div className="absolute top-[29.3rem] left-[55.5rem]">
              <IconButton onClick={() => setToShowPassword(!toShowPassword)}>
                <RemoveRedEyeRoundedIcon sx={{ color: "black" }} />
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
            Register
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <Box
      sx={{
        padding: 2,
        borderRadius: 2,
      }}
    >
      {isLogin ? <>{LoginBox}</> : <>{RegsiterBox}</>}
    </Box>
  );
};

export default Login;
