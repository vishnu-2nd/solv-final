import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react';

const getEmbedUrl = (url: string): string => {
  // YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }
  
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }
  
  // Return original URL if no match
  return url;
};

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const fetchArticle = async () => {
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
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;
      setArticle(data);
    } catch (error) {
      console.error('Error fetching article:', error);
      setError('Article not found');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="pt-16 min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Article Not Found</h1>
          <Link to="/research" className="text-slate-600 hover:text-slate-900">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-white">
      {/* Header */}
      <header className="bg-slate-50 py-8 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/research"
            className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
          
          <div className="flex items-center space-x-2 mb-4">
            {article.blog_tag_relations?.slice(0, 3).map((rel: any) => (
              <span 
                key={rel.blog_tags.id}
                className="text-white text-sm px-3 py-1 rounded-full"
                style={{ backgroundColor: rel.blog_tags.color }}
              >
                {rel.blog_tags.name}
              </span>
            ))}
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold font-serif text-slate-900 mb-6 leading-tight">
            {article.title}
          </h1>
          
          {article.excerpt && (
            <p className="text-xl text-slate-600 mb-6">{article.excerpt}</p>
          )}
          
          <div className="flex items-center space-x-6 text-slate-600">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(article.created_at)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{getReadTime(article.content)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {(article.featured_image || article.cover_url) && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative h-64 md:h-96 overflow-hidden rounded-lg shadow-lg">
          <img
            src={article.featured_image || article.cover_url}
            alt={article.title}
            className="w-full h-full object-cover rounded-lg"
          />
          </div>
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
            to="/contact"
            className="bg-white text-slate-900 px-8 py-3 rounded-md font-semibold hover:bg-slate-100 transition-colors inline-block"
          >
            Contact Our Experts
          </Link>
        </div>
      </section>
    </div>
  );
};