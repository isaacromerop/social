import { SET_USER, REMOVE_USER } from "../../types/types";

const UserReducer = (state, action) => {
  switch (action.type) {
    case SET_USER:
      return {
          ...state,
        user: action.payload,
      };
    case REMOVE_USER:
      return {
        ...state,
        user: null,
      };

    default:
      return state;
  }
};

export default UserReducer;
