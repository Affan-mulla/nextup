import { useTheme } from 'next-themes'
import React, { useState, useEffect } from 'react'

const Switcher4 = () => {
  const [isChecked, setIsChecked] = useState(false)
  const { setTheme, theme } = useTheme()

  useEffect(() => {
    // keep switch in sync with current theme
    setIsChecked(theme === 'dark')
  }, [theme])

  const handleCheckboxChange = () => {
    const next = !isChecked
    setIsChecked(next)
    setTheme(next ? 'dark' : 'light')
  }

  return (
    <label className='flex cursor-pointer select-none items-center'>
      <div className='relative'>
        <input
          type='checkbox'
          checked={isChecked}
          onChange={handleCheckboxChange}
          className='sr-only'
        />
        <div
          className={`box block h-6 w-12 rounded-full transition-colors ${
            isChecked ? 'bg-primary' : 'bg-gray-400'
          }`}
        ></div>
        <div
          className={`absolute left-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white transition-transform ${
            isChecked ? 'translate-x-6' : ''
          }`}
        ></div>
      </div>
    </label>
  )
}

export default Switcher4
