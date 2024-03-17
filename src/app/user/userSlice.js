import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLogin: false,
  info: {
    username: "",
  },
};

// about logout: https://stackoverflow.com/questions/74200761/having-an-issue-with-redux-persist-not-updating-localstorage/74200926#74200926
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuc: (state, action) => {
      state.isLogin = true;
      state.info = action.payload;
    },
    loginRefresh: (state, action) => {
      state.info.token = action.payload.token;
      let rtoken = action.payload.refreshToken
      if(rtoken !== undefined && rtoken !== "") {
        state.info.refreshToken = rtoken;
      }
    },
    logout: (state) => {
      state.isLogin = false;
      state.info = {
        username: ""
      }
    },
  },
});

export const { loginSuc, logout, loginRefresh } = userSlice.actions;

export const selectIsLogin = (state) => state.user.isLogin;
export const selectUserName = (state) => state.user.info.username;
export const selectUserPrivileges = (state) => state.user.info.privileges;
export const selectUserToken = (state) => state.user.info.token;
export const selectRefreshToken = (state) => state.user.info.refreshToken;
export const selectWaterMark = (state) => state.user.info.watermark;

export default userSlice.reducer;
