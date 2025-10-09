import store from "src/redux/store";

export const getUserToken = () => {
  const state = store.getState();

  return state.auth.token;
};
