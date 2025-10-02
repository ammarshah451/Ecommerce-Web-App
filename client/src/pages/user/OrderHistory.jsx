import React, { useEffect, useState } from "react";
import AppLayout from "../../layout/AppLayout";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../constants/config";
import toast from "react-hot-toast";
import {
  Box,
  Card,
  CardContent,
  Grid2,
  Stack,
  Typography,
} from "@mui/material";

const OrderHistory = () => {
  const { user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const [orderHistoryDetail, setOrderHistoryDetail] = useState([]);

  const fetchData = async () => {
    const toastId = toast.loading("Loading Order History...");

    try {
      const { data } = await axios.get(
        `${server}/api/v1/user/getOrdersByUserId?userId=${user.id}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (data?.success) {
        toast.success("Order History Fetched", {
          id: toastId,
        });
        setOrderHistoryDetail(data?.message);
      } else {
        toast.error(data?.message || "Oops! Something went wrong", {
          id: toastId,
        });
      }
    } catch (error) {
      toast.error("Oops! Something went wrong", {
        id: toastId,
      });
    }
  };
  useEffect(() => {
    fetchData();
  }, [cart]);

  const card = (Date, Total, id, shippingDetails, status, userId) => (
    <CardContent>
      <Typography
        gutterBottom
        sx={{ color: "text.secondary", fontSize: 14, marginTop: "1rem" }}
      >
        ORDER ID:{id}
      </Typography>
      <Typography variant="body2" sx={{ marginTop: "1rem" }}>
        USER ID:{userId}
      </Typography>
      <Typography variant="h5" component="div" sx={{ marginTop: "1rem" }}>
        TOTAL:${Total}
      </Typography>
      <Typography variant="body2" sx={{ marginTop: "1rem" }}>
        Date Of Placed:{Date}
      </Typography>
      <Typography variant="body2" sx={{ marginTop: "1rem" }}>
        Status:{status}
      </Typography>
    </CardContent>
  );

  return (
    <AppLayout>
      {orderHistoryDetail.length !== 0 ? (
        <Grid2 container spacing={2}>
          {orderHistoryDetail.map(
            ({ Date, Total, id, shippingDetails, status, userId }, index) => (
              <Grid2 size={4} key={index}>
                <Card raised>
                  {card(Date, Total, id, shippingDetails, status, userId)}
                </Card>
              </Grid2>
            )
          )}
        </Grid2>
      ) : (
        <div>lode order to place kar phle</div>
      )}
    </AppLayout>
  );
};

export default OrderHistory;
