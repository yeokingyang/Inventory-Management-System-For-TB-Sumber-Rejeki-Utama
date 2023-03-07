import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
};

const CheckInSlice = createSlice({
  name: "checkin",
  initialState,
  reducers: {
    open: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});
export const { open } = CheckInSlice.actions;
export default CheckInSlice.reducer;