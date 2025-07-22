import { createServerSupabase } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import CreateArticleForm from '@/components/CreateArticleForm'

export default async function CreateArticlePage() {
  const supabase = createServerSupabase()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold font-serif text-slate-900 mb-8">Create New Article</h1>
          <CreateArticleForm />
        </div>
      </div>
    </div>
  )
}