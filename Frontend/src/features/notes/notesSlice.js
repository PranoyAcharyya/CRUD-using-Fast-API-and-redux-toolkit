import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    notes:[]
}


const notesSlice = createSlice({
    name:'notes',
    initialState
})