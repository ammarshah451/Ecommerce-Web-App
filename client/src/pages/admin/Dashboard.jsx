import {
  BlurOn as BlurOnIcon,
  LocalAtm as LocalAtmIcon,
  NorthOutlined as NorthOutlinedIcon,
  ShoppingCartOutlined as ShoppingCartOutlinedIcon,
  SouthOutlined as SouthOutlinedIcon,
} from "@mui/icons-material";

import { Avatar, Box, IconButton, Stack, Typography } from "@mui/material";
import { yellow } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import Map from "../../assets/Map.png";
import {
  BarChart,
  DoughnutChart,
  LineChart,
} from "../../components/specifics/Charts";
import Table from "../../components/specifics/Table";
import { topProductsColumns } from "../../constants/necessaryConstants";
import { useErrors } from "../../hooks/hooks.jsx";
import AdminLayout from "../../layout/AdminLayout";
import {
  useGetBestSoldProductsQuery,
  useGetDashboardStatsQuery,
} from "../../redux/api/api.js";
import AdminHeader from "./AdminHeader";

let cost = 20000;

const lhsBox = (name, color, direction, val, perct) => (
  <Box
    sx={{
      // border: "1px solid red",
      height: "15vh",
      width: "100%",
      borderRadius: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "2rem",
      background: color,
    }}
  >
    <IconButton
      sx={{
        background: "white",
        borderRadius: "10%",
        padding: "1rem",
      }}
    >
      <ShoppingCartOutlinedIcon
        sx={{
          color: yellow[600],
        }}
      />
    </IconButton>
    <Typography>
      {name}
      <Typography>
        ${val}
        <Typography variant="caption">
          {direction === "up" ? (
            <>
              <NorthOutlinedIcon sx={{ color: "green" }} />
              <Typography
                variant="caption"
                fontWeight={"bold"}
                fontSize={".9 rem"}
                sx={{ color: "green" }}
              >
                {perct}
              </Typography>
            </>
          ) : (
            <>
              <SouthOutlinedIcon sx={{ color: "red" }} />
              <Typography
                variant="caption"
                fontWeight={"bold"}
                fontSize={".9 rem"}
                sx={{ color: "red" }}
              >
                {perct}
              </Typography>
            </>
          )}
        </Typography>
      </Typography>
    </Typography>
  </Box>
);

const Countries = (countryName, dotcolor, perct) => (
  <Box
    sx={{
      height: "20%",
      width: "49%",
      paddingTop: "1rem",
    }}
  >
    <IconButton>
      <BlurOnIcon
        sx={{
          color: dotcolor,
        }}
        fontSize="small"
      />
    </IconButton>
    <Typography sx={{ display: "inline", fontSize: ".9rem" }}>
      {countryName}
    </Typography>
    <Typography sx={{ marginLeft: "2.5rem" }} fontWeight={"bold"}>
      {perct}
    </Typography>
  </Box>
);

const DoughnutChartDescriptionBoxes = (name, value, dotcolor) => (
  <Stack alignItems={"center"} direction={"row"} sx={{ marginTop: "1rem" }}>
    <div
      style={{
        display: "inline",
        height: ".5rem",
        width: ".5rem",
        borderRadius: "50%",
        backgroundColor: dotcolor,
      }}
    ></div>
    <span style={{ display: "inline", width: ".5rem" }}> </span>
    <Typography
      sx={{
        display: "inline",
        fontWeight: "bold",
        color: "#7C7C7C",
      }}
    >
      ${value}
    </Typography>
    <span style={{ display: "inline", width: ".5rem" }}></span>
    <Typography sx={{ display: "inline", color: "#7C7C7C" }}>{name}</Typography>
  </Stack>
);

const AdminDashboard = () => {
  const [rows, setRows] = useState([]);
  const [salesPerDay, setSalesPerDay] = useState([]);
  const [totalSales, setTotalSales] = useState(-1);
  const [recentOrdersRev, setRecentOrdersRev] = useState([]);
  const [bestSoldProducts, setBestSoldProducts] = useState([]);

  const { isLoading, data, isError, error } = useGetDashboardStatsQuery();
  const {
    isLoading: bsProdLoading,
    data: bsProd,
    isError: bsProdIsError,
    error: bsProdError,
  } = useGetBestSoldProductsQuery();

  useErrors([
    { isError, error },
    { isError: bsProdIsError, error: bsProdError },
  ]);

  useEffect(() => {
    setBestSoldProducts(bsProd?.message);
  }, [bsProd]);

  useEffect(() => {
    setSalesPerDay(data?.message?.recent7DaysRevenue);
    setTotalSales(data?.message?.totalRevenue);
    data?.message?.transformedRecentOrderRows?.map(
      ({ Date, TotalOrders, Revenue }) => {
        setRecentOrdersRev((prev) => [...prev, parseInt(TotalOrders)]);
      }
    );
  }, [data]);

  const Dashboard = (
    <>
      <AdminHeader name={"Dashboard"} value={"Everything Here"} />
      <Box sx={{ margin: "1rem" }}>
        <Stack direction={"row"} width={"100%"} sx={{ marginTop: "1rem" }}>
          <Stack
            direction={"row"}
            width={"75%"}
            sx={{ marginTop: "1rem" }}
            flexWrap={"wrap"}
            gap={".2rem"}
          >
            <Box height={"70vh"} width={"60%"} sx={{ paddingTop: "5rem" }}>
              <Typography fontWeight={"bold"} textAlign={"center"}>
                Sales Report
              </Typography>
              {isLoading ? (
                <></>
              ) : (
                <Stack>
                  <LineChart dataArr={salesPerDay} label="Revenue" />
                </Stack>
              )}
              <Typography sx={{ marginTop: "5rem", marginLeft: "1rem" }}>
                <div
                  style={{
                    height: ".5rem",
                    width: ".5rem",
                    borderRadius: "50%",
                    display: "inline-block",
                    backgroundColor: "#ffc107",
                  }}
                ></div>
                <span> </span>
                Items Earning Sales($)
              </Typography>
            </Box>

            <Box height={"70vh"} width={"39%"} sx={{ paddingTop: "5rem" }}>
              <Typography fontWeight={"bold"} textAlign={"center"}>
                Earnings
              </Typography>
              {/* DOUGHNUT CHART */}
              <DoughnutChart
                labels={["Total Sales", "Cost", "Profit"]}
                dataArr={[totalSales, cost, totalSales - cost]}
              />
              <Box
                sx={{
                  borderRadius: "50%",
                  height: "13rem",
                  width: "13rem",
                  position: "relative",
                  top: "-13.5rem",
                  left: "6.9rem",
                }}
              >
                <Box
                  sx={{
                    width: "5rem",
                    textAlign: "center",
                  }}
                >
                  <IconButton>
                    <LocalAtmIcon
                      sx={{
                        height: "5rem",
                        width: "5rem",
                        marginTop: "1rem",
                      }}
                    />
                  </IconButton>
                  <Typography
                    variant="h5"
                    fontWeight={"bold"}
                    sx={{ marginLeft: ".5rem", textAlign: "right" }}
                  >
                    ${(totalSales - cost).toFixed(2)}
                  </Typography>
                  <Typography sx={{ marginLeft: "1rem" }}>Balance</Typography>
                </Box>
              </Box>

              <Stack
                direction={"column"}
                justifyContent={"center"}
                alignItems={"center"}
                gap={"1rem"}
                sx={{ marginTop: "-14rem" }}
              >
                <br />
                <Box>
                  <Box>
                    {DoughnutChartDescriptionBoxes(
                      "Total Sales",
                      totalSales,
                      "#ffc107"
                    )}
                  </Box>
                  <Box>
                    {DoughnutChartDescriptionBoxes("Cost", cost, "#17B169")}
                  </Box>
                  <Box>
                    {DoughnutChartDescriptionBoxes(
                      "Profit",
                      totalSales - cost,
                      "#6CB4EE"
                    )}
                  </Box>
                </Box>
              </Stack>
            </Box>

            {/* Recent orders barChart */}
            <Box
              height={"58vh"}
              sx={{
                width: "90%",
                marginTop: "-5rem",
                // border: "1px solid red",
                paddingTop: "2rem",
              }}
            >
              <Typography fontWeight={"bold"} textAlign={"center"}>
                Recent Orders
              </Typography>
              {isLoading ? (
                <></>
              ) : (
                <Stack>
                  <BarChart dataArr={recentOrdersRev} />
                </Stack>
              )}
            </Box>

            {/* Products Overview*/}
            <Box
              sx={{
                width: "100%",
                marginTop: "5rem",
                // border: "1px solid red",
                paddingLeft: ".5rem",
              }}
            >
              <Typography textAlign={"center"} fontWeight={"bold"}>
                Top Products Overview
              </Typography>

              {bsProdLoading ? (
                <></>
              ) : (
                <Box>
                  <Table
                    rows={bestSoldProducts}
                    columns={topProductsColumns}
                    rowHeight={150}
                  />
                </Box>
              )}
            </Box>
          </Stack>

          <Stack width={"35%"} /*sx={{ border: "1px solid red" }}*/>
            <Stack direction={"row"} justifyContent={"space-around"}>
              <Typography variant="h5" fontWeight={"bold"}>
                Statistics
              </Typography>
              {/* <Box>soon</Box> */}
            </Stack>

            {isLoading ? (
              <></>
            ) : (
              <Stack
                direction={"column"}
                gap={"2rem"}
                justifyContent={"space-between"}
                padding={"2rem"}
              >
                {lhsBox(
                  "Orders",
                  "#FCF9EF",
                  "up",
                  data?.message?.transformedRecentOrderRows.length,
                  "12.5%"
                )}
                {lhsBox(
                  "Sales",
                  "#F9ECE5",
                  "up",
                  data?.message?.totalRevenue,
                  "7.1%"
                )}
                {lhsBox(
                  "Earning",
                  "#F0F5E7",
                  "down",
                  data?.message?.totalRevenue,
                  "0.5%"
                )}
              </Stack>
            )}

            <Typography
              variant="h6"
              fontWeight={"bold"}
              padding={"1rem"}
              marginLeft={"1rem"}
            >
              Top Countries
            </Typography>

            <Stack
              // sx={{ border: "1px solid red" }}
              height={"40vh"}
              width={"100%"}
              flexWrap={"wrap"}
              gap={".1rem"}
              direction={"row"}
              justifyContent={"space-between"}
              marginLeft={"1rem"}
            >
              {Countries("United States", "red", "80%")}
              {Countries("United Kingdom", "yellow", "65%")}
              {Countries("Germany", "green", "64%")}
              {Countries("Russia", "cyan", "70%")}
            </Stack>

            <Avatar
              src={Map}
              alt="Map"
              sx={{
                marginLeft: "1rem",
                borderRadius: "0rem",
                width: "90%",
                height: "10%",
                marginTop: "-2rem",
              }}
            />
            <Typography
              variant="caption"
              fontWeight={"semibold"}
              padding={"1rem"}
              color="#7C7C7C"
            >
              We only started collecting region data from January 2015
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </>
  );

  return <AdminLayout>{Dashboard}</AdminLayout>;
};

export default AdminDashboard;
