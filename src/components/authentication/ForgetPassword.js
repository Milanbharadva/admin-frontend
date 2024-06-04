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

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
  });
  useEffect(() => {
    if (getLocalStorage("token")) {
      navigate(getRoutePath("dashboard"));
    }
  }, []);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({ ...errors, [name]: "" });
  };

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
        successToast(result.message);
        setLocalStorage("email-forget", formdata.get("email"));
        setLoading(false);
        navigate(getRoutePath("reset-password"));
      };
      const onError = (error) => {
        errorToast(error.message);
        setLoading(false);
      };
      handleApiCall({
        method: "POST",
        apiPath: "/forgot-password",
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
                        Forget Password Of Your Account
                      </h5>
                      <p className="text-center small">
                        Enter your email to forget password
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
                            onChange={handleInputChange}
                            className="form-control"
                            id="email"
                            required
                          />
                          {errors["email"] && (
                            <div className="invalid-feedback">
                              Please enter your email.
                            </div>
                          )}
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

export default ForgetPassword;
