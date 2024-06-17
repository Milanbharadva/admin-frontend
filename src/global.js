import axios from "axios";
import { toast } from "react-toastify";

export const adminName = "Admin";
export const logoPath = `${process.env.PUBLIC_URL}/assets/img/logo.png`;
export const guardKey =
  "ksjdfHih8UsIAF87iuDS98aD78AsIqwrsdagwsAF8UzsIOsEO9WE98329O$=";
export const errorToast = (message) => {
  toast.error(message);
};
export const successToast = (message) => {
  toast.success(message);
};
export const warnToast = (message) => {
  toast.warn(message);
};

export const handleApiCall = async ({
  method,
  apiPath,
  body,
  onSuccess,
  onError,
}) => {
  const myHeaders = {
    "Guard-Key": guardKey,
    Authorization: `Bearer ${getLocalStorage("token")}`,
  };

  let axiosConfig = {
    headers: myHeaders,
  };

  try {
    let response;
    apiPath = addBackendUrl(`api/admin${apiPath}`);
    if (method === "GET") {
      response = await axios.get(apiPath, axiosConfig);
    } else {
      response = await axios({
        method: method,
        url: apiPath,
        data: body,
        ...axiosConfig,
      });
    }
    if (response.status === 403) {
      errorToast(response.data.message);
    }
    if (response.status >= 400) {
      onError(response.data);
    } else {
      onSuccess(response.data);
    }
  } catch (error) {
    if (error.response && error.response.status === 400) {
      onError(error.response.data);
    } else if (error.response && error.response.status === 401) {
      removeLocalStorage("token");
      removeLocalStorage("userData");
      window.location.href = window.location.origin + "/admin/login";
    } else if (error.response && error.response.status === 403) {
      // errorToast(error.response.data.message);
      onError(error.response.data);
    } else if (error.response && error.response.status === 500) {
      onError(error.response.data);
    } else {
      onError(`Error in API call: ${error}`);
    }
  }
};

export const setLocalStorage = (key, value) => {
  localStorage.setItem(key, value);
};
export const getLocalStorage = (key) => {
  return localStorage.getItem(key);
};
export const removeLocalStorage = (key) => {
  localStorage.removeItem(key);
};
export const getUserData = async () => {
  return await JSON.parse(getLocalStorage("userData"));
};
export const getRoutePath = (path) => {
  return `/admin/${path}`;
};
export const changeDateFormat = (data) => {
  const date = new Date(data);
  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
  return formattedDate;
};
export const toCapitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
export function customLog(...messages) {
  const timestamp = Date.parse(new Date());
  console.log(`[${timestamp}]`, ...messages);
}
export function addBackendUrl(path) {
  return `http://larareact.sys/${path}`;
}
