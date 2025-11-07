import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('theme-dark')
    return saved ? JSON.parse(saved) : false
  }
  return false
}

const themeSlice = createSlice({
  name: 'theme',
  initialState: { dark: getInitialTheme() },
  reducers: {
    toggleTheme(state) {
      state.dark = !state.dark
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme-dark', JSON.stringify(state.dark))
      }
    },
    setTheme(state, action: PayloadAction<boolean>) {
      state.dark = action.payload
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme-dark', JSON.stringify(state.dark))
      }
    },
  },
})

export const { toggleTheme, setTheme } = themeSlice.actions
export default themeSlice.reducer
