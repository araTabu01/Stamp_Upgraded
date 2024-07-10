import axios from "axios";
import { LOGIN_SUCCESS, LOGIN_FAIL } from "../constants/actionTypes";

export const login = (username, password) => async (dispatch) => {
  try {
    const res = await axios.post("/api/login", { username, password });
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data.token,
    });
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
      payload: err.response.data.message,
    });
  }
};

export const loginMiddleware =
  ({ dispatch }) =>
  (next) =>
  async (action) => {
    if (action.type === LOGIN_SUCCESS) {
      localStorage.setItem("token", action.payload);

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${action.payload}`;
    }

    return next(action);
  };
