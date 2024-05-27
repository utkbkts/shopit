import React from "react";
import Layout from "../layouts/Layout";
import { Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import ProductDetail from "../components/ProductDetail.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Profile from "../pages/Profile.jsx";
import ProctecRoute from "../components/ProctecRoute.jsx";
import UpdateUserProfile from "../user/UpdateUserProfile.jsx";
import UploadAvatar from "../user/UploadAvatar.jsx";
import UpdatePassword from "../user/UpdatePassword.jsx";
import ForgotPassword from "../user/ForgotPassword.jsx";
import ResetPassword from "../user/ResetPassword.jsx";
import CartPage from "../pages/CartPage.jsx";
import ShippingInfo from "../pages/ShippingInfo.jsx";
import ConfirmOrder from "../pages/ConfirmOrder.jsx";
import PaymentMethod from "../pages/PaymentMethod.jsx";
import MyOrders from "../user/MyOrders.jsx";
import Order_details from "../pages/Order_details.jsx";
import Invoices from "../components/Invoices.jsx";
const UserRoutes = () => {
  return (
    <>
      <Route
        element={
          <Layout>
            <Home />
          </Layout>
        }
        path="/"
      />
      <Route
        element={
          <Layout>
            <ProductDetail />
          </Layout>
        }
        path="/product/:id"
      />
      <Route element={<Login />} path="/login" />
      <Route element={<Register />} path="/register" />
      <Route element={<ForgotPassword />} path="/password/forgot" />
      <Route element={<ResetPassword />} path="/password/reset/:token" />
      <Route
        element={
          <Layout>
            <CartPage />
          </Layout>
        }
        path="/cart"
      />
      <Route
        element={
          <Layout>
            <ProctecRoute>
              <ShippingInfo />
            </ProctecRoute>
          </Layout>
        }
        path="/shipping"
      />{" "}
      <Route
        element={
          <Layout>
            <ProctecRoute>
              <ConfirmOrder />
            </ProctecRoute>
          </Layout>
        }
        path="/confirm_order"
      />
      <Route
        element={
          <Layout>
            <ProctecRoute>
              <PaymentMethod />
            </ProctecRoute>
          </Layout>
        }
        path="/payment"
      />
      <Route
        element={
          <Layout>
            <ProctecRoute>
              <MyOrders />
            </ProctecRoute>
          </Layout>
        }
        path="/me/orders"
      />
      <Route
        element={
          <Layout>
            <ProctecRoute>
              <Order_details />
            </ProctecRoute>
          </Layout>
        }
        path="/order/:id"
      />
      <Route
        element={
          <Layout>
            <ProctecRoute>
              <Profile />
            </ProctecRoute>
          </Layout>
        }
        path="/me/profile"
      />
      <Route
        element={
          <Layout>
            <ProctecRoute>
              <UpdateUserProfile />
            </ProctecRoute>
          </Layout>
        }
        path="/me/update_profile"
      />
      <Route
        element={
          <Layout>
            <ProctecRoute>
              <UploadAvatar />
            </ProctecRoute>
          </Layout>
        }
        path="/me/upload_avatar"
      />
      <Route
        element={
          <Layout>
            <ProctecRoute>
              <Invoices />
            </ProctecRoute>
          </Layout>
        }
        path="/invoice/order/:id"
      />
      <Route
        element={
          <Layout>
            <ProctecRoute>
              <UpdatePassword />
            </ProctecRoute>
          </Layout>
        }
        path="/me/update_password"
      />
    </>
  );
};

export default UserRoutes;
