import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { BlogPost, AdminRole } from '../../types';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Search,
  ExternalLink,
  Eye,
  Calendar,
  Clock,
  User,
  Image as ImageIcon,
  Check,
  X,
  Sparkles,
  FileText,
  AlertCircle,
  Lock,
  ShieldAlert,
} from 'lucide-react';

const SUGGESTED_BLOG_IMAGES = [
  {
    label: 'Kabuli Pulao Pot',
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Charcoal Grills',
    url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Afghan Saffron & Spices',
    url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Traditional Bread Naan',
    url: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Tea Ceremony',
    url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80',
  },
];

interface AdminBlogCMSProps {
  userRole?: AdminRole;
}

export const AdminBlogCMS: React.FC<AdminBlogCMSProps> = ({ userRole = 'admin' }) => {
  const { blogPosts, addBlogPost, updateBlogPost, deleteBlogPost, showToast, setSelectedBlogPost } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  // Form states
  const [titleEn, setTitleEn] = useState('');
  const [titleFa, setTitleFa] = useState('');
  const [titlePs, setTitlePs] = useState('');
  const [categoryEn, setCategoryEn] = useState('Afghan Culinary Heritage');
  const [categoryFa, setCategoryFa] = useState('میراث آشپزی افغانستان');
  const [categoryPs, setCategoryPs] = useState('د افغان پخلي میراث');
  const [author, setAuthor] = useState('Bukhara Head Chef');
  const [readTime, setReadTime] = useState('5 min read');
  const [date, setDate] = useState('September 2026');
  const [imageUrl, setImageUrl] = useState(SUGGESTED_BLOG_IMAGES[0].url);
  const [excerptEn, setExcerptEn] = useState('');
  const [excerptFa, setExcerptFa] = useState('');
  const [excerptPs, setExcerptPs] = useState('');
  const [contentEnText, setContentEnText] = useState('');
  const [contentFaText, setContentFaText] = useState('');
  const [contentPsText, setContentPsText] = useState('');

  // Delete confirm modal
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  // Filter posts
  const filteredPosts = blogPosts.filter((post) => {
    if (selectedCategory !== 'all' && post.categoryEn !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        post.titleEn.toLowerCase().includes(q) ||
        post.titleFa.toLowerCase().includes(q) ||
        post.excerptEn.toLowerCase().includes(q) ||
        post.author.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const allCategories = Array.from(new Set(blogPosts.map((p) => p.categoryEn)));

  const handleOpenNewModal = () => {
    setEditingPost(null);
    setTitleEn('');
    setTitleFa('');
    setTitlePs('');
    setCategoryEn('Afghan Culinary Heritage');
    setCategoryFa('میراث آشپزی افغانستان');
    setCategoryPs('د افغان پخلي میراث');
    setAuthor('Bukhara Culinary Team');
    setReadTime('4 min read');
    setDate(new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
    setImageUrl(SUGGESTED_BLOG_IMAGES[0].url);
    setExcerptEn('');
    setExcerptFa('');
    setExcerptPs('');
    setContentEnText('');
    setContentFaText('');
    setContentPsText('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (post: BlogPost) => {
    setEditingPost(post);
    setTitleEn(post.titleEn);
    setTitleFa(post.titleFa);
    setTitlePs(post.titlePs);
    setCategoryEn(post.categoryEn);
    setCategoryFa(post.categoryFa);
    setCategoryPs(post.categoryPs);
    setAuthor(post.author);
    setReadTime(post.readTime);
    setDate(post.date);
    setImageUrl(post.image);
    setExcerptEn(post.excerptEn);
    setExcerptFa(post.excerptFa);
    setExcerptPs(post.excerptPs);
    setContentEnText(post.contentEn.join('\n\n'));
    setContentFaText(post.contentFa.join('\n\n'));
    setContentPsText(post.contentPs.join('\n\n'));
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!titleEn.trim()) {
      showToast('Please enter an English title for the article', 'error');
      return;
    }

    const paragraphsEn = contentEnText
      .split('\n\n')
      .map((p) => p.trim())
      .filter(Boolean);
    const paragraphsFa = (contentFaText || contentEnText)
      .split('\n\n')
      .map((p) => p.trim())
      .filter(Boolean);
    const paragraphsPs = (contentPsText || contentEnText)
      .split('\n\n')
      .map((p) => p.trim())
      .filter(Boolean);

    const slug = titleEn
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    if (editingPost) {
      const updated: BlogPost = {
        ...editingPost,
        slug: editingPost.slug || slug,
        titleEn,
        titleFa: titleFa || titleEn,
        titlePs: titlePs || titleEn,
        categoryEn,
        categoryFa: categoryFa || categoryEn,
        categoryPs: categoryPs || categoryEn,
        author,
        readTime,
        date,
        image: imageUrl,
        excerptEn: excerptEn || titleEn,
        excerptFa: excerptFa || titleFa || titleEn,
        excerptPs: excerptPs || titlePs || titleEn,
        contentEn: paragraphsEn.length > 0 ? paragraphsEn : [excerptEn || titleEn],
        contentFa: paragraphsFa.length > 0 ? paragraphsFa : [excerptFa || titleFa || titleEn],
        contentPs: paragraphsPs.length > 0 ? paragraphsPs : [excerptPs || titlePs || titleEn],
      };
      updateBlogPost(updated);
    } else {
      const newPost: BlogPost = {
        id: `blog-${Date.now()}`,
        slug: slug || `article-${Date.now()}`,
        titleEn,
        titleFa: titleFa || titleEn,
        titlePs: titlePs || titleEn,
        categoryEn,
        categoryFa: categoryFa || categoryEn,
        categoryPs: categoryPs || categoryEn,
        author,
        readTime,
        date,
        image: imageUrl,
        excerptEn: excerptEn || titleEn,
        excerptFa: excerptFa || titleFa || titleEn,
        excerptPs: excerptPs || titlePs || titleEn,
        contentEn: paragraphsEn.length > 0 ? paragraphsEn : [excerptEn || titleEn],
        contentFa: paragraphsFa.length > 0 ? paragraphsFa : [excerptFa || titleFa || titleEn],
        contentPs: paragraphsPs.length > 0 ? paragraphsPs : [excerptPs || titlePs || titleEn],
      };
      addBlogPost(newPost);
    }

    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (userRole !== 'admin') {
      showToast('Administrator privileges required to delete historical blog posts.', 'error');
      setDeletingPostId(null);
      return;
    }
    if (deletingPostId) {
      deleteBlogPost(deletingPostId);
      setDeletingPostId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0c342b]/10 border border-[#0c342b]/20 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6 text-[#0c342b]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif-title text-xl font-bold text-stone-900">
                Blog &amp; Cultural Articles CMS
              </h3>
              {userRole === 'manager' ? (
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold border border-blue-200">
                  🛡️ Manager Access (Edit Only)
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-200">
                  👑 Admin Access (Full)
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500">
              Publish culinary heritage stories, recipes, seasonal specials, and Afghan hospitality journals.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenNewModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0c342b] hover:bg-[#c5a059] text-white hover:text-[#0c342b] text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title, author, or excerpt..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#c5a059]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#0c342b] text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            All Articles ({blogPosts.length})
          </button>
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#0c342b] text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              {/* Thumbnail */}
              <div className="relative h-44 bg-stone-100 overflow-hidden group">
                <img
                  src={post.image}
                  alt={post.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#0c342b]/90 backdrop-blur-md text-[#c5a059] text-[10px] font-bold uppercase tracking-wider">
                  {post.categoryEn}
                </span>
                <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-stone-200 text-[10px] font-mono">
                  {post.readTime}
                </span>
              </div>

              {/* Content Info */}
              <div className="p-5">
                <div className="flex items-center gap-2 text-[11px] text-stone-500 mb-2">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-[#c5a059]" />
                    {post.author}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-stone-400" />
                    {post.date}
                  </span>
                </div>

                <h4 className="font-serif-title text-base font-bold text-stone-900 line-clamp-2 mb-1.5">
                  {post.titleEn}
                </h4>
                <p className="text-xs text-stone-500 line-clamp-3 leading-relaxed mb-4">
                  {post.excerptEn}
                </p>

                {/* Dari & Pashto Titles badge indicator */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-stone-100 text-[10px] text-stone-400 font-sans">
                  <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-600 truncate max-w-[140px]" dir="rtl">
                    دری: {post.titleFa}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-600 truncate max-w-[140px]" dir="rtl">
                    پښتو: {post.titlePs}
                  </span>
                </div>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="p-4 bg-stone-50/80 border-t border-stone-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedBlogPost(post)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0c342b] hover:text-[#c5a059] transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Read Preview</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEditModal(post)}
                  title="Edit article"
                  className="p-2 rounded-xl bg-white hover:bg-stone-200 text-stone-700 transition-colors border border-stone-200 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                {userRole === 'admin' ? (
                  <button
                    onClick={() => setDeletingPostId(post.id)}
                    title="Delete article (Admin only)"
                    className="p-2 rounded-xl bg-white hover:bg-red-50 text-stone-700 hover:text-red-600 transition-colors border border-stone-200 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => showToast('Administrator privileges required to delete historical articles.', 'error')}
                    title="Deletion locked for Manager role"
                    className="p-2 rounded-xl bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200 flex items-center justify-center"
                  >
                    <Lock className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
          <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-stone-800 mb-1">No articles found</h4>
          <p className="text-xs text-stone-500 mb-4">Try clearing your search query or add a new article.</p>
          <button
            onClick={handleOpenNewModal}
            className="px-4 py-2 rounded-xl bg-[#0c342b] text-white text-xs font-bold uppercase tracking-wider"
          >
            Create First Article
          </button>
        </div>
      )}

      {/* Add / Edit Article Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-300 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#0c342b] text-white flex items-center justify-between border-b border-[#c5a059]/30">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-[#c5a059]" />
                <h3 className="font-serif-title text-lg font-bold">
                  {editingPost ? 'Edit Blog Article' : 'Write New Blog Article'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-stone-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* English, Dari, Pashto Titles */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Article Title (English) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="e.g. The Secrets of Slow-Steamed Kabuli Pulao"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#c5a059]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      عنوان مقاله (فارسی / دری)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={titleFa}
                      onChange={(e) => setTitleFa(e.target.value)}
                      placeholder="رازهای پخت اصیل قابلی پلو بخارا..."
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      د لیکنې سرلیک (پښتو)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={titlePs}
                      onChange={(e) => setTitlePs(e.target.value)}
                      placeholder="د قابلي پلو ځانګړی خوند او تاریخ..."
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>
              </div>

              {/* Metadata row: Category, Author, Read Time, Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">Category</label>
                  <input
                    type="text"
                    value={categoryEn}
                    onChange={(e) => setCategoryEn(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">Author</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">Read Time</label>
                  <input
                    type="text"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">Date</label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs"
                    required
                  />
                </div>
              </div>

              {/* Featured Image & Presets */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Featured Image URL
                </label>
                <div className="flex gap-3 items-center mb-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-4 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#c5a059]"
                    required
                  />
                  <div className="w-12 h-9 rounded-lg overflow-hidden border border-stone-300 shrink-0">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Suggested Presets */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] text-stone-400">Quick Presets:</span>
                  {SUGGESTED_BLOG_IMAGES.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setImageUrl(preset.url)}
                      className="text-[10px] px-2 py-1 rounded bg-stone-100 hover:bg-[#c5a059]/20 hover:text-[#0c342b] text-stone-600 transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Excerpts */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Short Summary / Excerpt (English)
                </label>
                <textarea
                  rows={2}
                  value={excerptEn}
                  onChange={(e) => setExcerptEn(e.target.value)}
                  placeholder="A brief teaser for the blog card and social shares..."
                  className="w-full px-4 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              {/* Full Article Content */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Full Article Content (English)
                  </label>
                  <span className="text-[11px] text-stone-400">Separate paragraphs with a blank line</span>
                </div>
                <textarea
                  rows={6}
                  value={contentEnText}
                  onChange={(e) => setContentEnText(e.target.value)}
                  placeholder="Write the full narrative here. You can use multiple paragraphs separated by empty lines..."
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs leading-relaxed focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              {/* Dari and Pashto optional full text */}
              <details className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <summary className="text-xs font-bold text-stone-700 cursor-pointer">
                  + Add Dari &amp; Pashto Full Content (Optional)
                </summary>
                <div className="mt-3 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">متن کامل مقاله به زبان فارسی / دری</label>
                    <textarea
                      rows={4}
                      dir="rtl"
                      value={contentFaText}
                      onChange={(e) => setContentFaText(e.target.value)}
                      placeholder="متن کامل به دری..."
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">د لیکنې بشپړ متن په پښتو</label>
                    <textarea
                      rows={4}
                      dir="rtl"
                      value={contentPsText}
                      onChange={(e) => setContentPsText(e.target.value)}
                      placeholder="بشپړ پښتو متن..."
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs"
                    />
                  </div>
                </div>
              </details>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0c342b] hover:bg-[#c5a059] text-white hover:text-[#0c342b] text-xs font-bold uppercase tracking-wider transition-all shadow-md"
                >
                  {editingPost ? 'Save Changes' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingPostId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-stone-300 shadow-xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h4 className="font-serif-title text-lg font-bold text-stone-900 mb-1">Delete Article?</h4>
            <p className="text-xs text-stone-500 mb-6">
              Are you sure you want to delete this article? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeletingPostId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
