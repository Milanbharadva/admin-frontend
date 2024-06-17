import React, { useEffect, useState } from "react";
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
const CreateRole = () => {
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [errors, setErrors] = useState({});
  const handleInputChange = (e) => {
    const { name } = e.target;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };
  useEffect(() => {
    initSelect2();
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
    if (!Object.keys(Object.fromEntries(formdata)).includes("permissions[]")) {
      hasErrors = true;
      newErrors["permissions[]"] = "Please select any one permission ";
    }
    if (hasErrors) {
      setErrors(newErrors);
    } else {
      setAdding(true);
      const onSuccess = (result) => {
        successToast(result.message);
        navigate(getRoutePath("role"));
        setAdding(false);
      };
      const onError = (error) => {
        errorToast(error.message);
        setAdding(false);
      };
      handleApiCall({
        method: "POST",
        apiPath: "/roles/create",
        body: formdata,
        onSuccess: onSuccess,
        onError: onError,
      });
    }
  };
  return (
    <main id="main" className="main">
      <section className="section">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <h5 className="card-title">Create Role</h5>
                  <div>
                    <button
                      type="button"
                      className="btn btn-primary text-nowrap d-flex gap-1 align-items-center mt-2"
                      onClick={() => {
                        navigate(getRoutePath("role"));
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
                  <div className="row mt-3">
                    <div className="mb-2">
                      <div className="col-12 d-sm-flex gap-3 align-items-center">
                        <label htmlFor="name" className="text-nowrap  col-2">
                          Role Name
                        </label>
                        <div className="input-group has-validation">
                          <input
                            type="text"
                            onChange={handleInputChange}
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
                    <div>
                      <div className="col-12 d-sm-flex gap-3 align-items-center">
                        <label
                          htmlFor="permissionsSelect"
                          className="text-nowrap  col-2"
                        >
                          Permissions
                        </label>
                        <select
                          id="permissionsSelect"
                          className="form-select form-control"
                          multiple
                          data-control="select2"
                          data-ajax-preload={`${addBackendUrl("api/admin/permissions/all")}`}
                          name="permissions[]"
                        ></select>
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
                            initSelect2();
                            setErrors({});
                          }}
                        >
                          <i className="bi bi-arrow-counterclockwise"></i>Reset
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
    </main>
  );
};

export default CreateRole;
