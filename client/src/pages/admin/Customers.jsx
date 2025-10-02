import { FilterAlt as FilterAltIcon } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Table from "../../components/specifics/Table";
import { customerColumns } from "../../constants/necessaryConstants";
import { useErrors, useSearchHandler } from "../../hooks/hooks";
import AdminLayout from "../../layout/AdminLayout";
import {
  useGetUsersQuery,
  useSearchCustomersApiMutation,
} from "../../redux/api/api";
import {
  GreenPlusBtn,
  InputBtn,
  WhiteBtn,
} from "../../shared/SharedComponents";
import AdminHeader from "./AdminHeader";

const Customers = () => {
  const [rows, setRows] = useState([]);
  const [searchedName, setSearchedName] = useState("");
  const [searchedId, setSearchedId] = useState("");

  const [searchAPI] = useSearchCustomersApiMutation();

  const { isLoading, data, isError, error } = useGetUsersQuery();

  useErrors([{ isError, error }]);

  useEffect(() => {
    setRows(data?.message);
  }, [data]);

  const { handleSearch, isSearching } = useSearchHandler(searchAPI, setRows);

  const filterDataHandler = () => {
    if (searchedId === "" && searchedName === "") return;
    handleSearch({
      name: searchedName,
      id: searchedId,
    });
  };
  const showAllCustomers = () => {
    setRows(data?.message);
  };

  return (
    <AdminLayout>
      <AdminHeader name={"Customers"} value={"MartCom cusomters listing"} />
      <Stack
        direction={"column"}
        sx={{
          height: "95vh",
          width: "96%",
          marginTop: "1rem",
        }}
        gap={"1rem"}
      >
        {/* Header  */}
        <Stack direction={"row"} sx={{ width: "100%", height: "20%" }}>
          <Stack sx={{ width: "65%" }} direction={"row"}>
            <Box>
              <InputBtn
                heading={"Customer ID"}
                variable={searchedId}
                setVar={setSearchedId}
                w={"20rem"}
              />
              <Box sx={{ marginTop: "1rem", marginLeft: "-.6rem" }}>
                <WhiteBtn
                  data={"Filter"}
                  icon={<FilterAltIcon />}
                  handler={filterDataHandler}
                  w={"20rem"}
                />
              </Box>
            </Box>
            <Box sx={{ marginLeft: "1rem" }}>
              <InputBtn
                heading={"Customer Name"}
                variable={searchedName}
                setVar={setSearchedName}
                w={"20rem"}
              />
            </Box>
          </Stack>
          <Box
            sx={{
              padding: ".8rem",
              marginLeft: "14rem",
            }}
          >
            <GreenPlusBtn data={"Show All"} handler={showAllCustomers} />
          </Box>
        </Stack>

        {/* Header  */}

        {/* Table  */}
        <Stack alignItems={"center"} sx={{ width: "100%", height: "90%" }}>
          <Typography variant="h6">Customer Details</Typography>
          {isLoading || isSearching ? (
            <Typography>Loading...</Typography>
          ) : (
            <Table rows={rows} columns={customerColumns} />
          )}
        </Stack>

        {/* Table  */}
      </Stack>
    </AdminLayout>
  );
};

export default Customers;
