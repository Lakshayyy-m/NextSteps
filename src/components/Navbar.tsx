'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/button';
import { MoonIcon, SunIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [user, setUser] = useState<null | User>(null)
  const [mounted, setMounted] = useState(false)
  const { theme, toggleTheme } = useTheme();
  const supabase = createClient()
  const router = useRouter()
  
  useEffect(() => {
    setMounted(true)
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    getUser()
  }, [supabase.auth])
  const signOut = async () => {
    const {error} = await supabase.auth.signOut()
    if(error) {
      toast("Error Signing out!");
      return;
    }
    
    toast("Signed out successfully");
    // Redirect to login page after successful signout
    router.push('/login');
  }
  
  // Prevent hydration mismatch by not rendering user-dependent content until mounted
  if (!mounted) {
    return (
      <div className='p-4 flex justify-between items-center'>
        <h1 className='text-text text-3xl font-semibold font-logo italic'>NS</h1>
        <div className='flex gap-5 items-center'>
          <button
            onClick={toggleTheme}
            className='bg-primary text-secondary px-4 py-2 rounded-md hover:bg-accent transition-colors duration-200 cursor-pointer'
          >
            <MoonIcon />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='p-4 flex justify-between items-center'>
      <h1 className='text-text text-3xl font-semibold font-logo italic'>NS</h1>
      <div className='flex gap-5 items-center'>
        {user && (
          <Button className='cursor-pointer hover:bg-accent' onClick= {signOut}>
            Sign Out
          </Button>
        )}
        <button
          onClick={toggleTheme}
          className='bg-primary text-secondary px-4 py-2 rounded-md hover:bg-accent transition-colors duration-200 cursor-pointer'
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
      </div>
    </div>
  )
}

export default Navbar
