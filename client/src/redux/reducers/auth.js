import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loader: true,
  admin: null,
  adminLoader: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userExists: (state, action) => {
      state.user = action.payload;
      state.loader = false;
    },

    userNotExists: (state) => {
      state.user = null;
      state.loader = false;
    },

    adminExists: (state, action) => {
      state.admin = action.payload;
      state.adminLoader = false;
    },
    adminNotExists: (state) => {
      state.admin = null;
      state.adminLoader = true;
    },
  },
});

export const { userExists, userNotExists, adminExists, adminNotExists } =
  authSlice.actions;
export default authSlice;
