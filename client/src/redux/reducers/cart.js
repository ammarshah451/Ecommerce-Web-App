import { createSlice } from "@reduxjs/toolkit";

// Retrieve cart data from localStorage or use an empty array if none exists
const initialState = {
  cart: JSON.parse(localStorage.getItem("cart")) || [],
  discountRate:
    parseFloat(JSON.parse(localStorage.getItem("discountRate"))) || -1.0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // Check if the item already exists in the cart if yes so dont append again just update the quantity
      let found = false;
      state.cart.map(({ details, quantity }, index) => {
        if (details.split(",")[0] === action.payload.details.split(",")[0]) {
          state.cart[index].quantity = quantity + action.payload.quantity;
          found = true;
        }
      });

      if (!found) state.cart.push(action.payload);

      //set the cart to the localStorage
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    clearCart: (state) => {
      state.cart = [];
      localStorage.removeItem("cart");
    },
    updateToCart: (state, action) => {
      state.cart.map(({ details }, index) => {
        if (details.split(",")[0] === action.payload.details.split(",")[0])
          state.cart[index].quantity = action.payload.newQuantity;

        //set the cart to the localStorage
        localStorage.setItem("cart", JSON.stringify(state.cart));
      });
    },
    removeFromCart: (state, action) => {
      state.cart.map(({ details }, index) => {
        if (details.split(",")[0] === action.payload.id)
          state.cart.splice(index, 1);

        //set the cart to the localStorage
      });
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },

    addDisountRate: (state, action) => {
      state.discountRate = action.payload;
      localStorage.setItem("discountRate", JSON.stringify(action.payload));
    },

    clearDiscountRate: (state) => {
      state.discountRate = -1.0;
      localStorage.removeItem("discountRate");
    },
  },
});

export const {
  addToCart,
  clearCart,
  updateToCart,
  removeFromCart,
  addDisountRate,
  clearDiscountRate,
} = cartSlice.actions;
export default cartSlice;
