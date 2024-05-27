import React from "react";
import { Route } from "react-router-dom";
import Dashboard from "../components/admin/Dashboard";
import Layout from "../layouts/Layout";
import ProctecRoute from "../components/ProctecRoute";
import ListProducts from "../components/admin/ListProducts";
import NewProduct from "../components/admin/NewProduct";
import UpdateProduct from "../components/admin/UpdateProducts";
import UploadImages from "../components/admin/UploadImages";
import ListOrders from "../components/admin/ListOrders";
import ProcessOrder from "../components/admin/ProcessOrder";
import ListUsers from "../components/admin/ListUsers";
import UpdateUser from "../components/admin/UpdateUser";
import ProductReview from "../components/admin/ProductReview";

const AdminRoutes = () => {
  return (
    <>
      <Route
        path="/admin/dashboard"
        element={
          <Layout>
            <ProctecRoute admin={true}>
              <Dashboard />
            </ProctecRoute>
          </Layout>
        }
      />
      <Route
        path="/admin/products"
        element={
          <Layout>
            <ProctecRoute admin={true}>
              <ListProducts />
            </ProctecRoute>
          </Layout>
        }
      />
      <Route
        path="/admin/product/new"
        element={
          <Layout>
            <ProctecRoute admin={true}>
              <NewProduct />
            </ProctecRoute>
          </Layout>
        }
      />
      <Route
        path="/admin/products/:id"
        element={
          <Layout>
            <ProctecRoute admin={true}>
              <UpdateProduct />
            </ProctecRoute>
          </Layout>
        }
      />
      <Route
        path="/admin/products/:id/upload_images"
        element={
          <Layout>
            <ProctecRoute admin={true}>
              <UploadImages />
            </ProctecRoute>
          </Layout>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <Layout>
            <ProctecRoute admin={true}>
              <ListOrders />
            </ProctecRoute>
          </Layout>
        }
      />
      <Route
        path="/admin/orders/:id"
        element={
          <Layout>
            <ProctecRoute admin={true}>
              <ProcessOrder />
            </ProctecRoute>
          </Layout>
        }
      />
      <Route
        path="/admin/users"
        element={
          <Layout>
            <ProctecRoute admin={true}>
              <ListUsers />
            </ProctecRoute>
          </Layout>
        }
      />
      <Route
        path="/admin/users/:id"
        element={
          <Layout>
            <ProctecRoute admin={true}>
              <UpdateUser />
            </ProctecRoute>
          </Layout>
        }
      />
      <Route
        path="/admin/reviews"
        element={
          <Layout>
            <ProctecRoute admin={true}>
              <ProductReview />
            </ProctecRoute>
          </Layout>
        }
      />
    </>
  );
};

export default AdminRoutes;
