import React, { useEffect, useState } from "react";
import { errorToast, handleApiCall, successToast } from "../../global";
import Loader from "../common/Loader";
import flatpickr from "flatpickr";

const Config = () => {
  const [loading, setLoading] = useState(true);
  const [globalData, setGlobalData] = useState([]);
  const [settings, setSettings] = useState(null);
  const [activeTab, setActiveTab] = useState("");
  const [validationState, setValidationState] = useState({});

  useEffect(() => {
    handleApiCall({
      method: "GET",
      apiPath: "/globalsettings/list",
      onSuccess: (result) => {
        setGlobalData(result.data);
        setLoading(false);
      },
      onError: (error) => {
        errorToast(error.message);
        setLoading(false);
      },
    });
  }, []);
  useEffect(() => {
    if (!loading) {
      const initialSettings = {
        websites: {
          title: "websites",
          description: "This is description",
          inputs: [
            {
              slug: "site_date",
              title: "Site Date",
              required: true,
              readonly: false,
              placeholder: "Enter Site Date ",
              class: "",
              id: "",
              value: "",
              default_value: "",
              type: "date",
              sort_order: 1,
            },
            {
              slug: "site_time",
              title: "Site time",
              required: true,
              readonly: false,
              placeholder: "Enter Site time ",
              class: "",
              id: "",
              value: "",
              default_value: "",
              type: "time",
              sort_order: 1,
            },
            {
              slug: "site_datetime",
              title: "Site datetime",
              required: true,
              readonly: false,
              placeholder: "Enter Site datetime ",
              class: "",
              id: "",
              value: "",
              default_value: "",
              type: "datetime",
              sort_order: 1,
            },
            {
              slug: "site_daterange",
              title: "Site daterange",
              required: false,
              readonly: false,
              placeholder: "Enter Site daterange ",
              class: "",
              id: "",
              value: "",
              default_value: "",
              type: "daterange",
              sort_order: 1,
            },
          ],
        },
        testing: {
          title: "testing",
          description: "",
          inputs: [
            {
              slug: "testing",
              title: "testing",
              required: false,
              readonly: false,
              placeholder: "",
              class: "",
              id: "",
              name: "test",
              value: "",
              type: "text",
              sort_order: 1,
            },
          ],
        },
      };

      const updatedSettings = { ...initialSettings };

      Object.values(updatedSettings).forEach((section) => {
        section.inputs.forEach((input) => {
          const globalItem = globalData.find(
            (item) => item.slug === input.slug
          );
          if (globalItem) {
            input.value =
              input.type === "checkbox" || input.type === "select"
                ? globalItem.value.split("|").length > 1
                  ? globalItem.value.split("|")
                  : globalItem.value
                : globalItem.value;
          }
        });
      });

      setSettings(updatedSettings);

      const settingsNavMenus = Object.values(updatedSettings).map(
        (item) => item.title
      );
      setActiveTab(settingsNavMenus[0]);
      setValidationState(
        settingsNavMenus.reduce((acc, tab) => ({ ...acc, [tab]: true }), {})
      );
    }
  }, [loading, globalData]);
  useEffect(() => {
    if (!loading && settings) {
      const elements = document.querySelectorAll(
        ".time-select, .date-select, .datetime-select, .daterange-select"
      );
      elements.forEach((element) => {
        let config = {};
        if (element.classList.contains("time-select")) {
          config.enableTime = true;
          config.noCalendar = true;
          config.dateFormat = "H:i";
        } else if (element.classList.contains("datetime-select")) {
          config.enableTime = true;
          config.dateFormat = "Y-m-d H:i";
        } else if (element.classList.contains("daterange-select")) {
          config.mode = "range";
        }
        flatpickr(element, config);
      });
    }
  }, [loading, settings]);

  const handleValidation = (tab) => {
    const form = document.getElementById(
      `form ${window.location.pathname.split("/").slice(2).join("-")}`
    );
    const formData = new FormData(form);
    const tabData = Object.values(settings).find(
      (item) => item.title === tab
    ).inputs;
    let isValid = true;

    tabData.forEach((input) => {
      const value =
        input.type === "checkbox" || input.type === "select"
          ? formData.getAll(`settings[${tab}][inputs][${input.slug}][value][]`)
          : formData.get(`settings[${tab}][inputs][${input.slug}][value]`);
      const inputElement =
        input.type === "checkbox" || input.type === "select"
          ? form.elements[`settings[${tab}][inputs][${input.slug}][value][]`]
          : form.elements[`settings[${tab}][inputs][${input.slug}][value]`];

      if (input.required && !value) {
        isValid = false;
        if (inputElement) {
          if (inputElement.length > 0) {
            inputElement.forEach((element) =>
              element.classList.add("is-invalid")
            );
          } else {
            inputElement.classList.add("is-invalid");
          }
        }
      }
    });
    setValidationState((prev) => ({ ...prev, [tab]: isValid }));
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let allValid = true;
    let firstInvalidInput = null;

    Object.values(settings)
      .map((item) => item.title)
      .forEach((tab) => {
        const isValid = handleValidation(tab);
        if (!isValid && allValid) {
          allValid = false;
          firstInvalidInput = document.querySelector(
            `#configs-${tab} .form-control.is-invalid, #configs-${tab} .form-check-input.is-invalid`
          );
        }
      });

    if (!allValid) {
      if (firstInvalidInput) {
        firstInvalidInput.focus();
      }
      errorToast("Please Fill All The Fields");
      window.scrollTo(0, 0);
      return;
    }

    const form = document.getElementById(
      `form ${window.location.pathname.split("/").slice(2).join("-")}`
    );
    const formData = new FormData(form);

    handleApiCall({
      method: "POST",
      apiPath: "/globalsettings/store",
      body: formData,
      onSuccess: (result) => successToast(result.message),
      onError: (error) => {
        error.error &&
          Object.keys(error.error) &&
          Object.keys(error.error).forEach((item) => {
            let result = item.split(".").reduce((acc, key, index) => {
              return index === 0 ? key : `${acc}[${key}]`;
            }, "");
            document.getElementsByName(result)[0].classList.add("is-invalid");
          });
        errorToast(error.message);
      },
    });
  };

  const handleInputChange = (e, tab) => {
    e.target.classList.remove("is-invalid");
    if (e.target.type === "radio" || e.target.type === "checkbox") {
      const form = document.getElementById(
        `form ${window.location.pathname.split("/").slice(2).join("-")}`
      );
      const inputs = form.querySelectorAll(`input[name='${e.target.name}']`);
      inputs.forEach((input) => input.classList.remove("is-invalid"));
    }
    handleValidation(tab);
  };

  if (loading || !settings) {
    return <Loader height="90vh" />;
  }

  return (
    <main id="main" className="main">
      <div className="card">
        <div className="card-body pt-3">
          <ul className="nav nav-tabs nav-tabs-bordered">
            {Object.values(settings).map((item) => (
              <li className="nav-item" key={item.title}>
                <button
                  className={`nav-link ${activeTab === item.title ? "active" : ""} d-flex gap-2 align-items-center ${!validationState[item.title] ? "text-danger" : ""}`}
                  data-bs-toggle="tab"
                  onClick={() => setActiveTab(item.title)}
                >
                  <span>{item.title}</span>
                  {!validationState[item.title] && (
                    <i
                      className="fa fa-exclamation text-danger border rounded-circle"
                      title="Please fill all required fields"
                    ></i>
                  )}
                </button>
              </li>
            ))}
          </ul>
          <form
            onSubmit={handleSubmit}
            id={`form ${window.location.pathname.split("/").slice(2).join("-")}`}
            encType="multipart/form-data"
          >
            <div className="tab-content pt-2">
              {Object.values(settings).map((data) => (
                <div
                  key={data.title}
                  className={`tab-pane fade ${activeTab === data.title ? "active show" : ""}`}
                  id={`configs-${data.title}`}
                >
                  {data.description && (
                    <p className="small fst-italic">{data.description}</p>
                  )}
                  {data.inputs
                    .sort((a, b) => a.sort_order - b.sort_order)
                    .map((input, index) => (
                      <div key={index} className="mb-3">
                        <input
                          type="hidden"
                          name={`settings[${data.title}][inputs][${input.slug}][slug]`}
                          defaultValue={input.slug}
                        />
                        <input
                          type="hidden"
                          name={`settings[${data.title}][inputs][${input.slug}][required]`}
                          defaultValue={input.required ? 1 : 0}
                        />
                        <label className="form-label">
                          <span>{input.title}</span>
                          {input.required && (
                            <span className="text-danger">*</span>
                          )}
                        </label>
                        {[
                          "text",
                          "number",
                          "password",
                          "email",
                          "hidden",
                        ].includes(input.type) && (
                          <>
                            <input
                              type={input.type}
                              className={`form-control ${input.class || ""}`}
                              name={`settings[${data.title}][inputs][${input.slug}][value]`}
                              placeholder={input.placeholder}
                              defaultValue={input.value || input.default_value}
                              onChange={(e) => handleInputChange(e, data.title)}
                              {...(input.extra || {})}
                            />
                            <div className="invalid-feedback">
                              Please Fill This Field.
                            </div>
                          </>
                        )}
                        {input.type === "date" && (
                          <>
                            <input
                              type="text"
                              className={`form-control ${input.class || ""} date-select`}
                              name={`settings[${data.title}][inputs][${input.slug}][value]`}
                              placeholder={input.placeholder}
                              defaultValue={input.value || input.default_value}
                              onChange={(e) => handleInputChange(e, data.title)}
                              {...(input.extra || {})}
                            />
                            <div className="invalid-feedback">
                              Please Fill This Field.
                            </div>
                          </>
                        )}
                        {input.type === "time" && (
                          <>
                            <input
                              type="text"
                              className={`form-control ${input.class || ""} time-select`}
                              name={`settings[${data.title}][inputs][${input.slug}][value]`}
                              placeholder={input.placeholder}
                              defaultValue={input.value || input.default_value}
                              onChange={(e) => handleInputChange(e, data.title)}
                              {...(input.extra || {})}
                            />
                            <div className="invalid-feedback">
                              Please Fill This Field.
                            </div>
                          </>
                        )}
                        {input.type === "datetime" && (
                          <>
                            <input
                              type="text"
                              className={`form-control ${input.class || ""} datetime-select`}
                              name={`settings[${data.title}][inputs][${input.slug}][value]`}
                              placeholder={input.placeholder}
                              defaultValue={input.value || input.default_value}
                              onChange={(e) => handleInputChange(e, data.title)}
                              {...(input.extra || {})}
                            />
                            <div className="invalid-feedback">
                              Please Fill This Field.
                            </div>
                          </>
                        )}
                        {input.type === "daterange" && (
                          <>
                            <input
                              type="text"
                              className={`form-control ${input.class || ""} daterange-select`}
                              name={`settings[${data.title}][inputs][${input.slug}][value]`}
                              placeholder={input.placeholder}
                              defaultValue={input.value || input.default_value}
                              onChange={(e) => handleInputChange(e, data.title)}
                              {...(input.extra || {})}
                            />
                            <div className="invalid-feedback">
                              Please Fill This Field.
                            </div>
                          </>
                        )}
                        {input.type === "textarea" && (
                          <>
                            <textarea
                              className={`form-control ${input.class || ""}`}
                              name={`settings[${data.title}][inputs][${input.slug}][value]`}
                              placeholder={input.placeholder}
                              defaultValue={input.value || input.default_value}
                              onChange={(e) => handleInputChange(e, data.title)}
                              style={{ height: "100px" }}
                              {...(input.extra || {})}
                            ></textarea>
                            <div className="invalid-feedback">
                              Please Fill This Field.
                            </div>
                          </>
                        )}
                        {input.type === "radio" && (
                          <fieldset
                            className={`row  ${input.class || ""}`}
                            id={input.id}
                            onChange={(e) => handleInputChange(e, data.title)}
                          >
                            <div>
                              {input.options.map((options) => {
                                return (
                                  <div
                                    className="form-check"
                                    key={options.value}
                                  >
                                    <input
                                      type="radio"
                                      value={options.value}
                                      className={`form-check-input ${input.class || ""}`}
                                      id={input.id}
                                      name={`settings[${data.title}][inputs][${input.slug}][value]`}
                                      placeholder={input.placeholder}
                                      readOnly={input.readonly}
                                      defaultChecked={
                                        input.value == options.value
                                      }
                                      {...(input.extra || {})}
                                    />
                                    <label className="form-check-label">
                                      {options.text}
                                    </label>
                                    <div className="invalid-feedback">
                                      Please Select Any One From This.
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </fieldset>
                        )}
                        {input.type === "checkbox" && (
                          <div className="row">
                            <div>
                              {input.options.map((options) => (
                                <div className="form-check" key={options.value}>
                                  <input
                                    type="checkbox"
                                    className={`form-check-input ${input.class || ""}`}
                                    id={input.id}
                                    name={`settings[${data.title}][inputs][${input.slug}][value][]`}
                                    value={options.value}
                                    placeholder={input.placeholder}
                                    readOnly={input.readonly}
                                    defaultChecked={input.value.includes(
                                      options.value
                                    )}
                                    {...(input.extra || {})}
                                    onChange={(e) =>
                                      handleInputChange(e, data.title)
                                    }
                                  />
                                  <label className="form-check-label">
                                    {options.text}
                                  </label>
                                  <div className="invalid-feedback">
                                    Please Select Any One From This.
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {input.type === "select" && (
                          <select
                            className={`form-select ${input.class || ""}`}
                            name={`settings[${data.title}][inputs][${input.slug}][value][]`}
                            onChange={(e) => handleInputChange(e, data.title)}
                            defaultValue={input.value}
                            {...(input.extra || {})}
                          >
                            <option disabled>Open this select menu</option>
                            {input.options.map((option) => (
                              <option value={option.value} key={option.value}>
                                {option.text}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    ))}
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
                    >
                      <i className="bi bi-arrow-counterclockwise"></i>Reset
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Config;
