'use client'
import { FileUpIcon } from 'lucide-react'
import React, { useRef, useState, useEffect } from 'react'
import { useUppyWithSupabase } from '@/hooks/useUppyWithSupabase';

const FileInput = () => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [currentFile, setCurrentFile] = useState<File | null>(null)
    const [mounted, setMounted] = useState(false)
    
    // Initialize Uppy instance with the 'sample' bucket specified for uploads
    const uppy = useUppyWithSupabase({ bucketName: "user_books" });

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setCurrentFile(file)
        }

        //? You want to implement resumable uplaods here, but are taking care of auth first
        //handle file upload on client side
        //upload it on supabase storage
        //get url from storage and save it in the users table
    }

  // Prevent hydration mismatch by not rendering Uppy-dependent content until mounted
  if (!mounted) {
    return (
      <>
        <div id='drag-drop-area' className='flex justify-center items-center my-20'>
        </div>
        <div className='w-full flex flex-col items-center justify-center my-20'>
          <input hidden ref={fileInputRef} type='file' accept='.pdf,.epub,.mobi,.azw,.azw3,.fb2,.txt,.rtf,.doc,.docx,.odt,.djvu,.cbr,.cbz,.ibooks,.lit,.prc,.pdb,.chm,.html,.htm,.xml,.opf,.xhtml' onChange={handleFileUpload} />
          <div className="max-w-5xl w-[80%] max-h-[420px] h-[400px] rounded-4xl bg-primary flex justify-center items-center gap-2 text-secondary hover:cursor-pointer relative group" onClick={() => fileInputRef.current?.click()}>
            <div className='h-full w-full border-accent border-4 absolute rounded-4xl -z-10 group-hover:scale-x-[1.02] group-hover:scale-y-[1.05] transition-transform duration-300 ease-in-out'/>
            <div className='h-full w-full border-accent border-4 absolute rounded-4xl -z-10 group-hover:scale-x-[1.04] group-hover:scale-y-[1.1] transition-transform duration-300 ease-in-out'/>
            <FileUpIcon className='' />
            <span>Upload</span>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
    <div id='drag-drop-area' className='flex justify-center items-center my-20'>

    </div>
    <div className='w-full flex flex-col items-center justify-center my-20'>
       <input hidden ref={fileInputRef} type='file' accept='.pdf,.epub,.mobi,.azw,.azw3,.fb2,.txt,.rtf,.doc,.docx,.odt,.djvu,.cbr,.cbz,.ibooks,.lit,.prc,.pdb,.chm,.html,.htm,.xml,.opf,.xhtml' onChange={handleFileUpload} />
      <div className="max-w-5xl w-[80%] max-h-[420px] h-[400px] rounded-4xl bg-primary flex justify-center items-center gap-2 text-secondary hover:cursor-pointer relative group" onClick={() => fileInputRef.current?.click()}>
        <div className='h-full w-full border-accent border-4 absolute rounded-4xl -z-10 group-hover:scale-x-[1.02] group-hover:scale-y-[1.05] transition-transform duration-300 ease-in-out'/>
        <div className='h-full w-full border-accent border-4 absolute rounded-4xl -z-10 group-hover:scale-x-[1.04] group-hover:scale-y-[1.1] transition-transform duration-300 ease-in-out'/>
        <FileUpIcon className='' />
        <span>Upload</span>
      </div>
    </div>
    </>
  )
}

export default FileInput
