import { Box, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Table from "../../components/specifics/Table";
import { categoryColumns } from "../../constants/necessaryConstants";
import AdminLayout from "../../layout/AdminLayout";
import {
  GreenPlusBtn,
  SearchBtn,
  WhiteBtn,
} from "../../shared/SharedComponents";
import AdminHeader from "./AdminHeader";

import toast from "react-hot-toast";
import {
  useAddCategoryMutation,
  useGetCategoriesQuery,
  useSearchCategoriesApiMutation,
} from "../../redux/api/api";
import { InputBtn } from "../../shared/SharedComponents";

import { useErrors, useSearchHandler } from "../../hooks/hooks";
import { Loader } from "../../layout/Loader";
import { Add as AddIcon } from "@mui/icons-material";
import { useSelector } from "react-redux";

const Categories = () => {
  const { admin } = useSelector((state) => state.auth);

  const [rows, setRows] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [searchedCategory, setSearchedCategory] = useState("");

  const { isLoading, data, isError, error, isSuccess } = useGetCategoriesQuery({
    populate: true,
  });

  useErrors([{ isError, error }]);

  useEffect(() => {
    setRows(data?.message);
  }, [data]);
  const [addCategoryQuery] = useAddCategoryMutation();
  const [searchAPI] = useSearchCategoriesApiMutation();

  const { handleSearch, isSearching } = useSearchHandler(searchAPI, setRows);

  const showAllCategories = async () => {
    setRows(data?.message);
  };
  const addCategoryHandler = async () => {
    if (name === "" && description === "") return;
    const toastId = toast.loading("Adding category...");
    try {
      const response = await addCategoryQuery({
        name,
        description,
        adminId: admin.id,
      });

      if (response?.data?.success) {
        toast.success(response?.data?.message, { id: toastId });
        setName("");
        setDescription("");
        return;
      } else {
        toast.error(response?.data?.message, { id: toastId });
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message, { id: toastId });
    }
  };
  const resetHandler = () => {
    if (name === "" && description === "") return;
    setName("");
    setDescription("");
    toast.success("Items cleared!");
  };

  return (
    <AdminLayout>
      <AdminHeader name={"Categories"} value={"MartCom categories listing"} />

      <Stack direction={"row"} height={"100vh"} sx={{ marginTop: "2rem" }}>
        <Box height={"100%"} width={"70%"}>
          <SearchBtn
            variable={searchedCategory}
            setVariable={setSearchedCategory}
            finalHandler={() => handleSearch({ value: searchedCategory })}
          />
          <WhiteBtn data={"Show All"} handler={showAllCategories} />
          <Box sx={{ marginTop: "6rem" }}>
            {isLoading || isSearching ? (
              <Loader />
            ) : (
              <Table rows={rows} columns={categoryColumns} rowHeight={52} />
            )}
          </Box>
        </Box>

        {/* Line */}
        <div
          style={{
            height: "61rem",
            width: ".01rem",
            backgroundColor: "#7C7C7C",
          }}
        ></div>
        {/* Line */}
        <Box height={"100%"} width={"35%"}>
          {/* SideBar */}

          <Stack direction={"column"} gap={"1rem"} padding={"1rem"}>
            <Box>
              <Typography sx={{ marginLeft: ".5rem" }}>
                Name<span className="text-red-500">*</span>
              </Typography>
              <InputBtn
                heading={"Name"}
                variable={name}
                setVar={setName}
                w={"20rem"}
              />
            </Box>

            <Box>
              <Typography sx={{ marginLeft: ".5rem" }}>
                Description<span className="text-red-500">*</span>
              </Typography>
              <InputBtn
                heading={"Description"}
                variable={description}
                setVar={setDescription}
                w={"20rem"}
              />
            </Box>

            <Stack direction={"column"}>
              <Box sx={{ height: "5rem", width: "100" }}>
                <WhiteBtn data={"RESET"} handler={resetHandler} w={"20rem"} />
              </Box>
              <Box sx={{ height: "5rem", width: "8rem" }}>
                <GreenPlusBtn
                  data={"Add Category"}
                  handler={addCategoryHandler}
                  icon={<AddIcon />}
                  w={"20rem"}
                />
              </Box>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </AdminLayout>
  );
};

export default Categories;
