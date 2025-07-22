'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientSupabase } from '@/lib/supabase'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { RichTextEditor } from './RichTextEditor'
import { generateSlug } from '@/lib/utils'
import toast from 'react-hot-toast'
import { ArrowLeft, Upload } from 'lucide-react'
import Link from 'next/link'

export default function CreateArticleForm() {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [coverUrl, setCoverUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  
  const router = useRouter()
  const supabase = createClientSupabase()

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!slug) {
      setSlug(generateSlug(value))
    }
  }

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true)
    
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('article-images')
        .upload(fileName, file)

      if (uploadError) {
        toast.error('Failed to upload image')
        return
      }

      const { data } = supabase.storage
        .from('article-images')
        .getPublicUrl(fileName)

      setCoverUrl(data.publicUrl)
      toast.success('Image uploaded successfully')
    } catch (error) {
      toast.error('Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title || !content || !author) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase
        .from('articles')
        .insert({
          title,
          slug: slug || generateSlug(title),
          content,
          author,
          cover_url: coverUrl || null,
        })

      if (error) {
        if (error.code === '23505') {
          toast.error('An article with this slug already exists')
        } else {
          toast.error('Failed to create article')
        }
      } else {
        toast.success('Article created successfully!')
        router.push('/admin')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <Link 
          href="/admin"
          className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Title *"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Enter article title"
            required
          />
          
          <Input
            label="Author *"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author name"
            required
          />
        </div>

        <Input
          label="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="article-url-slug"
          help="Leave empty to auto-generate from title"
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Cover Image
          </label>
          <div className="space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setCoverImage(file)
                  handleImageUpload(file)
                }
              }}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100"
            />
            {uploadingImage && (
              <div className="flex items-center text-sm text-slate-600">
                <Upload className="w-4 h-4 mr-2 animate-pulse" />
                Uploading image...
              </div>
            )}
            {coverUrl && (
              <div className="relative w-32 h-20 rounded-md overflow-hidden">
                <img
                  src={coverUrl}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Content *
          </label>
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Start writing your article..."
          />
        </div>

        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-200">
          <Link href="/admin">
            <Button variant="secondary">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            loading={loading}
            disabled={!title || !content || !author}
          >
            Create Article
          </Button>
        </div>
      </form>
    </div>
  )
}