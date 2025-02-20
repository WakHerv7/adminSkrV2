import { createSlice } from "@reduxjs/toolkit";

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {        
      version: 2,
      limitDate:'',
  },
  reducers: {
        setVersion: (state, action) => {
            console.log("STATE VERSION :: ", action.payload);
            state.version = action.payload;
        },
        setLimitDate: (state, action) => {
            const today = new Date();
            const selectedDate = new Date(action.payload);
            if(selectedDate != today){
                const limitDate = action.payload
                state.limitDate = limitDate;
            }
        },
  },
})

export const { setVersion, setLimitDate } = settingsSlice.actions

export default settingsSlice.reducer

export const selectCurrentVersion = (state:any) => state.settings.version;
export const selectLimitDate = (state:any) => state.settings.limitDate;
