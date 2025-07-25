import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoggedIn: false,
  userEmail: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true
      state.userEmail = action.payload
    },
    logout: (state) => {
      state.isLoggedIn = false
      state.userEmail = null
    },
    setAuthFromStorage: (state, action) => {
      state.isLoggedIn = !!action.payload
      state.userEmail = action.payload || null
    }
  }
})

export const { login, logout, setAuthFromStorage } = authSlice.actions
export default authSlice.reducer
