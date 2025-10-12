"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as z from 'zod'
import { createClient } from "@/lib/supabase/server";

const loginCredentialsBaseSchema = z.object({
  name: z.string().min(1, "Too Short"),
  email:z.string().email("Not an Email").min(1, "Too Short"),
  password: z.string().min(4, "Password should be of atleast 4 letters").regex(/^(?=.*[a-zA-Z])(?=.*\d)/, "Password must contain both letters and numbers")
})

const loginSchema = loginCredentialsBaseSchema.omit({name:true})
type LoginCredentialType = z.infer<typeof loginSchema>

export async function login(userDetails: LoginCredentialType) {
  const {success, data, error} = loginSchema.safeParse(userDetails)
  const supabase = await createClient();
  
  if(!success){
    const newErrors: {[key: string]: string} = {}
    const errors = z.flattenError(error)

    const propertyWithErrors = Object.keys(errors.fieldErrors)
    propertyWithErrors.forEach(property => {
      const fieldError = errors.fieldErrors[property as keyof typeof errors.fieldErrors]
      if (fieldError) {
        newErrors[property] = fieldError[0]
      }
    })

    return {
      code:401,
      message: "Invalid Credentials",
      error: newErrors
    }
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({email: data?.email, password: data?.password});

  if (signInError) {
    redirect("/error?message="+ signInError.message);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

const signinSchema = loginCredentialsBaseSchema
type SigninCredentialType = z.infer<typeof signinSchema>

export async function signup(userDetails: SigninCredentialType) {
  const {success, data, error} = signinSchema.safeParse(userDetails)
  const supabase = await createClient();
  
  if(!success){
    const newErrors: {[key: string]: string} = {}
    const errors = z.flattenError(error)

    const propertyWithErrors = Object.keys(errors.fieldErrors)
    propertyWithErrors.forEach(property => {
      const fieldError = errors.fieldErrors[property as keyof typeof errors.fieldErrors]
      if (fieldError) {
        newErrors[property] = fieldError[0]
      }
    })

    return {
      code:401,
      message: "Invalid Credentials",
      error: newErrors
    }
  }
    const { error: signInError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          fullName: data.name
        },
      }
    });
    if (signInError) {
      redirect("/error?message="+ signInError.message);
    }

  return {
    code: 200,
    message: "Please check your email",
    success:true
  }
}
