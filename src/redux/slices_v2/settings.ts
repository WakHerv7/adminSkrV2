import { createSlice } from "@reduxjs/toolkit";

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {        
      version: 2,
  },
  reducers: {
      setVersion: (state, action) => {
          console.log("STATE VERSION :: ", action.payload);
          state.version = action.payload;
      },
  },
})

export const { setVersion } = settingsSlice.actions

export default settingsSlice.reducer

export const selectCurrentVersion = (state:any) => state.settings.version;

