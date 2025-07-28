import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoggedIn: false,
  userEmail: null,
  accessToken: null,
  userRole: null,
  user: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = !!action.payload.token
      state.userEmail = action.payload.email
      state.accessToken = action.payload.token
      state.user = action.payload.user || null
      state.userRole = action.payload.user?.role || null
    },
    logout: (state) => {
      state.isLoggedIn = false
      state.userEmail = null
      state.accessToken = null
      state.userRole = null
      state.user = null
    },
    setAuthFromStorage: (state, action) => {
      state.isLoggedIn = !!action.payload?.token
      state.userEmail = action.payload?.email || null
      state.accessToken = action.payload?.token || null
      state.userRole = action.payload?.user?.role || null
      state.user = action.payload?.user || null
    }
  }
})

export const { login, logout, setAuthFromStorage } = authSlice.actions
export default authSlice.reducer
