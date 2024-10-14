import * as api from "../api/index";
import * as actionType from "../constants/actionTypes";

export const fetch_profile = () => async (dispatch) => {
  try {
    dispatch({ type: actionType.LOADING });

    const response = await api.fetch_profile();
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
};

// actions/crud.js

export const fetch_single_user_info = () => async (dispatch) => {
  try {
    dispatch({ type: actionType.LOADING });
    const response = await api.getSingleUserInfo();
    dispatch({
      type: actionType.FETCH_SINGLE_USER_INFO,
      data: response,
    });
  } catch (error) {
    console.log(error);
  }
};

export const submitStamp = (stampData) => async (dispatch) => {
  try {
    dispatch({ type: actionType.LOADING });
    const response = await api.submit_stamp({ stampData });

    dispatch({ type: actionType.SUBMIT_STAMP, data: response });
  } catch (error) {
    console.log(error);
  }
};

export const fetchStamp = () => async (dispatch) => {
  try {
    dispatch({ type: actionType.LOADING });

    const response = await api.fetch_stamp();
    dispatch({ type: actionType.FETCH_STAMP, data: response.data.data });
  } catch (error) {
    console.log(error);
  }
};

export const deleteStamp =
  ({ id }) =>
  async (dispatch) => {
    try {
      dispatch({ type: actionType.LOADING });
      await api.delete_stamp({ id });
    } catch (error) {
      console.log(error);
    }
  };
