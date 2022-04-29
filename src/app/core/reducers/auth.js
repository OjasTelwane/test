import {
  AUTH_ERROR,
  CHANGEPASSWORD_FAIL,
  CHANGEPASSWORD_SUCCESS,
  LOGIN_FAIL,
  LOGIN_FIRST_TIME,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  USER_LOADED
} from '../actions/constants';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  authLoading: true,
  isFirstTime: null,
  user: null
};

const authReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        authLoading: false,
        user: payload
      };
    case LOGIN_FIRST_TIME:
      localStorage.setItem('token', payload.token);   
      const ftResult = {
        ...state,
        ...payload,
        isAuthenticated: true,
        authLoading: false,
        isFirstTime: true
      };
      return ftResult;
    case CHANGEPASSWORD_SUCCESS:
      return {
        ...state,
        isFirstTime: false
      };      
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);
      const result = {
        ...state,
        ...payload,
        isAuthenticated: true,
        authLoading: false
      };
      return result;
    case CHANGEPASSWORD_FAIL:
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
      // localStorage.removeItem('token');
      localStorage.clear();
      sessionStorage.clear();
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        authLoading: false,
        isFirstTime: false
      };

    default:
      return state;
  }
};

export default authReducer;
