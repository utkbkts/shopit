import React, { useEffect } from "react";
import { useMyOrdersQuery } from "../redux/api/OrderApi";
import { toast } from "react-hot-toast";
import Loader from "../components/Loader";
import { MDBDataTable } from "mdbreact";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "../redux/features/CartSlice";
const MyOrders = () => {
  const { data, isLoading, error } = useMyOrdersQuery();
  const [searchParams] = useSearchParams();
  const orderSuccess = searchParams.get("order_success");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if (orderSuccess) {
      dispatch(clearCart());
      navigate("/me/orders");
    }
  }, [error, orderSuccess]);

  const setOrders = () => {
    const orders = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Amount",
          field: "amount",
          sort: "asc",
        },
        {
          label: "Payment Status",
          field: "status",
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
        amount: `${order?.totalAmount}`,
        status: order?.paymentInfo?.status?.toUpperCase(),
        orderStatus: order?.orderStatus,
        actions: (
          <>
            <Link to={`/order/${order?._id}`}>
              <i className="fa fa-eye"></i>
            </Link>
            <Link
              className="btn btn-success ms-2"
              to={`/invoice/order/${order?._id}`}
            >
              <i className="fa fa-print"></i>
            </Link>
          </>
        ),
      });
    });
    return orders;
  };

  if (isLoading) return <Loader />;
  return (
    <div>
      <h1 className="my-5">{data?.orders?.length} Orders</h1>
      <MDBDataTable data={setOrders()} className="px-3" bordered striped />
    </div>
  );
};

export default MyOrders;
