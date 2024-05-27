import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../redux/api/AuthApi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useGetUserQuery } from "../redux/api/userApi";
const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { email, name, password } = user;
  const { data } = useGetUserQuery();

  const [register, { isLoading, error, isSuccess }] = useRegisterMutation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if (isSuccess) {
      toast.success("Register successful!");
      navigate("/");
    }
  }, [error, isSuccess]);

  const submitHandler = (e) => {
    e.preventDefault();

    const registerData = {
      name,
      email,
      password,
    };
    register(registerData);
  };

  const onChangeUser = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form onSubmit={submitHandler} className="shadow rounded bg-body">
          <h2 className="mb-4">Register</h2>

          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="name"
              id="name_field"
              className="form-control"
              name="name"
              value={name}
              onChange={onChangeUser}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              id="email_field"
              className="form-control"
              name="email"
              value={email}
              onChange={onChangeUser}
            />
          </div>

          <div className="mb-3">
            <label for="password_field" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password_field"
              className="form-control"
              name="password"
              value={password}
              onChange={onChangeUser}
            />
          </div>

          <a href="/password/forgot" className="float-end mb-4">
            Forgot Password?
          </a>

          <button
            id="register_button"
            type="submit"
            className="btn w-100 py-2"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Register"}
          </button>
          <div className="my-3">
            <Link to="/login" className="float-end">
              Do you have an account ?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
