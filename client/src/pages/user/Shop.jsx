import {
  Description,
  FormatListBulleted as FormatListBulletedIcon,
  GridOn as GridOnIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Grid2,
  IconButton,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import slider_1 from "../../assets/slider-1.png";
import {
  predefinedDepartmentsData,
  predefinedTypesData,
} from "../../constants/necessaryConstants";
import { SpecificProduct } from "../../dialogs/SpecificProduct";
import AppLayout from "../../layout/AppLayout";
import {
  useGetBestSoldProductsQuery,
  useGetPaginatedProductsQuery,
} from "../../redux/api/api";
import {
  ImageSlider,
  PriceRangeSelector,
  ProductCard,
  ProductSlider,
  ProductSliderHeader,
  URLOfPageTopBar,
  VerticalProductCard,
  YellowUnderLineBtn,
} from "../../shared/SharedComponents";
import { useErrors } from "../../hooks/hooks";
import { Loader } from "../../layout/Loader";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/reducers/cart";
import { getCartObj } from "../../lib/features";

const images = [slider_1, slider_1];

let totalProd = 0;
let totalPages = 0;

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchedCategory = searchParams.get("category");

  const [prices, setPrices] = useState([0, 100]);
  const [toShowAProduct, setToShowAProduct] = useState(false);

  const [bestSoldProducts, setBestSoldProducts] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState([]);
  const [view, setView] = useState("grid");

  const dispatch = useDispatch();

  const [page, setPage] = useState(1);

  const [rows, setRows] = useState([]);

  const { isLoading, data, isError, error } = useGetPaginatedProductsQuery({
    page,
    category: searchedCategory,
    priceLowerBound: prices[0],
    priceUpperBound: prices[1],
  });
  const {
    isLoading: bspLoading,
    data: bsProducts,
    isError: bspIsError,
    error: bspError,
  } = useGetBestSoldProductsQuery();

  useErrors([
    { isError, error },
    { bspIsError, bspError },
  ]);

  useEffect(() => {
    // if page changes so update the data
    setRows(data?.message);
    totalPages = data?.totalPages;
    totalProd = data?.totalProducts;
    // console.log(data?.message);
  }, [data]);

  useEffect(() => {
    setBestSoldProducts(bsProducts?.message);
  }, [bsProducts]);

  const changeViewToGrid = () => setView("grid");

  const changeViewToList = () => setView("list");

  const pageChangeHandler = (event, value) => setPage(value);

  const showAProduct = (product) => {
    setSelectedProduct(product);
    setToShowAProduct(true);
  };

  const addToCartHandler = (product, quantity) => {
    const cartObj = getCartObj(product, quantity);

    dispatch(addToCart(cartObj));
    toast.success(`Added to cart successfully!`);
  };
  const closeDialog = () => setToShowAProduct(false);

  const BestSoldItemsBox = (
    <Stack
      sx={{
        // border: "1px solid red",
        height: "30rem",
        width: "99%",
      }}
    >
      {toShowAProduct && (
        <SpecificProduct
          product={selectedProduct}
          open={toShowAProduct}
          handlerClose={closeDialog}
          addToCart={addToCartHandler}
        />
      )}
      <ProductSliderHeader data={"Best Sold Items"} url={"#"} />
      <ProductSlider
        products={bestSoldProducts}
        showAProduct={showAProduct}
        addToCart={addToCartHandler}
      />
    </Stack>
  );

  const HorizontalGridProductBoxes = (
    <Grid2 container spacing={view === "grid" ? 0 : 2}>
      {data?.message?.length > 0 ? (
        data?.message?.map((product, index) => (
          <Grid2
            sx={{ padding: ".5rem", "&:hover": { border: "1px solid gray" } }}
            size={view === "grid" ? 3 : 12}
            height={view === "grid" ? "23rem" : "15rem"}
            key={index}
          >
            <VerticalProductCard
              product={product}
              addToCart={addToCartHandler}
            />
          </Grid2>
        ))
      ) : (
        <></>
      )}
    </Grid2>
  );

  const VerticalGridProductBoxes = (
    <Grid2 container spacing={view === "grid" ? 0 : 2}>
      {data?.message?.length > 0 &&
        data?.message?.map((product, index) => (
          <Grid2
            size={view === "grid" ? 3 : 12}
            height={view === "grid" ? "23rem" : "15rem"}
            key={index}
            sx={{
              marginTop: index > 3 ? "3rem" : "0rem",
            }}
          >
            <ProductCard
              product={product}
              addToCart={addToCartHandler}
              showAProduct={showAProduct}
            />
          </Grid2>
        ))}
    </Grid2>
  );

  const filterDataHandler = () => {
    if (prices[0] === 0 && prices[1] === 100) return;
  };
  return (
    <AppLayout>
      {/* Main wrapper */}
      <Box sx={{ width: "100%" }}>
        {/* URL of page */}
        <URLOfPageTopBar url={"Home / Shop"} />
        {/* URL of page */}

        {/* Image SLider */}
        <Box sx={{ width: "98%" }}>
          <ImageSlider images={images} />
        </Box>
        {/* Image SLider */}

        <Stack
          flexWrap={"wrap"}
          gap={"1rem"}
          sx={{
            height: view === "grid" ? "165rem" : "335rem",
            width: "98%",
            // border: "1px solid black",
            marginTop: "5rem",
          }}
        >
          <Stack
            sx={{
              // border: "1px solid red",
              height: "60rem",
              width: "23%",
              display: "flex",
              direction: "column",
              gap: "1rem",
            }}
          >
            {/* Category Side Box */}
            <Stack
              sx={{
                // border: "1px solid black",
                height: "35rem",
                width: "100%",
                // paddingTop: "1rem",
                paddingLeft: "1rem",
                backgroundColor: "#f5f5f5",
              }}
              justifyContent={"space-evenly"}
            >
              <Typography sx={{ fontWeight: "bold" }}>CATEGORIES</Typography>
              <Stack gap={"1.5rem"}>
                {predefinedDepartmentsData.map(({ name, url, icon }, index) => (
                  <YellowUnderLineBtn data={name} url={url} key={index} />
                ))}
              </Stack>
            </Stack>
            {/* Category Side Box */}

            {/* Price Filter Side Box */}
            <Stack sx={{ height: "15rem", width: "100%" }}>
              <Stack
                sx={{
                  // border: "1px solid black",
                  height: "10rem",
                  width: "100%",
                  paddingTop: "1rem",
                  paddingLeft: "1rem",
                  backgroundColor: "#f5f5f5",
                }}
                justifyContent={"space-around"}
              >
                <Typography>BY PRICE</Typography>
                <PriceRangeSelector
                  prices={prices}
                  setPrices={setPrices}
                  setPage={setPage}
                />
                <Typography sx={{ color: "gray" }} fontWeight={"thin"}>
                  Price: ${prices[0]} - ${prices[1]}
                </Typography>
              </Stack>
            </Stack>

            {/* Price Filter Side Box */}
          </Stack>

          <Stack sx={{ height: "100%", width: "76%" }}>
            {/* Best Seller Items */}
            {BestSoldItemsBox}
            {/* Best Seller Items */}

            <Stack>
              {/* Top Bar */}
              <div className="h-[4rem] w-[100%] bg-gray-200 border-b-2 border-b-gray-300 flex flex-row justify-between items-center">
                <span className="p-6 font-bold">
                  {totalProd}
                  <span className="ml-2 text-gray-500 font-medium">
                    Products found
                  </span>
                </span>

                <div className="p-2">
                  <IconButton
                    onClick={changeViewToGrid}
                    sx={{ color: view === "grid" ? "black" : "gray" }}
                  >
                    <GridOnIcon />
                  </IconButton>
                  <IconButton
                    onClick={changeViewToList}
                    sx={{ color: view === "list" ? "black" : "gray" }}
                  >
                    <FormatListBulletedIcon />
                  </IconButton>
                </div>
              </div>
              {/* Top Bar */}

              {/* Actual Products */}
              {isLoading ? (
                <Loader />
              ) : view === "list" ? (
                <>{HorizontalGridProductBoxes}</>
              ) : (
                <>{VerticalGridProductBoxes}</>
              )}
              {/* Actual Products */}

              <Stack
                sx={{ marginTop: "5rem" }}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Pagination
                  count={totalPages}
                  color="primary"
                  variant="outlined"
                  onChange={pageChangeHandler}
                />
              </Stack>
              {/* Actual Products */}
            </Stack>
          </Stack>
        </Stack>
      </Box>
      {/* Main wrapper */}
    </AppLayout>
  );
};

export default Shop;
