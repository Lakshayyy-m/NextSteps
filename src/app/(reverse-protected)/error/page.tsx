'use client'

import { useSearchParams } from "next/navigation"

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message')
  
  return (
    <div className="w-full h-[calc(100vh-5rem)] flex flex-col justify-center items-center font-main text-text">
      <div className="bg-secondary p-8 rounded-lg max-w-md w-[90%] text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
        <p className="text-text">
          {message || "Sorry, something went wrong"}
        </p>
        <a 
          href="/login" 
          className="inline-block mt-4 px-4 py-2 bg-primary text-text rounded hover:bg-primary/80 transition-colors"
        >
          Back to Login
        </a>
      </div>
    </div>
  )
}