import Hero from "@/components/Hero";
import FileInput from "@/components/FileInput";
import UserBooks from "@/components/UserBooks";
import { createClient } from "@/lib/supabase/server";

interface SupabaseFileUrl {
  data?: {
    publicUrl: string
  }
  publicUrl?: string
}

export default async function Home() {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  // Fetch user's books from the database
  const { data: userData } = await supabase
    .from('users')
    .select('files')
    .eq('id', user?.id)
    .single()
  
  // Get the file URLs and fetch metadata from storage
  const fileUrls = userData?.files || []
  const booksWithMetadata = await Promise.all(
    fileUrls.map(async (fileUrl: SupabaseFileUrl | string) => {
      // Handle the structure returned by getPublicUrl
      const publicUrl = typeof fileUrl === 'string' 
        ? fileUrl 
        : fileUrl?.data?.publicUrl || fileUrl?.publicUrl || ''
      if (!publicUrl || typeof publicUrl !== 'string') return null
      
      // Extract the object path from the public URL
      const objectPath = publicUrl.split('/user_books/')[1]
      if (!objectPath) return null
      
      // Get file metadata from storage
      const { data: fileData } = await supabase
        .storage
        .from('user_books')
        .list(objectPath.split('/')[0], {
          search: objectPath.split('/')[1]?.split('__')[0]
        })
      
      return {
        publicUrl: publicUrl,
        data: fileData?.[0] || {}
      }
    })
  )
  
  const validBooks = booksWithMetadata.filter(book => book !== null)
  
  return (
    <>
      <Hero />
      <FileInput />
      <UserBooks books={validBooks} />
    </>  
  );
}
