import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'
import { MoonIcon } from '../icons/MoonIcon'
import { SunIcon } from '../icons/SunIcon'
export enum Themes {
  Dark = 'dark',
  Light = 'light',
}

const ThemeButton = () => {
  const { resolvedTheme: theme, setTheme } = useTheme()
  console.log('theme', theme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  function toggleTheme() {
    console.log('toggle')
    setTheme(isDarkMode ? Themes.Light : Themes.Dark)
  }

  const isDarkMode = theme === Themes.Dark

  if (!mounted) return null
  return (
    <button
      onClick={toggleTheme}
      title={isDarkMode ? 'toggle light mode' : 'toggle dark mode'}
    >
      {isDarkMode ? <SunIcon size="lg" /> : <MoonIcon size="lg" />}
    </button>
  )
}

export default ThemeButton
