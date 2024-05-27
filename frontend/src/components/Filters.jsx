import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getPriceQueryParams } from "../helpers/Helper";
import { PRODUCT_CATEGORIES } from "../constans/constans";
import StarRatings from "react-star-ratings";

const Filters = () => {
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();

  //handle Category Filter
  const handleClick = (checkbox) => {
    const checkboxes = document.getElementsByName(checkbox.name);

    checkboxes.forEach((item) => {
      if (item !== checkbox) item.checked = false;
    });
    if (checkbox.checked === false) {
      if (searchParams.has(checkbox.name)) {
        searchParams.delete(checkbox.name);
        const path = window.location.pathname + "?" + searchParams.toString();
        navigate(path);
      }
    } else {
      if (searchParams.has(checkbox.name)) {
        searchParams.set(checkbox.name, checkbox.value);
      } else {
        searchParams.append(checkbox.name, checkbox.value);
      }
      const path = window.location.pathname + "?" + searchParams.toString();
      navigate(path);
    }
  };

  //handle Price Filter
  const handleButtonOnclick = (e) => {
    e.preventDefault();

    // Reset searchParams if min or max is empty
    if (!min && searchParams.has("min")) {
      searchParams.delete("min");
    }
    if (!max && searchParams.has("max")) {
      searchParams.delete("max");
    }

    if (min) {
      searchParams = getPriceQueryParams(searchParams, "min", min);
    }
    if (max) {
      searchParams = getPriceQueryParams(searchParams, "max", max);
    }

    setSearchParams(searchParams);
  };

  const defaultCheckHandler = (checkboxType, checkboxValue) => {
    const value = searchParams.get(checkboxType);
    if (checkboxValue === value) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="border p-3 filter">
      <h3>Filters</h3>
      <hr />
      <h5 className="filter-heading mb-3">Price</h5>
      <form id="filter_form" className="px-2" onSubmit={handleButtonOnclick}>
        <div className="row">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Min ($)"
              name="min"
              value={min}
              onChange={(e) => setMin(e.target.value)}
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Max ($)"
              name="max"
              value={max}
              onChange={(e) => setMax(e.target.value)}
            />
          </div>
          <div className="col">
            <button type="submit" className="btn btn-primary">
              GO
            </button>
          </div>
        </div>
      </form>

      <hr />
      <h5 className="mb-3">Category</h5>
      {PRODUCT_CATEGORIES.map((item, index) => (
        <div key={index} className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            name="category"
            id={`category-check-${index}`}
            value={item}
            defaultChecked={defaultCheckHandler("category", item)}
            onClick={(e) => handleClick(e.target)}
          />
          <label
            className="form-check-label"
            htmlFor={`category-check-${index}`}
          >
            {item}
          </label>
        </div>
      ))}
      <hr />
      <h5 className="mb-3">Ratings</h5>
      {[5, 4, 3, 2, 1].map((rating, index) => (
        <div key={index} className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            name="ratings"
            id={`rating-check-${index}`}
            value={rating}
            defaultChecked={defaultCheckHandler("ratings", rating?.toString())}
            onClick={(e) => handleClick(e.target)}
          />
          <label className="form-check-label" htmlFor={`rating-check-${index}`}>
            <StarRatings
              rating={rating}
              starRatedColor="#ffb829"
              numberOfStars={5}
              name="rating"
              starDimension="14px"
              starSpacing="1px"
            />
          </label>
        </div>
      ))}
    </div>
  );
};

export default Filters;
