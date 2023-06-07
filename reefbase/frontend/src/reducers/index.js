import { combineReducers } from "redux";
import authReducer from "./auth";
import errorsReducer from "./errors";

export default combineReducers({
  authReducer,
  errorsReducer,
});
