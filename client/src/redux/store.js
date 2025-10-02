import { configureStore } from "@reduxjs/toolkit";
import api from "./api/api";
import authSlice from "./reducers/auth";
import cartSlice from "./reducers/cart";
import miscSlice from "./reducers/misc";

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [authSlice.name]: authSlice.reducer,
    [cartSlice.name]: cartSlice.reducer,
    [miscSlice.name]: miscSlice.reducer,
  },
  middleware: (mid) => [...mid(), api.middleware],
});

export default store;
