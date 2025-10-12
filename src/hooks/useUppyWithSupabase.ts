import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useRef } from "react";
import Uppy from "@uppy/core";
import Tus from "@uppy/tus";
import Dashboard from "@uppy/dashboard";
import "@uppy/core/css/style.min.css";
import "@uppy/dashboard/css/style.min.css";
import { toast } from "sonner";

/**
 * Custom hook for configuring Uppy with Supabase authentication and TUS resumable uploads
 * @param {Object} options - Configuration options for the Uppy instance.
 * @param {string} options.bucketName - The bucket name in Supabase where files are stored.
 * @returns {Object} uppy - Uppy instance with configured upload settings.
 */
export const useUppyWithSupabase = ({ bucketName }: { bucketName: string }) => {
    // Initialize Uppy instance only once
    const [uppy] = useState(() => new Uppy({
        restrictions: {
            maxNumberOfFiles: 1, // Allow only one file at a time
        }
    }));
    
    // Track if plugins have been initialized
    const pluginsInitialized = useRef(false);
    
    // Initialize Supabase client with project URL and anon key
    const supabase = createClient();
    
    useEffect(() => {
        const initializeUppy = async () => {
            // Only initialize plugins once and only on client side
            if (pluginsInitialized.current || typeof window === 'undefined') return;
            
            // Retrieve the current user's session for authentication
            const {
                data: { session },
            } = await supabase.auth.getSession();
            
            // Check if plugins are already added to prevent duplicates
            if (uppy.getPlugin('Tus') || uppy.getPlugin('Dashboard')) {
                pluginsInitialized.current = true;
                return;
            }
            
            // Add Tus plugin
            uppy.use(Tus, {
                id: 'Tus', // Explicitly set the plugin ID
                // Supabase TUS endpoint (with direct storage hostname)
                endpoint: `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID!}.storage.supabase.co/storage/v1/upload/resumable`,
                retryDelays: [0, 3000, 5000, 10000, 20000], // Retry delays for resumable uploads
                headers: {
                    authorization: `Bearer ${session?.access_token}`, // User session access token
                    apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // API key for Supabase
                },
                uploadDataDuringCreation: true, // Send metadata with file chunks
                removeFingerprintOnSuccess: true, // Remove fingerprint after successful upload
                chunkSize: 6 * 1024 * 1024, // Chunk size for TUS uploads (6MB)
                allowedMetaFields: [
                    "bucketName",
                    "objectName",
                    "contentType",
                    "cacheControl",
                    "metadata",
                ], // Metadata fields allowed for the upload
                onError: (error) => console.error("Upload error:", error), // Error handling for uploads
            });

            // Add Dashboard plugin
            uppy.use(Dashboard, {
                id: 'Dashboard', // Explicitly set the plugin ID
                inline: true,
                target: "#drag-drop-area",
                hideProgressDetails: false
            });

            // Add event handlers after plugins are initialized
            uppy.on("file-added", (file) => {
                // Generate timestamp only on client-side to avoid hydration mismatch
                const timestamp = typeof window !== 'undefined' ? Date.now() : 0;
                
                // Attach metadata to each file, including bucket name and content type
                file.meta = {
                    ...file.meta,
                    bucketName, // Bucket specified by the user of the hook
                    objectName: `${session?.user.id}/${file.name}__${timestamp}`, // Use file name as object name
                    contentType: file.type, // Set content type based on file MIME type
                    metadata: JSON.stringify({ // custom metadata passed to the user_metadata column
                        yourCustomMetadata: true,
                    }),
                };
            });

            uppy.on("upload-success", async (file) => {
                const fileUrl = supabase.storage.from("user_books").getPublicUrl(file?.meta.objectName as string)
                //insert file url in database
                const {data, error: fileArrayFetchError} = await supabase.from("users").select("files").eq("id", session?.user.id)
                if(fileArrayFetchError){
                    supabase.storage.from("user_books").remove([file?.meta.objectName as string])
                    console.log("running fetch error")
                    console.log("Error uploading book, please try again.")
                    toast("Error uploading book, please try again.")
                    return
                }
                
                const currentFileArray = data[0].files ?? []
                currentFileArray.push(fileUrl)
                // update user with new file url
                const {error: fileArrayUpdateError} = await supabase.from("users").update({files: currentFileArray}).eq("id", session?.user.id)
                if(fileArrayUpdateError){
                    supabase.storage.from("user_books").remove([file?.meta.objectName as string])
                    console.log("running update error", fileArrayUpdateError)
                    console.log("Error uploading book, please try again.")
                    toast("Error uploading book, please try again.")
                    return
                }
                toast("Book uploading successfully")
            });
            
            // Mark plugins as initialized
            pluginsInitialized.current = true;
        };
        
        // Initialize Uppy with Supabase settings
        initializeUppy();
    }, [bucketName]); // Remove uppy and supabase from dependencies to prevent re-initialization
    
    // Return the configured Uppy instance
    return uppy;
};