import React, { useEffect, useRef, useState } from "react";
import {
  addBackendUrl,
  errorToast,
  getRoutePath,
  handleApiCall,
  successToast,
} from "../../global";
import { useNavigate } from "react-router-dom";
import Loader from "../common/Loader";
import { initSelect2 } from "../common/select2Init";
const CreateUser = () => {
  const [roleData, setRoleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const navigate = useNavigate();
  const handleInputChange = (e) => {
    const { name } = e.target;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };
  useEffect(() => {
    const onSuccess = (result) => {
      setRoleData(result.data);
      setLoading(false);
    };
    const onError = (error) => {
      setLoading(false);
      errorToast(error.message);
    };

    handleApiCall({
      method: "POST",
      apiPath: "/roles/list",
      onSuccess: onSuccess,
      onError: onError,
    });
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = document.getElementById(
      `form ${window.location.pathname.split("/").slice(2).join("-")}`
    );
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
    if (!Object.keys(Object.fromEntries(formdata)).includes("roles[]")) {
      hasErrors = true;
      newErrors["roles[]"] = "Please select any one Role ";
    }
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
      setAdding(true);
      const body = formdata;
      const onSuccess = (result) => {
        successToast(result.message);
        navigate(getRoutePath("users"));
        setAdding(false);
      };
      const onError = (error) => {
        const newErrors = {};
        let empty = false;
        error.error &&
          Object.keys(error.error).map((item) => {
            newErrors[item] = error.error[item][0];
            if (!empty) {
              document.getElementsByName(item)[0].focus();
              empty = true;
            }
          });
        errorToast(error.message);
        setErrors(newErrors);
        setAdding(false);
      };
      handleApiCall({
        method: "POST",
        apiPath: "/users/create",
        body: body,
        onSuccess: onSuccess,
        onError: onError,
      });
    }
  };
  const handleTogglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword((prevShowPassword) => !prevShowPassword);
      if (passwordRef.current) {
        passwordRef.current.focus();
      }
    } else if (field === "confirmPassword") {
      setShowConfirmPassword(
        (prevShowConfirmPassword) => !prevShowConfirmPassword
      );
      if (confirmPasswordRef.current) {
        confirmPasswordRef.current.focus();
      }
    }
  };

  useEffect(() => {
    if (!loading) initSelect2();
  }, [loading]);
  return (
    <main id="main" className="main">
      <section className="section">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <h5 className="card-title">Create User</h5>
                  <div>
                    <button
                      type="button"
                      className="btn btn-primary text-nowrap d-flex gap-1 align-items-center mt-2"
                      onClick={() => {
                        navigate(getRoutePath("users"));
                      }}
                    >
                      List
                      <i className="bi bi-list-task"></i>
                    </button>
                  </div>
                </div>
                <form
                  onSubmit={handleSubmit}
                  id={`form ${window.location.pathname
                    .split("/")
                    .slice(2)
                    .join("-")}`}
                  encType="multipart/form-data"
                >
                  <div className="row mt-3">
                    <div className="mb-2">
                      <div className="col-12 d-sm-flex gap-3 align-items-center">
                        <label htmlFor="name" className="text-nowrap  col-2">
                          Name
                        </label>
                        <div className="input-group has-validation">
                          <input
                            type="text"
                            name="name"
                            onChange={handleInputChange}
                            className={`form-control ${errors["name"] ? "is-invalid" : ""} `}
                            id="name"
                            placeholder="Enter Name"
                          />
                        </div>
                      </div>
                      <div className="d-flex">
                        <span className="col-2 me-3 d-none d-sm-block"></span>
                        {errors["name"] && (
                          <div className="text-danger">{errors["name"]}</div>
                        )}
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="col-12 d-sm-flex gap-3 align-items-center">
                        <label
                          htmlFor="username"
                          className="text-nowrap  col-2"
                        >
                          UserName
                        </label>
                        <div className="input-group">
                          <span className="input-group-text" id="basic-addon1">
                            @
                          </span>
                          <input
                            type="text"
                            name="username"
                            className={`form-control ${errors["username"] ? "is-invalid" : ""} `}
                            onChange={handleInputChange}
                            placeholder="Username"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                          />
                        </div>
                      </div>
                      <div className="d-flex">
                        <span className="col-2 me-3 d-none d-sm-block"></span>
                        {errors["username"] && (
                          <div className="text-danger">
                            {errors["username"]}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="col-12 d-sm-flex gap-3 align-items-center">
                        <label htmlFor="email" className="text-nowrap  col-2">
                          Email
                        </label>
                        <div className="input-group has-validation">
                          <input
                            type="email"
                            name="email"
                            onChange={handleInputChange}
                            className={`form-control ${errors["email"] ? "is-invalid" : ""} `}
                            id="email"
                            placeholder="Enter Email"
                          />
                        </div>
                      </div>
                      <div className="d-flex">
                        <span className="col-2 me-3 d-none d-sm-block"></span>
                        {errors["email"] && (
                          <div className="text-danger">{errors["email"]}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-12 d-sm-flex gap-3 align-items-center">
                      <label htmlFor="avatar" className="text-nowrap  col-2">
                        File Upload
                      </label>
                      <div className="input-group has-validation">
                        <input
                          className="form-control"
                          type="file"
                          id="avatar"
                          name="avatar"
                        />
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="col-12 mt-2 d-sm-flex gap-3 align-items-center">
                        <label htmlFor="phone" className="text-nowrap  col-2">
                          Phone Number
                        </label>
                        <div className="input-group has-validation">
                          <input
                            type="number"
                            name="phone"
                            onChange={handleInputChange}
                            className={`form-control ${errors["phone"] ? "is-invalid" : ""} `}
                            id="phone"
                            placeholder="Enter Phone Number"
                          />
                        </div>
                      </div>
                      <div className="d-flex">
                        <span className="col-2 me-3 d-none d-sm-block"></span>
                        {errors["phone"] && (
                          <div className="text-danger">{errors["phone"]}</div>
                        )}
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="col-12 d-sm-flex gap-3 align-items-center">
                        <label
                          htmlFor="password"
                          className="text-nowrap  col-2"
                        >
                          Password
                        </label>
                        <div className="input-group has-validation">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            onChange={handleInputChange}
                            ref={passwordRef}
                            className={`form-control ${errors["password"] ? "is-invalid" : ""} `}
                            id="password"
                            placeholder="Enter Password"
                            style={{
                              borderRadius: "0.5rem 0 0 0.5rem",
                            }}
                          />
                          <div className="input-group-append">
                            <span
                              className="input-group-text"
                              style={{
                                background: "transparent",
                                borderLeft: "none",
                                cursor: "pointer",
                                borderRadius: "0 0.5rem 0.5rem 0",
                              }}
                              onClick={() =>
                                handleTogglePasswordVisibility("password")
                              }
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
                      </div>
                      <div className="d-flex">
                        <span className="col-2 me-3 d-none d-sm-block"></span>
                        {errors["password"] && (
                          <div className="text-danger">
                            {errors["password"]}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="col-12 d-sm-flex gap-3 align-items-center">
                        <label
                          htmlFor="password_confirmation"
                          className="text-nowrap col-2"
                        >
                          Confirm Password
                        </label>
                        <div className="input-group has-validation">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="password_confirmation"
                            onChange={handleInputChange}
                            className={`form-control ${errors["password_confirmation"] ? "is-invalid" : ""} `}
                            id="password_confirmation"
                            ref={confirmPasswordRef}
                            placeholder="Enter Confirm Password"
                            style={{
                              borderRadius: "0.5rem 0 0 0.5rem",
                            }}
                          />
                          <div className="input-group-append">
                            <span
                              className="input-group-text"
                              style={{
                                background: "transparent",
                                borderLeft: "none",
                                cursor: "pointer",
                                borderRadius: "0 0.5rem 0.5rem 0",
                              }}
                              onClick={() =>
                                handleTogglePasswordVisibility(
                                  "confirmPassword"
                                )
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
                      </div>
                      <div className="d-flex">
                        <span className="col-2 me-3 d-none d-sm-block"></span>
                        {errors["password_confirmation"] && (
                          <div className="text-danger">
                            {errors["password_confirmation"]}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="col-12 d-sm-flex gap-3 align-items-center">
                        <label
                          htmlFor="rolesSelect"
                          className="text-nowrap  col-2"
                        >
                          Roles
                        </label>
                        <select
                          id="rolesSelect"
                          className="form-select form-control"
                          data-control="select2"
                          data-ajax-preload={`${addBackendUrl("api/admin/roles/all")}`}
                          name="roles[]"
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Select Role
                          </option>
                          {!loading &&
                            roleData.records != undefined &&
                            roleData.records.map((item) => (
                              <option value={item.id} key={item.id}>
                                {item.name}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="d-flex">
                        <span className="col-2 me-3 d-none d-sm-block"></span>
                        {errors["roles[]"] && (
                          <div className="text-danger">{errors["roles[]"]}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-end mt-2">
                      {adding ? (
                        <Loader />
                      ) : (
                        <div className="d-flex justify-content-end mb-1 gap-2">
                          <button
                            type="submit"
                            className="btn btn-primary d-flex align-items-center gap-2"
                          >
                            <i className="bi bi-send"></i>Submit
                          </button>
                          <button
                            type="reset"
                            className="btn btn-secondary d-flex align-items-center gap-2"
                            onClick={() => {
                              setShowPassword(false);
                              setShowConfirmPassword(false);
                              setErrors({});
                              initSelect2();
                            }}
                          >
                            <i className="bi bi-arrow-counterclockwise"></i>
                            Reset
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CreateUser;
