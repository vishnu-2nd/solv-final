import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { AdminLayout } from '../../components/AdminLayout'
import { FileText, Briefcase, Users, TrendingUp } from 'lucide-react'

// Cache for dashboard stats to avoid repeated API calls
let statsCache: any = null
let statsCacheTimestamp: number = 0
const STATS_CACHE_DURATION = 10 * 60 * 1000 // 10 minutes

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalJobs: 0,
    recentBlogs: 0,
    recentJobs: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    // Check if we have valid cached data
    const now = Date.now()
    if (statsCache && statsCacheTimestamp && (now - statsCacheTimestamp) < STATS_CACHE_DURATION) {
      setStats(statsCache)
      setLoading(false)
      return
    }
    
    try {
      setError(null)
      console.log('Fetching dashboard stats...')
      
      // Get total blogs
      const { count: totalBlogs, error: blogsError } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
      
      if (blogsError) {
        console.error('Error fetching blogs count:', blogsError)
        throw blogsError
      }

      // Get total jobs
      const { count: totalJobs, error: jobsError } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
      
      if (jobsError) {
        console.error('Error fetching jobs count:', jobsError)
        throw jobsError
      }

      // Get recent blogs (last 7 days)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      
      const { count: recentBlogs, error: recentBlogsError } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString())
      
      if (recentBlogsError) {
        console.error('Error fetching recent blogs:', recentBlogsError)
        throw recentBlogsError
      }

      // Get recent jobs (last 7 days)
      const { count: recentJobs, error: recentJobsError } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString())
      
      if (recentJobsError) {
        console.error('Error fetching recent jobs:', recentJobsError)
        throw recentJobsError
      }

      console.log('Dashboard stats fetched successfully:', {
        totalBlogs,
        totalJobs,
        recentBlogs,
        recentJobs
      })
      
      const newStats = {
        totalBlogs: totalBlogs || 0,
        totalJobs: totalJobs || 0,
        recentBlogs: recentBlogs || 0,
        recentJobs: recentJobs || 0
      }
      
      setStats(newStats)
      // Cache the stats data
      statsCache = newStats
      statsCacheTimestamp = now
    } catch (error) {
      console.error('Error fetching stats:', error)
      console.error('Full error details:', JSON.stringify(error, null, 2))
      setError('Failed to load dashboard statistics')
      // Clear cache on error
      statsCache = null
      statsCacheTimestamp = 0
    } finally {
      setLoading(false)
    }
  }

  const retry = () => {
    // Clear cache on retry
    statsCache = null
    statsCacheTimestamp = 0
    setLoading(true)
    setError(null)
    fetchStats()
  }
  const statCards = [
    {
      title: 'Total Blogs',
      value: stats.totalBlogs,
      icon: FileText,
      color: 'bg-blue-500',
      link: '/admin/blogs'
    },
    {
      title: 'Total Jobs',
      value: stats.totalJobs,
      icon: Briefcase,
      color: 'bg-green-500',
      link: '/admin/jobs'
    },
    {
      title: 'Recent Blogs',
      value: stats.recentBlogs,
      icon: TrendingUp,
      color: 'bg-purple-500',
      link: '/admin/blogs'
    },
    {
      title: 'Recent Jobs',
      value: stats.recentJobs,
      icon: Users,
      color: 'bg-orange-500',
      link: '/admin/jobs'
    }
  ]

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Error Loading Dashboard</h2>
            <p className="text-slate-600 mb-6">{error}</p>
            <button
              onClick={retry}
              className="bg-slate-900 text-white px-6 py-3 rounded-md hover:bg-slate-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </AdminLayout>
    )
  }
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-serif text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-2">Welcome to the SOLV admin panel</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card) => (
              <Link
                key={card.title}
                to={card.link}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">{card.title}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{card.value}</p>
                  </div>
                  <div className={`${card.color} p-3 rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/admin/blogs/create"
                className="block w-full bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-md transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5" />
                  <span>Create New Blog Post</span>
                </div>
              </Link>
              <Link
                to="/admin/jobs/create"
                className="block w-full bg-green-50 hover:bg-green-100 text-green-700 px-4 py-3 rounded-md transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <Briefcase className="h-5 w-5" />
                  <span>Post New Job</span>
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent Activity</h2>
            <div className="space-y-3 text-slate-600">
              <p>• {stats.recentBlogs} new blog posts this week</p>
              <p>• {stats.recentJobs} new job postings this week</p>
              <p>• Dashboard last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}