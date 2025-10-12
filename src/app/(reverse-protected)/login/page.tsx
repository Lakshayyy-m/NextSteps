'use client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { login, signup } from '@/lib/actions/auth.action'
import { Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'
import * as z from "zod"

const loginCredentialsBaseSchema = z.object({
  name: z.string().min(1, "Name is too Short"),
  email:z.string().email("Not an Email").min(1, "Too Short"),
  password: z.string().min(4, "Password should be of atleast 4 letters").regex(/^(?=.*[a-zA-Z])(?=.*\d)/, "Password must contain both letters and numbers")
})

const loginSchema = loginCredentialsBaseSchema.omit({name:true})
const signinSchema = loginCredentialsBaseSchema


const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const toggleForm = () => {
    setIsLogin(!isLogin)
    setErrors({})
    setFormData({
      email: '',
      password: '',
      name: '',
      confirmPassword: ''
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    if(isLogin){
      const {success, error} = loginSchema.safeParse(formData)

      if(!success){
        const errors = z.flattenError(error)
  
        const propertyWithErrors = Object.keys(errors.fieldErrors)
        propertyWithErrors.forEach(property => {
          const fieldError = errors.fieldErrors[property as keyof typeof errors.fieldErrors]
          if (fieldError) {
            newErrors[property] = fieldError[0]
          }
        })
      }
    } else {
      const {success, error} = signinSchema.safeParse(formData)

      if(!success){
        const errors = z.flattenError(error)
  
        const propertyWithErrors = Object.keys(errors.fieldErrors)
        propertyWithErrors.forEach(property => {
          const fieldError = errors.fieldErrors[property as keyof typeof errors.fieldErrors]
          if (fieldError) {
            newErrors[property] = fieldError[0]
          }
        })
      }
      if (!formData.confirmPassword.trim()) {
        newErrors.confirmPassword = 'Please confirm your password'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
      
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    if (validateForm()) {
      if (isLogin) {
        console.log('reacgubg ghre')
        const {error} = await login(formData)
        setErrors(error)
      } else {
        const { error, message }=  await signup(formData)
        if(error) setErrors(error)
        toast(message)
      }
    }
    setIsLoading(false)
  }

  return (
    <div className="w-full h-[calc(100vh-5rem)] flex flex-col justify-center items-center font-main text-text">   
      <Card className='bg-secondary  w-[90%] max-w-[500px] flex flex-col gap-10 justify-center items-center p-10'>
        <h3 className=' text-5xl font-bold '>
          {isLogin ? 'Login' : 'Sign Up'}
        </h3>     
        <div className='flex flex-col gap-2 w-full'>
          <Label htmlFor='email' className='font-bold'>Email</Label>
          <Input 
            type='email' 
            id="email" 
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && <span className='text-red-500 text-sm'>{errors.email}</span>}
        </div>
        
        {!isLogin && (
          <div className='flex flex-col gap-2 w-full'>
            <Label htmlFor='name' className='font-bold'>Full Name</Label>
            <Input 
              type='text' 
              id="name" 
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <span className='text-red-500 text-sm'>{errors.name}</span>}
          </div>
        )}
        
        <div className='flex flex-col gap-2 w-full'>
          <Label htmlFor='password' className='font-bold'>Password</Label>
          <Input 
            type='password' 
            id="password" 
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={errors.password ? 'border-red-500' : ''}
          />
          {errors.password && <span className='text-red-500 text-sm'>{errors.password}</span>}
        </div>
        
        {!isLogin && (
          <div className='flex flex-col gap-2 w-full'>
            <Label htmlFor='confirmPassword' className='font-bold'>Confirm Password</Label>
            <Input 
              type='password' 
              id="confirmPassword" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={errors.confirmPassword ? 'border-red-500' : ''}
            />
            {errors.confirmPassword && <span className='text-red-500 text-sm'>{errors.confirmPassword}</span>}
          </div>
        )}
        
        <Button onClick={handleSubmit} className='bg-primary w-full font-bold cursor-pointer'>
          {isLoading?<Loader2 className='text-text animate-spin' />:isLogin ? 'Login' : 'Sign Up'}
        </Button>
        
        <div className='text-center'>
          <p className='text-sm text-text/70'>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button
            onClick={toggleForm}
            type='button'
            className='text-primary hover:text-primary/80 underline text-sm font-medium transition-colors cursor-pointer'
            >
            {isLogin ? 'Sign up here' : 'Login here'}
          </button>
        </div>
      </Card>
  </div>
  )
}

export default LoginPage
