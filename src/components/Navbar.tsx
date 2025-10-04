'use client';

import React from 'react';
import { useTheme } from '../app/contexts/ThemeContext';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className='p-4 flex justify-between items-center'>
      <h1 className='text-text text-3xl font-semibold font-main italic'>NS</h1>
      <button
        onClick={toggleTheme}
        className='bg-secondary text-primary px-4 py-2 rounded-md hover:bg-accent transition-colors duration-200'
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </div>
  )
}

export default Navbar
