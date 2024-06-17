import React, { useEffect, useState } from "react";
import {
  addBackendUrl,
  errorToast,
  getRoutePath,
  handleApiCall,
  successToast,
} from "../../global";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Loader from "../common/Loader";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { initSelect2 } from "../common/select2Init";
const EditUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [roleData, setRoleData] = useState([]);
  const [userData, setUserData] = useState();
  const [copyUserData, setCopyUserData] = useState();
  const [loading, setLoading] = useState(true);
  const [loadingRole, setLoadingRole] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errors, setErrors] = useState({});
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserData((prev) => ({
          ...prev,
          [name]: event.target.result,
        }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setUserData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  useEffect(() => {
    const onSuccess = (result) => {
      setUserData(result.data);
      setCopyUserData({ ...result.data });
      setLoading(false);
    };
    const onError = (error) => {
      setLoading(false);
      errorToast(error.message);
      navigate(getRoutePath("user"));
    };

    handleApiCall({
      method: "GET",
      apiPath: `/users/detail/${id}`,
      onSuccess: onSuccess,
      onError: onError,
    });
    const onSuccess2 = (result) => {
      setRoleData(result.data);
      setLoadingRole(false);
    };
    const onError2 = (error) => {
      setLoadingRole(false);
      errorToast(error.message);
    };
    setLoading(true);
    handleApiCall({
      method: "POST",
      apiPath: `/roles/list`,
      onSuccess: onSuccess2,
      onError: onError2,
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
    if (hasErrors) {
      setErrors(newErrors);
    } else {
      setUpdating(true);
      const onSuccess = (result) => {
        successToast(result.message);
        if (location.state && location.state.prevPath.split("?").length > 1) {
          navigate(-1);
        } else {
          navigate(getRoutePath("user"));
        }
      };
      const onError = (error) => {
        errorToast(error.message);
      };
      handleApiCall({
        method: "POST",
        apiPath: `/users/update/${id}`,
        body: formdata,
        onSuccess: onSuccess,
        onError: onError,
      });
      setUpdating(false);
    }
  };
  useEffect(() => {
    if (!loading) {
      initSelect2();
    }
  }, [loading]);
  return (
    <main id="main" className="main">
      <section className="section">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <h5 className="card-title">Edit User</h5>
                  <div>
                    <button
                      type="button"
                      className="btn btn-primary text-nowrap d-flex gap-1 align-items-center mt-2"
                      onClick={() => {
                        if (location.state.prevPath.split("?").length > 1) {
                          navigate(-1);
                        } else {
                          navigate(getRoutePath("user"));
                        }
                      }}
                    >
                      List
                      <i className="bi bi-list-task"></i>
                    </button>
                  </div>
                </div>
                {!loading && (
                  <form
                    onSubmit={handleSubmit}
                    id={`form ${window.location.pathname.split("/").slice(2).join("-")}`}
                    encType="multipart/form-data"
                  >
                    <div className="row mb-3 mt-3">
                      <div className="mb-2">
                        <div className="col-12 d-sm-flex gap-3 align-items-center">
                          <label htmlFor="name" className="text-nowrap  col-2">
                            Name
                          </label>
                          <div className="input-group has-validation">
                            <input
                              type="text"
                              name="name"
                              value={userData.name}
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
                            <span
                              className="input-group-text"
                              id="basic-addon1"
                            >
                              @
                            </span>
                            <input
                              type="text"
                              name="username"
                              className={`form-control ${errors["username"] ? "is-invalid" : ""} `}
                              onChange={handleInputChange}
                              value={userData.username}
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
                        <div className="col-12 d-sm-flex  gap-3 align-items-center">
                          <label htmlFor="email" className="text-nowrap  col-2">
                            Email
                          </label>
                          <div className="input-group has-validation">
                            <input
                              type="email"
                              name="email"
                              value={userData.email}
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
                      <div className="col-12 mb-2 d-sm-flex gap-3 align-items-center">
                        <label
                          htmlFor="avatar"
                          className="text-nowrap align-self-start col-2 mt-2"
                        >
                          File Upload
                        </label>
                        <div className="input-group has-validation d-flex flex-column">
                          <input
                            className="form-control"
                            type="file"
                            id="avatar"
                            style={{
                              width: "auto",
                            }}
                            onChange={handleInputChange}
                            name="avatar"
                          />
                          {userData.avatar &&
                          typeof userData.avatar === "string" ? (
                            <LazyLoadImage
                              alt="image alternative"
                              src={userData.avatar}
                              effect="blur"
                              height={"200px"}
                              width={"200px"}
                              style={{ objectFit: "contain" }}
                              onError={(e) =>
                                (e.target.src = `${process.env.PUBLIC_URL}/assets/img/no-image-found.png`)
                              }
                            />
                          ) : userData.avatar &&
                            userData.avatar instanceof File ? (
                            <LazyLoadImage
                              alt="image alternative"
                              src={URL.createObjectURL(userData.avatar)}
                              effect="blur"
                              height={"200px"}
                              width={"200px"}
                              style={{
                                objectFit: "contain",
                              }}
                              onError={(e) =>
                                (e.target.src = `${process.env.PUBLIC_URL}/assets/img/no-image-found.png`)
                              }
                            />
                          ) : null}
                        </div>
                      </div>

                      <div className="mb-2">
                        <div className="col-12 mb-2 d-sm-flex  gap-3 align-items-center">
                          <label htmlFor="phone" className="text-nowrap  col-2">
                            Phone Number
                          </label>
                          <div className="input-group has-validation">
                            <input
                              type="number"
                              name="phone"
                              onChange={handleInputChange}
                              value={userData.phone}
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
                        <div className="mb-2">
                          <div className="col-12 d-sm-flex gap-3 align-items-center">
                            <label
                              htmlFor="inputPermissions"
                              className="text-nowrap  col-2"
                            >
                              Roles
                            </label>
                            <select
                              id="rolesSelect"
                              className="form-select form-control"
                              data-control="select2"
                              data-value={
                                Array.isArray(userData.roles)
                                  ? userData.roles[0].id
                                  : userData.roles.id
                              }
                              data-ajax-preload={`${addBackendUrl("api/admin/roles/all")}`}
                              name="roles[]"
                            >
                              {!loadingRole &&
                                roleData &&
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
                              <div className="text-danger">
                                {errors["role"]}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-end">
                        {updating ? (
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
                                setUserData(copyUserData);
                                setErrors({});
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
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default EditUser;
