import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { AdminLayout } from '../../components/AdminLayout'
import { RichTextEditor } from '../../components/RichTextEditor'
import { ArrowLeft, Save } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export const EditBlog: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    status: 'published' as 'draft' | 'published',
    is_featured: false,
    featured_image: '',
    video_url: '',
    selected_author_id: '',
    selectedTags: [] as string[]
  })
  const [tags, setTags] = useState<any[]>([])
  const [authors, setAuthors] = useState<any[]>([])
  const [uploadingImage, setUploadingImage] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [loadingAuthors, setLoadingAuthors] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      fetchBlog()
      fetchTags()
      fetchAuthors()
    }
  }, [id])

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

  const fetchAuthors = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id, name, email')
        .order('name')

      if (error) throw error
      setAuthors(data || [])
    } catch (error) {
      console.error('Error fetching authors:', error)
      toast.error('Failed to load authors')
    } finally {
      setLoadingAuthors(false)
    }
  }
  const fetchBlog = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          blog_tag_relations (
            blog_tags (
              id,
              name,
              color
            )
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      
      const articleTags = data.blog_tag_relations?.map((rel: any) => rel.blog_tags.id) || []
      
      setFormData({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || '',
        content: data.content,
        status: data.status || 'published',
        is_featured: data.is_featured || false,
        featured_image: data.featured_image || data.cover_url || '',
        video_url: data.video_url || '',
        selected_author_id: data.author_id || '',
        selectedTags: articleTags
      })
    } catch (error) {
      console.error('Error fetching blog:', error)
      setError('Failed to load blog')
    } finally {
      setFetchLoading(false)
    }
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

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Title is required')
      return
    }

    if (!formData.content.trim()) {
      toast.error('Content is required')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        toast.error('User not authenticated. Please log in again.')
        setLoading(false)
        return
      }

      // Determine author
      let authorData
      if (formData.selected_author_id) {
        // Use selected author
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', formData.selected_author_id)
          .single()
        
        if (error || !data) {
          toast.error('Selected author not found')
          setLoading(false)
          return
        }
        authorData = data
      } else {
        // Use current logged-in user as author
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('auth_user_id', user.id)
          .single()

        if (error || !data) {
          toast.error('Current user admin data not found. Please contact support.')
          setLoading(false)
          return
        }
        authorData = data
      }

      const finalSlug = formData.slug.trim() || generateSlug(formData.title)
      const { error: articleError } = await supabase
        .from('articles')
        .update({
          title: formData.title,
          slug: finalSlug,
          excerpt: formData.excerpt,
          content: formData.content,
          author: authorData.name,
          author_id: authorData.id,
          status: formData.status,
          is_featured: formData.is_featured,
          featured_image: formData.featured_image || null,
          cover_url: formData.featured_image || null, // Keep for backward compatibility
          video_url: formData.video_url || null
        })
        .eq('id', id)

      if (articleError) {
        console.error('Article update error:', articleError)
        if (articleError.code === '23505') {
          toast.error('A blog with this slug already exists. Please use a different title or slug.')
        } else {
          toast.error(`Failed to update blog: ${articleError.message}`)
        }
        setLoading(false)
        return
      }

      toast.success('Blog updated successfully!')
      navigate('/admin/blogs')
    } catch (err: any) {
      console.error('Error updating blog:', err)
      toast.error(`An unexpected error occurred: ${err.message || 'Please try again'}`)
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
        </div>
      </div>
    </AdminLayout>
  )
  )
}