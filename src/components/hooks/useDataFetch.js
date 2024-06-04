import { useState, useEffect } from "react";
import { handleApiCall } from "../../global";
import { useNavigate } from "react-router-dom";
import { useLoadingBar } from "../context/LoadingContext";

const useDataFetch = (apiPath, globalcolumns) => {
  const [pageNumber, setPageNumber] = useState(null);
  const [perPageCount, setPerPageCount] = useState(10);
  const [order, setOrder] = useState("asc");
  const [dummy, setDummy] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const [globalSearchValue, setGlobalSearchValue] = useState("");
  const { startLoading, stopLoading } = useLoadingBar();
  const navigate = useNavigate();
  let params = new URLSearchParams(window.location.search);
  function handleFormVisible() {
    setFormVisible(!formVisible);
  }
  function handleGlobalSearchChange(value) {
    setGlobalSearchValue(value);
  }
  useEffect(() => {
    if (params.get("globalsearch")) {
      setFormVisible(true);
    } else if (
      !params.get("globalsearch") &&
      !params.get("per_page") &&
      !params.get("page") &&
      params.size > 0
    ) {
      setFormVisible(true);
    }
  }, []);

  const handlePageNumber = (page) => {
    setPageNumber(page);
  };

  const handleOrder = (order) => {
    setOrder(order);
  };

  const handlePerPageCount = (count) => {
    setPageNumber(1);
    setPerPageCount(count);
  };

  const reRender = () => {
    setDummy(!dummy);
  };

  const handleReset = () => {
    const inputFields = document.querySelectorAll("input");
    inputFields.forEach((field) => {
      field.value = "";
    });
    setGlobalSearchValue("");
    navigate(``);
  };

  const fetchData = () => {
    const formData = new FormData();
    if (pageNumber != null) {
      formData.append("page", pageNumber);
    }
    if (perPageCount != null) {
      formData.append("per_page", perPageCount);
    }
    formData.append("sort_column", "id");
    formData.append("sort_by", "asc");
    handleApiCall({
      method: "POST",
      apiPath: apiPath,
      body: formData,
      onSuccess: onSuccess,
      onError: onError,
    });
  };

  const onSuccess = (result) => {
    setData(result.data);
    setLoading(false);
    stopLoading();
    if (firstLoad) setFirstLoad(false);
  };

  const onError = (error) => {
    setLoading(false);
    stopLoading();
    if (firstLoad) setFirstLoad(false);
  };
  const fetchFilteredData = () => {
    const formData = new FormData();
    let params = new URLSearchParams(window.location.search);
    let allFields = [];
    for (const [key, value] of params.entries()) {
      allFields.push(key);
    }
    if (!allFields.includes("sort_by")) {
      formData.append("sort_column", "id");
      formData.append("sort_by", "asc");
    }
    allFields.map((item, index) => {
      if (item === "page") {
        formData.append("page", params.get(item));
      } else if (item === "per_page") {
        formData.append("per_page", params.get(item));
      } else if (item === "sort_column") {
        formData.append("sort_column", params.get(item));
      } else if (item === "sort_by") {
        formData.append("sort_by", params.get(item));
      } else if (item === "globalsearch") {
        globalcolumns.map((item, index) =>
          formData.append(`global_filters[columns][${index}]`, item)
        );
        formData.append("global_filters[value]", params.get(item));
      } else {
        formData.append(`filters[${index}][type]`, "string");
        formData.append(`filters[${index}][field]`, item);
        formData.append(`filters[${index}][operation]`, "like");
        formData.append(`filters[${index}][value]`, params.get(item));
      }
    });
    handleApiCall({
      method: "POST",
      apiPath: apiPath,
      body: formData,
      onSuccess: onSuccess,
      onError: onError,
    });
  };
  useEffect(() => {
    if (
      window.location.href.includes(apiPath.split("/")[1]) &&
      window.location.search === ""
    ) {
      if (firstLoad) {
        setLoading(true);
        fetchData();
      } else {
        startLoading();
        fetchData();
      }
    }
    if (
      window.location.href.includes(apiPath.split("/")[1]) &&
      window.location.search !== ""
    ) {
      startLoading();
      fetchFilteredData();
    }
  }, [pageNumber, apiPath, dummy, perPageCount, window.location.search]);
  // Add other methods as needed
  const handleAddToURL = () => {
    let url = new URL(window.location.href);
    let params = new URLSearchParams(url.search);

    params = new URLSearchParams();

    const inputFields = document.querySelectorAll("input");

    inputFields.forEach((field) => {
      if (field.name) {
        const value = field.value.trim();
        if (field.type === "radio") {
          if (field.checked) {
            params.append(field.name, field.value);
          }
        } else {
          if (value !== "") {
            params.append(field.name, value);
          }
        }
      }
    });
    const selectFields = document.querySelectorAll(".select-field");
    selectFields.forEach((field) => {
      if (field.name) {
        const value = field.value.trim();
        if (value !== "") {
          params.append(field.name, value);
        }
      }
    });
    navigate(`?${params}`);
  };
  return {
    pageNumber,
    perPageCount,
    order,
    dummy,
    data,
    loading,
    formVisible,
    handleGlobalSearchChange,
    firstLoad,
    globalSearchValue,
    handlePageNumber,
    handleOrder,
    handlePerPageCount,
    reRender,
    handleReset,
    handleFormVisible,
    handleAddToURL,
  };
};

export default useDataFetch;
