import React, { useEffect, useState } from "react";
import { countries } from "countries-list";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingInfo } from "../redux/features/CartSlice";
import { Link } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";
const ShippingInfo = () => {
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    phoneNo: "",
    postalCode: "",
    country: "",
  });
  const dispatch = useDispatch();
  const countriesList = Object.values(countries);
  const { shippingInfo } = useSelector((state) => state.cart);

  useEffect(() => {
    if (shippingInfo) {
      setFormData({
        address: shippingInfo?.address || "",
        city: shippingInfo?.city || "",
        phoneNo: shippingInfo?.phoneNo || "",
        postalCode: shippingInfo?.postalCode || "",
        country: shippingInfo?.country || "",
      });
    }
  }, [shippingInfo]);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form verilerini işleme (örneğin, bir API'ye gönderme)
    dispatch(saveShippingInfo(formData));
  };
  return (
    <>
      <CheckoutSteps shipping />
      <div className="row wrapper mb-5">
        <div className="col-10 col-lg-5">
          <form className="shadow rounded bg-body" onSubmit={handleSubmit}>
            <h2 className="mb-4">Shipping Info</h2>
            <div className="mb-3">
              <label htmlFor="address_field" className="form-label">
                Address
              </label>
              <input
                type="text"
                id="address_field"
                className="form-control"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="city_field" className="form-label">
                City
              </label>
              <input
                type="text"
                id="city_field"
                className="form-control"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="phone_field" className="form-label">
                Phone No
              </label>
              <input
                type="tel"
                id="phone_field"
                className="form-control"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="postal_code_field" className="form-label">
                Postal Code
              </label>
              <input
                type="number"
                id="postal_code_field"
                className="form-control"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="country_field" className="form-label">
                Country
              </label>
              <select
                id="country_field"
                className="form-select"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              >
                {countriesList.map((item) => (
                  <option key={item?.name} value={item?.name}>
                    {item?.name}
                  </option>
                ))}
              </select>
            </div>

            <Link
              to={"/confirm_order"}
              id="shipping_btn"
              type="submit"
              className="btn w-100 py-2"
            >
              CONTINUE
            </Link>
          </form>
        </div>
      </div>
    </>
  );
};

export default ShippingInfo;
