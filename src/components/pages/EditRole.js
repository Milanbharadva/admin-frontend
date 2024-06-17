import React, { useEffect, useRef, useState } from "react";
import {
  addBackendUrl,
  errorToast,
  getRoutePath,
  handleApiCall,
  successToast,
} from "../../global";
import { initSelect2 } from "../common/select2Init";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Loader from "../common/Loader";

const EditRole = () => {
  const { id } = useParams();
  const location = useLocation();

  const [roleData, setRoleData] = useState({ name: "", permissions: [] });
  const [loadingRole, setLoadingRole] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errors, setErrors] = useState({});
  const initialRoleData = useRef({ name: "", permissions: [] });

  useEffect(() => {
    initialRoleData.current = { ...roleData };
  }, [roleData]);

  useEffect(() => {
    initSelect2();
    fetchData();
  }, [loadingRole]);

  const navigate = useNavigate();
  const fetchData = () => {
    const onSuccess = (result) => {
      setRoleData(result.data);
      setLoadingRole(false);
    };
    const onError = (error) => {
      errorToast(error.message);
      navigate(getRoutePath("roles"));
      setLoadingRole(false);
    };
    handleApiCall({
      method: "GET",
      apiPath: `/roles/detail/${id}`,
      onSuccess: onSuccess,
      onError: onError,
    });
  };

  const handleInputChange = (e) => {
    const { name } = e.target;
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };
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
    if (!Object.keys(Object.fromEntries(formdata)).includes("permissions[]")) {
      hasErrors = true;
      newErrors["permissions[]"] = "Please select any one permission ";
    }
    if (hasErrors) {
      setErrors(newErrors);
    } else {
      setUpdating(true);
      const onSuccess = (result) => {
        successToast(result.message);
        if (location.state) {
          if (location.state.prevPath.split("?").length > 1) {
            navigate(
              getRoutePath(`roles?${location.state.prevPath.split("?")[1]}`),
              {
                state: { scrollY: location.state.scrollY },
              }
            );
          } else {
            navigate(getRoutePath("roles"));
          }
        } else {
          navigate(getRoutePath("roles"));
        }
      };
      const onError = (error) => {
        errorToast(error.message);
        setUpdating(true);
      };

      handleApiCall({
        method: "POST",
        apiPath: `/roles/update/${id}`,
        body: formdata,
        onSuccess: onSuccess,
        onError: onError,
      });
      setUpdating(false);
    }
  };

  return (
    <main id="main" className="main">
      {loadingRole ? (
        <Loader height="90vh" />
      ) : (
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <h5 className="card-title">Edit Role</h5>
                    <div>
                      <button
                        type="button"
                        className="btn btn-primary text-nowrap d-flex gap-1 align-items-center mt-2"
                        onClick={() => {
                          if (location.state) {
                            if (location.state.prevPath.split("?").length > 1) {
                              navigate(
                                getRoutePath(
                                  `roles?${location.state.prevPath.split("?")[1]}`
                                ),
                                { state: { scrollY: location.state.scrollY } }
                              );
                            } else {
                              navigate(getRoutePath("roles"));
                            }
                          } else {
                            navigate(getRoutePath("roles"));
                          }
                        }}
                      >
                        List
                        <i className="bi bi-list-task"></i>
                      </button>
                    </div>
                  </div>
                  <form
                    id={`form ${window.location.pathname.split("/").slice(2).join("-")}`}
                    encType="multipart/form-data"
                    onSubmit={handleSubmit}
                  >
                    <div className="row mb-3 mt-3">
                      <div className="mb-2">
                        <div className="col-12 d-sm-flex gap-3 align-items-center">
                          <label htmlFor="name" className="text-nowrap  col-2">
                            Role Name
                          </label>
                          <div className="input-group has-validation">
                            <input
                              type="text"
                              name="name"
                              defaultValue={roleData.name}
                              className={`form-control ${errors["name"] ? "is-invalid" : ""} `}
                              id="name"
                              onChange={handleInputChange}
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
                            htmlFor="inputPermissions"
                            className="text-nowrap  col-2"
                          >
                            Permissions
                          </label>
                          <select
                            className="form-select"
                            multiple
                            id="inputPermissions"
                            data-control="select2"
                            data-value={roleData.permissions
                              .map((item) => item.id)
                              .toString()}
                            data-ajax-preload={`${addBackendUrl("api/admin/permissions/all")}`}
                            name="permissions[]"
                          >
                            {roleData.permissions.map((item) => (
                              <option value={item.id} key={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="d-flex">
                        <span className="col-2 me-3 d-none d-sm-block"></span>
                        {errors["permissions[]"] && (
                          <div className="text-danger">
                            {errors["permissions[]"]}
                          </div>
                        )}
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
                              setErrors({});
                              initSelect2(true);
                            }}
                          >
                            <i className="bi bi-arrow-counterclockwise"></i>
                            Reset
                          </button>
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default EditRole;
