import React, { useState } from "react";
import { Stack, Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { InputBtn, YellowBtn } from "../../shared/SharedComponents";
import toast from "react-hot-toast";
import { adminExists } from "../../redux/reducers/auth";
import axios from "axios";
import { server } from "../../constants/config";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { admin } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState(admin.name);
  const [email, setEmail] = useState(admin.email);
  const [password, setPassword] = useState("");

  const changeProfileHandler = async () => {
    const toastId = toast.loading("Updating your profile...");
    try {
      const obj = {
        adminId: admin.id,
        name,
        email,
        password,
      };

      const response = await axios.post(
        `${server}/api/v1/admin/editMyself`,
        obj,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Outisde of try catch");
      console.log(response);
      if (response?.data?.success) {
        dispatch(adminExists(response?.data?.admin_user));

        setTimeout(() => {
          toast.success(
            response?.data?.message || "Profile updated successfully!",
            {
              id: toastId,
            }
          );
        }, [2000]);

        setTimeout(() => {
          navigate("/admin/dashboard");
        }, [5000]);
      } else {
        toast.error(response?.data?.message || "Oops! Something went wrong", {
          id: toastId,
        });
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.log("Inside of try catch");
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Oops! Something went wrong",
        {
          id: toastId,
        }
      );
    }
  };

  const Form = (
    <Stack
      sx={{
        border: "1px solid gray",
        borderBottomRightRadius: "10px",
        borderBottomLeftRadius: "10px",
        width: "50%",
        height: "70%",
      }}
      justifyContent={"space-evenly"}
      alignItems={"center"}
    >
      <Box
        sx={{
          // border: "1px solid red",
          height: "3rem",
          width: "70%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          border: "1px solid gray",
        }}
      >
        <Typography sx={{ paddingLeft: ".5rem" }}>ID</Typography>
        <Typography sx={{ paddingRight: ".5rem" }}>{admin.id}</Typography>
      </Box>

      <Box
        sx={{
          // border: "1px solid red",
          height: "3rem",
          width: "70%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <InputBtn
          heading={admin.name}
          w="35rem"
          variable={name}
          setVar={setName}
        />
      </Box>

      <Box
        sx={{
          // border: "1px solid red",
          height: "3rem",
          width: "70%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <InputBtn
          heading={admin.email}
          w="35rem"
          variable={email}
          setVar={setEmail}
        />
      </Box>

      <Box
        sx={{
          height: "3rem",
          width: "70%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <InputBtn
          heading={"Password"}
          w="35rem"
          type="password"
          variable={password}
          setVar={setPassword}
        />
      </Box>

      {/* Action Buttons */}
      <Stack
        direction={"row"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={"3.2rem"}
      >
        <Button
          className="w-[15rem] h-[3rem]"
          variant="danger"
          onClick={() => navigate("/admin/dashboard")}
        >
          Cancel
        </Button>
        <YellowBtn
          heading={"Update"}
          w="15rem"
          handler={changeProfileHandler}
        />
      </Stack>
      {/* Action Buttons */}
    </Stack>
  );

  return (
    <Stack
      sx={{ width: "100%", height: "50rem" }}
      direction={"column"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Stack
        sx={{
          borderTopRightRadius: "10px",
          borderTopLeftRadius: "10px",
          backgroundColor: "#fcb800",
          width: "50%",
          height: "8%",
        }}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Typography variant="h5" fontWeight={600}>
          Admin Profile
        </Typography>
      </Stack>

      {/* Form */}
      {Form}
      {/* Form */}
    </Stack>
  );
};

export default Settings;
