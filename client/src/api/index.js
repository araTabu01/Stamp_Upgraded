import axios from "axios";

const REACT_APP_baseURL = process.env.REACT_APP_baseURL;

const API = axios.create({ baseURL: REACT_APP_baseURL });

export const userLogin = async ({ easyproID, password }) => {
  try {
    const response = await API.post("/api/login", { easyproID, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const fetch_profile = () => API.get("/profile/user");
export const getSingleUserInfo = ({ id }) => API.get(`/profile/${id}`);

export const submit_stamp = ({ stampData }) =>
  API.post("/api/stamps", { stampData });
export const fetch_stamp = () => API.get("/api/stamps");
export const delete_stamp = ({ id }) => API.delete(`/api/stamps/${id}`);
export const update_stamp = ({ id, approvalDate }) =>
  API.patch("/api/stamps", { id, approvalDate });

// Add new function to update substitute name
export const update_substitute_name = ({ id, substituteName }) =>
  API.patch("/api/stamps/substitute-name", { id, substituteName });
