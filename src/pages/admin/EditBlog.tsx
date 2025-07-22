import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { AdminLayout } from '../../components/AdminLayout'
import { ArrowLeft, Save } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export const EditBlog: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    author: '',
    cover_url: ''
  })
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      fetchBlog()
    }
  }, [id])

  const fetchBlog = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      
      setFormData({
        title: data.title,
        slug: data.slug,
        content: data.content,
        author: data.author,
        cover_url: data.cover_url || ''
      })
    } catch (error) {
      console.error('Error fetching blog:', error)
      setError('Failed to load blog')
    } finally {
      setFetchLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Get current user for authentication
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        setError('User not authenticated')
        return
      }

      const { error } = await supabase
        .from('articles')
        .update({
          title: formData.title,
          slug: formData.slug,
          content: formData.content,
          author: formData.author,
          cover_url: formData.cover_url || null
        })
        .eq('id', id)

      if (error) {
        if (error.code === '23505') {
          setError('A blog with this slug already exists')
        } else {
          setError(`Failed to update blog: ${error.message}`)
        }
      } else {
        toast.success('Blog updated successfully!')
        navigate('/admin/blogs')
      }
    } catch (err: any) {
      console.error('Error updating blog:', err)
      setError(`An unexpected error occurred: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Link
            to="/admin/blogs"
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Blogs</span>
          </Link>
          <h1 className="text-3xl font-bold font-serif text-slate-900">Edit Blog</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  placeholder="Enter blog title"
                />
              </div>
              
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-slate-700 mb-2">
                  Author *
                </label>
                <input
                  type="text"
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  placeholder="Author name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-slate-700 mb-2">
                Slug *
              </label>
              <input
                type="text"
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="blog-url-slug"
              />
            </div>

            <div>
              <label htmlFor="cover_url" className="block text-sm font-medium text-slate-700 mb-2">
                Cover Image URL
              </label>
              <input
                type="url"
                id="cover_url"
                value={formData.cover_url}
                onChange={(e) => setFormData(prev => ({ ...prev, cover_url: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-2">
                Content *
              </label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                required
                rows={12}
                className="w-full px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="Write your blog content here... (HTML supported)"
              />
              <p className="text-sm text-slate-500 mt-1">You can use HTML tags for formatting</p>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-200">
              <Link
                to="/admin/blogs"
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors duration-200"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || !formData.title || !formData.content || !formData.author}
                className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-6 py-3 rounded-md font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
              >
                <Save className="h-5 w-5" />
                <span>{loading ? 'Updating...' : 'Update Blog'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}