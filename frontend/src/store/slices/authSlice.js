import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoggedIn: false,
  userEmail: null,
  accessToken: null, // new field
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      // action.payload: { email, token }
      state.isLoggedIn = !!action.payload.token
      state.userEmail = action.payload.email
      state.accessToken = action.payload.token
    },
    logout: (state) => {
      state.isLoggedIn = false
      state.userEmail = null
      state.accessToken = null
    },
    setAuthFromStorage: (state, action) => {
      // action.payload: { email, token }
      state.isLoggedIn = !!action.payload?.token
      state.userEmail = action.payload?.email || null
      state.accessToken = action.payload?.token || null
    }
  }
})

export const { login, logout, setAuthFromStorage } = authSlice.actions
export default authSlice.reducer
