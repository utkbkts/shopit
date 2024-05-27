import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import Loader from "../Loader.jsx";
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout.jsx";
import MetaData from "../../layouts/Helmet.jsx";

import {
  useDeleteUserMutation,
  useGetAdminUsersQuery,
} from "../../redux/api/userApi.js";

const ListUsers = () => {
  const { data, isLoading, error } = useGetAdminUsersQuery();

  const [
    deleteUser,
    { error: deleteError, isloading: isErrorLoading, isSuccess },
  ] = useDeleteUserMutation();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if (deleteError) {
      toast.error(deleteError?.data?.message);
    }
    if (isSuccess) {
      toast.success("Deletes is successfull");
    }
  }, [error, deleteError, isSuccess]);

  const deleteHandler = (id) => {
    deleteUser(id);
  };

  const setUsers = () => {
    const users = {
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
          label: "Email",
          field: "email",
          sort: "asc",
        },
        {
          label: "Role",
          field: "role",
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
    data?.users?.forEach((user) => {
      users.rows.push({
        id: user?._id,
        name: user?.name,
        email: user?.email,
        role: user?.role,
        actions: (
          <div className="d-flex">
            <Link
              to={`/admin/users/${user?._id}`}
              className="btn btn-outline-primary"
            >
              <i className="fa fa-pencil"></i>
            </Link>
            <button
              onClick={() => deleteHandler(user?._id)}
              className="btn btn-outline-success ms-2"
            >
              <i className="fa fa-trash"></i>
            </button>
          </div>
        ),
      });
    });
    return users;
  };

  if (isLoading) return <Loader />;
  return (
    <AdminLayout>
      <MetaData title={"All Users"} />
      <div>
        <h1 className="my-5">{data?.users?.length} Users</h1>
        <MDBDataTable data={setUsers()} className="px-3" bordered striped />
      </div>
    </AdminLayout>
  );
};

export default ListUsers;
