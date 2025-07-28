import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selectedLocation: null,
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload
    },
  },
})

export const { setSelectedLocation } = filtersSlice.actions
export default filtersSlice.reducer
