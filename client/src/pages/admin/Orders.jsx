import { FilterAltOutlined as FilterAltOutlinedIcon } from "@mui/icons-material";
import { Box, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/specifics/Table";
import { orderColumns } from "../../constants/necessaryConstants";
import { useErrors, useSearchHandler } from "../../hooks/hooks";
import AdminLayout from "../../layout/AdminLayout";
import { Loader } from "../../layout/Loader";
import {
  useGetOrdersQuery,
  useSearchOrdersApiMutation,
} from "../../redux/api/api";
import {
  GreenPlusBtn,
  InputBtn,
  SelectDropDownBtn,
  WhiteBtn,
} from "../../shared/SharedComponents";
import AdminHeader from "./AdminHeader";
import { SpecificOrder } from "../../dialogs/SpecificOrder";
import moment from "moment";

const Orders = () => {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("");

  const [searchedOrderId, setSearchedOrderId] = useState("");
  const [searchedUserId, setSearchedUserId] = useState("");
  const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));

  const [searchedOrderIdDialog, setSearchedOrderIdDialog] = useState("");
  const [searchedUserIdDialog, setSearchedUserIdDialog] = useState("");

  const [toShowSpecificOrderDialog, setToShowSpecificOrderDialog] =
    useState(false);

  const { isLoading, data, isError, error } = useGetOrdersQuery();
  useErrors([{ isError, error }]);

  const [searchAPI] = useSearchOrdersApiMutation();

  const { handleSearch, isSearching } = useSearchHandler(searchAPI, setRows);

  const toShowSpecificOrderHandler = (orderId, userId) => {
    setSearchedOrderIdDialog(orderId);
    setSearchedUserIdDialog(userId);

    setToShowSpecificOrderDialog(true);
  };

  useEffect(() => {
    setRows(data?.message);
  }, [data]);

  const navigate = useNavigate();

  const closeDialogHandler = () => setToShowSpecificOrderDialog(false);

  const filterDataHandler = () => {
    if (
      status === "" &&
      searchedOrderId === "" &&
      searchedUserId === "" &&
      fromDate === "" &&
      toDate === ""
    )
      return;

    handleSearch({
      orderId: searchedOrderId.toUpperCase(),
      customerId: searchedUserId.toUpperCase(),
      status: status.toLowerCase(),
      fromDate: fromDate,
      toDate: toDate,
    });

    setStatus("");
    setSearchedOrderId("");
    setSearchedUserId("");
    setFromDate("");
    setToDate("");
  };

  useEffect(() => {
    const modifiedRows = rows?.map((row, index) => ({
      ...row,
      action_handler: toShowSpecificOrderHandler,
    }));

    setRows(modifiedRows);
  }, [rows]);

  const showAllOrders = () => {
    setRows(data?.message);
  };
  const searchBar = (
    <Stack direction={"row"} marginTop={"2rem"}>
      <Box sx={{ width: "15rem" }}>
        <InputBtn
          heading={"Order ID"}
          variable={searchedOrderId}
          setVar={setSearchedOrderId}
        />

        <Box sx={{ marginTop: "1rem" }}> </Box>
        <InputBtn
          type={"date"}
          variable={fromDate}
          setVar={setFromDate}
          heading={"yyyy-mm-dd"}
        />
      </Box>
      <Box sx={{ width: "15rem", marginLeft: "3rem" }}>
        <InputBtn
          heading={"Customer ID"}
          variable={searchedUserId}
          setVar={setSearchedUserId}
        />
        <Box sx={{ marginTop: "1rem" }}> </Box>
        <InputBtn
          type={"date"}
          variable={toDate}
          setVar={setToDate}
          heading={"yyyy-mm-dd"}
        />
      </Box>
      <Box sx={{ width: "25rem", marginLeft: "3rem" }}>
        <Box sx={{ width: "17.5rem", marginLeft: ".4rem" }}>
          <SelectDropDownBtn
            heading={"Status"}
            list={["Cancelled", "Shipping", "Delivered"]}
            variable={status}
            setVar={setStatus}
          />
        </Box>
      </Box>

      <Box sx={{ width: "15rem", marginTop: ".5rem" }}>
        <WhiteBtn
          data={"Filter"}
          handler={filterDataHandler}
          icon={<FilterAltOutlinedIcon sx={{ fontSize: 20 }} />}
        />
        <Box sx={{ marginTop: "1rem" }}>
          <GreenPlusBtn data={"Show All Orders"} handler={showAllOrders} />
        </Box>
      </Box>
    </Stack>
  );

  return (
    <AdminLayout>
      <AdminHeader name={"Orders"} value={"MartCom All Orders"} />
      {searchBar}
      {toShowSpecificOrderDialog && (
        <SpecificOrder
          userId={searchedUserIdDialog}
          orderId={searchedOrderIdDialog}
          open={toShowSpecificOrderDialog}
          closeHandler={closeDialogHandler}
        />
      )}
      {isLoading ? (
        <Loader />
      ) : (
        <Table
          rows={rows}
          columns={orderColumns}
          heading={"Orders"}
          rowHeight={52}
        />
      )}
    </AdminLayout>
  );
};

export default Orders;
