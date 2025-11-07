import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type AuthState = { token?: string | null; user?: { name?: string; email?: string } }

//initiate localstorage
const storedAuth = typeof window !== 'undefined' ? localStorage.getItem('auth') : null
const initialState: AuthState = storedAuth ? JSON.parse(storedAuth) : { token: null, user: undefined }

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ token: string; user?: AuthState['user'] }>) {
      state.token = action.payload.token
      state.user = action.payload.user

      localStorage.setItem('auth', JSON.stringify(state))
    },
    logout(state) {
      state.token = null
      state.user = undefined

      localStorage.removeItem('auth')
    },
  },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer
