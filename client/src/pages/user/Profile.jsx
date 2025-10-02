import { Box, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { InputBtn, YellowBtn } from "../../shared/SharedComponents";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { server } from "../../constants/config";
import { userExists } from "../../redux/reducers/auth";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [name, setName] = useState(user.name);
  const [phonenumber, setPhoneNumber] = useState(user.phonenumber);

  const changeProfileHandler = async () => {
    const toastId = toast.loading("Updating your profile...");
    try {
      const form = new FormData();
      form.append("name", name);
      form.append("email", email);
      form.append("password", password);
      form.append("userId", user.id);
      form.append("phonenumber", phonenumber);

      const response = await axios.post(
        `${server}/api/v1/user/editMyself`,
        form,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data?.success) {
        dispatch(userExists(response?.data?.user));

        setTimeout(() => {
          toast.success(
            response?.data?.message || "Profile updated successfully!",
            {
              id: toastId,
            }
          );
        }, [2000]);

        setTimeout(() => {
          navigate("/");
        }, [5000]);
      } else {
        toast.error(response?.data?.message || "Oops! Something went wrong", {
          id: toastId,
        });
        navigate("/");
      }
    } catch (error) {
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
        <Typography sx={{ paddingLeft: "1rem" }}>ID</Typography>
        <Typography sx={{ paddingRight: "1rem" }}>{user.id}</Typography>
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
          heading={user.name}
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
          heading={user.email}
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
          heading={"Phone Number"}
          w="35rem"
          variable={phonenumber}
          setVar={setPhoneNumber}
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
          onClick={() => navigate("/")}
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
          Your Profile
        </Typography>
      </Stack>

      {/* Form */}
      {Form}
      {/* Form */}
    </Stack>
  );
};

export default Profile;
