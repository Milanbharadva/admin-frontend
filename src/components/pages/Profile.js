import { useEffect, useState } from "react";
import { errorToast, handleApiCall, successToast } from "../../global";
import Loader from "../common/Loader";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  useEffect(() => {
    const onSuccess = (result) => {
      setUserData(result.data);
      setLoading(false);
    };
    const onError = (error) => {
      errorToast(error.message);
      setLoading(false);
    };
    handleApiCall({
      method: "GET",
      apiPath: "/auth-profile",
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
    if (hasErrors) {
      setErrors(newErrors);
    } else {
      // setUpdating(true);
      const onSuccess = (result) => {
        successToast(result.message);
      };
      const onError = (error) => {
        errorToast(error.message);
      };
      handleApiCall({
        method: "POST",
        apiPath: `/users/update/${userData.id}`,
        body: formdata,
        onSuccess: onSuccess,
        onError: onError,
      });
    }
  };
  const handlePasswordChange = (e) => {
    e.preventDefault();
    const form = document.getElementById(
      `form ${window.location.pathname.split("/").slice(2).join("-")} password`
    );
    const formdata = new FormData(form);
    const newErrors = {};
    let hasErrors = false;
    let firstEmptyFieldFocused = false;

    formdata.forEach((value, key) => {
      if (!value) {
        console.log(key);
        newErrors[key] = "This field is required.";
        hasErrors = true;
        if (!firstEmptyFieldFocused) {
          document.getElementsByName(key)[0].focus();
          firstEmptyFieldFocused = true;
        }
      }
    });
    if (formdata.get("newpassword") !== formdata.get("renewpassword")) {
      newErrors["renewpassword"] =
        "Password and confirm password should be same";
      hasErrors = true;
    }
    if (hasErrors) {
      setErrors(newErrors);
    } else {
      // setUpdating(true);
      const onSuccess = (result) => {
        successToast(result.message);
      };
      const onError = (error) => {
        errorToast(error.message);
      };
      handleApiCall({
        method: "POST",
        apiPath: `/users/update/${userData.id}`,
        body: formdata,
        onSuccess: onSuccess,
        onError: onError,
      });
    }
  };
  return (
    <>
      {loading ? (
        <Loader height="100vh" />
      ) : userData != null ? (
        <main id="main" className="main">
          <section className="section profile">
            <div className="row">
              <div className="col-xl-4">
                <div className="card">
                  <div className="card-body profile-card pt-4 d-flex flex-column align-items-center">
                    {userData.avatar ? (
                      <LazyLoadImage
                        alt="Profile"
                        src={userData.avatar}
                        effect="blur"
                        height={"150px"}
                        width={"150px"}
                        style={{ objectFit: "contain" }}
                        onError={(e) =>
                          (e.target.src = `${process.env.PUBLIC_URL}/assets/img/no-image-found.png`)
                        }
                      />
                    ) : (
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/img/profile-img.jpg`}
                        alt="Profile"
                        className="rounded-circle"
                      />
                    )}
                    <h2>{userData.username}</h2>
                    <h3>
                      {Array.isArray(userData.roles)
                        ? userData.roles.map((item) => item.name).join(" , ")
                        : userData.roles.name}
                    </h3>
                    <div className="social-links mt-2">
                      <a href="#" className="twitter">
                        <i className="bi bi-twitter"></i>
                      </a>
                      <a href="#" className="facebook">
                        <i className="bi bi-facebook"></i>
                      </a>
                      <a href="#" className="instagram">
                        <i className="bi bi-instagram"></i>
                      </a>
                      <a href="#" className="linkedin">
                        <i className="bi bi-linkedin"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-8">
                <div className="card">
                  <div className="card-body pt-3">
                    <ul className="nav nav-tabs nav-tabs-bordered">
                      <li className="nav-item">
                        <button
                          className="nav-link active"
                          data-bs-toggle="tab"
                          data-bs-target="#profile-overview"
                        >
                          Overview
                        </button>
                      </li>

                      <li className="nav-item">
                        <button
                          className="nav-link"
                          data-bs-toggle="tab"
                          data-bs-target="#profile-edit"
                        >
                          Edit Profile
                        </button>
                      </li>

                      <li className="nav-item">
                        <button
                          className="nav-link"
                          data-bs-toggle="tab"
                          data-bs-target="#profile-settings"
                        >
                          Settings
                        </button>
                      </li>

                      <li className="nav-item">
                        <button
                          className="nav-link"
                          data-bs-toggle="tab"
                          data-bs-target="#profile-change-password"
                        >
                          Change Password
                        </button>
                      </li>
                    </ul>
                    <div className="tab-content pt-2">
                      <div
                        className="tab-pane fade show active profile-overview"
                        id="profile-overview"
                      >
                        <h5 className="card-title">Profile Details</h5>

                        <div className="row">
                          <div className="col-lg-3 col-md-4 label ">
                            Full Name
                          </div>
                          <div className="col-lg-9 col-md-8">
                            {userData.name}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-3 col-md-4 label">Phone</div>
                          <div className="col-lg-9 col-md-8">
                            {userData.phone}
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-lg-3 col-md-4 label">Email</div>
                          <div className="col-lg-9 col-md-8">
                            {userData.email}
                          </div>
                        </div>
                      </div>

                      <div
                        className="tab-pane fade profile-edit pt-3"
                        id="profile-edit"
                      >
                        <form
                          id={`form ${window.location.pathname.split("/").slice(2).join("-")}`}
                          onSubmit={handleSubmit}
                        >
                          <div className="row mb-3">
                            <label
                              htmlFor="profileImage"
                              className="col-md-4 col-lg-3 col-form-label"
                            >
                              Profile Image
                            </label>
                            <div className="col-md-8 col-lg-9">
                              {userData.avatar ? (
                                <LazyLoadImage
                                  alt="Profile"
                                  src={userData.avatar}
                                  effect="blur"
                                  height={"150px"}
                                  width={"150px"}
                                  style={{ objectFit: "contain" }}
                                  onError={(e) =>
                                    (e.target.src = `${process.env.PUBLIC_URL}/assets/img/no-image-found.png`)
                                  }
                                />
                              ) : (
                                <img
                                  src={`${process.env.PUBLIC_URL}/assets/img/profile-img.jpg`}
                                  alt="Profile"
                                  className="rounded-circle"
                                />
                              )}
                            </div>
                          </div>

                          <div className="row mb-3">
                            <label
                              htmlFor="fullName"
                              className="col-md-4 col-lg-3 col-form-label"
                            >
                              Full Name
                            </label>
                            <div className="col-md-8 col-lg-9">
                              <input
                                name="name"
                                type="text"
                                className="form-control"
                                id="fullName"
                                defaultValue={userData.name}
                              />
                            </div>
                          </div>
                          <div className="row mb-3">
                            <label
                              htmlFor="username"
                              className="col-md-4 col-lg-3 col-form-label"
                            >
                              UserName
                            </label>
                            <div className="col-md-8 col-lg-9">
                              <input
                                name="username"
                                type="text"
                                className="form-control"
                                id="username"
                                readOnly
                                value={userData.username}
                              />
                            </div>
                          </div>
                          <div className="row mb-3">
                            <label
                              htmlFor="role"
                              className="col-md-4 col-lg-3 col-form-label"
                            >
                              Role
                            </label>
                            <div className="col-md-8 col-lg-9">
                              <input
                                name="role"
                                type="text"
                                className="form-control"
                                id="role"
                                disabled
                                value={
                                  Array.isArray(userData.roles)
                                    ? userData.roles[0].name
                                    : userData.roles.name
                                }
                              />
                            </div>
                          </div>

                          <div className="row mb-3">
                            <label
                              htmlFor="Phone"
                              className="col-md-4 col-lg-3 col-form-label"
                            >
                              Phone
                            </label>
                            <div className="col-md-8 col-lg-9">
                              <input
                                name="phone"
                                type="number"
                                className="form-control"
                                id="Phone"
                                defaultValue={userData.phone}
                              />
                            </div>
                          </div>

                          <div className="row mb-3">
                            <label
                              htmlFor="Email"
                              className="col-md-4 col-lg-3 col-form-label"
                            >
                              Email
                            </label>
                            <div className="col-md-8 col-lg-9">
                              <input
                                name="email"
                                type="email"
                                className="form-control"
                                id="Email"
                                readOnly
                                value={userData.email}
                              />
                            </div>
                          </div>

                          <div className="text-center">
                            <button type="submit" className="btn btn-primary">
                              Save Changes
                            </button>
                          </div>
                        </form>
                      </div>

                      <div className="tab-pane fade pt-3" id="profile-settings">
                        <form>
                          <div className="row mb-3">
                            <label
                              htmlFor="fullName"
                              className="col-md-4 col-lg-3 col-form-label"
                            >
                              Email Notifications
                            </label>
                            <div className="col-md-8 col-lg-9">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="changesMade"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="changesMade"
                                >
                                  Changes made to your account
                                </label>
                              </div>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="newProducts"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="newProducts"
                                >
                                  Information on new products and services
                                </label>
                              </div>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="proOffers"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="proOffers"
                                >
                                  Marketing and promo offers
                                </label>
                              </div>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="securityNotify"
                                  disabled
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="securityNotify"
                                >
                                  Security alerts
                                </label>
                              </div>
                            </div>
                          </div>

                          <div className="text-center">
                            <button type="submit" className="btn btn-primary">
                              Save Changes
                            </button>
                          </div>
                        </form>
                      </div>

                      <div
                        className="tab-pane fade pt-3"
                        id="profile-change-password"
                      >
                        <form
                          id={`form ${window.location.pathname.split("/").slice(2).join("-")} password`}
                          onSubmit={handlePasswordChange}
                        >
                          <div className="row mb-3">
                            <label
                              htmlFor="currentPassword"
                              className="col-md-4 col-lg-3 col-form-label"
                            >
                              Current Password
                            </label>
                            <div className="col-md-8 col-lg-9">
                              <input
                                name="currentpassword"
                                type="password"
                                className="form-control"
                                id="currentPassword"
                              />
                            </div>
                          </div>

                          <div className="row mb-3">
                            <label
                              htmlFor="newPassword"
                              className="col-md-4 col-lg-3 col-form-label"
                            >
                              New Password
                            </label>
                            <div className="col-md-8 col-lg-9">
                              <input
                                name="newpassword"
                                type="password"
                                className="form-control"
                                id="newPassword"
                              />
                              {errors["newpassword"] && (
                                <div className="text-danger">
                                  {errors["newpassword"]}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="row mb-3">
                            <label
                              htmlFor="renewPassword"
                              className="col-md-4 col-lg-3 col-form-label"
                            >
                              Re-enter New Password
                            </label>
                            <div className="col-md-8 col-lg-9">
                              <input
                                name="renewpassword"
                                type="password"
                                className="form-control"
                                id="renewPassword"
                              />
                              {errors["renewpassword"] && (
                                <div className="text-danger">
                                  {errors["renewpassword"]}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="text-center">
                            <button type="submit" className="btn btn-primary">
                              Change Password
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      ) : (
        <div className="text-center">
          <img
            src={`${process.env.PUBLIC_URL}/assets/img/nodata.png`}
            alt="No Data Found"
          />
        </div>
      )}
    </>
  );
};
export default Profile;
