import { createSlice, PayloadAction } from '@reduxjs/toolkit'


type AuthState = { token?: string | null; user?: { name?: string; email?: string } }


const initialState: AuthState = { token: null, user: undefined }


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
login(state, action: PayloadAction<{ token: string; user?: AuthState['user'] }>) {
state.token = action.payload.token
state.user = action.payload.user
},
logout(state) {
    state.token = null
    state.user = undefined
},
},
})


export const { login, logout } = authSlice.actions
export default authSlice.reducer