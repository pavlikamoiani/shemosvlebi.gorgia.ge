import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoggedIn: false,
  userEmail: null,
  accessToken: null,
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
      state.user = action.payload.user || null // expects user object
    },
    logout: (state) => {
      state.isLoggedIn = false
      state.userEmail = null
      state.accessToken = null
      state.user = null
    },
    setAuthFromStorage: (state, action) => {
      // action.payload: { email, token, user }
      state.isLoggedIn = !!action.payload?.token
      state.userEmail = action.payload?.email || null
      state.accessToken = action.payload?.token || null
      state.user = action.payload?.user || null
    }
  }
})

export const { login, logout, setAuthFromStorage } = authSlice.actions
export default authSlice.reducer
