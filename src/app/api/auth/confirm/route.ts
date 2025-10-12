import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'

import { createClient } from '@/lib/supabase/server' 
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'
  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!error) {
      //Since no error, insert record in database
      const { error: insertionError} = await supabase.from("users").insert({id:user?.id, name: user?.user_metadata.fullName, email: user?.email })

      if(insertionError){
        console.log("New record insertion error:---- ",insertionError )
      }
      // redirect user to specified redirect URL or root of app
      redirect(next)
    }
  }

  // redirect the user to an error page with some instructions
  redirect('/error')
}