import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

interface AdminUser {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'admin'
  auth_user_id: string
}

// Cache for admin data to avoid repeated API calls
let adminUserCache: AdminUser | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    let timeoutId: NodeJS.Timeout

    const initializeAuth = async () => {
      try {
        setError(null)
        
        // Set a timeout for the auth check
        timeoutId = setTimeout(() => {
          if (mounted) {
            setError('Authentication timeout. Please refresh the page.')
            setLoading(false)
          }
        }, 10000) // 10 second timeout
        
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!mounted) return
        
        clearTimeout(timeoutId)
        
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchAdminUser(session.user.id)
        } else {
          // Clear cache when user logs out
          adminUserCache = null
          cacheTimestamp = 0
          setAdminUser(null)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        if (mounted) {
          setError('Failed to initialize authentication')
          setLoading(false)
        }
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchAdminUser(session.user.id)
        } else {
          // Clear cache when user logs out
          adminUserCache = null
          cacheTimestamp = 0
          setAdminUser(null)
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      if (timeoutId) clearTimeout(timeoutId)
      subscription.unsubscribe()
    }
  }, [])

  const fetchAdminUser = async (authUserId: string) => {
    // Check if we have valid cached data
    const now = Date.now()
    if (adminUserCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
      setAdminUser(adminUserCache)
      setLoading(false)
      return
    }
    
    let timeoutId: NodeJS.Timeout
    
    try {
      // Set timeout for admin user fetch
      timeoutId = setTimeout(() => {
        setError('Failed to load admin data. Please refresh the page.')
        setLoading(false)
      }, 8000) // 8 second timeout
      
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('auth_user_id', authUserId)
        .maybeSingle()

      clearTimeout(timeoutId)

      if (error) {
        console.error('Error fetching admin user:', error)
        setError('Failed to load admin user data')
        setAdminUser(null)
        adminUserCache = null
        cacheTimestamp = 0
      } else {
        setAdminUser(data)
        // Cache the admin user data
        adminUserCache = data
        cacheTimestamp = now
        setError(null)
      }
    } catch (error) {
      console.error('Error fetching admin user:', error)
      setError('Network error while loading admin data')
      setAdminUser(null)
      adminUserCache = null
      cacheTimestamp = 0
    } finally {
      setLoading(false)
    }
  }

  const isSuperAdmin = () => adminUser?.role === 'super_admin'
  const isAdmin = () => adminUser?.role === 'admin' || adminUser?.role === 'super_admin'

  // Retry function for failed requests
  const retry = () => {
    // Clear cache on retry
    adminUserCache = null
    cacheTimestamp = 0
    setLoading(true)
    setError(null)
    if (user) {
      fetchAdminUser(user.id)
    }
  }
  return {
    user,
    adminUser,
    loading,
    error,
    isSuperAdmin,
    isAdmin,
    retry
  }
}