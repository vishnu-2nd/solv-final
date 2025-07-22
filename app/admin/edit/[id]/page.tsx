import { createServerSupabase } from '@/lib/supabase'
import { redirect, notFound } from 'next/navigation'
import EditArticleForm from '@/components/EditArticleForm'

interface EditArticlePageProps {
  params: {
    id: string
  }
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const supabase = createServerSupabase()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/admin/login')
  }

  const { data: article, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !article) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold font-serif text-slate-900 mb-8">Edit Article</h1>
          <EditArticleForm article={article} />
        </div>
      </div>
    </div>
  )
}