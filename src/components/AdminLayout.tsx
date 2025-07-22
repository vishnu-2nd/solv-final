import React from 'react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Scale, LayoutDashboard, FileText, Briefcase, LogOut, Home, Users, Tag, Menu, X, ChevronRight } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

interface AdminLayoutProps {
  children: React.ReactNode
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { adminUser, isSuperAdmin } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin')
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Blogs', href: '/admin/blogs', icon: FileText },
    { name: 'Tags', href: '/admin/tags', icon: Tag },
    { name: 'Jobs', href: '/admin/jobs', icon: Briefcase },
    ...(isSuperAdmin() ? [{ name: 'Users', href: '/admin/users', icon: Users }] : []),
  ]

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 ${sidebarOpen ? 'w-64' : 'w-16'} bg-slate-900 text-white transition-all duration-300`}>
        <div className="flex items-center space-x-2 p-6 border-b border-slate-800">
          <Scale className="h-8 w-8 flex-shrink-0" />
          {sidebarOpen && (
            <div>
              <span className="text-xl font-bold font-serif">SOLV Admin</span>
              {adminUser && (
                <p className="text-sm text-slate-400">{adminUser.name}</p>
              )}
            </div>
          )}
          {sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-auto p-1 rounded-md hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        <nav className="mt-6">
          <div className="px-3 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href)
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  } ${!sidebarOpen ? 'justify-center' : ''}`}
                  title={!sidebarOpen ? item.name : ''}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && <span>{item.name}</span>}
                </Link>
              )
            })}
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-800 px-3 space-y-1">
            <Link
              to="/"
              className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors duration-200 ${!sidebarOpen ? 'justify-center' : ''}`}
              title={!sidebarOpen ? 'View Website' : ''}
            >
              <Home className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span>View Website</span>}
            </Link>
            <button
              onClick={handleLogout}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors duration-200 ${!sidebarOpen ? 'justify-center' : ''}`}
              title={!sidebarOpen ? 'Logout' : ''}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </nav>
      </div>

      {/* Sidebar Open Button - Only visible when sidebar is closed */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-6 left-20 z-40 bg-slate-900 text-white p-2 rounded-md hover:bg-slate-800 transition-colors shadow-lg"
          title="Open Sidebar"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      {/* Main content */}
      <div className={`${sidebarOpen ? 'pl-64' : 'pl-16'} transition-all duration-300`}>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}