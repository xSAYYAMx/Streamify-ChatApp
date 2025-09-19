import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { login } from '../lib/api';
import { ShipWheelIcon } from 'lucide-react';
import { Link } from 'react-router';
import useLogin from '../hooks/useLogin.js';
const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  })

  // This is how we did it withpout using the custom hook
  // const queryClient = useQueryClient();

  // const {mutate:loginMutation , isPending, error} = useMutation({
  //   mutationFn: login,
  //   onSuccess: ()=> queryClient.invalidateQueries({queryKey: ['authUser']}),
  //   onError: ()=>{

  //   }
  // }) 

  const { isPending, error, loginMutation } = useLogin()

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  }

  return (
    <div className='h-screen flex items-center justify-center p-4 sm:p-6 md:p-8' data-theme="forest">

    <div className='border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden'>
      {/* LOGIN FORM SECTION */}
      <div className='w-full lg:w-1/2 p-4 sm:p-8 flex flex-col'>
        <div className='mb-4 flex items-center justify-start gap-2'>
          <ShipWheelIcon className='text-primary size-9' />
          <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>Streamify</span>
        </div>

        {/* ERROR MESSAGE DISPLAY */}
        {error && (
          <div className='alert alert-error mb-4'>
          <span>{error.response.data.message}</span>
        </div>
        )}

        <div className='w-full'>
          <form onSubmit={handleLogin}>
            <div className='-space-y-1'>
              <div>
                <h2 className='text-xl font-semibold'>Welcome back</h2>
                <p className='text-sm opacity-70'>
                  Sign in to your account to continue your language journey
                </p>
              </div>

              <div className='flex flex-col gap-3'>
                <div className='form-control w-full space-y-2'>
                  <label className='label'>
                    <span className='label-text'>Email</span>
                  </label>
                  <input 
                    type="email"
                    placeholder='hello@example.com'
                    className='input input-bordered w-full'
                    value={loginData.email}
                    onChange={(e)=>{setLoginData({...loginData, email: e.target.value})}}
                    required
                  />
                </div>

                <div className='form-control w-full space-y-2'>
                  <label className='label'>
                    <span className='label-text'>Password</span>
                  </label>
                  <input 
                    type="password"
                    placeholder='*********'
                    className='input input-bordered w-full'
                    value={loginData.password}
                    onChange={(e)=>{setLoginData({...loginData, password: e.target.value})}}
                    required
                  />
                </div>

                <button type='submit' className='btn btn-primary w-full' disabled={isPending}>
                  {isPending? (
                    <>
                      <span className='loading loading-spinner loading-xs'></span>
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>

                <div className='text-center mt-4'>
                  <p className='text-sm'>
                    Don't have an account?{" "}
                    <Link to="/signup" className='text-primary hover:underline'>
                      Create One
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* IMAGE */}
      <div className='hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center'>
      <div className='max-w-md p-8'>
        {/* ILLUSTRATION */}
        <div className='relative aspect-square max-w-sm mx-auto'>
          <img src="/i.png" alt="Language connection illustration" className='w-full h-full' />
        </div>

        <div className='text-center space-y-3 mt-6'>
          <h2 className='text-xl font-semibold'>Connect with language partners worldwide</h2>
          <p className='opacity-70'>
            Practice comversations, make friends, and improve your language skills together 
          </p>
        </div>
      </div>
      </div>
    </div>

    </div>
  )
}

export default LoginPage