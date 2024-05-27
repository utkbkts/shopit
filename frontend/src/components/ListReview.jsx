import React from "react";
import logo from "../images/user.png";
import StarRatings from "react-star-ratings";
const ListReview = ({ reviews }) => {
  return (
    <>
      <div class="reviews w-75">
        <h3>Other's Reviews:</h3>
        <hr />
        {reviews?.map((rev) => (
          <div key={rev._id} class="review-card my-3">
            <div class="row">
              <div class="col-1">
                <img
                  src={rev.user.avatar ? rev.user.avatar.url : logo}
                  alt="User Name"
                  width="50"
                  height="50"
                  class="rounded-circle"
                />
              </div>
              <div class="col-11">
                <StarRatings
                  rating={rev?.rating}
                  starRatedColor="#ffb829"
                  numberOfStars={5}
                  name="rating"
                  starDimension="22px"
                  starSpacing="1px"
                />
                <p class="review_user">by {rev.user.name}</p>
                <p class="review_comment">{rev.comment}</p>
              </div>
            </div>
            <hr />
          </div>
        ))}
      </div>
    </>
  );
};

export default ListReview;
