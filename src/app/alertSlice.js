import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  show: false,
  code: "",
  msg: "",
};

export const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    sendAlert: (state, action) => {
      state.show = true;
      state.code = action.payload.code;
      state.msg = action.payload.msg;
    },
    clearAlert: (state) => {
      state.show = false;
      state.code = "";
      state.msg = ""
    },
  },
});

export const { sendAlert, clearAlert } = alertSlice.actions;

export const selectAlertShow = (state) => state.alert.show;
export const selectAlertCode = (state) => state.alert.code;
export const selectAlertMsg = (state) => state.alert.msg;

export default alertSlice.reducer;
