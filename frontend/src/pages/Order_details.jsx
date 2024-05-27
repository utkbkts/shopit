import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import MetaData from "../layouts/Helmet";
import { useOrderDetailsQuery } from "../redux/api/OrderApi";
import toast from "react-hot-toast";
const Order_details = () => {
  const params = useParams();
  const { data, error, isSuccess } = useOrderDetailsQuery(params?.id);
  const order = data?.order || {};
  const {
    orderItems,
    paymentInfo,
    shippingInfo,
    user,
    totalAmount,
    orderStatus,
  } = order;
  useEffect(() => {
    if (error) {
      toast.error(error.data.message);
    }
  }, [error]);
  const isPaid = paymentInfo?.status === "paid" ? true : false;
  return (
    <>
      <MetaData title={"Order Details"} />
      <div className="row d-flex justify-content-center">
        <div className="col-12 col-lg-9 mt-5 order-details">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mt-5 mb-4">Your Order Details</h3>
            <Link className="btn btn-success" to="/invoice/order/order-id">
              <i className="fa fa-print"></i> Invoice
            </Link>
          </div>
          <table className="table table-striped table-bordered">
            <tbody>
              <tr>
                <th scope="row">ID</th>
                <td>{order?._id}</td>
              </tr>
              <tr>
                <th scope="row">Status</th>
                <td
                  className={
                    String(orderStatus).includes("Delivered")
                      ? "greenColor"
                      : "redColor"
                  }
                >
                  <b>{orderStatus}</b>
                </td>
              </tr>
              <tr>
                <th scope="row">Date</th>
                <td>{new Date(order?.createdAt).toLocaleString("en-US")}</td>
              </tr>
            </tbody>
          </table>

          <h3 className="mt-5 mb-4">Shipping Info</h3>
          <table className="table table-striped table-bordered">
            <tbody>
              <tr>
                <th scope="row">Name</th>
                <td>{user?.name}</td>
              </tr>
              <tr>
                <th scope="row">Phone No</th>
                <td>{shippingInfo?.phoneNo}</td>
              </tr>
              <tr>
                <th scope="row">Address</th>
                <td>
                  {" "}
                  {shippingInfo?.address},{shippingInfo?.city},
                  {shippingInfo?.postalCode}
                </td>
              </tr>
            </tbody>
          </table>

          <h3 className="mt-5 mb-4">Payment Info</h3>
          <table className="table table-striped table-bordered">
            <tbody>
              <tr>
                <th scope="row">Status</th>
                <td className={isPaid ? "greenColor" : "redColor"}>
                  <b>{paymentInfo?.status}</b>
                </td>
              </tr>
              <tr>
                <th scope="row">Method</th>
                <td>{order?.paymentMethod}</td>
              </tr>
              <tr>
                <th scope="row">Stripe ID</th>
                <td>{paymentInfo?.id || "Nill"}</td>
              </tr>
              <tr>
                <th scope="row">Amount Paid</th>
                <td>${totalAmount}</td>
              </tr>
            </tbody>
          </table>

          <h3 className="mt-5 my-4">Order Items:</h3>
          <hr />
          {orderItems?.map((item) => (
            <div className="cart-item my-1">
              <div className="row my-5">
                <div className="col-4 col-lg-2">
                  <img
                    src={item?.image}
                    alt="Product Name"
                    height="45"
                    width="65"
                  />
                </div>

                <div className="col-5 col-lg-5">
                  <Link to={`/products/${item?.product}`}>{item?.name}</Link>
                </div>

                <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                  <p>${item?.price}</p>
                </div>

                <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                  <p>{item?.quantity} Piece(s)</p>
                </div>
              </div>
            </div>
          ))}
          <hr />
        </div>
      </div>
    </>
  );
};

export default Order_details;
