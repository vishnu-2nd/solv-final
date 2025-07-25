import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, adminUser, loading, error, retry } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading admin panel...</p>
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md max-w-md mx-auto">
              <p className="text-red-700 text-sm mb-2">{error}</p>
              <button
                onClick={retry}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Show error state if there's an error and no user data
  if (error && !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Connection Error</h2>
            <p className="text-slate-600 mb-6">{error}</p>
            <div className="space-y-2">
              <button
                onClick={retry}
                className="w-full bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/admin/login'}
                className="w-full border border-slate-300 text-slate-700 px-4 py-2 rounded-md hover:bg-slate-50"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  // If user is authenticated but not an admin, show access denied
  if (!adminUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Access Denied</h2>
            <p className="text-slate-600 mb-6">
              You don't have admin access. Please contact a super admin to get access.
            </p>
            <div className="space-y-2">
              <button
                onClick={retry}
                className="w-full bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800"
              >
                Retry
              </button>
              <button
                onClick={() => window.location.href = '/admin/login'}
                className="w-full border border-slate-300 text-slate-700 px-4 py-2 rounded-md hover:bg-slate-50"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}