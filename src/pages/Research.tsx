import React, { useState } from 'react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, User, ArrowRight, BookOpen, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Pagination } from '../components/Pagination';

export const Research: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [articles, setArticles] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9); // 9 articles per page for a 3x3 grid

  useEffect(() => {
    fetchArticlesAndTags();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [selectedFilter, searchTerm]);
  
  const fetchArticlesAndTags = async () => {
    try {
      // Fetch articles with tags
      const { data: articlesData, error: articlesError } = await supabase
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
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (articlesError) throw articlesError;

      // Fetch all tags for filters
      const { data: tagsData, error: tagsError } = await supabase
        .from('blog_tags')
        .select('*')
        .order('name');

      if (tagsError) throw tagsError;

      setArticles(articlesData || []);
      setTags(tagsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filters = ['All', ...tags.map(tag => tag.name)];

  const filteredArticles = articles.filter(article => {
    const matchesFilter = selectedFilter === 'All' || 
      article.blog_tag_relations?.some((rel: any) => rel.blog_tags.name === selectedFilter);
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (article.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const featuredArticles = filteredArticles.filter(article => article.is_featured);
  const regularArticles = filteredArticles.filter(article => !article.is_featured);

  // Pagination calculations
  const totalPages = Math.ceil(regularArticles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedArticles = regularArticles.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of articles section
    const articlesSection = document.getElementById('regular-articles');
    if (articlesSection) {
      articlesSection.scrollIntoView({ behavior: 'smooth' });
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

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-5xl font-bold font-serif mb-6">Research & Articles</h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Stay informed with our latest insights, analysis, and thought leadership on emerging legal trends and industry developments.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
            </div>
          ) : (
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-slate-400" />
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedFilter === filter
                        ? 'bg-slate-800 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>
          )}
        </div>
      </section>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold font-serif text-slate-900 mb-2">Featured Articles</h2>
              <p className="text-slate-600">Essential reading on the most important legal developments</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredArticles.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 group cursor-pointer"
                >
                  <img
                    src={article.featured_image || article.cover_url || 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600'}
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      {article.blog_tag_relations?.slice(0, 2).map((rel: any) => (
                        <span 
                          key={rel.blog_tags.id}
                          className="text-white text-xs px-2 py-1 rounded"
                          style={{ backgroundColor: rel.blog_tags.color }}
                        >
                          {rel.blog_tags.name}
                        </span>
                      ))}
                      <span className="text-slate-500 text-sm">{getReadTime(article.content)}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-slate-700 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-slate-600 mb-4">{article.excerpt || article.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600">{article.author}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600">
                          {formatDate(article.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Regular Articles */}
      <section id="regular-articles" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold font-serif text-slate-900 mb-2">Latest Articles</h2>
            <p className="text-slate-600">Stay current with our ongoing research and analysis</p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
            </div>
          ) : (featuredArticles.length === 0 && filteredArticles.length === 0) ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-16"
            >
              <BookOpen className="h-24 w-24 text-slate-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-slate-900 mb-4">No Articles Available</h3>
              <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                We're working on creating valuable content for you. Check back soon for the latest legal insights, 
                research, and industry analysis from our expert team.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <a
                  href="/contact"
                  className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-8 py-3 rounded-md font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 inline-flex items-center space-x-2"
                >
                  <span>Contact Us</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="/services"
                  className="border-2 border-slate-300 text-slate-700 px-8 py-3 rounded-md font-semibold hover:bg-slate-50 transition-all duration-200 inline-flex items-center space-x-2"
                >
                  <span>Our Services</span>
                </a>
              </div>
            </motion.div>
          ) : regularArticles.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-16"
            >
              <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No Articles Found</h3>
              <p className="text-slate-600">
                No articles match your current search criteria. Try adjusting your filters or search terms.
              </p>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedArticles.map((article, index) => (
                  <motion.article
                    key={article.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 group cursor-pointer"
                    onClick={() => window.open(`/blog/${article.slug}`, '_blank')}
                  >
                    <img
                      src={article.featured_image || article.cover_url || 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600'}
                      alt={article.title}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        {article.blog_tag_relations?.slice(0, 1).map((rel: any) => (
                          <span 
                            key={rel.blog_tags.id}
                            className="text-white text-xs px-2 py-1 rounded"
                            style={{ backgroundColor: rel.blog_tags.color }}
                          >
                            {rel.blog_tags.name}
                          </span>
                        ))}
                        <span className="text-slate-500 text-sm">{getReadTime(article.content)}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-3 group-hover:text-slate-700 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-slate-600 text-sm mb-4">{article.excerpt || article.content.replace(/<[^>]*>/g, '').substring(0, 100) + '...'}</p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{article.author}</span>
                        <span>{formatDate(article.created_at)}</span>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
              
              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItems={regularArticles.length}
              />
            </>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <BookOpen className="h-12 w-12 mx-auto mb-6 text-slate-300" />
            <h2 className="text-3xl font-bold font-serif mb-4">Stay Informed</h2>
            <p className="text-xl text-slate-300 mb-8">
              Subscribe to our newsletter for the latest legal insights and industry updates delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
              <button className="bg-white text-slate-900 px-6 py-3 rounded-md font-semibold hover:bg-slate-100 transition-colors inline-flex items-center justify-center space-x-2">
                <span>Subscribe</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};