import React, { useEffect, useRef, useState } from "react";
import {
  errorToast,
  getRoutePath,
  handleApiCall,
  successToast,
} from "../../global";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Loader from "../common/Loader";

const EditPermission = () => {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [updating, setUpdating] = useState(false);
  const [errors, setErrors] = useState({});
  const [permissionData, setpermissionData] = useState();
  const [loading, setLoading] = useState(true);
  const initialRoleData = useRef({ name: "", permissions: [] });

  useEffect(() => {
    initialRoleData.current = { ...permissionData };
  }, [permissionData]);

  useEffect(() => {
    const onSuccess = (result) => {
      setpermissionData(result.data);
      setLoading(false);
    };
    const onError = (error) => {
      errorToast(error.message);
      setLoading(false);
      navigate(getRoutePath("permission"));
    };

    handleApiCall({
      method: "GET",
      apiPath: `/permissions/detail/${id}`,
      onSuccess: onSuccess,
      onError: onError,
    });
  }, []);
  const handleInputChange = (e) => {
    const { name } = e.target;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
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
    if (hasErrors) {
      setErrors(newErrors);
    } else {
      setUpdating(true);
      const onSuccess = (result) => {
        successToast(result.message);
        if (location.state && location.state.prevPath.split("?").length > 1) {
          navigate(-1);
        } else {
          navigate(getRoutePath("permission"));
        }
      };
      const onError = (error) => {
        errorToast(error.message);
        setUpdating(true);
      };
      handleApiCall({
        method: "POST",
        apiPath: `/permissions/update/${id}`,
        body: formdata,
        onSuccess: onSuccess,
        onError: onError,
      });
      setUpdating(false);
    }
  };

  return (
    <main id="main" className="main">
      {loading ? (
        <Loader height="90vh" />
      ) : (
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <h5 className="card-title">Edit Permission</h5>
                    <div>
                      <button
                        type="button"
                        className="btn btn-primary text-nowrap d-flex gap-1 align-items-center mt-2"
                        onClick={() => {
                          if (
                            location.state &&
                            location.state.prevPath.split("?").length > 1
                          ) {
                            navigate(-1);
                          } else {
                            navigate(getRoutePath("permission"));
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
                          <input
                            type="text"
                            onChange={handleInputChange}
                            defaultValue={
                              permissionData ? permissionData.name : ""
                            }
                            name="name"
                            className={`form-control ${errors["name"] ? "is-invalid" : ""} `}
                            id="name"
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
                              setpermissionData({
                                ...initialRoleData.current,
                              });
                              setErrors({});
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

export default EditPermission;
