import React, { useEffect, useState } from "react";
import {
  adminName,
  errorToast,
  getLocalStorage,
  getRoutePath,
  handleApiCall,
  logoPath,
  removeLocalStorage,
  successToast,
} from "../../global";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../common/Loader";

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const handleInputChange = (e) => {
    const { name } = e.target;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  useEffect(() => {
    if (getLocalStorage("token")) {
      navigate(getRoutePath("dashboard"));
    }
    if (!getLocalStorage("email-forget")) {
      navigate(getRoutePath("forget-password"));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = document.getElementById("form");
    const formdata = new FormData(form);
    const newErrors = {};
    let hasErrors = false;
    let firstEmptyFieldFocused = false;

    formdata.forEach((value, key) => {
      if (!value) {
        newErrors[key] = "This field is required.";
        hasErrors = true;
        if (!firstEmptyFieldFocused) {
          document.getElementsByName(key)[0].focus();
          firstEmptyFieldFocused = true;
        }
      }
    });

    if (formdata.get("password").length < 8) {
      newErrors["password"] = "Password must be at least 8 characters long.";
      hasErrors = true;
    }

    if (
      formdata.get("password").length >= 8 &&
      formdata.get("password") !== formdata.get("password_confirmation")
    ) {
      newErrors["password_confirmation"] =
        "Both Password And Confirm Password Should match";
      hasErrors = true;
    }
    if (hasErrors) {
      setErrors(newErrors);
    } else {
      setLoading(true);
      const body = formdata;
      const onSuccess = (result) => {
        successToast(result.message);
        removeLocalStorage("email-forget");
        setLoading(false);
        navigate(getRoutePath("login"));
      };
      const onError = (error) => {
        const newErrors = {};
        let empty = false;
        errorToast(error.message);
        error.error &&
          Object.keys(error.error).map((item) => {
            newErrors[item] = error.error[item][0];
            if (!empty) {
              document.getElementsByName(item)[0].focus();
              empty = true;
            }
          });
        setErrors(newErrors);
        setLoading(false);
      };
      handleApiCall({
        method: "POST",
        apiPath: "/reset-password",
        body: body,
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
                        Reset Password Of Your Account
                      </h5>
                      <p className="text-center small">
                        Enter your email to reset password
                      </p>
                    </div>
                    <form
                      className="row g-3 needs-validation"
                      noValidate
                      onSubmit={handleSubmit}
                      id="form"
                    >
                      <div className="col-12">
                        <label htmlFor="email" className="form-label">
                          Email
                        </label>
                        <div className="input-group has-validation">
                          <input
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            onChange={handleInputChange}
                            value={getLocalStorage("email-forget") || ""}
                            className="form-control"
                            id="email"
                            required
                          />
                        </div>
                        {errors["email"] && (
                          <div className="text-danger">{errors["email"]} </div>
                        )}
                      </div>
                      <div className="col-12">
                        <label htmlFor="otp" className="form-label">
                          OTP
                        </label>
                        <div className="input-group has-validation">
                          <input
                            type="number"
                            name="otp"
                            onChange={handleInputChange}
                            className="form-control"
                            id="otp"
                            placeholder="Enter OTP"
                            required
                          />
                        </div>
                        {errors["otp"] && (
                          <div className="text-danger">{errors["otp"]} </div>
                        )}
                      </div>
                      <div className="col-12">
                        <label htmlFor="password" className="form-label">
                          Password
                        </label>
                        <div className="input-group has-validation">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            onChange={handleInputChange}
                            className="form-control"
                            id="password"
                            placeholder="Enter Password"
                            style={{
                              borderRadius: "0.5rem 0 0 0.5rem",
                              borderRight: 0,
                            }}
                          />
                          <div className="input-group-append">
                            <span
                              className="input-group-text"
                              style={{
                                background: "transparent",
                                border: "none",
                                cursor: "pointer",
                              }}
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              <i
                                className={
                                  !showPassword
                                    ? "bi bi-eye"
                                    : "bi bi-eye-slash-fill"
                                }
                                style={{ fontSize: "1.2rem" }}
                              ></i>
                            </span>
                          </div>
                        </div>
                        {errors["password"] && (
                          <div className="text-danger">
                            {errors["password"]}
                          </div>
                        )}
                      </div>

                      <div className="col-12">
                        <label
                          htmlFor="password_confirmation"
                          className="form-label"
                        >
                          Confirm Password
                        </label>
                        <div className="input-group has-validation">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="password_confirmation"
                            onChange={handleInputChange}
                            className="form-control"
                            id="password_confirmation"
                            placeholder="Enter Confirm Password"
                            style={{
                              borderRadius: "0.5rem 0 0 0.5rem",
                              borderRight: 0,
                            }}
                          />
                          <div className="input-group-append">
                            <span
                              className="input-group-text"
                              style={{
                                background: "transparent",
                                border: "none",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              <i
                                className={
                                  !showConfirmPassword
                                    ? "bi bi-eye"
                                    : "bi bi-eye-slash-fill"
                                }
                                style={{ fontSize: "1.2rem" }}
                              ></i>
                            </span>
                          </div>
                        </div>
                        {errors["password_confirmation"] && (
                          <div className="text-danger">
                            {errors["password_confirmation"]}
                          </div>
                        )}
                      </div>
                      <div className="col-12 text-center">
                        {loading ? (
                          <Loader />
                        ) : (
                          <button
                            className="btn btn-primary w-100"
                            type="submit"
                          >
                            Forget Password
                          </button>
                        )}
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

export default ResetPassword;
