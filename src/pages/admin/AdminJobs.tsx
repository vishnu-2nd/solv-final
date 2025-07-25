import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { AdminLayout } from '../../components/AdminLayout'
import { Plus, Edit, Trash2, MapPin, Clock, Briefcase, Calendar } from 'lucide-react'

interface Job {
  id: string
  title: string
  department: string
  location: string
  type: string
  experience: string
  created_at: string
  updated_at: string
}

// Cache for jobs data to avoid repeated API calls
let jobsCache: Job[] | null = null
let jobsCacheTimestamp: number = 0
const JOBS_CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export const AdminJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    // Check if we have valid cached data
    const now = Date.now()
    if (jobsCache && jobsCacheTimestamp && (now - jobsCacheTimestamp) < JOBS_CACHE_DURATION) {
      setJobs(jobsCache)
      setLoading(false)
      return
    }
    
    try {
      console.log('Fetching jobs...')
      const { data, error } = await supabase
        .from('jobs')
        .select('id, title, department, location, type, experience, created_at, updated_at')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error fetching jobs:', error)
        throw error
      }
      
      console.log('Jobs fetched successfully:', data?.length || 0, 'jobs')
      setJobs(data || [])
      // Cache the jobs data
      jobsCache = data || []
      jobsCacheTimestamp = now
    } catch (error) {
      console.error('Error fetching jobs:', error)
      console.error('Full error details:', JSON.stringify(error, null, 2))
      // Clear cache on error
      jobsCache = null
      jobsCacheTimestamp = 0
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return
    }

    setDeleting(id)
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setJobs(jobs.filter(job => job.id !== id))
      // Update cache after deletion
      if (jobsCache) {
        jobsCache = jobsCache.filter(job => job.id !== id)
      }
    } catch (error) {
      console.error('Error deleting job:', error)
      alert('Failed to delete job')
    } finally {
      setDeleting(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-serif text-slate-900">Job Management</h1>
            <p className="text-slate-600 mt-2">Manage job postings and career opportunities</p>
          </div>
          <Link
            to="/admin/jobs/create"
            className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-6 py-3 rounded-md font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 inline-flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Create New Job</span>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
              <p className="text-slate-600 mt-4">Loading jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No jobs posted yet</h3>
              <p className="text-slate-600 mb-6">Get started by posting your first job opening.</p>
              <Link
                to="/admin/jobs/create"
                className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-6 py-3 rounded-md font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 inline-flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Create Job</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {jobs.map((job) => (
                <div key={job.id} className="bg-slate-50 border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 line-clamp-2">{job.title}</h3>
                    <div className="flex items-center space-x-1 ml-2">
                      <Link
                        to={`/admin/jobs/edit/${job.id}`}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition-colors duration-200"
                        title="Edit Job"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(job.id, job.title)}
                        disabled={deleting === job.id}
                        className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
                        title="Delete Job"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <Briefcase className="h-4 w-4" />
                      <span>{job.department}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <Clock className="h-4 w-4" />
                      <span>{job.type} • {job.experience}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-200">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>Created {formatDate(job.created_at)}</span>
                    </div>
                    {job.updated_at !== job.created_at && (
                      <span>Updated {formatDate(job.updated_at)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}