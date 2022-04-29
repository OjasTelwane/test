import axios from 'axios';
import { SessionStorageKeywords } from '../../shared/constants/global-constant';
import { setAuthToken } from '../services/central-operations.service';
import { setAlert } from './alert';
import {
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FIRST_TIME,
  LOGOUT,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  USER_LOADED,
  CHANGEPASSWORD_SUCCESS,
  CHANGEPASSWORD_FAIL
} from './constants';
//load user
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.get('authenticate');
    sessionStorage.setItem(
      SessionStorageKeywords.currentUser,
      JSON.stringify(res.data)
    );
    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};
//Register user
export const register =
  ({ name, empId, email, password }) =>
  async (dispatch) => {
    const newUser = {
      name,
      empId,
      email,
      password
    };
    const body = JSON.stringify(newUser);
    try {
      const res = await axios.post('register', body);
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
      });
      dispatch(loadUser());
    } catch (error) {
      const errors = error.response.data.errors;
      if (errors) {
        errors.array.forEach((element) => {
          dispatch(setAlert(error.msg, 'danger'));
        });
      }
      dispatch({
        type: REGISTER_FAIL
      });
    }
  };
//Login user
export const login =
  ({ empId, password }) =>
  async (dispatch) => {
    const newLogin = {
      empId,
      password
    };
    const body = JSON.stringify(newLogin);
    console.log('login body==>', body);
    try {
      const res = await axios.post('login', body);
      if(res.data.isFirstTime) {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: res.data
        });
        dispatch(loadUser());
        dispatch({
          type: LOGIN_FIRST_TIME,
          payload: res.data
        });
      } else {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: res.data
        });
        dispatch(loadUser());
      }
    } catch (error) {
      const errors = error?.message
        ? error?.message
        : error?.response?.data?.errors;
      if (typeof errors === 'object') {
        errors.forEach((element) => {
          dispatch(setAlert(element.msg, 'danger'));
        });
      } else {
        dispatch(setAlert('Invalid Credentials', 'danger'));
      }
      dispatch({
        type: LOGIN_FAIL
      });
    }
  };
  //Logout / Clear user
export const logout = () => (dispatch) => {
  dispatch({
    type: LOGOUT
  });
};

//Change Password
export const changePassword =
  ({ id, oldPassword, newPassword }) =>
  async (dispatch) => {
    const updatePassword = {
      id,
      oldPassword,
      newPassword
    };
    const body = JSON.stringify(updatePassword);
    try {
      const res = await axios.post('updatePassword', body);
      dispatch({
        type: CHANGEPASSWORD_SUCCESS,
        payload: res.data
      });
      dispatch(loadUser());
    } catch (error) {
      const errors = error?.message
        ? error?.message
        : error?.response?.data?.errors;
      if (typeof errors === 'object') {
        errors.forEach((element) => {
          dispatch(setAlert(element.msg, 'danger'));
        });
      } else {
        dispatch(setAlert('Invalid Credentials', 'danger'));
      }
      dispatch({
        type: CHANGEPASSWORD_FAIL
      });
    }
  };
