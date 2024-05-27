import React from "react";
import MetaData from "../layouts/Helmet";
import { useDispatch, useSelector } from "react-redux";
import { removeCart, setCartItems } from "../redux/features/CartSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const CartPage = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const increaseQty = (item, quantity) => {
    const newQty = quantity + 1;
    if (newQty >= item?.stock) return;

    addToCard(item, newQty);
  };
  const decreaseQty = (item, quantity) => {
    const newQty = quantity - 1;
    if (newQty <= 0) return;

    addToCard(item, newQty);
  };
  const addToCard = (item, newQty) => {
    const cartItems = {
      product: item?.product,
      name: item?.name,
      price: item?.price,
      image: item?.image,
      stock: item?.stock,
      quantity: newQty,
    };
    dispatch(setCartItems(cartItems));
  };
  const RemoveCartItem = (id) => {
    dispatch(removeCart(id));
    toast.success("Product Deleted !");
  };
  //units
  const calculateTotalUnits = () => {
    return cartItems?.reduce((acc, item) => acc + item.quantity, 0);
  };
  //total
  const calculateTotal = () => {
    return cartItems
      ?.reduce((acc, item) => acc + item.quantity * item.price, 0)
      .toFixed(2);
  };
  const NavigateShipping = () => {
    navigate("/shipping");
  };
  return (
    <>
      <MetaData title={"Cart Page"} />
      <div className="container">
        {cartItems.length === 0 ? (
          <h2 className="text-center mt-4">Your Cart Is Empty</h2>
        ) : (
          <div className="row  justify-content-between mt-2 mb-4 py-4 px-4 ">
            <h2>Your Cart Items({cartItems.length})</h2>
            <div className="col-12 col-lg-9">
              <table className="table table-striped ">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Image</th>
                    <th scope="col">Name</th>
                    <th scope="col">Price</th>
                    <th scope="col">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr>
                      <th scope="row">{item?.product.substring(0, 10)}...</th>
                      <td>
                        <img
                          src={item?.image}
                          alt={"images"}
                          height="90"
                          width="115"
                        />
                      </td>
                      <td>{item?.name.substring(0, 30)}</td>
                      <td>{item?.price}</td>
                      <td>
                        <div className="stockCounter">
                          <span
                            className="btn btn-danger minus"
                            onClick={() => decreaseQty(item, item.quantity)}
                          >
                            {" "}
                            -{" "}
                          </span>
                          <input
                            type="number"
                            className="form-control count d-inline"
                            value={item?.quantity}
                            readonly
                          />
                          <span
                            onClick={() => increaseQty(item, item.quantity)}
                            className="btn btn-primary plus"
                          >
                            {" "}
                            +{" "}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                          <i
                            id="delete_cart_item"
                            className="fa fa-trash btn btn-danger"
                            onClick={() => RemoveCartItem(item?.product)}
                          ></i>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="col-12 col-lg-3 my-4">
              <div id="order_summary">
                <h4>Order Summary</h4>
                <hr />
                <p>
                  Units:{" "}
                  <span className="order-summary-values">
                    {calculateTotalUnits()} (Units)
                  </span>
                </p>
                <p>
                  Est. total:{" "}
                  <span className="order-summary-values">
                    ${calculateTotal()}
                  </span>
                </p>
                <hr />
                <button
                  onClick={NavigateShipping}
                  id="checkout_btn"
                  className="btn btn-primary w-100"
                >
                  Check out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;
