import React, { useEffect, useState } from "react";
import CheckoutSteps from "../components/CheckoutSteps";
import MetaData from "../layouts/Helmet";
import { useSelector } from "react-redux";
import { calculateOrderCost } from "../helpers/Helper";
import {
  useCreateNewOrderMutation,
  useStripeCheckoutSessionMutation,
} from "../redux/api/OrderApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const PaymentMethod = () => {
  const [method, setMethod] = useState("");
  const navigate = useNavigate();
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const [createNewOrder, { isLoading, error, isSuccess }] =
    useCreateNewOrderMutation();
  const [
    stripeCheckoutSession,
    { data: checkoutData, error: checkoutError, isSuccess: Success },
  ] = useStripeCheckoutSessionMutation();

  useEffect(() => {
    if (error) {
      toast.error(error.data.message);
    }
    if (isSuccess || Success) {
      navigate("/me/orders?order_success=true");
    }
  }, [error, isSuccess, navigate]);

  useEffect(() => {
    if (checkoutData) {
      window.location.href = checkoutData.url;
    }
    if (checkoutError) {
      toast.error(checkoutError.data.message);
    }
  }, [checkoutData, checkoutError]);

  const submitHandler = (e) => {
    e.preventDefault();

    const { itemPrice, shippingPrice, taxPrice, totalPrice } =
      calculateOrderCost(cartItems);

    if (method === "COD") {
      const orderData = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice: itemPrice,
        shippingAmount: shippingPrice,
        taxAmount: taxPrice,
        totalAmount: totalPrice,
        paymentInfo: {
          status: "Not Paid",
        },
        paymentMethod: "COD",
      };
      createNewOrder(orderData);
    }

    if (method === "Card") {
      const orderData = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice: itemPrice,
        shippingAmount: shippingPrice,
        taxAmount: taxPrice,
        totalAmount: totalPrice,
      };
      stripeCheckoutSession(orderData);
    }
  };

  return (
    <>
      <MetaData title={"Payment"} />
      <CheckoutSteps shipping confirmOrder payment />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow rounded bg-body" onSubmit={submitHandler}>
            <h2 className="mb-4">Select Payment Method</h2>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="payment_mode"
                id="codradio"
                value={"COD"}
                onChange={(e) => setMethod("COD")}
              />
              <label className="form-check-label" htmlFor="codradio">
                Cash on Delivery
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="payment_mode"
                id="cardradio"
                value={"Card"}
                onChange={(e) => setMethod("Card")}
              />
              <label className="form-check-label" htmlFor="cardradio">
                Card - VISA, MasterCard
              </label>
            </div>
            <button id="shipping_btn" type="submit" className="btn py-2 w-100">
              CONTINUE
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PaymentMethod;
