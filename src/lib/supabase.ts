import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          cover_url: string | null
          featured_image: string | null
          excerpt: string | null
          is_featured: boolean
          status: 'draft' | 'published' | 'archived'
          author: string
          author_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          cover_url?: string | null
          featured_image?: string | null
          excerpt?: string | null
          is_featured?: boolean
          status?: 'draft' | 'published' | 'archived'
          author: string
          author_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          cover_url?: string | null
          featured_image?: string | null
          excerpt?: string | null
          is_featured?: boolean
          status?: 'draft' | 'published' | 'archived'
          author?: string
          author_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'super_admin' | 'admin'
          auth_user_id: string
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: 'super_admin' | 'admin'
          auth_user_id: string
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'super_admin' | 'admin'
          auth_user_id?: string
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
      blog_tags: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          color: string
          created_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          color?: string
          created_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          color?: string
          created_at?: string
          created_by?: string | null
        }
      }
      blog_tag_relations: {
        Row: {
          id: string
          article_id: string
          tag_id: string
          created_at: string
        }
        Insert: {
          id?: string
          article_id: string
          tag_id: string
          created_at?: string
        }
        Update: {
          id?: string
          article_id?: string
          tag_id?: string
          created_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          title: string
          department: string
          location: string
          type: string
          experience: string
          description: string
          requirements: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          department: string
          location: string
          type: string
          experience: string
          description: string
          requirements: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          department?: string
          location?: string
          type?: string
          experience?: string
          description?: string
          requirements?: string[]
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}