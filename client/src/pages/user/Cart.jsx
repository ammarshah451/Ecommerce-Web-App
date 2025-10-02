import { Delete as DeleteIcon } from "@mui/icons-material";
import { Avatar, Box, IconButton, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ItemRemovalFromCartDialog from "../../dialogs/CartItemRemoval";
import AppLayout from "../../layout/AppLayout";
import {
  addDisountRate,
  removeFromCart,
  updateToCart,
} from "../../redux/reducers/cart";
import {
  HorizontalLine,
  InputBtn,
  URLOfPageTopBar,
  WhiteBtn,
  YellowBtn,
} from "../../shared/SharedComponents";

import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../layout/Footer";
import { transformImage } from "../../lib/features";
import { useApplyCouponMutation } from "../../redux/api/api";

const Carts = () => {
  const [toShowItemRemovalDialog, setToShowItemRemovalDialog] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [totalBill, setTotalBill] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cart, discountRate } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [applyCouponQuery] = useApplyCouponMutation();

  useEffect(() => {
    // Total Bill of the Cart
    cart.map(({ quantity, price }) => {
      setTotalBill((prev) => prev + quantity * price);
    });
  }, []);

  const removeItemFromCartHandler = (id) => {
    dispatch(removeFromCart({ id }));
    setToShowItemRemovalDialog(false);
  };

  const updateItemToCartHandler = (details, newQuantity) => {
    dispatch(updateToCart({ details, newQuantity }));
  };

  const applyCouponHandler = async () => {
    if (coupon === "") return;

    try {
      const data = await applyCouponQuery({
        couponCode: coupon,
      }).unwrap();

      if (data?.success) {
        dispatch(addDisountRate(data?.discountRate));

        setCoupon("");
        return toast.success(data?.message, {
          duration: 5000,
        });
      } else {
        return toast.error(data?.error?.data?.message);
      }
    } catch (error) {
      return toast.error(error?.data?.message || "Oops! An error occurred");
    }
    setCoupon("");
  };

  const CartList = cart.map(({ quantity, details, price }, index) => {
    const [id, name, imgUrl] = details.split(",");
    return (
      <Stack
        direction={"row"}
        sx={{
          height: "13rem",
          width: "78.5%",
        }}
        justifyContent={"space-between"}
        alignItems={"center"}
        gap={"1rem"}
        key={index}
      >
        <Box
          sx={{
            height: "100%",
            width: "12rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            src={transformImage(imgUrl)}
            sx={{
              height: "80%",
              width: "100%",
              borderRadius: "0%",
            }}
          />
          <Link className="no-underline text-sm " to={`/product/${id}`}>
            {name}
          </Link>
        </Box>

        <Box sx={{ width: "3rem", marginLeft: "-8rem" }}>
          <Typography>${price}</Typography>
        </Box>

        {/* Inc/Dec Btn */}
        <div className="border-2 h-[2rem] w-[8rem] -ml-[4rem] flex items-center justify-between ">
          <button
            onClick={() => {
              if (quantity > 1) {
                updateItemToCartHandler(details, quantity - 1);
              }
            }}
            className="text-gray-600  p-2 font-bold rounded transition-all duration-200"
          >
            -
          </button>
          <span>{quantity}</span>
          <button
            onClick={() => updateItemToCartHandler(details, quantity + 1)}
            className="text-gray-600  p-2 font-bold rounded transition-all duration-200"
          >
            +
          </button>
        </div>
        {/* Inc/Dec Btn */}

        <Box sx={{ width: "4rem", marginLeft: "-6rem" }}>
          <Typography sx={{ textAlign: "right" }}>
            ${quantity * price}
          </Typography>
        </Box>

        <IconButton
          sx={{ fontSize: 20, marginLeft: "1rem" }}
          onClick={() => setToShowItemRemovalDialog(true)}
        >
          <DeleteIcon sx={{ color: "red", fontSize: 30 }} />
        </IconButton>

        {/* Item Removal  Dialog */}
        {toShowItemRemovalDialog && (
          <ItemRemovalFromCartDialog
            details={details}
            open={toShowItemRemovalDialog}
            closeHandler={() => setToShowItemRemovalDialog(false)}
            cartHandler={removeItemFromCartHandler}
          />
        )}

        {/* Item Removal  Dialog */}
      </Stack>
    );
  });

  const CouponsBox = (
    <Stack sx={{ height: "15rem", width: "30rem" }} justifyContent={"center"}>
      <Typography
        variant="h6"
        sx={{ marginLeft: ".5rem" }}
        fontWeight={"semi-bold"}
      >
        Coupon Discount
      </Typography>
      <br />
      <InputBtn
        heading={"Enter Coupon Here"}
        variable={coupon}
        setVar={setCoupon}
        w={"20rem"}
      />
      <Box sx={{ marginLeft: "-.2rem", marginTop: "1rem" }}>
        <WhiteBtn data={"Apply"} handler={applyCouponHandler} w={"15rem"} />
      </Box>
    </Stack>
  );

  const ReceiptBox = (
    <Stack
      sx={{
        height: "100%",
        width: "40rem",
        paddingTop: "2rem",
      }}
      alignItems={"end"}
    >
      <Stack
        sx={{
          height: "17rem",
          width: "26rem",
          backgroundColor: "#f2f3f5",
          border: "1px solid gray",
        }}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Box
          sx={{ height: "3rem", width: "90%" }}
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography sx={{ color: "gray", fontWeight: 100 }}>
            Subtotal
          </Typography>
          <Typography sx={{ color: "gray", fontWeight: 100 }}>
            ${totalBill}
          </Typography>
        </Box>
        <HorizontalLine marginTop={"1rem"} w={"90%"} />
        <Box
          sx={{ height: "3rem", width: "90%" }}
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography sx={{ color: "black", fontWeight: 100 }}>
            Discount Rate
          </Typography>
          <Typography sx={{ color: "blue", fontWeight: 100 }}>
            {discountRate !== -1.0 ? discountRate : 0}%
          </Typography>
        </Box>

        <Box
          sx={{ height: "3rem", width: "90%" }}
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography sx={{ color: "black", fontWeight: 100 }}>
            Discount Price
          </Typography>
          <Typography sx={{ color: "blue", fontWeight: 100 }}>
            ${discountRate !== -1.0 ? totalBill * (discountRate / 100) : 0}
          </Typography>
        </Box>

        <HorizontalLine marginTop={"1rem"} w={"90%"} />

        <Box
          sx={{ height: "3rem", width: "90%" }}
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography sx={{ color: "black", fontWeight: 600, fontSize: 20 }}>
            Grand Total
          </Typography>
          {discountRate !== -1.0 ? (
            <Stack gap={".5rem"} direction={"row"}>
              <Typography sx={{ color: "red", fontWeight: 600, fontSize: 20 }}>
                ${totalBill - totalBill * (discountRate / 100)}
              </Typography>
              <Typography
                sx={{
                  color: "black",
                  fontWeight: 600,
                  fontSize: 20,
                  textDecoration: "line-through",
                }}
              >
                ${totalBill}
              </Typography>
            </Stack>
          ) : (
            <Typography
              sx={{
                color: "black",
                fontWeight: 600,
                fontSize: 20,
                // textDecoration: "line-through",
              }}
            >
              ${totalBill}
            </Typography>
          )}
        </Box>
      </Stack>
      <br />
      {/* Proceed To CheckOut */}

      {cart.length > 0 && (
        <Box>
          <YellowBtn
            heading={"Proceed To Checkout"}
            handler={() => navigate("/account/checkout")}
            w="26rem"
          />
        </Box>
      )}
      {/* Proceed To CheckOut */}
    </Stack>
  );
  return (
    <AppLayout>
      {/* Main wrapper */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* URL OF PAGE */}
        <URLOfPageTopBar url={"Home / Shopping Cart"} />
        {/* URL OF PAGE */}

        {/* Cart Info */}
        <Stack
          sx={{ width: "90%" }}
          justifyContent={"center"}
          alignItems={"center"}
          gap={"1rem"}
        >
          <Typography variant="h3">Shopping Cart</Typography>

          {cart.length > 0 ? (
            <>
              <div className="w-[66rem]  h-[4rem] bg-gray-200 border-b-2 p-4 border-b-gray-300 flex flex-row justify-between items-center">
                <Typography fontWeight={"bold"} sx={{ color: "black" }}>
                  PRODUCT
                </Typography>
                <Typography fontWeight={"bold"} sx={{ color: "black" }}>
                  PRICE
                </Typography>
                <Typography fontWeight={"bold"} sx={{ color: "black" }}>
                  QUANTITY
                </Typography>
                <Typography fontWeight={"bold"} sx={{ color: "black" }}>
                  TOTAL
                </Typography>
                <Typography fontWeight={"bold"} sx={{ color: "black" }}>
                  ACTION
                </Typography>
              </div>

              {CartList}
            </>
          ) : (
            <div>
              <Typography variant={"h5"}>Cart is empty</Typography>
            </div>
          )}
        </Stack>
        {/* Cart Info */}

        {/* Back To Shop Btn */}
        <Box
          sx={{
            marginTop: "3rem",
            marginLeft: "-69em",
          }}
        >
          <YellowBtn
            heading={"Back To Shop"}
            handler={() => navigate("/shop?category=electronics")}
          />
        </Box>

        {/* Back To Shop Btn */}

        {/* Receipt And Coupon Boxes */}
        <Stack
          sx={{ height: "25rem", width: "90%" }}
          direction={"row"}
          justifyContent={"space-between"}
        >
          {/* Coupons (Can only be used by members means logged In users)*/}
          {user && cart.length > 0 && CouponsBox}
          {/* Coupons */}

          {/* Subtotal Receipt */}
          {cart.length > 0 && ReceiptBox}
          {/* Subtotal Receipt */}
        </Stack>
        {/* Receipt And Coupon Boxes */}

        <HorizontalLine w="99%" marginTop="1rem" />
      </Box>
      {/* Main wrapper */}

      {/* Footer */}
      <Box>
        <Footer />
      </Box>
      {/* Footer */}
    </AppLayout>
  );
};

export default Carts;
