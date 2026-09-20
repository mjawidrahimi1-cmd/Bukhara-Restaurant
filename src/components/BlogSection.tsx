import React from 'react';
import { useStore } from '../context/StoreContext';
import { BlogPost } from '../types';
import { BookOpen, Calendar, Clock, User, ArrowRight } from 'lucide-react';

export const BlogSection: React.FC = () => {
  const { blogPosts, language, t, setSelectedBlogPost } = useStore();

  return (
    <section id="blog" className="py-20 sm:py-28 bg-[#faf8f5] relative border-t border-[#e8e2d9] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0c342b]/10 text-[#0c342b] text-xs font-bold uppercase tracking-widest mb-3">
            <BookOpen className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>{t.blogTitle}</span>
          </div>
          <h2 className="font-serif-title text-3xl sm:text-5xl font-bold text-[#0c342b]">
            {t.blogSubtitle}
          </h2>
          <div className="w-16 h-[2px] bg-[#c5a059] mx-auto mt-4" />
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {blogPosts.map((post: BlogPost) => {
            const title =
              language === 'fa' ? post.titleFa : language === 'ps' ? post.titlePs : post.titleEn;
            const excerpt =
              language === 'fa' ? post.excerptFa : language === 'ps' ? post.excerptPs : post.excerptEn;
            const category =
              language === 'fa' ? post.categoryFa : language === 'ps' ? post.categoryPs : post.categoryEn;

            return (
              <article
                key={post.id}
                className="bg-white rounded-3xl border border-[#e8e2d9] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Image & Category */}
                <div className="relative h-64 sm:h-72 overflow-hidden bg-stone-900">
                  <img
                    src={post.image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-[#0c342b]/85 backdrop-blur-sm text-[#c5a059] border border-[#c5a059]/40 text-xs font-bold tracking-wide">
                      {category}
                    </span>
                  </div>
                </div>

                {/* Article Info */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Metadata Header */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 mb-3">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#c5a059]" />
                        <span>{post.author}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#c5a059]" />
                        <span>{post.date}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#c5a059]" />
                        <span>{post.readTime}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-[#0c342b] group-hover:text-[#c5a059] transition-colors mb-3 leading-snug">
                      {title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-stone-600 leading-relaxed line-clamp-3 mb-6">
                      {excerpt}
                    </p>
                  </div>

                  {/* Read Article Trigger */}
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedBlogPost(post)}
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0c342b] group-hover:text-[#c5a059] transition-colors"
                    >
                      <span>{t.readArticle}</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
