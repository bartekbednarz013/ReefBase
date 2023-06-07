import axios from 'axios';
import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  CHANGE_PASSWORD_SUCCESS,
  DELETE_ACCOUNT_SUCCESS,
  GET_ERRORS,
} from './types';

//CHECK TOKEN AND LOAD USER
export const loadUser = () => (dispatch, getState) => {
  //User Loading
  dispatch({ type: USER_LOADING });

  axios
    .get('/api/auth/user', tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: {
          data: err.response.data,
          status: err.response.status,
        },
      });
      dispatch({
        type: AUTH_ERROR,
      });
    });
};

//LOGIN USER
export const login = (username, password) => (dispatch) => {
  //Headers
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  //Request body
  const body = JSON.stringify({ username, password });

  axios
    .post('/api/auth/login', body, config)
    .then((res) => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: {
          data: err.response.data,
          status: err.response.status,
        },
      });
      dispatch({
        type: LOGIN_FAIL,
      });
    });
};

//LOGOUT USER
export const logout = () => (dispatch, getState) => {
  axios
    .post('/api/auth/logout', null, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: LOGOUT_SUCCESS,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: {
          data: err.response.data,
          status: err.response.status,
        },
      });
    });
};

//REGISTER USER
export const register =
  ({ username, password, email }) =>
  (dispatch) => {
    //Headers
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    //Request body
    const body = JSON.stringify({ username, email, password });

    axios
      .post('/api/auth/register', body, config)
      .then((res) => {
        dispatch({
          type: GET_ERRORS,
          payload: {
            data: res.data,
            status: res.status,
          },
        });
      })
      .catch((err) => {
        dispatch({
          type: GET_ERRORS,
          payload: {
            data: err.response.data,
            status: err.response.status,
          },
        });
        dispatch({
          type: REGISTER_FAIL,
        });
      });
  };

//CHANGE PASSWORD
export const changePassword = (password) => (dispatch, getState) => {
  //Request body
  const body = JSON.stringify({ password });

  axios
    .post('/api/auth/changePassword', body, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: CHANGE_PASSWORD_SUCCESS,
        payload: res.data,
      });
      dispatch({
        type: GET_ERRORS,
        payload: {
          data: { detail: 'Hasło zostało zmienione' },
          status: res.status,
        },
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: {
          data: err.response.data,
          status: err.response.status,
        },
      });
    });
};

//DELETE ACCOUNT
export const deleteAccount = () => (dispatch, getState) => {
  const config = tokenConfig(getState);
  axios
    .delete('/api/auth/deleteAccount', config)
    .then((res) => {
      dispatch({
        type: DELETE_ACCOUNT_SUCCESS,
      });
      dispatch({
        type: GET_ERRORS,
        payload: { data: res.data, status: res.status },
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: {},
      });
    });
};

// Setup config with token
export const tokenConfig = (getState) => {
  //Get token from state
  const token = getState().authReducer.token;

  //Headers
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  //If token, add to headers config
  if (token) {
    config.headers['Authorization'] = `Token ${token}`;
  }

  return config;
};
