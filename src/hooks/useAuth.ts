import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AdminUser {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'admin'
  auth_user_id: string
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!mounted) return
        
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchAdminUser(session.user.id)
        } else {
          setAdminUser(null)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        if (mounted) {
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
          setAdminUser(null)
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const fetchAdminUser = async (authUserId: string) => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('auth_user_id', authUserId)
        .maybeSingle()

      if (error) {
        console.error('Error fetching admin user:', error)
        setAdminUser(null)
      } else {
        setAdminUser(data)
      }
    } catch (error) {
      console.error('Error fetching admin user:', error)
      setAdminUser(null)
    } finally {
      setLoading(false)
    }
  }

  const isSuperAdmin = () => adminUser?.role === 'super_admin'
  const isAdmin = () => adminUser?.role === 'admin' || adminUser?.role === 'super_admin'

  return {
    user,
    adminUser,
    loading,
    isSuperAdmin,
    isAdmin
  }
}