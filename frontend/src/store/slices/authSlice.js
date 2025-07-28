import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoggedIn: false,
  userEmail: null,
  accessToken: null,
  userRole: null,
  user: null, // new field for user object
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      // action.payload: { email, token, user }
      state.isLoggedIn = !!action.payload.token
      state.userEmail = action.payload.email
      state.accessToken = action.payload.token
      state.userRole = action.payload.user?.role || null // expects user object with role
      state.user = action.payload.user || null // expects user object
    },
    logout: (state) => {
      state.isLoggedIn = false
      state.userEmail = null
      state.accessToken = null
      state.userRole = null
      state.user = null
    },
    setAuthFromStorage: (state, action) => {
      // action.payload: { email, token, user }
      state.isLoggedIn = !!action.payload?.token
      state.userEmail = action.payload?.email || null
      state.accessToken = action.payload?.token || null
      state.userRole = action.payload?.user?.role || null // expects user object with role
      state.user = action.payload?.user || null
    }
  }
})

export const { login, logout, setAuthFromStorage } = authSlice.actions
export default authSlice.reducer
