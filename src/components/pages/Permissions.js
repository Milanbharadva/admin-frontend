import React, { useEffect } from "react";
import Table from "../common/Table";
import Loader from "../common/Loader";
import useDataFetch from "../hooks/useDataFetch";
import { addBackendUrl } from "../../global";

const Permissions = () => {
  const {
    data,
    loading,
    formVisible,
    globalSearchValue,
    handleFormVisible,
    handlePageNumber,
    handleOrder,
    handlePerPageCount,
    reRender,
    handleReset,
    handleGlobalSearchChange,
    handleAddToURL,
  } = useDataFetch("/permissions/list", ["name", "slug"]);

  let paramvalues = new URLSearchParams(window.location.search);
  return (
    <div>
      {loading ? (
        <Loader height="100vh" />
      ) : (
        <main id="main" className="main">
          <div className="card" style={{ marginBottom: "10px" }}>
            <div className="card-body" style={{ paddingBottom: "10px" }}>
              <div className="d-flex flex-column">
                <div className="d-sm-flex text-center gap-2 align-items-end">
                  <button
                    type="button"
                    className="btn btn-primary text-nowrap d-flex gap-1 mt-2 "
                    onClick={() => handleFormVisible(!formVisible)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="currentColor"
                      className="bi bi-filter"
                      viewBox="0 0 16 16"
                    >
                      <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5" />
                    </svg>
                    <span>Advance Filter</span>
                  </button>
                  <div className="mt-1 search-bar d-flex align-items-center gap-2 col-xl-4 col-lg-6  col-md-8 col-sm-10 col-12">
                    <form
                      className="search-form d-flex align-items-center"
                      method="POST"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleAddToURL();
                      }}
                    >
                      <input
                        type="text"
                        id="globalsearch"
                        onChange={(e) => {
                          handleGlobalSearchChange(e.target.value);
                        }}
                        name="globalsearch"
                        placeholder="Search"
                        title="Enter search keyword"
                        defaultValue={paramvalues.get("globalsearch")}
                      />
                      <button type="submit" title="Search">
                        {globalSearchValue ? (
                          <i
                            className="bi bi-x"
                            onClick={() => {
                              handleGlobalSearchChange(null);
                              document.getElementById("globalsearch").value =
                                "";
                            }}
                          ></i>
                        ) : (
                          <i className="bi bi-search"></i>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
                {formVisible && (
                  <>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleAddToURL();
                      }}
                    >
                      <div className="row mb-3 mt-3">
                        <div className="col-md-6 col-lg-4 col-xl-3">
                          <label htmlFor="name" className="form-label">
                            Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            defaultValue={paramvalues.get("name")}
                          />
                        </div>
                        <div className="col-md-6 col-lg-4 col-xl-3">
                          <label htmlFor="dummy" className="form-label">
                            Dummy
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="dummy"
                          />
                        </div>
                        <div className="col-md-6 col-lg-4 col-xl-3">
                          <fieldset
                            className="row mb-3"
                            defaultChecked={paramvalues.get("gridRadios")}
                          >
                            <legend className="col-form-label col-sm-2 pt-0 text-nowrap mr-1">
                              Radios
                            </legend>
                            <div className="col-sm-10">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  id="gridRadios1"
                                  value="option1"
                                  defaultChecked={
                                    paramvalues.get("gridRadios") === "option1"
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="gridRadios1"
                                >
                                  First radio
                                </label>
                              </div>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  id="gridRadios2"
                                  value="option2"
                                  defaultChecked={
                                    paramvalues.get("gridRadios") === "option2"
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="gridRadios2"
                                >
                                  Second radio
                                </label>
                              </div>
                              <div className="form-check disabled">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  id="gridRadios3"
                                  value="option3"
                                  defaultChecked={
                                    paramvalues.get("gridRadios") === "option3"
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="gridRadios3"
                                >
                                  Third disabled radio
                                </label>
                              </div>
                            </div>
                          </fieldset>
                        </div>
                        <div className="col-md-6 col-lg-4 col-xl-3">
                          <label
                            htmlFor="permissionList"
                            className="form-label"
                          >
                            State
                          </label>
                          <select
                            id="permissionList"
                            className="form-select"
                            data-control="select2"
                            data-ajax-preload={`${addBackendUrl("api/admin/permissions/all")}`}
                            name="status"
                            // multiple
                          ></select>
                        </div>
                      </div>
                      <div className="d-flex justify-content-end mb-1 gap-2">
                        <button
                          type="submit"
                          className="btn btn-primary d-flex align-items-center gap-2"
                        >
                          <i className="bi bi-search"></i>
                          <span className="me-2">Search</span>
                        </button>
                        <button
                          type="reset"
                          className="btn btn-secondary d-flex align-items-center gap-2"
                          onClick={handleReset}
                        >
                          <i className="bi bi-arrow-counterclockwise"></i>
                          <span className="me-2">Reset</span>
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
          <Table
            data={data}
            handlePageChange={handlePageNumber}
            handlePerPageChange={handlePerPageCount}
            handleOrderChange={handleOrder}
            page="Permissions"
            reRender={reRender}
            loading={loading}
          />
        </main>
      )}
    </div>
  );
};

export default Permissions;
