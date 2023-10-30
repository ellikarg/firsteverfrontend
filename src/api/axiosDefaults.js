import axios from "axios";

axios.defaults.baseURL = "https://firsteverbackend-391b6fc97a98.herokuapp.com/";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;

export const axiosReq = axios.create();
export const axiosRes = axios.create();
