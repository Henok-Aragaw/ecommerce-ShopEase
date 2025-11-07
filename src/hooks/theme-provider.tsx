'use client'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setTheme } from '@/store/slices/themeSlice'

const ThemeProvider = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const saved = localStorage.getItem('theme-dark')
    if (saved) {
      dispatch(setTheme(JSON.parse(saved)))
    }
  }, [dispatch])

  return null
}

export default ThemeProvider
