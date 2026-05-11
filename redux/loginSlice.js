import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  user: {
    email: '',
    uid: '',
    fullName: '',
  }
};
const loginSlice = createSlice({
  initialState,
  name: "Login",
  reducers: {
    setTrue(state) {
      state.isLoggedIn = true;
    },
    setFalse(state) {
      state.isLoggedIn = false;
    },
    setUser(state, action) {
      state.user = action.payload
    }
  },
});


export const { setFalse, setTrue, setUser } = loginSlice.actions
export default loginSlice.reducer