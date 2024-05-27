import React from "react";
import logo from "../images/commerce1.jpg";
import userLogo from "../images/user.png";
import Search from "./Search";
import { useGetUserQuery } from "../redux/api/userApi";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLazyLogoutQuery } from "../redux/api/AuthApi";
const Header = () => {
  const { isLoading } = useGetUserQuery();
  const [logout] = useLazyLogoutQuery();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const logoutHandler = async () => {
    await logout();
    navigate(0);
  };
  return (
    <nav className="navbar row p-3">
      <div className="col-12 col-md-3 ps-5">
        <div className="navbar-brand brand-logo">
          <Link to="/" className="Logo">
            <img src={logo} alt="ShopIT Logo" />
          </Link>
          <span>E-Commerce</span>
        </div>
      </div>
      <div className="col-12 col-md-6 mt-2 mt-md-0">
        <Search />
      </div>
      <div className="col-12 col-md-3 mt-4 mt-md-0 text-center d-flex justify-content-center align-items-center">
        <Link
          to="/cart"
          style={{ textDecoration: "none" }}
          className="d-flex justify-content-center align-items-center"
        >
          <span id="cart" className="ms-1">
            {" "}
            Cart{" "}
          </span>
          <span className="ms-1" id="cart_count">
            {cartItems.length}
          </span>
        </Link>

        {user ? (
          <div className="ms-4 dropdown">
            <button
              className="btn dropdown-toggle text-white"
              type="button"
              id="dropDownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <figure className="avatar avatar-nav">
                <img
                  src={user?.avatar ? user.avatar.url : userLogo}
                  className="rounded-circle"
                />
              </figure>
              <span>{user?.name}</span>
            </button>
            <div
              className="dropdown-menu w-100"
              aria-labelledby="dropDownMenuButton"
            >
              {user?.role === "admin" && (
                <Link className="dropdown-item" to="/admin/dashboard">
                  Dashboard
                </Link>
              )}

              <Link className="dropdown-item" to="/me/orders">
                Orders
              </Link>

              <Link className="dropdown-item" to="/me/profile">
                Profile
              </Link>

              <Link
                onClick={logoutHandler}
                className="dropdown-item text-danger"
                to="/"
              >
                Logout
              </Link>
            </div>
          </div>
        ) : (
          !isLoading && (
            <Link to="/login" className="btn ms-4" id="login_btn">
              Login
            </Link>
          )
        )}
      </div>
    </nav>
  );
};

export default Header;
