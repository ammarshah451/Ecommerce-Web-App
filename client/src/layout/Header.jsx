import {
  Menu as MenuIcon,
  PersonOutlineOutlined as PersonOutlineOutlinedIcon,
  ShoppingBagOutlined as ShoppingBagOutlinedIcon,
  SettingsOutlined as SettingsOutlinedIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { Badge, Box, IconButton, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropDownBtn,
  DropDownBtnForProducts,
  DropDownUrlBtn,
  HorizontalLine,
} from "../shared/SharedComponents";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../constants/config";
import { useDispatch, useSelector } from "react-redux";
import { userNotExists } from "../redux/reducers/auth";
import {
  useGetCategoriesQuery,
  useSearchProductsApiMutation,
} from "../redux/api/api";
import {
  predefinedDepartmentsData,
  predefinedPagesOfHeader,
  predefinedTypesData,
} from "../constants/necessaryConstants";
import { useSearchHandler } from "../hooks/hooks";
import { clearCart, clearDiscountRate } from "../redux/reducers/cart";
import {
  removePaymentDetails,
  removeShippingDetails,
} from "../redux/reducers/misc";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cart } = useSelector((state) => state.cart);

  const [rows, setRows] = useState([]);

  const categories = useGetCategoriesQuery({ populate: false });
  const [searchAPI] = useSearchProductsApiMutation();

  const { handleSearch, isSearching } = useSearchHandler(searchAPI, setRows);

  const [searched, setSearched] = useState("");

  const [page, setPage] = useState("");

  const [categoryList, setCategoryList] = useState([]);

  const [category, setCategory] = useState("");

  const [showDropDown, setShowDropDown] = useState(false);
  const [dropDownIndex, setDropDownIndex] = useState(-1);

  useEffect(() => {
    setCategoryList(["All"]);
    categories?.data?.message?.forEach((name) => {
      setCategoryList((prev) => [...prev, name]);
    });
  }, [categories?.data?.message]);

  useEffect(() => {
    if (searched === "") return;

    //using debouncing to avoid unnecessary api calls
    console.log(category);
    const getData = setTimeout(async () => {
      handleSearch({
        name: searched,
        category: category === "All" ? "" : category,
      });
    }, [1000]);
    return () => {
      clearTimeout(getData);
      setRows([]);
    };
  }, [searched]);

  const redirectToLoginPage = () => {
    navigate("/login");
  };

  const trackHandler = () => {
    navigate("/order/track");
  };

  const showCartHandler = () => {
    navigate("/cart");
  };
  const navigateToProfile = () => {
    navigate("/user/profile");
  };
  const navigateToShop = () => {
    navigate("/shop");
  };
  const navigateToPage = () => {
    navigate(`/${page}`);
  };
  const orderHistoryHandler = () => {
    navigate(`/order/history`);
  };

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (data?.success) {
        dispatch(clearCart());
        dispatch(removePaymentDetails());
        dispatch(removeShippingDetails());
        dispatch(clearDiscountRate());
        dispatch(userNotExists());
        redirectToLoginPage();
        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Oops! An error occurred");
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "78%",
        backgroundColor: "#fcb800",
        position: "sticky", // or 'fixed'
        top: 0, // Keeps it at the top
        zIndex: 1000, // High value to ensure it's on top
      }}
    >
      <Stack
        sx={{
          // border: "1px solid black",
          height: "60%",
          width: "100%",
          position: "sticky",
        }}
        direction={"row"}
        gap={"1rem"}
      >
        {/* heading */}
        <Box
          sx={{
            // border: "1px solid red",
            width: "7rem",
            height: "2rem",
            marginTop: "1.5rem",
            marginLeft: "1rem",
          }}
        >
          <Typography
            variant="h5"
            style={{
              color: "#000000",
              display: "inline",
              cursor: "pointer",
            }}
            onClick={() => {
              navigate("/");
            }}
          >
            Swift
          </Typography>
          <Typography
            variant="h5"
            style={{
              color: "white",
              display: "inline",
            }}
          >
            Shop
          </Typography>
        </Box>

        {/* search bar */}
        <Stack
          direction={"row"}
          sx={{
            width: "45rem",
            height: "3rem",
            marginTop: "1.5rem",
            marginLeft: "12rem",
          }}
        >
          <Box
            sx={{
              display: "inline-block",
              width: "26%",
              height: "100%",
              // border: "1px solid green",
            }}
          >
            <Box
              sx={{
                textAlign: "center",
                height: "2.9rem",
                paddingTop: ".7rem",
                backgroundColor: "white",
              }}
              onClick={() => {
                setShowDropDown(!showDropDown);
                setDropDownIndex(0);
              }}
            >
              <Typography sx={{ display: "inline-block" }}>
                {category === "" ? "All" : category}
              </Typography>
              <ArrowDropDownIcon sx={{ color: "black", marginLeft: "1rem" }} />
              {showDropDown && dropDownIndex === 0 && (
                <DropDownBtn list={categoryList} setHandler={setCategory} />
              )}
            </Box>
          </Box>

          <Box
            sx={{
              display: "",
              width: "100%",
              height: "100%",
              // border: "1spx solid green",
            }}
          >
            <input
              type="text"
              id="search"
              className="w-[90%] h-[2.9rem]  pl-2 rounded-0 focus:outline-none border-l-[.01rem] border-gray-300"
              placeholder="I'm shopping for..."
              value={searched}
              onChange={(e) => setSearched(e.target.value)}
            />
            <IconButton
              sx={{
                borderRadius: "0%",
                borderLeft: "1px solid gray",
                height: "2.9rem",
                marginTop: "-.4rem",
                backgroundColor: "white",
              }}
            >
              <SearchIcon sx={{ color: "black" }} />
            </IconButton>
            {rows.length > 0 && <DropDownBtnForProducts list={rows} />}
          </Box>
        </Stack>

        {/* Cart */}
        <Box
          sx={{
            width: "3rem",
            height: "3rem",
            marginTop: "1.5rem",
            marginLeft: "4rem",
            // border: "1px solid black",
          }}
        >
          <IconButton onClick={showCartHandler}>
            <ShoppingBagOutlinedIcon
              sx={{ margin: "-.5rem", fontSize: 40, color: "black" }}
            />
            {cart.length !== 0 && (
              <div className=" bg-black h-[1.3rem] w-[1.3rem] rounded-xl relative top-[.7rem] -left-[.5rem]">
                <Badge
                  badgeContent={`${cart.length}`}
                  max={10}
                  sx={{ color: "white", marginTop: "-1.5rem" }}
                />
              </div>
            )}
          </IconButton>
        </Box>

        {/* login/register */}
        <Box
          sx={{
            width: "10rem",
            height: "5.4rem",
            marginLeft: "2rem",
          }}
        >
          <IconButton>
            <PersonOutlineOutlinedIcon
              sx={{ color: "black", fontSize: 40, marginTop: "1rem" }}
            />
          </IconButton>
          <div className="-mt-[3.2rem] ml-[4rem] ">
            <button
              className="hover:text-white text-sm duration-300 ease-in-out"
              onClick={redirectToLoginPage}
            >
              Login
            </button>
            <br />
            <button
              className="hover:text-white text-sm duration-300 ease-in-out"
              onClick={redirectToLoginPage}
            >
              Register
            </button>
          </div>

          {/* Logout button */}
          <div className={`-mt-[3rem] ml-[10rem]`}>
            <IconButton onClick={logoutHandler}>
              <LogoutIcon sx={{ color: "black", fontSize: 35 }} />
            </IconButton>
          </div>
          {/* Logout button */}
        </Box>
      </Stack>

      <HorizontalLine bg={"#6c757d"} />
      <Stack
        direction={"row"}
        justifyContent={"space-around"}
        sx={{
          // border: "1px solid red",
          height: "40%",
          width: "100%",
        }}
      >
        {/* Shop by department btn */}
        <Box
          sx={{
            height: "100%",
            width: "15%",
            paddingTop: ".5rem",
            marginLeft: "-4rem",
          }}
          onClick={() => {
            setShowDropDown(!showDropDown);
            setDropDownIndex(1);
          }}
        >
          <IconButton
            sx={{
              borderRadius: "0%",
            }}
          >
            <MenuIcon sx={{ color: "black", fontSize: 30 }} />
          </IconButton>
          <Typography
            sx={{
              display: "inline-block",
              cursor: "pointer",
            }}
            fontWeight={"bold"}
          >
            Shop By Department
          </Typography>
          {showDropDown && dropDownIndex === 1 && (
            <Box>
              <DropDownUrlBtn list={predefinedDepartmentsData} />
            </Box>
          )}
        </Box>

        {/*  dropDowns, Home, shop etc */}
        <Stack
          sx={{ height: "100%", width: "30% " }}
          direction={"row"}
          // justifyContent={"space-around"}
          // alignItems={"center"}
        >
          <Box
            sx={{
              textAlign: "center",
              height: "2.9rem",
              paddingTop: "1rem",
              // backgroundColor: "white",
            }}
            onClick={() => {
              setShowDropDown(!showDropDown);
              setDropDownIndex(2);
            }}
          >
            {/* KAL KARLENA!!! */}
            {/* <Typography sx={{ display: "inline-block" }}>Pages</Typography>
            <ArrowDropDownIcon sx={{ color: "black", marginLeft: "1rem" }} />
            {showDropDown && dropDownIndex === 2 && (
              <DropDownUrlBtn list={predefinedPagesOfHeader} />
            )}
 */}
            {/* KAL KARLENA!!! */}
          </Box>
        </Stack>

        <Stack
          sx={{ height: "100%", width: "30% " }}
          direction={"row"}
          alignItems={"center"}
        >
          <div
            className="ml-[7rem] cursor-pointer font-semibold"
            onClick={trackHandler}
          >
            Track Your Order
          </div>
          <div className="h-[1.4rem] ml-4 w-[.1rem] rounded-lg font-weight-bold bg-black mr-4"></div>
          <div
            className="cursor-pointer font-semibold"
            onClick={orderHistoryHandler}
          >
            Order History
          </div>
          <div className="h-[1.4rem] ml-4 w-[.1rem] rounded-lg font-weight-bold bg-black mr-4"></div>
          <IconButton onClick={navigateToProfile}>
            <SettingsOutlinedIcon sx={{ color: "black" }} />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Header;
