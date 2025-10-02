import { createSlice } from "@reduxjs/toolkit";

// Retrieve cart data from localStorage or use an empty array if none exists
const initialState = {
  shippingDetails: null,
  paymentDetails: null,
  placedOrderId: null,
};

const miscSlice = createSlice({
  name: "misc",
  initialState,
  reducers: {
    setShippingDetails: (state, action) => {
      state.shippingDetails = action.payload;
    },
    removeShippingDetails: (state, action) => {
      state.shippingDetails = null;
    },
    setPaymentDetails: (state, action) => {
      state.paymentDetails = action.payload;
    },
    removePaymentDetails: (state, action) => {
      state.paymentDetails = null;
    },
    setPlacedOrderId: (state, action) => {
      state.placedOrderId = action.payload;
    },
  },
});

export const {
  setShippingDetails,
  setPaymentDetails,
  setPlacedOrderId,
  removeShippingDetails,
  removePaymentDetails,
} = miscSlice.actions;
export default miscSlice;
