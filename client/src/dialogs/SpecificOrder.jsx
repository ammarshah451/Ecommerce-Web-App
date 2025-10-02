import {
  AccountCircleOutlined as AccountCircleOutlinedIcon,
  ArrowBackOutlined as ArrowBackOutlinedIcon,
  ArrowForwardOutlined as ArrowForwardOutlinedIcon,
  Inventory2Outlined as Inventory2OutlinedIcon,
  LocalShippingOutlined as LocalShippingOutlinedIcon,
  PaymentOutlined as PaymentOutlinedIcon,
  ProductionQuantityLimitsOutlined as ProductionQuantityLimitsOutlinedIcon,
} from "@mui/icons-material";
import {
  Box,
  Dialog,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import { useGetOrderDetailsQuery } from "../redux/api/api";
import { useErrors } from "../hooks/hooks";

const verticalTabs = [
  {
    name: "User Details",
    icon: (
      <AccountCircleOutlinedIcon sx={{ color: "black" }} fontSize="medium" />
    ),
  },
  {
    name: "Order Details",
    icon: (
      <ProductionQuantityLimitsOutlinedIcon
        sx={{ color: "black" }}
        fontSize="medium"
      />
    ),
  },
  {
    name: "Payment Details",
    icon: <PaymentOutlinedIcon sx={{ color: "black" }} fontSize="medium" />,
  },
  {
    name: "Delivery Details",
    icon: (
      <LocalShippingOutlinedIcon sx={{ color: "black" }} fontSize="medium" />
    ),
  },
  {
    name: "Item Details",
    icon: <Inventory2OutlinedIcon sx={{ color: "black" }} fontSize="medium" />,
  },
];

const SpecificOrder = ({ userId = "", orderId = "", open, closeHandler }) => {
  const [toShowDrawer, setToShowDrawer] = useState(false);
  const [selectedOption, setSelectedOption] = useState(verticalTabs[0].name);

  const { isLoading, data, isError, error } = useGetOrderDetailsQuery({
    userId,
    orderId,
  });
  useErrors([{ isError, error }]);
  useEffect(() => {
    console.log(data);
  }, [data]);

  const GeneralDetailsComponent = ({ headings = [], values = [] }) => (
    <Stack
      sx={{ height: "100%", width: "100%" }}
      direction={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      gap={"2rem"}
    >
      <Stack sx={{ width: "100%", height: "100%" }} alignItems={"center"}>
        {headings.map((head, index) => (
          <Box
            key={index}
            sx={{
              // border: "1px solid red",
              width: "100%",
              height: "20%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Box sx={{ marginLeft: "2rem" }}>
              <Typography variant="h5">{head}</Typography>
            </Box>
            <Box marginRight={"2rem"}>
              <Typography sx={{ color: "gray" }}>{values[index]}</Typography>
            </Box>
          </Box>
        ))}
      </Stack>
    </Stack>
  );

  return (
    <Dialog open onClose={closeHandler} maxWidth={"md"}>
      <Stack
        sx={{ height: "45rem", width: "56rem" }}
        alignItems={"center"}
        gap={"1rem"}
        direction={"row"}
      >
        <IconButton
          sx={{ position: "absolute", top: "1rem" }}
          onClick={() => setToShowDrawer(!toShowDrawer)}
        >
          <Tooltip title={toShowDrawer === true ? "Close" : "Open"}>
            {toShowDrawer ? (
              <ArrowBackOutlinedIcon sx={{ color: "black", fontSize: 30 }} />
            ) : (
              <ArrowForwardOutlinedIcon sx={{ color: "black", fontSize: 30 }} />
            )}
          </Tooltip>
        </IconButton>
        {toShowDrawer && (
          <Stack
            sx={{
              height: "100%",
              width: "25rem",
              backgroundColor: "#fcb800",
              borderTopRightRadius: "20%",
              borderBottomRightRadius: "20%",
            }}
            justifyContent={"center"}
          >
            {verticalTabs.map(({ name, icon }, index) => (
              <Stack
                key={index}
                direction={"row"}
                gap={".5rem"}
                justifyContent={"center"}
                sx={{
                  marginTop: "2rem",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "scale(1.1)",
                    transition: "all 0.2s ease-in-out",
                  },
                }}
                onClick={() => setSelectedOption(verticalTabs[index].name)}
              >
                <Box
                  sx={{
                    height: "3rem",
                    width: "3rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {icon}
                </Box>
                <Box
                  sx={{
                    height: "3rem",
                    width: "10rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ color: "black" }} fontWeight={300}>
                    {name}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        )}
        <Stack
          sx={{
            // border: "1px solid red",

            height: "100%",
            width: "100%",
          }}
        >
          <Box
            sx={{
              height: "10%",
              width: "100%",
              textAlign: "center",
              marginTop: ".5rem",
              // border: "1px solid black",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              fontSize={toShowDrawer ? 20 : 30}
              sx={{ color: "#fcb800" }}
            >
              {selectedOption}
            </Typography>
          </Box>

          {isLoading ? (
            <></>
          ) : (
            <Stack sx={{ height: "97%", width: "100%" }}>
              {selectedOption === "User Details" && (
                <GeneralDetailsComponent
                  headings={Object.keys(data?.message?.userDetails[0])}
                  values={Object.values(data?.message?.userDetails[0])}
                />
              )}
              {selectedOption === "Order Details" && (
                <GeneralDetailsComponent
                  headings={Object.keys(data?.message?.orderDetails[0])}
                  values={Object.values(data?.message?.orderDetails[0])}
                />
              )}
              {selectedOption === "Payment Details" && (
                <GeneralDetailsComponent
                  headings={Object.keys(data?.message?.paymentDetails[0])}
                  values={Object.values(data?.message?.paymentDetails[0])}
                />
              )}
              {selectedOption === "Delivery Details" && (
                <GeneralDetailsComponent
                  headings={Object.keys(data?.message?.shippingDetails[0])}
                  values={Object.values(data?.message?.shippingDetails[0])}
                />
              )}
              {selectedOption === "Item Details" && (
                <Stack
                  sx={{ height: "100%", width: "100%" }}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  {data?.message?.itemsDetails.map(
                    ({ item_id, order_id, quantity }, index) => (
                      <Stack
                        key={index}
                        sx={{
                          maxHeight: "20rem",
                          overflowY: "auto",
                          border: "1px solid gray",
                          borderRadius: "1rem",
                          padding: "1rem",
                          width: "100%",
                        }}
                      >
                        <Typography sx={{ color: "gray" }}>
                          ITEMID: {item_id}
                        </Typography>
                        <Typography sx={{ color: "gray" }}>
                          ORDERID: {order_id}
                        </Typography>
                        <Typography sx={{ color: "gray" }}>
                          QUANTITY: {quantity}
                        </Typography>
                      </Stack>
                    )
                  )}
                </Stack>
              )}
            </Stack>
          )}
        </Stack>
      </Stack>
    </Dialog>
  );
};

export { SpecificOrder };
