import { GET_ERRORS } from "../actions/types";

const initialState = {
  data: {},
  status: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
      return {
        data: action.payload.data,
        status: action.payload.status,
      };
    default:
      return state;
  }
}
