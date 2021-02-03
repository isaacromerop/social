import React, { useReducer } from "react";
import UserContext from "./UserContext";
import { SET_USER, REMOVE_USER } from "../../types/types";
import UserReducer from "./UserReducer";
import Cookie from "js-cookie";

const UserState = ({ children }) => {
  const user = Cookie.getJSON("user");
  const initialState = {
    user: user || null,
  };
  const logUser = (user) => {
    dispatch({
      type: SET_USER,
      payload: user,
    });
  };
  const removeUser = () => {
    dispatch({
      type: REMOVE_USER,
    });
  };
  const [state, dispatch] = useReducer(UserReducer, initialState);
  return (
    <UserContext.Provider value={{ user: state.user, logUser, removeUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserState;
