import { configureStore } from '@reduxjs/toolkit'
import eventsReducer from './slices/eventsSlice'
import filtersReducer from './slices/filtersSlice'
import authReducer from './slices/authSlice'

export const store = configureStore({
  reducer: {
    events: eventsReducer,
    filters: filtersReducer,
    auth: authReducer,
  },
})

export default store
