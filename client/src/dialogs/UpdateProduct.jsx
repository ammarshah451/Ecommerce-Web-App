import React, { useEffect, useState } from "react";
import {
  InputBtn,
  SearchBtn,
  SelectDropDownBtn,
  YellowBtn,
} from "../shared/SharedComponents";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Box,
  Avatar,
  Typography,
  Button,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useGetAProductQuery } from "../redux/api/api";

const product = {
  id: "P091",
  name: "Ahsan",
  price: 100,
  imgUrl: "",
  quantity: 0,
  categoryname: "electronics",
  description: "",
};
import axios from "axios";
import { server } from "../constants/config";
import toast from "react-hot-toast";

const UpdateProduct = ({
  open,
  closeHandler,
  updateProductHandler,
  id,
  setId,
  name,
  setName,
  category,
  setCategory,
  quantity,
  setQuantity,
  price,
  setPrice,
  description,
  setDescription,
  categoryList = [],
}) => {
  useEffect(() => {
    return () => {
      setId("");
      setName("");
      setCategory("");
      setQuantity("");
      setPrice("");
      setDescription("");
      setimgurl("");
    };
  }, []);
  const [imgurl, setimgurl] = useState("");

  const searchAProductHandler = async () => {
    if (id === "") return;

    const toastId = toast.loading("Fetching Product...");
    try {
      const { data } = await axios.get(
        `${server}/api/v1/products/getAProduct/${id}`
      );

      if (data?.success) {
        toast.success("Product has been fetched", { id: toastId });
        setName(data?.message?.name);
        setCategory(data?.message?.categoryname);
        setQuantity(data?.message?.quantity);
        setPrice(data?.message?.price);
        setDescription(data?.message?.description);
        setimgurl(data?.message?.imgUrl);
      } else {
        toast.error(data?.message || "Error in fetching Product", {
          id: toastId,
        });
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Oops! Something went wrong",
        { id: toastId }
      );
    }
  };

  return (
    <Dialog open onClose={closeHandler} fullScreen>
      <IconButton sx={{ color: "red" }} onClick={closeHandler}>
        <CloseIcon sx={{ fontSize: 40 }} />
      </IconButton>
      <DialogTitle sx={{ textAlign: "center", fontSize: 40 }}>
        Update An Existing Product
      </DialogTitle>
      <Box sx={{ marginLeft: "1.1rem" }}>
        <SearchBtn
          variable={id}
          setVariable={setId}
          finalHandler={searchAProductHandler}
          heading={"Product ID..."}
        />
      </Box>

      <DialogContent>
        {product && (
          <Stack
            direction={"row"}
            justifyContent={"center"}
            alignItems={"center"}
            sx={{ width: "90rem" }}
            gap={"1rem"}
          >
            {/* Image Of The Product */}
            <Stack
              sx={{
                borderRadius: "5px",
                height: "38rem",
                width: "30%",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  backgroundColor: "#fcb800",
                  height: "10%",
                  borderRadius: "5px",
                  display: "flex",
                  paddingLeft: "1rem",
                }}
                alignItems={"center"}
              >
                <Typography variant="h5" fontWeight={500}>
                  Image
                </Typography>
              </Box>
              <Stack
                justifyContent={"center"}
                alignItems={"center"}
                sx={{ marginTop: "2rem" }}
              >
                <Avatar
                  src={imgurl || ""}
                  sx={{ height: "20rem", width: "20rem", borderRadius: "0%" }}
                />
              </Stack>
            </Stack>
            {/* Image Of The Product */}

            {/* Product Info  */}
            <Stack
              sx={{
                // border: "1px solid gray",
                borderRadius: "5px",
                height: "38rem",
                width: "70%",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  backgroundColor: "#fcb800",
                  height: "15%",
                  borderRadius: "5px",
                  paddingLeft: "1rem",
                  display: "flex",
                }}
                alignItems={"center"}
              >
                <Typography variant="h5" fontWeight={500}>
                  Products Information
                </Typography>
              </Box>
              <Stack
                sx={{ marginTop: "2rem", paddingLeft: "1rem" }}
                justifyContent={"space-between"}
                direction={"row"}
                flexWrap={"wrap"}
                gap={"2rem"}
              >
                <Box sx={{ width: "100%" }}>
                  <Typography sx={{ color: "gray", marginLeft: ".2rem" }}>
                    Name
                  </Typography>
                  <InputBtn
                    heading={"Product Name"}
                    w="99.8%"
                    variable={name}
                    setVar={setName}
                  />
                </Box>

                <Box sx={{ width: "20%", marginTop: "1rem" }}>
                  <SelectDropDownBtn
                    list={categoryList}
                    heading={"Select Category"}
                    variable={category}
                    setVar={setCategory}
                  />
                </Box>
                <Box>
                  <Typography sx={{ color: "gray", marginLeft: ".2rem" }}>
                    Quantity
                  </Typography>
                  <InputBtn
                    heading={"Quantity"}
                    variable={quantity}
                    setVar={setQuantity}
                  />
                </Box>

                <Box>
                  <Typography sx={{ color: "gray", marginLeft: ".2rem" }}>
                    Price
                  </Typography>
                  <InputBtn
                    heading={"Price"}
                    variable={price}
                    setVar={setPrice}
                  />
                </Box>

                <Box sx={{ width: "100%" }}>
                  <Typography sx={{ color: "gray", marginLeft: ".2rem" }}>
                    Description
                  </Typography>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description (, separated points)"
                    className="w-full  h-40 p-4 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 resize-none bg-white text-gray-800 placeholder-gray-400"
                  ></textarea>
                </Box>
              </Stack>
              <Stack
                sx={{
                  paddingLeft: "1rem",
                  // border: "1px solid red",
                  height: "10rem",
                  width: "100%",
                }}
                direction={"row"}
                justifyContent={"center"}
                alignItems={"center"}
                gap={"4rem"}
              >
                <Button
                  color="error"
                  variant="contained"
                  sx={{ width: "10rem", height: "3rem" }}
                  onClick={closeHandler}
                >
                  Cancel
                </Button>
                <YellowBtn
                  heading={"Update"}
                  handler={updateProductHandler}
                  w="10rem"
                />
              </Stack>
            </Stack>
            {/* Product Info  */}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProduct;
