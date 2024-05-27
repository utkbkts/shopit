import React from "react";
import SidebarMenu from "../pages/SidebarMenu";

const AdminLayout = ({ children }) => {
  const menuItems = [
    {
      name: "Dashboard",
      url: "/admin/dashboard",
      icon: "fas fa-user",
    },
    {
      name: "New Product",
      url: "/admin/product/new",
      icon: "fas fa-user",
    },
    {
      name: "Products",
      url: "/admin/products",
      icon: "fas fa-user-circle",
    },
    {
      name: "Order",
      url: "/admin/orders",
      icon: "fas fa-lock",
    },
    {
      name: "Users",
      url: "/admin/users",
      icon: "fas fa-lock",
    },
    {
      name: "Reviews",
      url: "/admin/reviews",
      icon: "fas fa-lock",
    },
  ];
  return (
    <div>
      <div className="mt-2 mb-4 py-4">
        <h2 className="text-center fw-bolder">Admin Control Panel</h2>
      </div>
      <div className="container">
        <div className="row justify-center-around">
          <div className="col-12 col-lg-3">
            <SidebarMenu menuItems={menuItems} />
          </div>
          <div className="col-12 col-lg-8 user-dashboard">
            <>{children}</>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
