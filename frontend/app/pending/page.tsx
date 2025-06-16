import Link from 'next/link'
import React from 'react'

const Pending = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <svg 
                className="w-10 h-10 text-blue-500 animate-pulse" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            <div className="absolute -inset-2 border-2 border-blue-200 border-dashed rounded-full animate-ping opacity-75"></div>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Account Pending Approval</h1>
        <p className="text-gray-600 mb-6">
            Your account is pending approval. Please wait for the admin to approve your account.
        </p>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div className="bg-blue-500 h-2.5 rounded-full w-3/4 animate-pulse"></div>
        </div>
        
        <button 
          disabled
          className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition duration-200 cursor-not-allowed opacity-70"
        >
          Logout
        </button>
      </div>
      
      <p className="mt-6 text-sm text-gray-500">Go to <Link href="/login" className='text-blue-500'>Login</Link></p>
    </div>
  )
}

export default Pending