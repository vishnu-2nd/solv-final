import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { AdminLayout } from '../../components/AdminLayout'
import { useAuth } from '../../hooks/useAuth'
import { Plus, Edit, Trash2, Tag, Palette } from 'lucide-react'
import toast from 'react-hot-toast'

interface BlogTag {
  id: string
  name: string
  slug: string
  description: string | null
  color: string
  created_at: string
}

export const TagManagement: React.FC = () => {
  const { adminUser, isAdmin } = useAuth()
  const [tags, setTags] = useState<BlogTag[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTag, setEditingTag] = useState<BlogTag | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6'
  })

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ]

  useEffect(() => {
    if (isAdmin()) {
      fetchTags()
    } else {
      setLoading(false)
    }
  }, [adminUser])

  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_tags')
        .select('*')
        .order('name')

      if (error) throw error
      setTags(data || [])
    } catch (error) {
      console.error('Error fetching tags:', error)
      toast.error('Failed to load tags')
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const slug = generateSlug(formData.name)
      
      if (editingTag) {
        const { error } = await supabase
          .from('blog_tags')
          .update({
            name: formData.name,
            slug,
            description: formData.description || null,
            color: formData.color
          })
          .eq('id', editingTag.id)

        if (error) throw error
        toast.success('Tag updated successfully')
      } else {
        const { error } = await supabase
          .from('blog_tags')
          .insert({
            name: formData.name,
            slug,
            description: formData.description || null,
            color: formData.color,
            created_by: adminUser?.id
          })

        if (error) throw error
        toast.success('Tag created successfully')
      }

      setShowModal(false)
      setEditingTag(null)
      setFormData({ name: '', description: '', color: '#3B82F6' })
      fetchTags()
    } catch (error: any) {
      console.error('Error saving tag:', error)
      toast.error(error.message || 'Failed to save tag')
    }
  }

  const handleEdit = (tag: BlogTag) => {
    setEditingTag(tag)
    setFormData({
      name: tag.name,
      description: tag.description || '',
      color: tag.color
    })
    setShowModal(true)
  }

  const handleDelete = async (tagId: string, tagName: string) => {
    if (!confirm(`Are you sure you want to delete "${tagName}"?`)) return

    try {
      const { error } = await supabase
        .from('blog_tags')
        .delete()
        .eq('id', tagId)

      if (error) throw error
      toast.success('Tag deleted successfully')
      fetchTags()
    } catch (error: any) {
      console.error('Error deleting tag:', error)
      toast.error('Failed to delete tag')
    }
  }

  if (!isAdmin()) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <Tag className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-600">You need admin access to manage tags.</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-serif text-slate-900">Tag Management</h1>
            <p className="text-slate-600 mt-2">Organize your blog posts with tags</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-6 py-3 rounded-md font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 inline-flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Tag</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
              <p className="text-slate-600 mt-4">Loading tags...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {tags.map((tag) => (
                <div key={tag.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                      <h3 className="font-semibold text-slate-900">{tag.name}</h3>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleEdit(tag)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                        title="Edit Tag"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tag.id, tag.name)}
                        className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                        title="Delete Tag"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">/{tag.slug}</p>
                  {tag.description && (
                    <p className="text-sm text-slate-500">{tag.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add/Edit Tag Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  {editingTag ? 'Edit Tag' : 'Add New Tag'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                      placeholder="Tag name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                      placeholder="Optional description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Color
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {colors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, color }))}
                          className={`w-8 h-8 rounded-full border-2 ${
                            formData.color === color ? 'border-slate-900' : 'border-slate-300'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false)
                        setEditingTag(null)
                        setFormData({ name: '', description: '', color: '#3B82F6' })
                      }}
                      className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800"
                    >
                      {editingTag ? 'Update' : 'Create'} Tag
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}