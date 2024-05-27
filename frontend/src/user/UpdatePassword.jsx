import React, { useEffect, useState } from "react";
import { useUpdatePasswordMutation } from "../redux/api/userApi";
import UserLayout from "../pages/UserLayout";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();
  const [updatePassword, { isLoading, error, isSuccess }] =
    useUpdatePasswordMutation();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message || "An error occurred");
    }
    if (isSuccess) {
      toast.success("Password Updated");
      navigate("/me/profile");
    }
  }, [error, isSuccess, navigate]);

  const SubmitHandler = (e) => {
    e.preventDefault();

    const userData = {
      oldPassword,
      password,
    };
    updatePassword(userData);
  };
  return (
    <UserLayout>
      {" "}
      <div className="row wrapper">
        <div className="col-10 col-lg-8">
          <form onSubmit={SubmitHandler} className="shadow rounded bg-body">
            <h2 className="mb-4">Update Password</h2>
            <div className="mb-3">
              <label htmlFor="old_password_field" className="form-label">
                Old Password
              </label>
              <input
                type="password"
                id="old_password_field"
                className="form-control"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="new_password_field" className="form-label">
                New Password
              </label>
              <input
                type="password"
                id="new_password_field"
                className="form-control"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn update-btn w-100"
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
      </div>
    </UserLayout>
  );
};

export default UpdatePassword;
