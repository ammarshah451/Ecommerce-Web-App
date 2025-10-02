import {
  AddCardOutlined as AddCardOutlinedIcon,
  LoopOutlined as LoopOutlinedIcon,
  RocketLaunchOutlined as RocketLaunchOutlinedIcon,
  SmsOutlined as SmsOutlinedIcon,
} from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import slider_1 from "../../assets/slider-1.png";
import AppLayout from "../../layout/AppLayout";

import { Loader } from "../../layout/Loader";
import {
  HorizontalLine,
  ImageSlider,
  MoveToTopBtn,
  ProductSlider,
  ProductSliderHeader,
  SupportButton,
  VerticalLine,
} from "../../shared/SharedComponents";

import { topCategoriesSampleData } from "../../constants/homePageSampleData";
import { CategoriesOfMonthBox } from "../../shared/SharedComponents";

import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { SpecificProduct } from "../../dialogs/SpecificProduct";
import { useErrors } from "../../hooks/hooks";
import Footer from "../../layout/Footer";
import { getCartObj } from "../../lib/features";
import {
  useGetBestReviewedProductsQuery,
  useGetProductsQuery,
} from "../../redux/api/api";
import { addToCart } from "../../redux/reducers/cart";

const images = [slider_1, slider_1];

const Home = () => {
  const [toShowAProduct, setToShowAProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState([]);

  const [electronicPrds, setElectronicProducts] = useState([]);
  const [clothingPrds, setClothingProducts] = useState([]);
  const [fregnancePrds, setFregnanceProducts] = useState([]);
  const [bestReviewedPrds, setBestReviewedProducts] = useState([]);

  const dispatch = useDispatch();

  const showAProduct = (product) => {
    setSelectedProduct(product);
    setToShowAProduct(true);
  };

  //fetch all products of categories: electronics,clothings and fregnances
  const {
    isLoading: epIsLoading,
    data: electronicProducts,
    isError: epIsError,
    error: eperror,
  } = useGetProductsQuery({
    categories: "electronics",
  });

  const {
    isLoading: clpIsLoading,
    data: clothingProducts,
    isError: clpIsError,
    error: clperror,
  } = useGetProductsQuery({
    categories: "clothings",
  });

  const {
    isLoading: frgIsLoading,
    data: fregnancesProducts,
    isError: frgIsError,
    error: frgerror,
  } = useGetProductsQuery({
    categories: "fregnances",
  });

  //fetch all best reviewed products
  const {
    isLoading: bestVPrdsLoading,
    data: bestVPrds,
    isError: bestVPrdsIsError,
    error: bestVPrdsError,
  } = useGetBestReviewedProductsQuery();

  useErrors([
    { isError: epIsError, error: eperror },
    { isError: clpIsError, error: clperror },
    { isError: frgIsError, error: frgerror },
    { isError: bestVPrdsIsError, error: bestVPrdsError },
  ]);

  useEffect(() => {
    setBestReviewedProducts(bestVPrds?.message);
  }, [bestVPrds]);

  useEffect(() => {
    setElectronicProducts(electronicProducts?.message);
  }, [electronicProducts]);

  useEffect(() => {
    setClothingProducts(clothingProducts?.message);
  }, [clothingProducts]);
  useEffect(() => {
    setFregnanceProducts(fregnancesProducts?.message);
  }, [fregnancesProducts]);

  const goToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const addToCartHandler = (product, quantity) => {
    const cartObj = getCartObj(product, quantity);

    dispatch(addToCart(cartObj));
    toast.success(`Added to cart successfully!`);
  };

  const closeDialog = () => setToShowAProduct(false);

  const BestReviewedItemsBox = (
    <Stack
      sx={{
        // border: "1px solid red",
        height: "30rem",
        width: "99%",
        marginTop: "8rem",
      }}
    >
      {toShowAProduct && (
        <SpecificProduct
          product={selectedProduct}
          open={toShowAProduct}
          handlerClose={closeDialog}
        />
      )}
      <ProductSliderHeader data={"Best Reviewed Items"} />
      <ProductSlider
        products={bestReviewedPrds}
        showAProduct={showAProduct}
        addToCart={addToCartHandler}
      />
    </Stack>
  );

  const ConsumerElectronicsBox = (
    <Stack
      sx={{
        // border: "1px solid red",
        height: "30rem",
        width: "99%",
        marginTop: "-10rem",
      }}
    >
      {toShowAProduct && (
        <SpecificProduct
          product={selectedProduct}
          open={toShowAProduct}
          handlerClose={closeDialog}
        />
      )}
      <ProductSliderHeader
        data={"Consumer Electronics"}
        url={"/shop?category=electronics"}
      />
      {epIsLoading ? (
        <Loader />
      ) : (
        <ProductSlider
          products={electronicPrds}
          showAProduct={showAProduct}
          addToCart={addToCartHandler}
        />
      )}
    </Stack>
  );

  const ClothingAndApparelBox = (
    <Stack
      sx={{
        // border: "1px solid red",
        height: "30rem",
        width: "99%",
        marginTop: "8rem",
      }}
    >
      {toShowAProduct && (
        <SpecificProduct
          product={selectedProduct}
          open={toShowAProduct}
          handlerClose={closeDialog}
        />
      )}
      <ProductSliderHeader
        data={"Clothing & Apparel"}
        url={"/shop?category=clothings"}
      />
      {clpIsLoading ? (
        <Loader />
      ) : (
        <ProductSlider
          products={clothingPrds}
          showAProduct={showAProduct}
          addToCart={addToCartHandler}
        />
      )}
    </Stack>
  );

  const FregnancesBox = (
    <Stack
      sx={{
        // border: "1px solid red",
        height: "30rem",
        width: "99%",
        marginTop: "8rem",
      }}
    >
      {toShowAProduct && (
        <SpecificProduct
          product={selectedProduct}
          open={toShowAProduct}
          handlerClose={closeDialog}
        />
      )}
      <ProductSliderHeader
        data={"Perfumes & Scents "}
        url={"/shop?category=fregnances"}
      />
      {frgIsLoading ? (
        <Loader />
      ) : (
        <ProductSlider
          products={fregnancePrds}
          showAProduct={showAProduct}
          addToCart={addToCartHandler}
        />
      )}
    </Stack>
  );

  return (
    <AppLayout>
      <Box sx={{ height: "100%", width: "100%" }}>
        <Stack
          direction={"row"}
          gap={"1rem"}
          sx={{
            // border: "1px solid black",
            height: "80%",
            width: "100%",
            marginTop: ".5rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              // border: "1px solid red",
              height: "100%",
              width: "70%",
              paddingTop: "1.5rem",
              zIndex: 1,
            }}
          >
            <ImageSlider images={images} />7
          </Box>

          <Stack
            sx={{ height: "100%", width: "30%" }}
            direction={"column"}
            gap={".5rem"}
          >
            <img
              src={slider_1}
              alt={"sideimage1"}
              className="bg-center w-[90%] h-[10.6rem] ml-[1.5rem] mt-8"
            />
            <img
              src={slider_1}
              alt={"sideimage2"}
              className="bg-center w-[90%] h-[10.7rem] ml-[1.5rem] mt-2"
            />
            {/* img2 */}
          </Stack>
        </Stack>

        <Stack
          sx={{ border: "1px solid #DCDCDC", width: "98.5%", height: "17%" }}
          direction={"row"}
          gap={"1rem"}
          justifyContent={"space-between"}
        >
          <SupportButton
            icon={
              <RocketLaunchOutlinedIcon
                sx={{ color: "#fcb800", fontSize: 50 }}
              />
            }
            message={"For all oders over $99"}
            heading={"Free Delivery"}
          />
          <VerticalLine width={".1rem"} />
          <SupportButton
            icon={<LoopOutlinedIcon sx={{ color: "#fcb800", fontSize: 50 }} />}
            message={"For all oders over $99"}
            heading={"Free Delivery"}
          />

          <VerticalLine width={"0.1rem"} />
          <SupportButton
            icon={
              <AddCardOutlinedIcon sx={{ color: "#fcb800", fontSize: 50 }} />
            }
            message={"For all oders over $99"}
            heading={"Free Delivery"}
          />
          <VerticalLine width={"0.1rem"} />
          <SupportButton
            icon={<SmsOutlinedIcon sx={{ color: "#fcb800", fontSize: 50 }} />}
            message={"For all oders over $99"}
            heading={"Free Delivery"}
          />
        </Stack>

        <Stack
          sx={{
            // border: "1px solid red",
            width: "98.5%",
            height: "100%",
            marginTop: "5rem",
          }}
          direction={"column"}
        >
          {/* Deal of the Day Pending*/}
          {/* <Stack
            sx={{ width: "100%", height: "18%" }}
            direction={"row"}
            gap={"2rem"}
          >
            <Box>
              <Typography variant={"h5"} sx={{ color: "black" }}>
                Deal of the Day
              </Typography>
            </Box>
            <Button variant="danger" className="w-[12rem] h-[2.5rem] ">
              End in 7 : 04 : 200
            </Button>
            <Box
              sx={{
                borderBottom: "2px solid black",
                marginLeft: "62.4rem",
                height: "25%",
                // width: "10%",
                textAlign: "right",
                cursor: "pointer",
                "&:hover": {
                  color: "#fcb800",
                  transition: "all .3s ease-in-out",
                },
              }}
            >
              View all
            </Box>
          </Stack> */}
          {/* Deal of the Day Pending*/}

          <Stack sx={{ width: "100%", height: "50%" }}>
            <Typography fontWeight={"bold"} variant="h5">
              Top Categories Of The Month
            </Typography>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              gap={"2rem"}
              height={"100%"}
            >
              {topCategoriesSampleData.map(
                ({ heading, url, categ_name }, index) => (
                  <CategoriesOfMonthBox
                    heading={heading}
                    url={url}
                    name={categ_name}
                    key={index}
                  />
                )
              )}
            </Stack>
          </Stack>
        </Stack>

        {/* Consumer electronics slider */}
        {ConsumerElectronicsBox}
        {/* Consumer electronics slider */}

        {/* Clothing And Apparel */}
        {ClothingAndApparelBox}
        {/* Clothing And Apparel */}

        {/* Computer And Technology */}
        {FregnancesBox}
        {/* Computer And Technology */}

        {/* 2 images to be rendered here */}
        <Stack
          sx={{
            height: "20rem",
            width: "99%",
            marginTop: "8rem",
          }}
          direction={"row"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={"1rem"}
        >
          <img
            src={slider_1}
            alt="Loading..."
            className="w-[65%] h-[19.9rem]"
          />
          <img
            src={slider_1}
            alt="Loading..."
            className="w-[32%] h-[19.9rem]"
          />
        </Stack>
        {/* 2 images to be rendered here */}

        {/* Hot New Arrivals */}
        {BestReviewedItemsBox}
        {/* Hot New Arrivals */}

        {/* Footer section comes yaaaay*/}
        <HorizontalLine marginTop={"1rem"} w={"99%"} />
        <Footer />
        {/* Footer section comes yaaaay*/}
      </Box>

      <MoveToTopBtn handler={goToTop} />
      <Toaster position="top-right" reverseOrder={false} />
    </AppLayout>
  );
};

export default Home;
