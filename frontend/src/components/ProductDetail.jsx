import React, { useEffect, useState } from "react";
import { useGetProductDetailsQuery } from "../redux/api/ProductApi";
import StarRatings from "react-star-ratings";
import { useParams } from "react-router-dom";
import Loader from "./Loader";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setCartItems } from "../redux/features/CartSlice";
import MetaData from "../layouts/Helmet";
import NewReviews from "./NewReviews";
import ListReview from "./ListReview";
const ProductDetail = () => {
  const params = useParams();
  const [activeImg, setActiveImg] = useState("");
  const { data, isLoading, isError, error } = useGetProductDetailsQuery(
    params?.id
  );
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const product = data?.product;
  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
  });

  useEffect(() => {
    setActiveImg(product?.images[0] ? product?.images[0].url : "");
  }, [product]);

  if (isLoading) {
    return <Loader />;
  }

  const increaseQty = () => {
    const count = document.querySelector(".count");

    if (count.valueAsNumber >= product.stock) return;

    const qty = count.valueAsNumber + 1;
    setQuantity(qty);
  };
  const decreaseQty = () => {
    const count = document.querySelector(".count");

    if (count.valueAsNumber <= 1) return;

    const qty = count.valueAsNumber - 1;
    setQuantity(qty);
  };
  const addToCard = () => {
    const cartItems = {
      product: product?._id,
      name: product?.name,
      price: product?.price,
      image: product?.images[0]?.url,
      stock: product?.stock,
      quantity,
    };
    dispatch(setCartItems(cartItems));
  };

  return (
    <>
      <MetaData title={product?.name} />
      <div className="row d-flex justify-content-around">
        <div className="col-12 col-lg-5 img-fluid" id="product_image">
          <div className="p-3">
            <img
              className="d-block w-100"
              src={activeImg}
              alt=""
              width="340"
              height="390"
            />
          </div>
          <div className="row justify-content-start mt-5">
            {product?.images?.map((img) => (
              <div className="col-2 ms-4 mt-2">
                <a role="button">
                  <img
                    className={`d-block border rounded p-3 cursor-pointer ${
                      img.url === activeImg ? "border-warning" : ""
                    }`}
                    height="100"
                    width="100"
                    src={img.url}
                    alt={img.url}
                    onClick={(e) => setActiveImg(img.url)}
                  />
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="col-12 col-lg-5 mt-5">
          <h3>{product?.name}</h3>
          <p id="product_id">Product # {product?._id}</p>

          <hr />

          <div className="d-flex">
            <StarRatings
              rating={product?.ratings}
              starRatedColor="#ffb829"
              numberOfStars={5}
              name="rating"
              starDimension="22px"
              starSpacing="1px"
            />
            <span id="no-of-reviews" className="pt-1 ps-2">
              {" "}
              ({product?.numOfReviews}){" "}
            </span>
          </div>
          <hr />

          <p id="product_price">${product?.price}</p>
          <div className="stockCounter d-inline">
            <span onClick={decreaseQty} className="btn btn-danger minus">
              -
            </span>
            <input
              type="number"
              className="form-control count d-inline"
              value={quantity}
            />
            <span onClick={increaseQty} className="btn btn-primary plus">
              +
            </span>
          </div>
          <button
            type="button"
            id="cart_btn"
            className="btn btn-primary d-inline ms-4"
            disabled={product.stock <= 0}
            onClick={addToCard}
          >
            Add to Cart
          </button>

          <hr />

          <p>
            Status:{" "}
            <span
              id="stock_status"
              className={product?.stock > 0 ? "greenColor" : "redColor"}
            >
              {product.stock > 0 ? "In Stock" : "No Stock"}
            </span>
          </p>

          <hr />

          <h4 className="mt-2">Description:</h4>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </p>
          <hr />
          <p id="product_seller mb-3">
            Sold by: <strong>Tech</strong>
          </p>

          {isAuthenticated ? (
            <NewReviews productId={product?._id} />
          ) : (
            <div className="alert alert-danger my-5" type="alert">
              Login to post your review.
            </div>
          )}
        </div>
      </div>
      {product?.reviews?.length > 0 && (
        <ListReview reviews={product?.reviews} />
      )}
    </>
  );
};

export default ProductDetail;
