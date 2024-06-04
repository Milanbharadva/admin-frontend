import React, { useState, useEffect } from "react";
import Nestable from "react-nestable";
import {
  AiOutlineDrag,
  AiFillCaretRight,
  AiFillCaretDown,
} from "react-icons/ai";
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

const Handler = () => <AiOutlineDrag />;
const Collapser = ({ isCollapsed }) =>
  isCollapsed ? <AiFillCaretRight /> : <AiFillCaretDown />;

export default function Menus() {
  const [collapseAll, setCollapseAll] = useState(false);
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

  useEffect(() => {
    const userData = JSON.parse(getLocalStorage("userData"));
    if (userData?.menus) {
      setUserData(userData.menus);
      setLoading(false);
      setItems(convertToNestedFormat(userData.menus));
    }
  }, []);

  const FetchMenu = () => {
    let formData = new FormData();
    formData.append("sort_column", "id");
    formData.append("sort_by", "asc");
    const onSuccess = (result) => {
      setUserData(result.data.records);
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
    // FetchMenu();
  }, []);

  const handleMenuChange = (updatedItems) => {
    setItems(updatedItems.items || []);
    const flatItems = convertToFlatFormat(updatedItems.items || []);
    const userDatalocal = JSON.parse(getLocalStorage("userData"));
    userDatalocal.menus = flatItems;
    setLocalStorage("userData", JSON.stringify(userDatalocal));
  };
  const handleSave = () => {
    const flatItems = convertToFlatFormat(items);
    const userDatalocal = JSON.parse(getLocalStorage("userData"));
    userDatalocal.menus = flatItems;
    setLocalStorage("userData", JSON.stringify(userDatalocal));
    successToast("Changes saved successfully");
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

    const onSuccess = (result) => successToast(result.message);
    const onError = (error) => errorToast(error);
    handleApiCall({
      method: "POST",
      apiPath: "/menus/create",
      body: newItem,
      onSuccess,
      onError,
    });
    setItems([...items, newItem]);
    setFormData({ title: "", icon: "", path: "", parent_id: 0 });
  };

  const deleteItem = (id) => {
    const onSuccess = (result) => {
      FetchMenu();
      warnToast(result.message);
    };
    const onError = (error) => {};
    handleApiCall({
      method: "DELETE",
      apiPath: `/menus/delete/${a}`,
      onSuccess,
      onError,
    });
  };

  return (
    <main className="main" id="main">
      {loading ? (
        <Loader />
      ) : (
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
              <header style={{ marginBottom: "1rem" }}>
                <h1>Menus</h1>
                <button
                  onClick={() => setCollapseAll(!collapseAll)}
                  style={styles.actionButton}
                >
                  {collapseAll ? "Expand All" : "Collapse All"}
                </button>
                <button
                  onClick={() => handleSave()}
                  style={styles.actionButton}
                >
                  Save Changes
                </button>
              </header>
              <Nestable
                items={items}
                renderItem={renderItem}
                handler={<Handler />}
                renderCollapseIcon={({ isCollapsed }) => (
                  <Collapser isCollapsed={isCollapsed} />
                )}
                collapsed={collapseAll}
                onChange={handleMenuChange}
              />
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
                      <label htmlFor="parent_id" className="text-nowrap col-2">
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
                          {userData.map((option) => (
                            <option value={option.id} key={option.id}>
                              {option.title}
                            </option>
                          ))}
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
      )}
    </main>
  );
}

const renderItem = ({ item, index, collapseIcon, handler }) => (
  <div style={styles.itemContainer}>
    <div style={styles.index}>{index + 1}</div>
    {handler}
    {collapseIcon}
    <div style={styles.text}>{item.text}</div>
    <div style={styles.actions}>
      <span
        style={{ cursor: "pointer" }}
        data-bs-toggle="modal"
        data-bs-target="#basicModal"
      >
        <i
          className="bi bi-trash"
          onClick={() => {
            a = item.id;
          }}
        ></i>
      </span>
    </div>
  </div>
);

const convertToNestedFormat = (menuItems) => {
  return menuItems.map((item) => ({
    ...item,
    text: item.title,
    children: convertToNestedFormat(item.sub_menus || []),
  }));
};

const convertToFlatFormat = (nestedItems) => {
  return nestedItems.map((item) => ({
    ...item,
    sub_menus: item.children,
    children: convertToFlatFormat(item.children || []),
  }));
};
