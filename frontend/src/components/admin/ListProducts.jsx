import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import Loader from "../Loader.jsx";
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";
import {
  useDeleteProductMutation,
  useGetAdminProductsQuery,
} from "../../redux/api/ProductApi";
import AdminLayout from "../../layouts/AdminLayout.jsx";
import MetaData from "../../layouts/Helmet.jsx";
const ListProducts = () => {
  const { data, isLoading, error } = useGetAdminProductsQuery();

  const [deleteProduct, { isSuccess, error: isDelete }] =
    useDeleteProductMutation();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if (isDelete) {
      toast.error(isDelete?.data?.message);
    }
    if (isSuccess) {
      toast.error("Deleted is successfull");
    }
  }, [error, isSuccess, isDelete]);
  const deletehandleProduct = (id) => {
    deleteProduct(id);
  };
  const setProducts = () => {
    const products = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Name",
          field: "name",
          sort: "asc",
        },
        {
          label: "Price",
          field: "price",
          sort: "asc",
        },
        {
          label: "Stock",
          field: "stock",
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
    data?.product?.forEach((product) => {
      products.rows.push({
        id: product?._id,
        name: `${product?.name?.substring(0, 20)}...`,
        price: product?.price,
        stock: product?.stock,
        actions: (
          <div className="d-flex">
            <Link
              to={`/admin/products/${product?._id}`}
              className="btn btn-outline-primary"
            >
              <i className="fa fa-pencil"></i>
            </Link>
            <Link
              to={`/admin/products/${product?._id}/upload_images`}
              className="btn btn-outline-success ms-2"
            >
              <i className="fa fa-image"></i>
            </Link>
            <button
              onClick={() => deletehandleProduct(product._id)}
              className="btn btn-outline-success ms-2"
            >
              <i className="fa fa-trash"></i>
            </button>
          </div>
        ),
      });
    });
    return products;
  };

  if (isLoading) return <Loader />;
  return (
    <AdminLayout>
      <MetaData title={"All Products"} />
      <div>
        <h1 className="my-5">{data?.product?.length} Products</h1>
        <MDBDataTable data={setProducts()} className="px-3" bordered striped />
      </div>
    </AdminLayout>
  );
};

export default ListProducts;
