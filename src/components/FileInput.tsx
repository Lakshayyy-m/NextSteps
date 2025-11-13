'use client'
import React, { useState, useEffect } from 'react'
import { useUppyWithSupabase } from '@/hooks/useUppyWithSupabase';

const FileInput = () => {
    const [mounted, setMounted] = useState(false)
    
    // Initialize Uppy instance with the 'user_books' bucket specified for uploads
    const uppy = useUppyWithSupabase({ bucketName: "user_books" });

    useEffect(() => {
        setMounted(true)
    }, [])

  // Prevent hydration mismatch by not rendering Uppy-dependent content until mounted
  if (!mounted) {
    return (
      <div className='w-full flex flex-col items-center justify-center my-20'>
        <div className="max-w-5xl w-[80%] max-h-[420px] h-[400px] rounded-4xl bg-primary/10 animate-pulse" />
      </div>
    )
  }

  return (
    <div className='w-full flex flex-col items-center justify-center my-20'>
      <div className="max-w-5xl w-[80%] relative group">
        {/* Ring animations */}
        <div className='h-full w-full border-accent border-4 absolute rounded-4xl -z-10 group-hover:scale-x-[1.02] group-hover:scale-y-[1.05] transition-transform duration-300 ease-in-out pointer-events-none'/>
        <div className='h-full w-full border-accent border-4 absolute rounded-4xl -z-10 group-hover:scale-x-[1.04] group-hover:scale-y-[1.1] transition-transform duration-300 ease-in-out pointer-events-none'/>
        
        {/* Uppy Dashboard */}
        <div id='drag-drop-area' className='rounded-4xl overflow-hidden' />
      </div>
    </div>
  )
}

export default FileInput
