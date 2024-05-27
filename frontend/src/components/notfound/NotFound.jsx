import React from "react";
import images from "../../images/404.svg";
const NotFound = () => {
  return (
    <div>
      {" "}
      <div class="row">
        <div class="d-flex justify-content-center page-not-found-wrapper">
          <img src={images} height="550" width="550" alt="404_not_found" />
        </div>
        <h5 class="text-center">
          Page Not Found. Go to <a href="/">Homepage</a>
        </h5>
      </div>
    </div>
  );
};

export default NotFound;
