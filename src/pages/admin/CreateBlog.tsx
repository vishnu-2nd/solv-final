import React, { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { AdminLayout } from '../../components/AdminLayout'
import { useAuth } from '../../hooks/useAuth'
import { RichTextEditor } from '../../components/RichTextEditor'
import { ArrowLeft, Save, Upload, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export const CreateBlog: React.FC = () => {
  const { adminUser } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    status: 'published' as 'draft' | 'published',
    is_featured: false,
    featured_image: '',
    selectedTags: [] as string[]
  })
  const [tags, setTags] = useState<any[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchTags()
  }, [])

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
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleImageUpload = async (file: File) => {
    if (file.size > 102400) { // 100KB limit
      toast.error('Image must be less than 100KB')
      return
    }

    setUploadingImage(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName)

      setFormData(prev => ({ ...prev, featured_image: data.publicUrl }))
      toast.success('Image uploaded successfully')
    } catch (error: any) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  const toggleTag = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tagId)
        ? prev.selectedTags.filter(id => id !== tagId)
        : [...prev.selectedTags, tagId]
    }))
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setLoading(true)
    setError('')

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        setError('User not authenticated')
        return
      }

      // Get admin user info
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('auth_user_id', user.id)
        .single()

      if (adminError || !adminData) {
        setError('Admin user not found')
        return
      }

      const { data: articleData, error: articleError } = await supabase
        .from('articles')
        .insert([{
          title: formData.title,
          slug: formData.slug || generateSlug(formData.title),
          excerpt: formData.excerpt,
          content: formData.content,
          author: adminData.name,
          author_id: adminData.id,
          status: formData.status,
          is_featured: formData.is_featured,
          featured_image: formData.featured_image || null
        }])
        .select()
        .single()

      if (articleError) {
        if (articleError.code === '23505') {
          setError('A blog with this slug already exists')
        } else {
          setError(`Failed to create blog: ${articleError.message}`)
        }
        return
      }

      // Add tag relations
      if (formData.selectedTags.length > 0) {
        const tagRelations = formData.selectedTags.map(tagId => ({
          article_id: articleData.id,
          tag_id: tagId
        }))

        const { error: tagError } = await supabase
          .from('blog_tag_relations')
          .insert(tagRelations)

        if (tagError) {
          console.error('Error adding tags:', tagError)
        }
      }

      toast.success('Blog created successfully!')
      navigate('/admin/blogs')
    } catch (err: any) {
      console.error('Error creating blog:', err)
      setError(`An unexpected error occurred: ${err.message}`)
    } finally {
      setLoading(false)
    }
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
          <h1 className="text-3xl font-bold font-serif text-slate-900">Create New Blog</h1>
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
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  placeholder="Enter blog title"
                />
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-2">
                  Status *
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-slate-700 mb-2">
                Slug
              </label>
              <input
                type="text"
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="blog-url-slug (auto-generated from title)"
              />
              <p className="text-sm text-slate-500 mt-1">Leave empty to auto-generate from title</p>
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-slate-700 mb-2">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="Brief description of the article (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Featured Image (Max 100KB)
              </label>
              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setImageFile(file)
                      handleImageUpload(file)
                    }
                  }}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100"
                />
                {uploadingImage && (
                  <div className="flex items-center text-sm text-slate-600">
                    <Upload className="h-4 w-4 mr-2 animate-pulse" />
                    Uploading image...
                  </div>
                )}
                {formData.featured_image && (
                  <div className="relative w-32 h-20 rounded-md overflow-hidden">
                    <img
                      src={formData.featured_image}
                      alt="Featured preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, featured_image: '' }))}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      formData.selectedTags.includes(tag.id)
                        ? 'text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                    style={{
                      backgroundColor: formData.selectedTags.includes(tag.id) ? tag.color : undefined
                    }}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_featured"
                checked={formData.is_featured}
                onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
              />
              <label htmlFor="is_featured" className="text-sm font-medium text-slate-700">
                Feature this article
              </label>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-2">
                Content *
              </label>
              <RichTextEditor
                content={formData.content}
                onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                placeholder="Start writing your blog content..."
              />
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
                disabled={loading || !formData.title || !formData.content}
                className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-6 py-3 rounded-md font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
              >
                <Save className="h-5 w-5" />
                <span>{loading ? 'Creating...' : 'Create Blog'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}