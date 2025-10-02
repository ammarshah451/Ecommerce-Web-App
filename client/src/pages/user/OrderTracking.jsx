import { Card, Stack, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { server } from "../../constants/config";
import AppLayout from "../../layout/AppLayout";
import { useSelector } from "react-redux";

const OrderTracking = () => {
  const { user } = useSelector((state) => state.auth);

  const [toShowData, setToShowData] = useState(false);
  const [searchedOrderId, setSearchedOrderId] = useState("");

  const [orderDetails, setOrderDetails] = useState({});

  const trackingHandler = async () => {
    if (searchedOrderId === "") return;

    const toastId = toast.loading("Tracking Your Order...");
    try {
      const { data } = await axios.get(
        `${server}/api/v1/user/getOrderById?orderId=${searchedOrderId}&userId=${user.id}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data?.success) {
        toast.success("Your order details are here", { id: toastId });

        setOrderDetails(data?.message[0]);
        setToShowData(true);
        setSearchedOrderId("");
        console.log(data);
      } else {
        toast.error(data?.message || "No order found");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Oops! Something went wrong",
        {
          id: toastId,
        }
      );
    }
  };
  const OrderTrackingBox = (
    <div className="bg-white flex flex-col justify-center items-center">
      <h2 className="mt-24 text-5xl font-bold -ml-20 mb-10">Order Tracking</h2>
      <div className="text-sm text-gray-600 text-center mb-16">
        <p>
          To track your order please enter your Order ID in the box below and
          press the "Track" button. This was given to you on your receipt and in
          the confirmation email you should have received.
        </p>
      </div>

      <div className="w-full max-w-md px-4 -mt-20">
        <div>
          <label className="block text-md font-bold text-black mt-5 mb-2">
            Order ID
          </label>
          <input
            value={searchedOrderId}
            onChange={(e) => setSearchedOrderId(e.target.value)}
            type="text"
            id="Order-Id"
            placeholder="Found in your order Confirmation Email"
            className="w-full mt-1 mb-2 text-xs p-2 h-12 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>
        <button
          onClick={trackingHandler}
          className="mt-6 w-full px-2 h-12 bg-yellow-400 transition duration-300 hover:text-white  font-semibold hover:bg-black "
        >
          Track Your Order
        </button>
      </div>
    </div>
  );

  return (
    <AppLayout>
      {toShowData ? (
        <Stack justifyContent={"center"} alignItems={"center"}>
          {
            <Stack
              sx={{
                height: "35rem",
                borderRadius: "10px",
                width: "40rem",
              }}
              direction={"column"}
              gap={"4rem"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Card
                raised
                sx={{
                  width: "100%",
                  height: "100%",
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: "black",
                    textAlign: "center",
                    marginTop: "5rem",
                  }}
                >
                  ORDER STATUS
                </Typography>
                <Typography
                  sx={{
                    color: "gray",
                    textAlign: "center",
                    marginTop: "4rem",
                  }}
                >
                  ORDER ID:{orderDetails.id}
                </Typography>
                <Typography
                  sx={{
                    color: "gray",
                    textAlign: "center",
                  }}
                >
                  USER ID:{orderDetails.userId}
                </Typography>
                <Typography sx={{ color: "gray", textAlign: "center" }}>
                  Date Of Placed:{orderDetails.Date}
                </Typography>
                <Typography sx={{ color: "gray", textAlign: "center" }}>
                  Total:${orderDetails.Total}
                </Typography>
                <Typography sx={{ color: "gray", textAlign: "center" }}>
                  Status:{orderDetails.status}
                </Typography>
              </Card>
            </Stack>
          }
        </Stack>
      ) : (
        <>{OrderTrackingBox}</>
      )}
    </AppLayout>
  );
};

export default OrderTracking;
