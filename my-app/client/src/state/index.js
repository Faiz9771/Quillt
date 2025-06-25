import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: "dark",
    userId: "66f05e69a13b21f17a6ec611"
};

export const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers:{
        setMode:(state)=>{
            state.mode = state.mode === 'light' ? "dark" : 'light';
        }
    }
})

export const {setMode} = globalSlice.actions;

export default globalSlice.reducer;