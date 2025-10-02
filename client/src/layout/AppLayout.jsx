import { Box, Stack } from "@mui/material";
import React from "react";
import Footer from "./Footer";
import Header from "./Header";

const AppLayout = ({ children }) => {
  return (
    <Stack
      direction={"column"}
      width={"100vw"}
      height={"100vh"}
      overflowx={"hidden"}
    >
      <Box sx={{ width: "100%", height: "25%" }} overflowx={"hidden"}>
        <Header />
      </Box>
      <Box
        sx={{
          height: "75%",
          marginTop: "-1.5rem",
          paddingLeft: "1rem",
          paddingRight: "1rem",
        }}
      >
        {children}
      </Box>
      {/* <Box sx={{ height: "100%" }} overflowX={"hidden"}>
        <Footer />
      </Box> */}
    </Stack>
  );
};

export default AppLayout;
