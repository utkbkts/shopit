import React from "react";
import { Link } from "react-router-dom";

const CheckoutSteps = ({ shipping, confirmOrder, payment }) => {
  return (
    <div class="checkout-progress d-flex justify-content-center mt-5 row">
      {shipping ? (
        <Link
          to="/shipping"
          class="float-right mt-2 mt-md-0 col-12 col-md-3 col-lg-2"
        >
          <div class="triangle2-active"></div>
          <div class="step active-step">Shipping</div>
          <div class="triangle-active"></div>
        </Link>
      ) : (
        <Link
          to="/confirm_order"
          class="float-right mt-2 mt-md-0 col-12 col-md-3 col-lg-2"
          disabled
        >
          <div class="triangle2-incomplete"></div>
          <div class="step incomplete">Shipping</div>
          <div class="triangle-incomplete"></div>
        </Link>
      )}
      {confirmOrder ? (
        <Link
          to="/confirm_order"
          class="float-right mt-2 mt-md-0 col-12 col-md-4 col-lg-3"
        >
          <div class="triangle2-active"></div>
          <div class="step active-step">Confirm Order</div>
          <div class="triangle-active"></div>
        </Link>
      ) : (
        <Link
          to="/confirm_order"
          class="float-right mt-2 mt-md-0 col-12 col-md-4 col-lg-3"
          disabled
        >
          <div class="triangle2-incomplete"></div>
          <div class="step incomplete">Confirm Order</div>
          <div class="triangle-incomplete"></div>
        </Link>
      )}

      {payment ? (
        <a
          href="/payment"
          class="float-right mt-2 mt-md-0 col-12 col-md-3 col-lg-2"
        >
          <div class="triangle2-active"></div>
          <div class="step active-step">Payment</div>
          <div class="triangle-active"></div>
        </a>
      ) : (
        <a
          href="#!"
          class="float-right mt-2 mt-md-0 col-12 col-md-3 col-lg-2"
          disabled
        >
          <div class="triangle2-incomplete"></div>
          <div class="step incomplete">Payment</div>
          <div class="triangle-incomplete"></div>
        </a>
      )}
    </div>
  );
};

export default CheckoutSteps;
