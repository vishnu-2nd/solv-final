import { createServerSupabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { ArrowLeft, Calendar, User } from 'lucide-react'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const supabase = createServerSupabase()
  
  const { data: article } = await supabase
    .from('articles')
    .select('title, content')
    .eq('slug', params.slug)
    .single()

  if (!article) {
    return {
      title: 'Article Not Found | SOLV Legal'
    }
  }

  const description = article.content.replace(/<[^>]*>/g, '').substring(0, 160)

  return {
    title: `${article.title} | SOLV Legal`,
    description,
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const supabase = createServerSupabase()
  
  const { data: article, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (error || !article) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-slate-50 py-8 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/blog"
            className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Articles
          </Link>
          
          <h1 className="text-3xl lg:text-4xl font-bold font-serif text-slate-900 mb-6 leading-tight">
            {article.title}
          </h1>
          
          <div className="flex items-center space-x-6 text-slate-600">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(article.created_at)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      {article.cover_url && (
        <div className="relative h-64 md:h-96 overflow-hidden">
          <Image
            src={article.cover_url}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Article Content */}
      <article className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="prose prose-slate prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </article>

      {/* Footer CTA */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold font-serif mb-4">Need Legal Assistance?</h2>
          <p className="text-slate-300 mb-8">
            Our expert legal team is here to help you navigate complex legal challenges.
          </p>
          <Link
            href="/contact"
            className="bg-white text-slate-900 px-8 py-3 rounded-md font-semibold hover:bg-slate-100 transition-colors inline-block"
          >
            Contact Our Experts
          </Link>
        </div>
      </section>
    </div>
  )
}