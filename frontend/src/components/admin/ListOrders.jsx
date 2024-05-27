import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import Loader from "../Loader.jsx";
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout.jsx";
import MetaData from "../../layouts/Helmet.jsx";
import {
  useDeleteOrderMutation,
  useGetAdminOrdersQuery,
} from "../../redux/api/OrderApi.js";

const ListOrders = () => {
  const { data, isLoading, error } = useGetAdminOrdersQuery();

  const [deleteOrder, { error: isDelete, isSuccess: deleteSucces }] =
    useDeleteOrderMutation();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if (isDelete) {
      toast.error(isDelete?.data?.message);
    }
    if (deleteSucces) {
      toast.success("Deleted is successfull");
    }
  }, [deleteSucces, isDelete, error]);

  const deletehandleProduct = (id) => {
    deleteOrder(id);
  };

  const setOrders = () => {
    const orders = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Payment Status",
          field: "paymentStatus",
          sort: "asc",
        },
        {
          label: "Order Status",
          field: "orderStatus",
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
    data?.orders?.forEach((order) => {
      orders.rows.push({
        id: order?._id,
        paymentStatus: order?.paymentInfo?.status?.toUpperCase(),
        orderStatus: order?.orderStatus,
        actions: (
          <div className="d-flex">
            <Link
              to={`/admin/orders/${order?._id}`}
              className="btn btn-outline-primary"
            >
              <i className="fa fa-pencil"></i>
            </Link>
            <button
              onClick={() => deletehandleProduct(order._id)}
              className="btn btn-outline-success ms-2"
            >
              <i className="fa fa-trash"></i>
            </button>
          </div>
        ),
      });
    });
    return orders;
  };

  if (isLoading) return <Loader />;
  return (
    <AdminLayout>
      <MetaData title={"All Orders"} />
      <div>
        <h1 className="my-5">{data?.orders?.length} Orders</h1>
        <MDBDataTable data={setOrders()} className="px-3" bordered striped />
      </div>
    </AdminLayout>
  );
};

export default ListOrders;
