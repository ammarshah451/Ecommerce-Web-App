import { Alert, Box, Checkbox, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../layout/AppLayout";
import Footer from "../../layout/Footer";
import {
  HorizontalLine,
  InputBtn,
  ReturnToBackBtn,
  URLOfPageTopBar,
  WhiteBtn,
  YellowBtn,
} from "../../shared/SharedComponents";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { setShippingDetails } from "../../redux/reducers/misc.js";

const Checkout = () => {
  const { cart, discountRate } = useSelector((state) => state.cart);
  const { shippingDetails } = useSelector((state) => state.misc);

  const [contactNumber, setContactNumber] = useState(
    shippingDetails?.contactNumber || ""
  );
  const [firstName, setFirstName] = useState(
    shippingDetails?.name?.split(" ")[0] || ""
  );
  const [lastName, setLastName] = useState(
    shippingDetails?.name?.split(" ")[1] || ""
  );
  const [address, setAddress] = useState(shippingDetails?.address || "");
  const [city, setCity] = useState(shippingDetails?.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingDetails?.postalCode || ""
  );

  const [totalBill, setTotalBill] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Total Bill of the Cart
    cart.map(({ quantity, price }) => {
      setTotalBill((prev) => prev + quantity * price);
    });
  }, []);

  const proceedToPaymentHandler = () => {
    if (
      contactNumber === "" ||
      firstName === "" ||
      lastName === "" ||
      address === "" ||
      city === "" ||
      postalCode === ""
    )
      return toast.error(`Please fill all the details`);

    const shippingDetails = {
      name: firstName + " " + lastName,
      address,
      city,
      postalCode,
      contactNumber,
    };
    dispatch(setShippingDetails(shippingDetails));

    navigate("/account/payment");
  };

  const ShippingDetailsForm = (
    <Stack sx={{ width: "60%" }} gap={"1rem"} justifyContent={"center"}>
      <InputBtn
        heading={"Contact Number"}
        variable={contactNumber}
        setVar={setContactNumber}
        w={"50rem"}
      />
      <Typography variant="h5" sx={{ marginLeft: ".6rem" }}>
        Address Information
      </Typography>
      <Stack
        sx={{ width: "100%" }}
        direction={"row"}
        flexWrap={"wrap"}
        gap={"2rem"}
      >
        <InputBtn
          heading={"First Name"}
          variable={firstName}
          setVar={setFirstName}
          w={"46%"}
        />
        <InputBtn
          heading={"Last Name"}
          variable={lastName}
          setVar={setLastName}
          w="49%"
        />
        <InputBtn
          heading={"Address"}
          variable={address}
          setVar={setAddress}
          w={"100%"}
        />
        <InputBtn heading={"City"} variable={city} setVar={setCity} w="46%" />
        <InputBtn
          heading={"Postal Code"}
          variable={postalCode}
          setVar={setPostalCode}
          w="49%"
        />
      </Stack>
      <Stack direction={"row"} sx={{ marginTop: "-1rem" }}>
        <Checkbox defaultChecked color="default" />
        <Typography
          variant="caption"
          sx={{ marginTop: ".8rem", color: "gray" }}
        >
          Save this information for the next time
        </Typography>
      </Stack>
      <ReturnToBackBtn
        heading={"Return To Shopping Cart"}
        handler={() => navigate("/cart")}
      />
    </Stack>
  );

  const CartList = (
    <Stack
      sx={{
        width: "40%",
      }}
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      <Stack
        sx={{
          maxHeight: "30rem",
          width: "32rem",
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
          <Typography sx={{ color: "black", fontWeight: 600 }}>
            Products
          </Typography>
          <Typography sx={{ color: "black", fontWeight: 600 }}>
            Total
          </Typography>
        </Box>
        <HorizontalLine marginTop={"1rem"} w={"90%"} />

        {/* Cart Items */}
        <Stack
          sx={{
            overflowY: "auto",
            maxHeight: "30rem",
            // border: "1px solid  black",
            width: "100%",
          }}
          justifyContent={"space-between"}
          alignItems={"center"}
          gap={".5rem"}
        >
          {cart.map(({ details, quantity, price }, index) => (
            <Box
              sx={{
                height: "5rem",
                width: "87%",
              }}
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              key={index}
            >
              <Typography sx={{ color: "black", fontWeight: 100 }}>
                {details.split(",")[1]} x{quantity}
              </Typography>
              <Typography sx={{ color: "black", fontWeight: 100 }}>
                ${quantity * price}
              </Typography>
            </Box>
          ))}
        </Stack>

        {/* Cart Items */}

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
            <Typography sx={{ color: "black", fontWeight: 600, fontSize: 20 }}>
              ${totalBill}
            </Typography>
          )}
        </Box>
      </Stack>
      <br />
      {/* Proceed To CheckOut */}
      <YellowBtn
        heading={"Proceed to Payment"}
        handler={proceedToPaymentHandler}
        w="32rem"
      />

      {/* Proceed To CheckOut */}
    </Stack>
  );

  return (
    <AppLayout>
      {/* Main wrapper */}
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* URL OF PAGE */}
          <URLOfPageTopBar url={"Home / account / checkout"} />
          {/* URL OF PAGE */}

          {/* Shipping Details Form */}
          <Stack sx={{ width: "90%" }} justifyContent={"center"}>
            <Typography variant="h3" sx={{ marginLeft: ".6rem" }}>
              Shipping Details
            </Typography>
            <Stack direction={"row"} sx={{ marginTop: "2rem" }}>
              {ShippingDetailsForm}
              {CartList}
            </Stack>
          </Stack>

          {/* Shipping Details Form */}
        </Box>
      </Box>
      {/* Main wrapper */}
      <HorizontalLine marginTop={"1rem"} w={"10rem"} />

      {/* Footer */}
      <Box>
        <Footer />
      </Box>

      {/* Footer */}
    </AppLayout>
  );
};

export default Checkout;
