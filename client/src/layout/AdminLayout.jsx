import {
  Avatar,
  Box,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";

import {
  GroupOutlined as GroupIcon,
  Groups as GroupsIcon,
  HomeOutlined as HomeIcon,
  LogoutOutlined as LogoutIcon,
  SettingsOutlined as SettingsIcon,
  ShoppingBagOutlined as ShoppingBagIcon,
  ViewListOutlined as ViewListIcon,
} from "@mui/icons-material";

import AdminPic from "../assets/AdminPic.jpg";

import React from "react";
import { yellow } from "../constants/colors";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../constants/config";
import { useDispatch } from "react-redux";
import { adminNotExists } from "../redux/reducers/auth";
const adminTabs = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <HomeIcon />,
  },
  {
    name: "Products",
    path: "/admin/products",
    icon: <ViewListIcon />,
  },
  {
    name: "Categories",
    path: "/admin/categories",
    icon: <GroupsIcon />,
  },
  {
    name: "Order",
    path: "/admin/orders",
    icon: <ShoppingBagIcon />,
  },
  {
    name: "Customers",
    path: "/admin/customers",
    icon: <GroupIcon />,
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: <SettingsIcon />,
  },
];

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const adminLogOutHandler = async () => {
    const toastId = toast.loading("Logging out...");
    try {
      const { data } = await axios.get(`${server}/api/v1/admin/logout`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (data?.success) {
        toast.success(data?.message || "Logged out successfully", {
          id: toastId,
        });
        dispatch(adminNotExists());

        navigate("/admin/login");
      } else {
      }
    } catch (error) {
      toast.error(error?.response?.data?.message, { id: toastId });
      navigate("/admin/login");
    }
  };

  const SideBar = (
    <Stack height={"100%"} gap={"1rem"}>
      <div
        style={{
          height: "18%",
          display: "flex",
          marginTop: "2rem",
        }}
      >
        {/* Admin Image */}
        <div>
          <Avatar
            alt="Admin"
            src={AdminPic}
            sx={{
              height: "5rem",
              width: "5rem",
            }}
          />
        </div>
        {/* Admin Image */}

        {/* Text */}
        <div
          style={{
            marginLeft: "1rem",
          }}
        >
          <Typography variant="h5" color="#7C7C7C">
            Hello,
          </Typography>
          <Typography variant="h6">Mart Com</Typography>
        </div>
        {/* Text */}
        {/* LogOut button Icon */}
        <div
          style={{
            marginLeft: "2rem",
          }}
        >
          <IconButton
            aria-label="logout"
            size="large"
            onClick={adminLogOutHandler}
          >
            <Tooltip title="Logout">
              <LogoutIcon />
            </Tooltip>
          </IconButton>
        </div>
        {/* LogOut button Icon */}
      </div>

      {/* Line */}
      <div
        style={{
          height: ".2%",
          width: "90%",
          backgroundColor: "#7C7C7C",
          // border: "1px solid #7C7C7C",
        }}
      ></div>
      {/* Line */}

      {/* Admin Tabs */}

      <Stack marginTop={"4rem"} gap={"1rem"}>
        {adminTabs.map((tab, index) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            style={{
              textDecoration: "none",
              color: "black",
            }}
          >
            <Stack
              direction={"row"}
              key={index}
              gap={"1rem"}
              sx={{
                transition: "transform 0.5s ease",
                "&:hover": {
                  borderRight: `2px solid ${yellow}`,
                  color: yellow, // Change text and icon color on hover
                },
                "&:hover .MuiIconButton-root": {
                  color: yellow, // Change icon color on hover
                  transform: "rotate(360deg)",
                },
                "&:hover .MuiTypography-root": {
                  color: yellow, // Change text color on hover
                },
                ".MuiIconButton-root, .MuiTypography-root": {
                  transition: "all 0.3s ease", // Smooth transition for color change
                },
              }}
            >
              <IconButton>{tab.icon}</IconButton>
              <Typography sx={{ marginTop: ".5rem" }}>{tab.name}</Typography>
            </Stack>
          </NavLink>
        ))}
      </Stack>

      {/* Admin Tabs */}

      {/* Footer of sidebar */}
      <div
        style={{
          height: "20%",
          marginTop: "6rem",
        }}
      >
        <Typography
          variant="h5"
          style={{
            color: "#000000",
            display: "inline",
          }}
        >
          Swift
        </Typography>
        <Typography
          variant="h5"
          style={{
            color: yellow,
            display: "inline",
          }}
        >
          Shop
        </Typography>
        <Typography
          style={{
            color: "#7C7C7C",
          }}
        >
          ©2024 SwiftShop marketplace.
        </Typography>
        <Typography
          style={{
            color: "#7C7C7C",
          }}
        >
          All rights reversed.
        </Typography>
      </div>

      {/* Footer of sidebar */}
    </Stack>
  );

  return (
    <Stack
      direction={"row"}
      width={"100vw"}
      height={"100vh"}
      sx={{ overflow: "hidden" }}
    >
      {/* Sidebar rendering */}
      <Stack
        direction={"column"}
        sx={{
          width: "20%",
          paddingLeft: "1rem",
          overflow: "hidden", // No scroll for sidebar
        }}
        backgroundColor={"#EFEFEF"}
      >
        <Box>{SideBar}</Box>
      </Stack>

      {/* Children rendering */}
      <Stack
        sx={{
          width: "80%",
          overflowY: "auto", // Only the children component scrolls vertically
          // overflowX: "hidden", // No horizontal scroll
          height: "100%", // Full height for the children container
          marginLeft: "1rem",
        }}
      >
        {children}
      </Stack>
    </Stack>
  );
};

export default AdminLayout;
