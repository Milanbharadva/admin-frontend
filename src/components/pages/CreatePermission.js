import React, { useState } from "react";
import {
  errorToast,
  getRoutePath,
  handleApiCall,
  successToast,
} from "../../global";
import { useNavigate } from "react-router-dom";
import Loader from "../common/Loader";

const CreatePermission = () => {
  const [adding, setAdding] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
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
      setAdding(true);
      const body = formdata;
      const onSuccess = (result) => {
        successToast(result.message);
        navigate(getRoutePath("permission"));
        setAdding(false);
      };
      const onError = (error) => {
        errorToast(error.message);
        setAdding(false);
      };
      handleApiCall({
        method: "POST",
        apiPath: "/permissions/create",
        body: body,
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
                  <h5 className="card-title">Create Permission</h5>
                  <div>
                    <button
                      type="button"
                      className="btn btn-primary text-nowrap d-flex gap-1 align-items-center mt-2"
                      onClick={() => {
                        navigate(getRoutePath("permission"));
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
                    <div className="mb-1">
                      <div className="col-12 d-sm-flex gap-3 align-items-center">
                        <label htmlFor="name" className="text-nowrap  col-2">
                          Permission Name
                        </label>
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
                          onClick={() => setErrors({})}
                          className="btn btn-secondary d-flex align-items-center gap-2"
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

export default CreatePermission;
