import { Box, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { shippingFee } from "../../constants/config";
import AppLayout from "../../layout/AppLayout";
import Footer from "../../layout/Footer";
import { useUpdateOrderStatusMutation } from "../../redux/api/api";
import { HorizontalLine, URLOfPageTopBar } from "../../shared/SharedComponents";
import { clearCart, clearDiscountRate } from "../../redux/reducers/cart";
import {
  removePaymentDetails,
  removeShippingDetails,
} from "../../redux/reducers/misc";

let status = "delivered";

const PaymentSuccess = () => {
  const naviagte = useNavigate();
  const dispatch = useDispatch();

  const [totalBill, setTotalBill] = useState(shippingFee);
  const { cart, discountRate } = useSelector((state) => state.cart);
  const { placedOrderId } = useSelector((state) => state.misc);

  const [updateOrderStatusQuery] = useUpdateOrderStatusMutation();

  const updateOrder = async () => {
    setTimeout(async () => {
      //After 9 seconds that shipping stauts will be changed to delivered!
      await updateOrderStatusQuery({
        orderId: placedOrderId,
        status,
      });
    }, [9000]);
  };

  useEffect(() => {
    cart.map(({ quantity, price }) => {
      setTotalBill((prev) => prev + quantity * price);
    });

    updateOrder();
    // as payment is processed then clears the cart!
    // dispatch(clearDiscountRate());
    // dispatch(removePaymentDetails());
    // dispatch(removeShippingDetails());
  }, []);
  const CartList = (
    <Stack
      sx={{
        maxHeight: "40rem",
        height: "40rem",
        width: "30",
        border: "2px solid gray",
      }}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Typography>Your Order</Typography>
      <Box
        sx={{ height: "3rem", width: "80%" }}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography sx={{ color: "black", fontWeight: 600 }}>
          Products
        </Typography>
        <Typography sx={{ color: "red", fontWeight: 600 }}>Total</Typography>
      </Box>
      <HorizontalLine marginTop={"1rem"} w={"90%"} />

      {/* Cart Items */}
      <Stack
        sx={{ overflowY: "auto", maxHeight: "30rem" }}
        justifyContent={"space-between"}
        alignItems={"center"}
        gap={".5rem"}
      >
        {cart.map(({ details, quantity, price }, index) => (
          <Box
            sx={{ height: "5rem", width: "20rem" }}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            key={index}
          >
            <Typography sx={{ color: "black", fontWeight: 100 }}>
              {details.split(",")[1]} x{quantity}
            </Typography>
            <Typography sx={{ color: "blue", fontWeight: 100 }}>
              ${quantity * price}
            </Typography>
          </Box>
        ))}
      </Stack>

      {/* Cart Items */}

      <HorizontalLine marginTop={"1rem"} w={"90%"} />

      <Box
        sx={{ height: "3rem", width: "80%" }}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography sx={{ color: "black", fontWeight: 600, fontSize: 20 }}>
          Grand Total
        </Typography>
        {discountRate !== -1 ? (
          <Stack direction={"row"} gap={".5rem"}>
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
          <Typography sx={{ color: "red", fontWeight: 600, fontSize: 20 }}>
            ${totalBill}
          </Typography>
        )}
      </Box>
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
        <URLOfPageTopBar url={"Home / Account / Payment Success"} />
        {/* URL OF PAGE */}

        <Typography fontWeight={"bold"} variant="h3">
          Payment Success
        </Typography>

        <Stack direction={"row"} sx={{ marginTop: "2rem" }}>
          {/* Payment Success */}
          <Stack
            justifyContent={"center"}
            sx={{ height: "25rem", width: "45rem" }}
          >
            <Typography fontWeight={"bold"} variant="h6">
              Thank you! Your order has been placed.
            </Typography>
            <Box display={"flex"} sx={{ marginTop: "1rem" }}>
              <Typography
                sx={{ color: "gray", display: "inline-block" }}
                variant="subtitle1"
              >
                Your order ID is:
              </Typography>
              <Typography
                sx={{
                  color: "black",
                  display: "inline-block",
                  marginLeft: ".5rem",
                }}
                variant="subtitle1"
              >
                {placedOrderId}
              </Typography>
            </Box>

            <Typography
              sx={{
                color: "gray",
                display: "inline-block",
                marginTop: "1rem    ",
              }}
              variant="subtitle1"
            >
              An email will be sent containing information about your purchase.
              If you have any questions about your purchase, email us at
              <Typography
                sx={{
                  color: "black",
                  display: "inline-block",
                  marginLeft: "1rem",
                }}
                variant="subtitle1"
              >
                k224271@nu.edu.pk
              </Typography>
            </Typography>

            <Button
              variant="warning"
              className="w-[15rem] mt-4 "
              onClick={() => {
                naviagte("/shop?category=electronics");
              }}
            >
              <span className=" text-2xl  mr-2">&#x2190;</span>
              <span className="text-xl font-bold">Back To Shop</span>
            </Button>
          </Stack>
          {/* Payment Success */}

          {/* Cart List */}
          <Stack sx={{ height: "30rem", width: "25rem" }}>{CartList}</Stack>

          {/* Cart List */}
        </Stack>
      </Box>
      {/* Main wrapper */}

      <HorizontalLine w={"98%"} marginTop="1rem" />

      {/* Footer */}
      <Box>
        <Footer />
      </Box>
      {/* Footer */}
    </AppLayout>
  );
};

export default PaymentSuccess;
