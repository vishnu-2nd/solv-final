import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { AdminLayout } from '../../components/AdminLayout'
import { Plus, Edit, Trash2, Eye, Calendar, User, FileText } from 'lucide-react'

interface Blog {
  id: string
  title: string
  slug: string
  author: string
  created_at: string
  updated_at: string
}

export const AdminBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      console.log('Fetching blogs...')
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, slug, author, created_at, updated_at')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error fetching blogs:', error)
        throw error
      }
      
      console.log('Blogs fetched successfully:', data?.length || 0, 'blogs')
      setBlogs(data || [])
    } catch (error) {
      console.error('Error fetching blogs:', error)
      console.error('Full error details:', JSON.stringify(error, null, 2))
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
        .from('articles')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setBlogs(blogs.filter(blog => blog.id !== id))
    } catch (error) {
      console.error('Error deleting blog:', error)
      alert('Failed to delete blog')
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
            <h1 className="text-3xl font-bold font-serif text-slate-900">Blog Management</h1>
            <p className="text-slate-600 mt-2">Manage your blog posts and articles</p>
          </div>
          <Link
            to="/admin/blogs/create"
            className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-6 py-3 rounded-md font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 inline-flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Create New Blog</span>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
              <p className="text-slate-600 mt-4">Loading blogs...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No blogs yet</h3>
              <p className="text-slate-600 mb-6">Get started by creating your first blog post.</p>
              <Link
                to="/admin/blogs/create"
                className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-6 py-3 rounded-md font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 inline-flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Create Blog</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Updated
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {blogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-slate-900">
                            {blog.title}
                          </div>
                          <div className="text-sm text-slate-500">
                            /{blog.slug}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-900">{blog.author}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-500">{formatDate(blog.created_at)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {formatDate(blog.updated_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <a
                            href={`/blog/${blog.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-600 hover:text-slate-900 p-2 rounded-md hover:bg-slate-100 transition-colors duration-200"
                            title="View Blog"
                          >
                            <Eye className="h-4 w-4" />
                          </a>
                          <Link
                            to={`/admin/blogs/edit/${blog.id}`}
                            className="text-blue-600 hover:text-blue-900 p-2 rounded-md hover:bg-blue-50 transition-colors duration-200"
                            title="Edit Blog"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(blog.id, blog.title)}
                            disabled={deleting === blog.id}
                            className="text-red-600 hover:text-red-900 p-2 rounded-md hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
                            title="Delete Blog"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}