import React from "react";
import UserLayout from "./UserLayout";
import logo from "../../src/images/user.png";
import { useSelector } from "react-redux";
const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <UserLayout>
      <div className="row justify-content-around mt-5 user-info">
        <div className="col-12 col-md-3">
          <div>
            <img
              src={user?.avatar ? user.avatar.url : logo}
              alt="avatar"
              className="rounded-circle img-fluid "
            />
          </div>
        </div>
        <div className="col-12 col-md-5">
          <h4>full name</h4>
          <p>{user?.name}</p>

          <h4>address</h4>
          <p>{user?.email}</p>

          <h4>joined out</h4>
          <p>{user?.createdAt.substring(0, 10)}</p>
        </div>
      </div>
    </UserLayout>
  );
};

export default Profile;
