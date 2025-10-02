import "bootstrap/dist/css/bootstrap.min.css";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoutes } from "./components/auth/ProtectedRoutes.jsx";
import LayoutLoader from "./layout/LayoutLoader.jsx";

import axios from "axios";
import { server } from "./constants/config.js";
import {
  adminExists,
  adminNotExists,
  userExists,
  userNotExists,
} from "./redux/reducers/auth.js";

// Admin things
const AdminLogin = lazy(() => import("./pages/admin/Login.jsx"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard.jsx"));
const Orders = lazy(() => import("./pages/admin/Orders.jsx"));
const NewOrder = lazy(() => import("./pages/admin/NewOrder.jsx"));
const Customers = lazy(() => import("./pages/admin/Customers.jsx"));
const Products = lazy(() => import("./pages/admin/Products.jsx"));
const Categories = lazy(() => import("./pages/admin/Categories.jsx"));
const Checkout = lazy(() => import("./pages/user/Checkout.jsx"));
const Settings = lazy(() => import("./pages/admin/Settings.jsx"));

// Admin things

//user things

const Home = lazy(() => import("./pages/user/Home.jsx"));
const UserLogin = lazy(() => import("./pages/user/Login.jsx"));
const OrderTrack = lazy(() => import("./pages/user/OrderTracking.jsx"));
const Cart = lazy(() => import("./pages/user/Cart.jsx"));
const Profile = lazy(() => import("./pages/user/Profile.jsx"));
const OrderHistory = lazy(() => import("./pages/user/OrderHistory.jsx"));
const Shop = lazy(() => import("./pages/user/Shop.jsx"));
const Product = lazy(() => import("./pages/user/Product.jsx"));
const Payment = lazy(() => import("./pages/user/Payment.jsx"));
const PaymentSuccess = lazy(() => import("./pages/user/PaymentSuccess.jsx"));
//user things

const NotFound = lazy(() => import("./layout/NotFound.jsx"));

const App = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  const { user, loader, admin, adminLoader } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, [2500]);
    // Check if user is logged In
    axios
      .get(`${server}/api/v1/user/myself`, { withCredentials: true })
      .then(({ data }) => dispatch(userExists(data?.message)))
      .catch((err) => dispatch(userNotExists()));

    // Check if Admin is logged In
    axios
      .get(`${server}/api/v1/admin/myself`, { withCredentials: true })
      .then(({ data }) => dispatch(adminExists(data?.message)))
      .catch((err) => dispatch(adminNotExists()));
  }, []);
  return (
    <BrowserRouter>
      {loading ? (
        <LayoutLoader />
      ) : (
        <Suspense fallback={<LayoutLoader />}>
          <Routes>
            {/* User Routes */}
            <Route element={<ProtectedRoutes user={user} />}>
              <Route path="/" element={<Home />} />
              <Route path="/order/track" element={<OrderTrack />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/order/history" element={<OrderHistory />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/user/profile" element={<Profile />} />
              <Route path="/account/checkout" element={<Checkout />} />
              <Route path="/account/payment" element={<Payment />} />
              <Route
                path="/account/paymentsuccess"
                element={<PaymentSuccess />}
              />
            </Route>

            <Route element={<ProtectedRoutes user={!user} redirect="/" />}>
              <Route path="/login" element={<UserLogin />} />
            </Route>

            {/* User Routes */}

            {/* Admin Routes */}

            {/* <Route
              element={<ProtectedRoutes user={admin} redirect="/admin/login" />}
            > */}
            <Route path="/admin/">
              <Route path="login" element={<AdminLogin />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="orders" element={<Orders />} />
              <Route path="neworder" element={<NewOrder />} />
              <Route path="customers" element={<Customers />} />
              <Route path="products" element={<Products />} />
              <Route path="categories" element={<Categories />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            {/* </Route> */}

            {/* <Route
              element={
                <ProtectedRoutes user={!admin} redirect="/admin/login" />
              }
            >
              <Route path="/admin/login" element={<AdminLogin />} />
            </Route> */}
            {/* Admin Routes */}

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      )}
      <Toaster position="top-right" reverseOrder={false} />
    </BrowserRouter>
  );
};

export default App;
