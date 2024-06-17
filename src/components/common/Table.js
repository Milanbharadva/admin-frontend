import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  changeDateFormat,
  errorToast,
  getRoutePath,
  handleApiCall,
  successToast,
} from "../../global";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
const Table = ({
  data,
  handlePageChange,
  page,
  reRender,
  handlePerPageChange,
  handleOrderChange,
}) => {
  const navigate = useNavigate();
  const [downloadingCSV, setDownloadingCSV] = useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  const handleChangePage = (page) => {
    if (urlParams.toString() === "") {
      navigate(`?page=${page}`);
    } else {
      if (page !== 1) {
        urlParams.set("page", page);
      } else {
        urlParams.delete("page");
      }
      navigate(`?${urlParams.toString()}`);
    }
    handlePageChange(page);
  };
  const handleChangePerPage = (page) => {
    if (urlParams.toString() === "") {
      navigate(`?per_page=${page}`);
    } else {
      urlParams.delete("page");
      if (page !== 10) {
        urlParams.set("per_page", page);
      } else {
        urlParams.delete("per_page");
      }
      navigate(`?${urlParams.toString()}`);
    }
    handlePerPageChange(page);
  };
  const handlePageOrderChange = (column, value) => {
    if (urlParams.toString() === "") {
      navigate(`?sort_column=${column}&sort_by=${value}`);
    } else {
      urlParams.set("sort_column", column);
      urlParams.set("sort_by", value);
      navigate(`?${urlParams.toString()}`);
    }
    handleOrderChange(page);
  };
  const [selectedRows, setSelectedRows] = useState([]);
  function deleteItem(id) {
    const onSuccess = (result) => {
      reRender();
      successToast(result.message);
    };
    const onError = (error) => {
      errorToast(error.message);
    };
    handleApiCall({
      method: "DELETE",
      apiPath: `/${page.toLowerCase()}/delete/${id}`,
      onSuccess: onSuccess,
      onError: onError,
    });
  }
  const toggleRowSelection = (id) => {
    const isSelected = selectedRows.includes(id);
    if (isSelected) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const exportCSV = async (exportOption) => {
    let exportData = [];
    setDownloadingCSV(true);
    if (exportOption === "current_page") {
      exportData = data.records;
    } else if (exportOption === "selected_rows") {
      let formData = new FormData();
      formData.append("per_page", data.total);
      const result = await new Promise((resolve, reject) => {
        handleApiCall({
          method: "POST",
          apiPath: `/${page.toLowerCase()}/list`,
          body: formData,
          onSuccess: resolve,
          onError: reject,
        });
      });
      const pageData = result.data;
      exportData = pageData.records.filter((item) =>
        selectedRows.includes(item.id)
      );
    } else if (exportOption === "all_data") {
      try {
        let formData = new FormData();
        urlParams.forEach((value, key) => formData.append(key, value));
        formData.append("per_page", data.total);
        const result = await new Promise((resolve, reject) => {
          handleApiCall({
            method: "POST",
            apiPath: `/${page.toLowerCase()}/list`,
            body: formData,
            onSuccess: resolve,
            onError: reject,
          });
        });
        const pageData = result.data;
        exportData = pageData.records;
      } catch (error) {
        setDownloadingCSV(false);
        console.error("Error exporting CSV:", error);
      }
    }

    for (let i = 0; i < exportData.length; i++) {
      const item = exportData[i];
      for (const key in item) {
        if (Array.isArray(item[key])) {
          if (Array.isArray(item[key])) {
            item[key] = item[key].map((itemInner) => itemInner.name).join(",");
          } else {
            item[key] = item[key]["name"];
          }
        } else if (item[key] && typeof item[key] === "object") {
          item[key] = item[key]["name"];
        }
      }
    }

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `${page}_data.csv`);
    setDownloadingCSV(false);
  };
  const [idDelete, setIdDelete] = useState();

  return (
    <>
      <div className="card">
        <div className="card-body" style={{ overflowX: "auto" }}>
          <div className="row d-flex align-items-center mx-3 my-2 ">
            <h5 className="card-title col-12 col-lg-6 p-0 m-0 mb-2 mb-lg-0">
              {page} Table
            </h5>
            <div className="d-lg-flex gap-2 align-items-center col-12 col-lg-6 justify-content-lg-end p-0">
              <div className="d-flex p-0 gap-2 align-items-end">
                {data.records !== undefined && data.records.length > 0 && (
                  <div className="dropdown">
                    <button
                      className="btn btn-primary dropdown-toggle"
                      type="button"
                      id="exportDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Export CSV
                    </button>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="exportDropdown"
                    >
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            exportCSV("current_page");
                          }}
                        >
                          Export Current Page {`(${data.records.length}) `}
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            exportCSV("selected_rows");
                          }}
                          disabled={selectedRows.length === 0}
                        >
                          Export Selected Rows {`(${selectedRows.length}) `}
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            exportCSV("all_data");
                          }}
                        >
                          Export All Data {`(${data.total}) `}
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
                <button
                  type="button"
                  className="btn btn-primary text-nowrap d-flex gap-1 align-items-center"
                  onClick={() => {
                    navigate(getRoutePath(`${page.toLowerCase()}/create`));
                  }}
                >
                  Add New
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    className="bi bi-plus-lg"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="table-responsive mb-3">
            {downloadingCSV ? (
              <div
                className="d-flex flex-column justify-content-center align-items-center"
                style={{ height: "90vh" }}
              >
                <div
                  className="spinner-border text-primary"
                  role="status"
                  style={{ width: "3rem", height: "3rem" }}
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 mb-0 text-center">
                  Downloading CSV ! Please wait
                </p>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    {data.records !== undefined && data.records.length > 0 && (
                      <th scope="col">
                        <input
                          type="checkbox"
                          checked={selectedRows.length === data.records.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRows(
                                data.records.map((item) => item.id)
                              );
                            } else {
                              setSelectedRows([]);
                            }
                          }}
                        />
                      </th>
                    )}
                    {data.records !== undefined && data.records.length > 0 ? (
                      <>
                        {Object.keys(data.records[0]).map((key, index) => (
                          <th scope="col" key={key}>
                            <div className="text-nowrap">
                              <span className="me-1">
                                {index === 0
                                  ? key.toUpperCase()
                                  : key.charAt(0).toUpperCase() + key.slice(1)}
                              </span>
                              {typeof data.records[0][key] !== "object" && (
                                <>
                                  {urlParams.get("sort_column") === key &&
                                    urlParams.get("sort_by") === "desc" && (
                                      <i
                                        className="fa fa-sort-amount-desc"
                                        aria-hidden="true"
                                        role="button"
                                        onClick={() =>
                                          handlePageOrderChange(key, "asc")
                                        }
                                      ></i>
                                    )}

                                  {urlParams.get("sort_column") !== key && (
                                    <i
                                      className="fa fa-sort"
                                      role="button"
                                      onClick={() =>
                                        handlePageOrderChange(key, "desc")
                                      }
                                    ></i>
                                  )}

                                  {urlParams.get("sort_column") === key &&
                                    urlParams.get("sort_by") === "asc" && (
                                      <i
                                        className="bi bi-sort-up"
                                        style={{
                                          fontSize: "20px",
                                          fontWeight: "bolder",
                                        }}
                                        aria-hidden="true"
                                        role="button"
                                        onClick={() =>
                                          handlePageOrderChange(key, "desc")
                                        }
                                      ></i>
                                    )}
                                </>
                              )}
                            </div>
                          </th>
                        ))}
                        <th>Actions</th>
                      </>
                    ) : (
                      <th>
                        <div className="text-center">
                          <img
                            src={`${process.env.PUBLIC_URL}/assets/img/nodata.png`}
                            alt="No Data Found"
                          />
                        </div>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {data.records &&
                    data.records.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(item.id)}
                            onChange={() => toggleRowSelection(item.id)}
                          />
                        </td>
                        {Object.keys(item).map((object, index) => {
                          if (object === "avatar") {
                            return (
                              <td key={index}>
                                <LazyLoadImage
                                  alt="image alternative"
                                  className="img-fluid"
                                  src={item[object]}
                                  effect="blur"
                                  onError={(e) =>
                                    (e.target.src = `${process.env.PUBLIC_URL}/assets/img/no-image-found.png`)
                                  }
                                />
                              </td>
                            );
                          }
                          if (
                            object === "updated_at" ||
                            object === "created_at"
                          ) {
                            return (
                              <td key={index} className="text-nowrap">
                                {changeDateFormat(item[object])}
                              </td>
                            );
                          }
                          if (Array.isArray(item[object])) {
                            return (
                              <td key={index}>
                                {item[object].map((item) => (
                                  <React.Fragment key={item.name}>
                                    <span>{item.name}</span>
                                    <br />
                                  </React.Fragment>
                                ))}
                              </td>
                            );
                          } else if (
                            item[object] &&
                            typeof item[object] === "object"
                          ) {
                            return <td key={index}>{item[object].name}</td>;
                          } else {
                            return (
                              <td key={index} className="text-nowrap">
                                {item[object]}
                              </td>
                            );
                          }
                        })}
                        <td>
                          <div className="d-flex gap-4">
                            <span
                              style={{ cursor: "pointer" }}
                              onClick={(e) => {
                                navigate(
                                  getRoutePath(
                                    `${page.toLowerCase()}/edit/${item.id}`
                                  ),
                                  {
                                    state: {
                                      prevPath: window.location.href,
                                      scrollY: window.scrollY,
                                    },
                                  }
                                );
                              }}
                            >
                              <i className="bi bi-pencil-square"></i>
                            </span>
                            <span
                              style={{ cursor: "pointer" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setIdDelete(item.id);
                              }}
                            >
                              <span
                                type="button"
                                data-bs-toggle="modal"
                                data-bs-target="#basicModal"
                              >
                                <i className="bi bi-trash"></i>
                              </span>
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
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
                <div className="modal-body">Do You Want To Delete {page} ?</div>
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
                    onClick={() => {
                      deleteItem(idDelete);
                    }}
                  >
                    YES
                  </button>
                </div>
              </div>
            </div>
          </div>
          {data.records !== undefined && data.records.length > 0 && (
            <div className="row d-flex align-items-center">
              <div className="col-12 col-lg-4">
                <p className="d-flex mb-2 mb-lg-0 gap-1 m-0">
                  Showing
                  <b>{(data.current_page - 1) * data.per_page + 1}</b>
                  to
                  <b>
                    {Math.min(data.total, data.per_page * data.current_page)}
                  </b>
                  of
                  <b>{data.total}</b>
                  entries
                </p>
              </div>
              <nav
                aria-label="Pagination"
                className="d-lg-flex gap-2 align-items-center col-12 col-lg-8 justify-content-lg-end"
              >
                <div className="d-flex gap-2 mb-2 mb-lg-0 align-items-center">
                  <span>Show</span>
                  <select
                    className="form-select form-select-sm"
                    style={{ maxWidth: "fit-content" }}
                    value={data.per_page}
                    onChange={(e) => handleChangePerPage(e.target.value)}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    {urlParams.get("per_page") &&
                      ["10", "20", "50", "100"].indexOf(
                        urlParams.get("per_page")
                      ) === -1 && (
                        <option value={urlParams.get("per_page")}>
                          {urlParams.get("per_page")}
                        </option>
                      )}
                  </select>
                  entries
                </div>
                <ul
                  className="pagination flex-wrap"
                  style={{ marginBottom: "0px" }}
                >
                  <li
                    className={`page-item ${data.current_page === 1 ? "disabled" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handleChangePage(data.current_page - 1)}
                    >
                      Previous
                    </button>
                  </li>
                  {[...Array(data.last_page).keys()].map((page) => {
                    const pagesToShow = 2;
                    const currentPage = data.current_page;
                    const lastPage = data.last_page;
                    if (
                      page === 0 ||
                      page === lastPage - 1 ||
                      (page >= currentPage - pagesToShow &&
                        page <= currentPage + pagesToShow)
                    ) {
                      return (
                        <li
                          key={page}
                          className={`page-item ${
                            page + 1 === currentPage ? "active" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => handleChangePage(page + 1)}
                          >
                            {page + 1}
                          </button>
                        </li>
                      );
                    } else if (
                      (page === 1 && currentPage > pagesToShow + 1) ||
                      (page === lastPage - 2 &&
                        currentPage < lastPage - pagesToShow - 1)
                    ) {
                      return (
                        <li key={page} className="page-item disabled">
                          <span className="page-link">...</span>
                        </li>
                      );
                    }
                    return null;
                  })}

                  <li
                    className={`page-item ${
                      data.current_page === data.last_page ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handleChangePage(data.current_page + 1)}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Table;
