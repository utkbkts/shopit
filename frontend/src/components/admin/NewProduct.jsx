import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { PRODUCT_CATEGORIES } from "../../constans/constans";
import { useCreateProductMutation } from "../../redux/api/ProductApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";
const NewProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    seller: "",
  });

  const [createProducts, { isLoading, error, isSuccess }] =
    useCreateProductMutation();
  const navigate = useNavigate();
  const { category, description, name, price, seller, stock } = product;

  const onChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if (isSuccess) {
      toast.success("Product Create");
      navigate("/admin/products");
    }
  }, [isSuccess, error]);

  const submitHandler = (e) => {
    e.preventDefault();
    createProducts(product);
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <AdminLayout>
      <div className="row wrapper">
        <div className="col-10 col-lg-10 mt-5 mt-lg-0">
          <form onSubmit={submitHandler} className="shadow rounded bg-body">
            <h2 className="mb-4">New Product</h2>
            <div className="mb-3">
              <label htmlFor="name_field" className="form-label">
                Name{" "}
              </label>
              <input
                type="text"
                id="name_field"
                className="form-control"
                name="name"
                value={name}
                onChange={onChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="description_field" className="form-label">
                Description
              </label>
              <textarea
                className="form-control"
                id="description_field"
                rows="8"
                value={description}
                onChange={onChange}
                name="description"
              ></textarea>
            </div>

            <div className="row">
              <div className="mb-3 col">
                <label htmlFor="price_field" className="form-label">
                  {" "}
                  Price{" "}
                </label>
                <input
                  type="text"
                  id="price_field"
                  className="form-control"
                  name="price"
                  value={price}
                  onChange={onChange}
                />
              </div>

              <div className="mb-3 col">
                <label htmlFor="stock_field" className="form-label">
                  {" "}
                  Stock{" "}
                </label>
                <input
                  type="number"
                  id="stock_field"
                  className="form-control"
                  name="stock"
                  value={stock}
                  onChange={onChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="mb-3 col">
                <label htmlFor="category_field" className="form-label">
                  {" "}
                  Category{" "}
                </label>
                <select
                  className="form-select"
                  id="category_field"
                  name="category"
                  value={category}
                  onChange={onChange}
                >
                  {PRODUCT_CATEGORIES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3 col">
                <label htmlFor="seller_field" className="form-label">
                  {" "}
                  Seller Name{" "}
                </label>
                <input
                  type="text"
                  id="seller_field"
                  className="form-control"
                  name="seller"
                  value={seller}
                  onChange={onChange}
                />
              </div>
            </div>
            <button
              disabled={isLoading}
              type="submit"
              className="btn w-100 py-2"
            >
              {isLoading ? "Creating..." : "CREATE"}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default NewProduct;
