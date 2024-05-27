import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  useGetUserDetailsQuery,
  useUpdateUserDetailsMutation,
} from "../../redux/api/userApi";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const UpdateUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const params = useParams();
  const { data } = useGetUserDetailsQuery(params?.id);
  const [updateUser, { error, isSuccess }] = useUpdateUserDetailsMutation();
  const navigate = useNavigate();
  useEffect(() => {
    if (data?.user) {
      setName(data?.user?.name);
      setEmail(data?.user?.email);
      setRole(data?.user?.role);
    }
    if (error) {
      toast.error(error?.data?.message);
    }
    if (isSuccess) {
      toast.success("Updated Successfull");
      navigate("/admin/users");
    }
  }, [data, error, isSuccess]);
  const submitHandler = (e) => {
    e.preventDefault();

    const userData = { name, email, role };
    updateUser({ id: params?.id, body: userData });
  };
  return (
    <AdminLayout>
      <div className="container">
        <div className="row">
          <div className="col-10 col-lg-10 mt-5 mt-lg-0">
            <form
              onSubmit={submitHandler}
              className="shadow rounded bg-body p-4"
            >
              <h2>Edit User</h2>
              <div>
                <label htmlFor="name_field" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  id="name_field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="email_field" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  id="email_field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="role_field" className="form-label">
                  Role
                </label>
                <select
                  id="role_field"
                  className="form-select"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </div>
              <button type="submit" className="btn update-btn w-100 py-2">
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UpdateUser;
