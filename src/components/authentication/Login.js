import React, { useEffect, useState } from "react";
import {
  adminName,
  errorToast,
  getLocalStorage,
  getRoutePath,
  handleApiCall,
  logoPath,
  setLocalStorage,
  successToast,
} from "../../global";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../common/Loader";

const Login = () => {
  useEffect(() => {
    if (getLocalStorage("token")) {
      navigate(getRoutePath("dashboard"));
    }
  }, []);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({ ...errors, [name]: "" });
  };
  function getUserDetail() {
    const onSuccess = (result) => {
      setLocalStorage("userData", JSON.stringify(result.data));
      setTimeout(() => {
        navigate(getRoutePath("dashboard"));
        setLoading(false);
      }, 200);
    };
    const onError = (error) => {
      errorToast(error.message);
    };
    handleApiCall({
      method: "GET",
      apiPath: "/auth-profile",
      onSuccess: onSuccess,
      onError: onError,
    });
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = document.getElementById("form");
    const formdata = new FormData(form);
    const newErrors = {};
    let hasErrors = false;
    for (const [key, value] of Object.entries(formData)) {
      if (!value) {
        newErrors[key] = "This field is required.";
        hasErrors = true;
      }
    }
    if (hasErrors) {
      setErrors(newErrors);
    } else {
      setLoading(true);
      const onSuccess = (result) => {
        successToast(`LogIn Successfully`);
        setLocalStorage("token", result.token);
        getUserDetail();
      };
      const onError = (error) => {
        errorToast(error.message);
        setLoading(false);
      };
      handleApiCall({
        method: "POST",
        apiPath: "/login",
        body: formdata,
        onSuccess: onSuccess,
        onError: onError,
      });
    }
  };
  return (
    <main>
      <div className="container">
        <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                <div className="d-flex justify-content-center py-4">
                  <Link
                    to={"dashboard"}
                    className="logo d-flex align-items-center w-auto"
                  >
                    <img src={logoPath} alt="" />
                    <span className="d-none d-lg-block">{adminName}</span>
                  </Link>
                </div>
                <div className="card mb-3">
                  <div className="card-body">
                    <div className="pt-4 pb-2">
                      <h5 className="card-title text-center pb-0 fs-4">
                        Login to Your Account
                      </h5>
                      <p className="text-center small">
                        Enter your username & password to login
                      </p>
                    </div>
                    <form
                      className="row g-3 needs-validation"
                      noValidate
                      onSubmit={handleSubmit}
                      id="form"
                    >
                      <div className="col-12">
                        <label htmlFor="username" className="form-label">
                          Username
                        </label>
                        <div className="input-group has-validation">
                          <span
                            className="input-group-text"
                            id="inputGroupPrepend"
                          >
                            @
                          </span>
                          <input
                            type="text"
                            name="username"
                            value={formData["username"]}
                            onChange={handleInputChange}
                            className="form-control"
                            id="username"
                            required
                          />
                        </div>
                        {errors["username"] && (
                          <div className="text-danger">
                            {errors["username"]}
                          </div>
                        )}
                      </div>

                      <div className="col-12">
                        <label htmlFor="password" className="form-label">
                          Password
                        </label>
                        <input
                          type="password"
                          value={formData["password"]}
                          onChange={handleInputChange}
                          name="password"
                          className="form-control"
                          id="password"
                          required
                        />
                        {errors["password"] && (
                          <div className="invalid-feedback">
                            Please enter your password!
                          </div>
                        )}
                      </div>

                      <div className="col-12  ">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="remember"
                            value="true"
                            id="rememberMe"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="rememberMe"
                          >
                            Remember me
                          </label>
                        </div>
                      </div>
                      <div className="col-12 text-center">
                        {loading ? (
                          <Loader />
                        ) : (
                          <button
                            className="btn btn-primary w-100"
                            type="submit"
                          >
                            Login
                          </button>
                        )}
                      </div>
                      <div className="col-12">
                        <p className="small mb-0">
                          Don't remember the password ?
                          <Link to={"forget-password"}>Forgot Password</Link>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
