import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUpdateProfileMutation } from "../redux/api/userApi";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import UserLayout from "../pages/UserLayout";
const UpdateUserProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading, error, isSuccess }] =
    useUpdateProfileMutation();
  useEffect(() => {
    if (user) {
      setName(user?.name);
      setEmail(user?.email);
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message || "An error occurred");
    }
    if (isSuccess) {
      toast.success("User Updated");
      navigate("/me/profile");
    }
  }, [error, isSuccess, navigate]);

  const SubmitHandler = (e) => {
    e.preventDefault();

    const userData = {
      name,
      email,
    };
    updateProfile(userData);
  };
  return (
    <UserLayout>
      <div class="row wrapper">
        <div class="col-10 col-lg-8">
          <form class="shadow rounded bg-body" onSubmit={SubmitHandler}>
            <h2 class="mb-4">Update Profile</h2>

            <div class="mb-3">
              <label for="name_field" class="form-label">
                {" "}
                Name{" "}
              </label>
              <input
                type="text"
                id="name_field"
                class="form-control"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div class="mb-3">
              <label for="email_field" class="form-label">
                {" "}
                Email{" "}
              </label>
              <input
                type="email"
                id="email_field"
                class="form-control"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn update-btn w-100"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
      </div>
    </UserLayout>
  );
};

export default UpdateUserProfile;
