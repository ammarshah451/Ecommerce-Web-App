import { Box, Checkbox, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import AppLayout from "../../layout/AppLayout";
import Footer from "../../layout/Footer";
import {
  HorizontalLine,
  InputBtn,
  ReturnToBackBtn,
  URLOfPageTopBar,
} from "../../shared/SharedComponents";
import { ConfirmOrder } from "../../dialogs/ConfirmOrder";
import { setPaymentDetails, setPlacedOrderId } from "../../redux/reducers/misc";
import toast from "react-hot-toast";
import { shippingFee } from "../../constants/config";
import { DoneAllSharp as DoneAllSharpIcon } from "@mui/icons-material";
import { usePlaceOrderMutation } from "../../redux/api/api";
import { getTodaysDateFormatted } from "../../lib/features";
import { clearCart } from "../../redux/reducers/cart";

const Payment = () => {
  const dispatch = useDispatch();
  const { shippingDetails } = useSelector((state) => state.misc);
  const { cart, discountRate } = useSelector((state) => state.cart);

  const { user } = useSelector((state) => state.auth);

  const [contact, setContact] = useState(shippingDetails?.contactNumber);
  const [details, setDetails] = useState(shippingDetails?.address);

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("mastercard");

  const [cardNumber, setCardNumber] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [cardExpiryDate, setCardExpiryDate] = useState("");

  const [toShowConfirmOrder, setToShowConfirmOrder] = useState(false);

  const [paymentSuccessLoader, setPaymentSuccessLoader] = useState(false);
  const [totalBill, setTotalBill] = useState(0);

  const navigate = useNavigate();

  const [placeOrderQuery] = usePlaceOrderMutation();

  useEffect(() => {
    cart.map(({ price, quantity }) => {
      setTotalBill((prev) => prev + price * quantity);
    });
  }, []);

  const closeConfirmOrder = () => setToShowConfirmOrder(false);

  const confirmOrderHandler = () => {
    if (
      cardNumber === "" ||
      cardHolderName === "" ||
      cardExpiryDate === "" ||
      selectedPaymentMethod === ""
    )
      return toast.error("Please fill all the categories");

    setToShowConfirmOrder(true);
  };

  const orderPlacedHandler = async () => {
    //Giant HERE, Store Data in DB
    const finalBill =
      shippingFee +
      (discountRate !== -1
        ? totalBill - totalBill * (discountRate / 100)
        : totalBill);

    const paymentDetails = {
      paymentAmount: finalBill,
      paymentMethod: selectedPaymentMethod,
      paymentStatus: "paid",
    };
    const orderDetails = {
      price: finalBill,
      status: "shipping",
      orderplaced: getTodaysDateFormatted(),
    };

    dispatch(setPaymentDetails(paymentDetails));

    setToShowConfirmOrder(false);

    const toastId = toast.loading("Placing order. Please wait...");

    const response = await placeOrderQuery({
      cart,
      shippingDetails,
      orderDetails,
      user,
      paymentDetails,
    });

    if (response?.data?.success) {
      setTimeout(() => {
        toast.success(response?.data?.message, {
          id: toastId,
        });
      }, [5000]);
      console.log(response?.data);
      dispatch(setPlacedOrderId(response?.data?.orderId));

      setTimeout(() => {
        navigate("/account/paymentsuccess");
      }, [5000]);
    } else {
      let errMessage = response?.error?.data?.message || "An error occurred";

      // Format out-of-stock items if present
      const outOfStockItems = response?.error?.data?.someOutOfStockItemsReq;
      if (outOfStockItems && outOfStockItems.length > 0) {
        const formattedItems = outOfStockItems
          .map(
            ({ itemId, available, requested }) =>
              `${itemId}-Requested:${requested} but Avaliable:${available}`
          )
          .join("\n");
        errMessage += `\n\nOut of stock items:\n${formattedItems}`;
      }

      // Show error toast with formatted message
      toast.error(
        <div>
          <strong>Error:</strong>
          <p>{errMessage}</p>
        </div>,
        {
          id: toastId,
        }
      );
      dispatch(clearCart());

      setTimeout(() => {
        navigate("/account/checkout");
      }, [5000]);
    }
  };

  const PaymentDetailsForm = (
    <Stack sx={{ height: "45rem", width: "50rem" }}>
      {/* Shipment Details */}
      <Stack
        sx={{
          border: "1px solid gray",
          height: "4.5rem",
          borderRadius: "8px",
          padding: "1rem",
        }}
        direction={"column"}
        alignItems={"flex-start"}
        justifyContent={"center"}
        gap={".5rem"}
      >
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          sx={{ height: "2.2rem", width: "100%" }}
        >
          <Typography>Contact</Typography>
          <Typography sx={{ color: "gray" }}>{contact}</Typography>
          <Link to={`/account/checkout`} className="no-underline">
            Change
          </Link>
        </Stack>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          sx={{ height: "2.2rem", width: "100%" }}
        >
          <Typography>Ship To</Typography>
          <Typography sx={{ color: "gray" }}>{details}</Typography>
          <Link to={`/account/checkout`} className="no-underline">
            Change
          </Link>
        </Stack>
      </Stack>
      {/* Shipment Details */}

      {/* Shipping Method */}
      <Box sx={{ marginTop: "2rem" }}></Box>
      <Typography fontWeight={"bold"} variant="h5">
        Shipping Method
      </Typography>
      <Stack
        sx={{
          border: "1px solid gray",
          height: "3rem",
          borderRadius: "8px",
          padding: "1rem",
          marginTop: ".5rem",
        }}
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Typography>International Shipping</Typography>
        <Typography fontWeight={"bold"}>${shippingFee}</Typography>
      </Stack>
      {/* Shipping Method */}

      {/* Payment Methods */}
      <Box sx={{ marginTop: "2rem" }}></Box>
      <Typography fontWeight={"bold"} variant="h5">
        Payment Methods
      </Typography>

      <Stack
        sx={{
          backgroundColor: "#e0e0e0",
          height: "30rem",
          width: "100%",
          padding: "1rem",
          marginTop: ".5rem",
        }}
        direction={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={"1rem"}
      >
        <Stack direction={"row"} sx={{ marginLeft: "-25.8rem" }}>
          <Checkbox
            id="payment"
            label="MasterCard"
            icon={<DoneAllSharpIcon />}
            checkedIcon={<DoneAllSharpIcon color="primary" />}
            onChange={() => setSelectedPaymentMethod("mastercard")}
            checked={selectedPaymentMethod === "mastercard"}
            value="mastercard"
          />
          <Typography
            sx={{
              marginTop: ".6rem",
              color:
                selectedPaymentMethod === "mastercard" ? "#0d6efd" : "black",
            }}
          >
            Master Card
          </Typography>

          <Checkbox
            id="payment"
            label="Stripe"
            color="default"
            icon={<DoneAllSharpIcon />}
            checkedIcon={<DoneAllSharpIcon color="primary" />}
            onChange={() => setSelectedPaymentMethod("stripe")}
            checked={selectedPaymentMethod === "stripe"}
            value="stripe"
          />
          <Typography
            sx={{
              marginTop: ".6rem",
              color: selectedPaymentMethod === "stripe" ? "#0d6efd" : "black",
            }}
          >
            Stripe
          </Typography>

          <Checkbox
            id="payment"
            label="RazorPay"
            color="default"
            icon={<DoneAllSharpIcon />}
            checkedIcon={<DoneAllSharpIcon color="primary" />}
            onChange={() => setSelectedPaymentMethod("razorpay")}
            checked={selectedPaymentMethod === "razorpay"}
            value="razorpay"
          />
          <Typography
            sx={{
              marginTop: ".6rem",
              color: selectedPaymentMethod === "razorpay" ? "#0d6efd" : "black",
            }}
          >
            RazorPay
          </Typography>
        </Stack>

        <Box>
          <Typography sx={{ marginBottom: ".8rem" }}>Card Number</Typography>
          <InputBtn
            w={"45rem"}
            heading={"Card Number"}
            variable={cardNumber}
            setVar={setCardNumber}
            m={"0"}
          />
        </Box>
        <Box>
          <Typography sx={{ marginBottom: ".8rem" }}>Card Holder</Typography>
          <InputBtn
            w={"45rem"}
            heading={"Card Holder"}
            variable={cardHolderName}
            setVar={setCardHolderName}
            m={"0"}
          />
        </Box>

        <Box>
          <Typography sx={{ marginBottom: ".8rem" }}>Expiry Date</Typography>
          <InputBtn
            w={"45rem"}
            heading={"YYYY-MM-DD"}
            variable={cardExpiryDate}
            setVar={setCardExpiryDate}
            m={"0"}
          />
        </Box>
        <Box sx={{ marginTop: ".5rem" }} textAlign={"center"}>
          <Button
            variant="warning"
            className="w-[45rem] h-[3rem]"
            onClick={confirmOrderHandler}
          >
            Confirm Order
          </Button>
        </Box>
        {toShowConfirmOrder && (
          <ConfirmOrder
            open={toShowConfirmOrder}
            closeHandler={closeConfirmOrder}
            handler={orderPlacedHandler}
          />
        )}
      </Stack>
      {/* Payment Methods */}
      {/* Return Btn */}
      <Box sx={{ marginTop: "1rem" }}>
        <ReturnToBackBtn
          heading={"Return to Checkout"}
          handler={() => navigate("/account/checkout")}
        />
      </Box>
      {/* Return Btn */}
    </Stack>
  );

  const CartItemBox = (
    <Stack
      sx={{
        border: "1px solid gray",
        borderRadius: "8px",
        height: "25rem",
        width: "25rem",
        marginLeft: "2rem",
      }}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Typography>Your Order</Typography>
      <Box
        sx={{ height: "3rem", width: "90%" }}
        display={"flex"}
        justifyContent={"flex-end"}
        alignItems={"center"}
      >
        <Typography sx={{ color: "black", fontWeight: 600 }}>Total</Typography>
      </Box>
      <HorizontalLine marginTop={"1rem"} w={"90%"} />

      <Box
        sx={{ height: "3rem", width: "90%" }}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography sx={{ color: "black", fontWeight: 600 }}>
          Your Bill
        </Typography>
        {discountRate !== -1 ? (
          <Stack direction={"row"} gap={".5rem"}>
            <Typography sx={{ color: "red", fontWeight: 600 }}>
              ${totalBill - totalBill * (discountRate / 100)}
            </Typography>
            <Typography
              sx={{
                color: "black",
                fontWeight: 600,
                textDecoration: "line-through",
              }}
            >
              ${totalBill}
            </Typography>
          </Stack>
        ) : (
          <Typography sx={{ color: "black", fontWeight: 600 }}>
            ${totalBill}
          </Typography>
        )}
      </Box>

      <HorizontalLine marginTop={"1rem"} w={"90%"} />

      <Box
        sx={{ height: "3rem", width: "90%" }}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography sx={{ color: "black", fontWeight: 600 }}>
          Total Items
        </Typography>
        <Typography sx={{ color: "black", fontWeight: 600 }}>
          {cart.length}
        </Typography>
      </Box>

      <HorizontalLine marginTop={"1rem"} w={"90%"} />

      <Stack
        sx={{ height: "3rem", width: "90%" }}
        // direction={"row"}
        justifyContent={"flex-start"}
        // alignItems={"center"}
      >
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography sx={{ color: "black", fontWeight: 600 }}>
            Dicount Rate
          </Typography>
          <Typography sx={{ color: "black", fontWeight: 600 }}>
            {discountRate !== -1 ? discountRate : 0}%
          </Typography>
        </Box>

        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography sx={{ color: "black", fontWeight: 600 }}>
            Dicount Price
          </Typography>
          <Typography sx={{ color: "black", fontWeight: 600 }}>
            ${discountRate !== -1 ? totalBill * (discountRate / 100) : 0}
          </Typography>
        </Box>
      </Stack>

      <HorizontalLine marginTop={"1rem"} w={"90%"} />

      <Box
        sx={{ height: "3rem", width: "90%" }}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography sx={{ color: "black", fontWeight: 600 }}>
          Shipping Fee
        </Typography>
        <Typography sx={{ color: "black", fontWeight: 600 }}>
          ${shippingFee}
        </Typography>
      </Box>

      <HorizontalLine marginTop={"1rem"} w={"90%"} />

      <Box
        sx={{ height: "3rem", width: "90%" }}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography sx={{ color: "black", fontWeight: 600 }}>
          TOTAL BILL
        </Typography>
        {discountRate !== -1 ? (
          <Stack direction={"row"} gap={".5rem"}>
            <Typography sx={{ color: "red", fontWeight: 600 }}>
              ${totalBill - totalBill * (discountRate / 100) + shippingFee}
            </Typography>
            <Typography
              sx={{
                color: "black",
                fontWeight: 600,
                textDecoration: "line-through",
              }}
            >
              ${totalBill + shippingFee}
            </Typography>
          </Stack>
        ) : (
          <Typography sx={{ color: "black", fontWeight: 600 }}>
            ${totalBill + shippingFee}
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
        <URLOfPageTopBar url={"Home / Account / Checkout / Payment"} />
        {/* URL OF PAGE */}

        <Stack
          sx={{ width: "90%" }}
          alignItems={"center"}
          justifyContent={"center"}
          gap={"2rem"}
        >
          <Typography variant="h3" sx={{ marginLeft: ".6rem" }}>
            Payment
          </Typography>
          <Stack direction={"row"} sx={{ height: "50rem" }}>
            {PaymentDetailsForm}
            {CartItemBox}
          </Stack>
        </Stack>
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

export default Payment;
