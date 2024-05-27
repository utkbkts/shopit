import React from "react";
import MetaData from "../layouts/Helmet";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { calculateOrderCost } from "../helpers/Helper";
import CheckoutSteps from "../components/CheckoutSteps";

const ConfirmOrder = () => {
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const { shippingPrice, taxPrice, totalPrice, itemPrice } =
    calculateOrderCost(cartItems);
  return (
    <>
      <MetaData title={"Confirm Order"} />
      <CheckoutSteps shipping confirmOrder />
      <div className="container mx-auto">
        <div className="row px-2 pt-4 py-2">
          <div className="col-12 col-lg-8">
            <h2>Shipping Info</h2>
            <hr />
            <div className="d-flex flex-column gap-3">
              <span>Name:{user?.name}</span>
              <span>Phone:{shippingInfo?.phoneNo}</span>
              <span>
                <b>Address:</b>
                {shippingInfo?.address},{shippingInfo?.city},
                {shippingInfo?.postalCode}
              </span>
              <hr />
            </div>
            <h2>Your Cart Items</h2>
            <hr />
            {cartItems.map((item) => (
              <div className="d-flex flex-row">
                <div class="col-4 col-lg-2">
                  <img src={item?.image} alt="Laptop" height="45" width="65" />
                </div>

                <div class="col-5 col-lg-6">
                  <Link to={`/product/${item.product}`}>{item?.name}</Link>
                </div>

                <div class="col-4 col-lg-4 mt-4 mt-lg-0">
                  <p>
                    {item?.quantity} x ${item?.price} ={" "}
                    <b>${(item?.quantity * item.price).toFixed(2)}</b>
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div class="col-12 col-lg-3 my-4">
            <div id="order_summary">
              <h4>Order Summary</h4>
              <hr />
              <p>
                Subtotal: <span class="order-summary-values">${itemPrice}</span>
              </p>
              <p>
                Shipping:{" "}
                <span class="order-summary-values">${shippingPrice}</span>
              </p>
              <p>
                Tax: <span class="order-summary-values">${taxPrice}</span>
              </p>

              <hr />

              <p>
                Total: <span class="order-summary-values">${totalPrice}</span>
              </p>

              <hr />
              <Link
                to="/payment"
                id="checkout_btn"
                class="btn btn-primary w-100"
              >
                Proceed to Payment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmOrder;
