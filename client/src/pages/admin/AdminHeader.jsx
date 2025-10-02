import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { SearchBtn } from "../../shared/SharedComponents";
import { StoreMallDirectoryOutlined as StoreMallDirectoryOutlinedIcon } from "@mui/icons-material";
const AdminHeader = ({ name, value }) => {
  const navigate = useNavigate();
  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      width={"95%"}
      padding={"1rem"}
      sx={{ marginTop: "1rem" }}
    >
      <Box>
        <Typography fontWeight={"bold"}>{name}</Typography>
        <Typography>{value}</Typography>
      </Box>

      <Box>
        <SearchBtn />
      </Box>
      <Stack
        direction={"row"}
        alignItems={"center"}
        sx={{
          "&:hover": {
            color: "#fcb800",
            cursor: "pointer",
          },
        }}
        onClick={() => navigate("/login")}
      >
        <Typography>View Your Store</Typography>
      </Stack>
    </Stack>
  );
};

export default AdminHeader;
