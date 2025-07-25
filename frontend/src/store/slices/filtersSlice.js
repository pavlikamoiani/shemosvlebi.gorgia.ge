import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selectedLocation: "დიდუბე", // Default location
  locations: [
    "დიდუბე", 
    "წყალსადენი", 
    "გლდანი", 
    "ბათუმი(საკონსერვო)", 
    "ბათუმი (დე-ეს-კა)", 
    "თელავი", 
    "ქუთაისი", 
    "საბურთალო", 
    "რუსთავი", 
    "ლილო", 
    "გორი", 
    "ვაკე"
  ],
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
