import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { ReactNode } from 'react'

export default async function ProtectedRoute({children} : {children: ReactNode}) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return <>{children}</>
}