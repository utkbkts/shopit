import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { MDBDataTable } from "mdbreact";
import {
  useDeleteReviewsMutation,
  useLazyGetProductReviewsQuery,
} from "../../redux/api/ProductApi";
import toast from "react-hot-toast";
const ProductReview = () => {
  const [productId, setProductId] = useState("");

  const [getProductReviews, { data, isLoading, error }] =
    useLazyGetProductReviewsQuery();

  const [
    deleteReviews,
    { error: deleteError, isLoading: isDeleteLoading, isSuccess },
  ] = useDeleteReviewsMutation();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if (deleteError) {
      toast.error(deleteError?.data?.message);
    }
    if (isSuccess) {
      toast.success("Review Deleted");
    }
  }, [error, deleteError, isSuccess, data]);

  const submitHandler = (e) => {
    e.preventDefault();
    getProductReviews(productId);
  };

  const deleteReviewHandler = (id) => {
    deleteReviews({ productId, id });
  };

  const setReviews = () => {
    const review = {
      columns: [
        {
          label: "Review ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Rating",
          field: "rating",
          sort: "asc",
        },
        {
          label: "Comment",
          field: "comment",
          sort: "asc",
        },
        {
          label: "User",
          field: "user",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
          sort: "asc",
        },
      ],
      rows: [],
    };
    data?.reviews?.forEach((reviews) => {
      review.rows.push({
        id: reviews?._id,
        rating: reviews?.rating,
        comment: reviews?.comment,
        name: reviews?.user?.name,
        actions: (
          <div className="d-flex">
            <button
              onClick={() => deleteReviewHandler(reviews?._id)}
              className="btn btn-outline-success ms-2"
            >
              <i className="fa fa-trash"></i>
            </button>
          </div>
        ),
      });
    });
    return review;
  };

  return (
    <AdminLayout>
      {" "}
      <div className="row justify-content-center my-5">
        <div className="col-6">
          <form onSubmit={submitHandler}>
            <div className="mb-3">
              <label htmlFor="productId_field" className="form-label">
                Enter Product ID
              </label>
              <input
                type="text"
                id="productId_field"
                className="form-control"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>

            <button
              id="search_button"
              type="submit"
              className="btn btn-primary w-100 py-2"
            >
              SEARCH
            </button>
          </form>
        </div>
      </div>
      {data?.reviews?.length > 0 ? (
        <MDBDataTable data={setReviews()} className="px-3" bordered striped />
      ) : (
        <p className="mt-5 text-center">No Reviews</p>
      )}
    </AdminLayout>
  );
};

export default ProductReview;
