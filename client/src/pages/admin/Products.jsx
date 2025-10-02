import React, { useEffect, useState } from "react";

import {
  Add as AddIcon,
  DeleteForever as DeleteForeverIcon,
  UpdateOutlined as UpdateOutlinedIcon,
  FilterAltOutlined as FilterAltOutlinedIcon,
} from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import { productsColumns } from "../../constants/necessaryConstants";
import AdminLayout from "../../layout/AdminLayout";
import {
  GreenPlusBtn,
  InputBtn,
  SelectDropDownBtn,
  WhiteBtn,
} from "../../shared/SharedComponents";
import AdminHeader from "./AdminHeader";

import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Table from "../../components/specifics/Table";
import { AddProduct } from "../../dialogs/AddProduct";
import { useErrors, useSearchHandler } from "../../hooks/hooks";
import {
  useAddProductMutation,
  useGetCategoriesQuery,
  useGetProductsQuery,
  useSearchProductsApiMutation,
  useUpdateProductMutation,
} from "../../redux/api/api";
import { Button } from "react-bootstrap";
import UpdateProduct from "../../dialogs/UpdateProduct";

const Products = () => {
  const navigate = useNavigate();

  const { admin } = useSelector((state) => state.auth);

  const [rows, setRows] = useState([]);

  const [toShowAddProductDialog, setToShowAddProductDialog] = useState(false);
  const [toShowDeleteProductDialog, setToShowDeleteProductDialog] =
    useState(false);
  const [toShowUpdateProductDialog, setToShowUpdateProductDialog] =
    useState(false);

  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("stock");
  const [searchedProductId, setSearchedProductId] = useState("");
  const [searchedProductName, setSearchedProductName] = useState("");
  const [priceLowerBound, setPriceLowerBound] = useState(-1);
  const [priceUpperBound, setPriceUpperBound] = useState(-1);

  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newQuantity, setNewQuantity] = useState("");

  const [updateSearchedProductId, setUpdateSearchedProductId] = useState("");

  const { isLoading, data, isError, error } = useGetProductsQuery({
    categories: "",
  });

  const [addProductQuery] = useAddProductMutation();
  const [updateProductQuery] = useUpdateProductMutation();

  const categories = useGetCategoriesQuery({ populate: false });
  useErrors([
    { isError, error },
    {
      isError: categories.isError,
      error: categories.error,
    },
  ]);

  useEffect(() => {
    setRows(data?.message);
  }, [data]);

  const [searchAPI] = useSearchProductsApiMutation();
  const { handleSearch, isSearching } = useSearchHandler(searchAPI, setRows);

  const filterDataHandler = () => {
    if (
      searchedProductId === "" &&
      searchedProductName === "" &&
      status === "" &&
      category === "" &&
      priceLowerBound === -1 &&
      priceUpperBound === -1
    )
      return;
    handleSearch({
      id: searchedProductId,
      name: searchedProductName,
      avaliable: status,
      category,
      priceLowerBound,
      priceUpperBound,
    });
    setSearchedProductId("");
    setSearchedProductName("");
    setStatus("");
    setCategory("");
    setPriceLowerBound(-1);
    setPriceUpperBound(-1);
  };

  const closeAddProductDialog = () => setToShowAddProductDialog(false);
  const closeUpdateProductDialog = () => setToShowUpdateProductDialog(false);
  const closeDeleteProductDialog = () => setToShowDeleteProductDialog(false);

  const addProductHandler = async () => {
    if (
      newImage === "" ||
      newName === "" ||
      newDescription === "" ||
      newPrice === "" ||
      newCategory === "" ||
      newQuantity === ""
    ) {
      return toast.error("Pease fill all fields!");
    }
    const form = new FormData();
    form.append("name", newName);
    form.append("description", newDescription);
    form.append("price", newPrice);
    form.append("categoryname", newCategory);
    form.append("quantity", newQuantity);
    form.append("adminid", admin.id);
    form.append("image", newImage);

    const toastId = toast.loading("Adding product...");

    const response = await addProductQuery(form);
    try {
      if (response?.data?.success) {
        toast.success(response?.data?.message, { id: toastId });
        setToShowAddProductDialog(false);
        navigate("/admin/products");
      } else {
        toast.error(response?.data?.message || "Oops! Something went wrong", {
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

  const updateProductHandler = async () => {
    if (
      newName === "" ||
      newDescription === "" ||
      newPrice === "" ||
      newCategory === "" ||
      newQuantity === ""
    ) {
      return toast.error("Pease fill all fields!");
    }

    const obj = {
      name: newName,
      description: newDescription,
      price: newPrice,
      categoryName: newCategory,
      quantity: newQuantity,
      productId: updateSearchedProductId,
    };

    const toastId = toast.loading("Updating product...");

    const response = await updateProductQuery(obj);
    try {
      if (response?.data?.success) {
        toast.success(response?.data?.message, { id: toastId });
        setToShowUpdateProductDialog(false);
        navigate("/admin/products");
      } else {
        toast.error(response?.error?.data?.message || "Cant update product", {
          id: toastId,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || "Oops! Something went wrosng", {
        id: toastId,
      });
    }
  };

  const deleteProductHandler = (productId) => {};

  const showAllProducts = () => {
    setRows(data?.message);
  };

  return (
    <AdminLayout>
      <AdminHeader name={"Products"} value={"MartCom products listing"} />
      <Box
        sx={{
          width: "100%",
          // textAlign: "right",
          paddingTop: "1rem",
          marginLeft: "-.2rem",
          // border: "1px solid red",
        }}
      >
        <GreenPlusBtn
          data={"New Product"}
          handler={() => setToShowAddProductDialog(true)}
          icon={<AddIcon />}
          w={"17rem"}
        />
        {/* <Button
          variant="danger"
          style={{
            borderRadius: "0%",
          }}
          onClick={() => setToShowDeleteProductDialog(true)}
          className="w-[16.8rem] h-[2.9rem] -mt-[.2rem] ml-[1.2rem]"
        >
          <DeleteForeverIcon />
          Delete Product
        </Button> */}
        <Button
          color="error"
          style={{
            borderRadius: "0%",
          }}
          onClick={() => setToShowUpdateProductDialog(true)}
          className="w-[16.8rem] h-[2.9rem] -mt-[.2rem] ml-[1.2rem]"
        >
          <UpdateOutlinedIcon />
          Update Product
        </Button>
      </Box>
      {toShowAddProductDialog && (
        <AddProduct
          open={toShowAddProductDialog}
          closeHandler={closeAddProductDialog}
          addProductHandler={addProductHandler}
          categoryList={categories?.data?.message}
          name={newName}
          setName={setNewName}
          description={newDescription}
          setDescription={setNewDescription}
          price={newPrice}
          setPrice={setNewPrice}
          category={newCategory}
          setCategory={setNewCategory}
          file={newImage}
          setFile={setNewImage}
          quantity={newQuantity}
          setQuantity={setNewQuantity}
        />
      )}

      {toShowUpdateProductDialog && (
        <UpdateProduct
          closeHandler={closeUpdateProductDialog}
          updateProductHandler={updateProductHandler}
          categoryList={categories?.data?.message}
          id={updateSearchedProductId}
          setId={setUpdateSearchedProductId}
          name={newName}
          setName={setNewName}
          description={newDescription}
          setDescription={setNewDescription}
          price={newPrice}
          setPrice={setNewPrice}
          category={newCategory}
          setCategory={setNewCategory}
          quantity={newQuantity}
          setQuantity={setNewQuantity}
        />
      )}
      <Stack
        sx={{ height: "5rem" }}
        direction={"row"}
        gap={"2rem"}
        marginTop={"1rem"}
      >
        <Box sx={{ width: "15%", marginTop: ".3rem" }}>
          <InputBtn
            heading={"Product ID..."}
            variable={searchedProductId}
            setVar={setSearchedProductId}
          />
          <Box sx={{ marginTop: ".6rem", marginLeft: "-.3rem" }}>
            <WhiteBtn
              data={"Filter"}
              icon={<FilterAltOutlinedIcon />}
              handler={filterDataHandler}
              w={"17rem"}
            />
          </Box>
        </Box>
        <Box sx={{ width: "15%", marginTop: ".3rem", marginLeft: "5rem" }}>
          <InputBtn
            heading={"Product Name..."}
            variable={searchedProductName}
            setVar={setSearchedProductName}
          />
          <Box sx={{ marginTop: ".8rem", marginLeft: "36.7rem" }}>
            <GreenPlusBtn
              data={"Show all Products"}
              handler={showAllProducts}
              w={"16.7rem"}
            />
          </Box>
        </Box>
        <Box sx={{ width: "22.5%", marginTop: ".2rem", marginLeft: "5rem" }}>
          {categories.isLoading ? (
            <></>
          ) : (
            <>
              <SelectDropDownBtn
                heading={"Select Category"}
                list={categories?.data?.message}
                variable={category}
                setVar={setCategory}
              />
            </>
          )}
        </Box>

        <Box sx={{ width: "22.5%", marginTop: ".2rem" }}>
          <SelectDropDownBtn
            heading={"Select Status"}
            list={["stock", "outofstock"]}
            variable={status}
            setVar={setStatus}
          />
        </Box>
      </Stack>

      <Stack sx={{ marginTop: "5rem" }}>
        <Typography
          textAlign={"center"}
          variant="h6"
          marginTop={".5rem"}
          height={"rem"}
        >
          All Products
        </Typography>
        {isLoading ? (
          <></>
        ) : (
          <>
            <Table rows={rows} columns={productsColumns} rowHeight={100} />
          </>
        )}
      </Stack>
    </AdminLayout>
  );
};

export default Products;
