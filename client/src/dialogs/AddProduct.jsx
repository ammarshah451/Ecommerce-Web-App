import {
  CameraAltOutlined as CameraAltOutlinedIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import {
  InputBtn,
  SelectDropDownBtn,
  YellowBtn,
} from "../shared/SharedComponents";

const AddProduct = ({
  open,
  closeHandler,
  addProductHandler,
  file,
  setFile,
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
      setFile("");
      setName("");
      setCategory("");
      setQuantity("");
      setPrice("");
      setDescription("");
    };
  }, []);
  return (
    <Dialog open onClose={closeHandler} fullScreen>
      <IconButton sx={{ color: "red" }} onClick={closeHandler}>
        <CloseIcon sx={{ fontSize: 40 }} />
      </IconButton>
      <DialogTitle sx={{ textAlign: "center", fontSize: 40 }}>
        New Product
      </DialogTitle>
      <DialogContent>
        <Stack
          direction={"row"}
          justifyContent={"center"}
          alignItems={"center"}
          sx={{ width: "90rem" }}
          gap={"1rem"}
        >
          {/* Image selection */}
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
                Image Selection
              </Typography>
            </Box>
            <Stack
              justifyContent={"center"}
              alignItems={"center"}
              sx={{ marginTop: "2rem" }}
            >
              <Avatar
                src={file ? "" : file}
                sx={{ height: "20rem", width: "20rem", borderRadius: "0%" }}
              />
              <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            </Stack>
          </Stack>
          {/* Image selection */}

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
                height: "10%",
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
                <InputBtn
                  heading={"Product Name"}
                  w="99.8%"
                  variable={name}
                  setVar={setName}
                />
              </Box>

              <Box sx={{ width: "20%" }}>
                <SelectDropDownBtn
                  list={categoryList}
                  heading={"Select Category"}
                  variable={category}
                  setVar={setCategory}
                />
              </Box>
              <Box>
                <InputBtn
                  heading={"Quantity"}
                  variable={quantity}
                  setVar={setQuantity}
                />
              </Box>

              <Box>
                <InputBtn
                  heading={"Price"}
                  variable={price}
                  setVar={setPrice}
                />
              </Box>

              <Box sx={{ width: "100%" }}>
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
                heading={"Add"}
                handler={addProductHandler}
                w="10rem"
              />
            </Stack>
          </Stack>
          {/* Product Info  */}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export { AddProduct };
