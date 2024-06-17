import React, { useState, useEffect } from "react";
import {
  errorToast,
  getLocalStorage,
  handleApiCall,
  setLocalStorage,
  successToast,
  warnToast,
} from "../../global";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Loader from "../common/Loader";
let a;
const styles = {
  itemContainer: {
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid #eee",
    padding: "0.8rem 1rem",
    backgroundColor: "white",
  },
  index: { flex: "0 0 3rem", color: "gray", marginRight: "1rem" },
  text: { flex: "1", fontWeight: "600", color: "black" },
  actions: { flex: "0 0 4rem", textAlign: "right" },
  actionButton: {
    cursor: "pointer",
    marginLeft: "0.5rem",
    padding: "0.3rem 0.5rem",
    borderRadius: "4px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
  },
  formContainer: { padding: "2rem", backgroundColor: "#f9f9f9" },
};

export default function Menus() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idDelete, setIdDelete] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    icon: "",
    path: "",
    parent_id: "",
    status: 1,
  });
  const [icon, setIcon] = useState("");
  const [userData, setUserData] = useState(null);

  const FetchMenu = () => {
    let formData = new FormData();
    formData.append("sort_column", "id");
    formData.append("sort_by", "asc");
    const onSuccess = (result) => {
      setUserData(result.data.records);
      setItems(convertToNestedFormat(result.data.records));
      const userDatalocal = JSON.parse(getLocalStorage("userData"));
      userDatalocal.menus = result.data.records;
      setLocalStorage("userData", JSON.stringify(userDatalocal));
      setLoading(false);
    };
    const onError = (error) => {
      errorToast(error.message);
      setLoading(false);
    };
    handleApiCall({
      method: "POST",
      apiPath: "/menus/list",
      body: formData,
      onSuccess,
      onError,
    });
  };

  useEffect(() => {
    FetchMenu();
  }, []);
  useEffect(() => {
    if (window.sortNestDemo && items.length > 0) {
      setTimeout(() => {
        window.sortNestDemo.init();
      }, 2000); // Ensure this delay matches the one in your script
    }
  }, [items]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleDeleteMenu = (id) => {
    if (window.confirm("Are you sure You Want to delete menu")) {
      handleApiCall({
        method: "DELETE",
        apiPath: `/menus/delete/${id}`,
        onSuccess: (result) => {
          successToast(result.message);
          FetchMenu();
        },
        onError: (error) => {
          errorToast(error);
        },
      });
    }
  };
  const handleSaveMenu = () => {
    if (document.getElementById("nestableOutput").innerHTML.length > 0) {
      handleApiCall({
        method: "POST",
        apiPath: `/menus/update`,
        body: JSON.parse(document.getElementById("nestableOutput").innerHTML),
        onSuccess: (result) => {
          successToast(result.message);
          setLocalStorage("changed", true);
        },
        onError: (error) => {
          errorToast(error.message);
        },
      });
    } else {
      successToast("Menu updated successfully");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newItem;
    if (!!formData.parent_id) {
      newItem = {
        id: Date.now(),
        text: formData.title,
        title: formData.title,
        icon: icon.split(" ")[1],
        path: formData.path,
        status: formData.status,
        parent_id: parseInt(formData.parent_id),
      };
    } else {
      newItem = {
        id: Date.now(),
        text: formData.title,
        title: formData.title,
        icon: icon.split(" ")[1],
        path: formData.path,
        status: formData.status,
      };
    }

    const onSuccess = (result) => {
      successToast(result.message);
      FetchMenu();
    };
    const onError = (error) => errorToast(error.message);
    handleApiCall({
      method: "POST",
      apiPath: "/menus/create",
      body: newItem,
      onSuccess,
      onError,
    });
  };

  const deleteItem = (id) => {
    const onSuccess = (result) => {
      FetchMenu();
      warnToast(result.message);
    };
    const onError = (error) => {
      errorToast(error.message);
    };
    handleApiCall({
      method: "DELETE",
      apiPath: `/menus/delete/${a}`,
      onSuccess,
      onError,
    });
  };
  const renderItems = (items) => {
    return (
      <ol className="dd-list">
        {items.map((item) => (
          <li className="dd-item" data-id={item.id} key={item.id}>
            {item.children && item.children.length > 0 && (
              <>
                <button
                  className="dd-collapse"
                  data-action="collapse"
                  type="button"
                >
                  Collapse
                </button>
                <button
                  className="dd-expand"
                  data-action="expand"
                  type="button"
                >
                  Expand
                </button>
              </>
            )}
            <div className="dd-handle">
              <div className="d-flex align-items-center">
                <span
                  className="drag-indicator"
                  style={item.children.length > 0 ? { opacity: 0 } : {}}
                ></span>
                <div>{item.title}</div>
              </div>
              <div className="dd-nodrag btn-group ml-auto align-self-end">
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => {
                    handleDeleteMenu(item.id);
                  }}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
            {item.children &&
              item.children.length > 0 &&
              renderItems(item.children)}
          </li>
        ))}
      </ol>
    );
  };
  const generateOptions = (options) => {
    return (
      options &&
      options.map((option) => {
        // Create the main option
        const mainOption = (
          <option value={option.id} key={option.id}>
            {option.title}
          </option>
        );

        // Check if there are sub_menus and generate their options
        if (option.sub_menus && option.sub_menus.length > 0) {
          const subOptions = generateOptions(option.sub_menus);
          return [mainOption, ...subOptions]; // Include the main option and its sub-options
        } else {
          return [mainOption]; // No sub-options, just return the main option
        }
      })
    );
  };
  return (
    <main className="main" id="main">
      {loading ? (
        <Loader />
      ) : (
        items.length > 0 && (
          <div className="container-fluid">
            <div className="modal fade" id="basicModal" tabIndex="-1">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Asking Confirmation</h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">Do You Want To Delete Menu ?</div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      NO
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                      onClick={() => deleteItem(idDelete)}
                    >
                      YES
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6" style={{ padding: "2rem" }}>
                <main>
                  <div className="wrapper">
                    <div className="page">
                      <button
                        type="submit"
                        onClick={handleSaveMenu}
                        className="btn btn-primary me-2"
                      >
                        Save Changes
                      </button>
                      <div className="page-inner">
                        <div id="sortablemulti" className="row"></div>
                        <div className="row">
                          <div className="">
                            <section className="card card-fluid">
                              <div id="nestable01" className="dd">
                                {renderItems(items)}
                              </div>
                            </section>
                          </div>
                        </div>
                        <div
                          className="section-block"
                          style={{ display: "none" }}
                        >
                          <pre id="nestableOutput"></pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
              <div className="col-md-6" style={styles.formContainer}>
                <h2>Create Menu</h2>
                <form onSubmit={handleSubmit}>
                  <div className="row mt-3">
                    {[
                      { label: "Title", name: "title" },
                      { label: "Path", name: "path" },
                    ].map((field) => (
                      <div className="mb-2" key={field.name}>
                        <div className="col-12 d-sm-flex gap-3 align-items-center">
                          <label
                            htmlFor={field.name}
                            className="text-nowrap col-2"
                          >
                            {field.label}
                          </label>
                          <div className="input-group has-validation">
                            <input
                              type="text"
                              name={field.name}
                              value={formData[field.name]}
                              onChange={handleInputChange}
                              className="form-control"
                              id={field.name}
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="mb-2" key="parent_id">
                      <div className="col-12 d-sm-flex gap-3 align-items-center">
                        <label
                          htmlFor="parent_id"
                          className="text-nowrap col-2"
                        >
                          Parent ID
                        </label>
                        <div className="input-group has-validation">
                          <select
                            className="form-select form-select-sm"
                            name="parent_id"
                            value={formData.parent_id}
                            onChange={handleInputChange}
                          >
                            <option value="0">root</option>
                            {!loading && generateOptions(userData)}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="mb-2" key="Status">
                      <div className="col-12 d-sm-flex gap-3 align-items-center">
                        <label htmlFor="Status" className="text-nowrap col-2">
                          Status
                        </label>
                        <div className="input-group has-validation">
                          <select
                            className="form-select form-select-sm"
                            name="status"
                            onChange={handleInputChange}
                            defaultValue={1}
                          >
                            <option value="1">ON</option>
                            <option value="0">OFF</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-end mt-2">
                    <button type="submit" className="btn btn-primary me-2">
                      Submit
                    </button>
                    <button type="reset" className="btn btn-secondary me-2">
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )
      )}
    </main>
  );
}
const convertToNestedFormat = (menuItems) => {
  return menuItems.map((item) => ({
    ...item,
    text: item.title,
    children: convertToNestedFormat(item.sub_menus || []),
  }));
};
