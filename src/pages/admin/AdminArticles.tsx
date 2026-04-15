import React, { useState } from 'react';
import { Edit2, Save, X, Plus, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_ARTICLES = [
  { id: '1', title: 'The Language of Silence: A Conversation with Sarah Chen', category: 'interview', is_published: true, body_text: 'There is a moment before the music begins—a breath held collectively...' },
  { id: '2', title: 'Designing for Sound: The Architecture of YORU', category: 'venue', is_published: true, body_text: 'When architect Hiroshi Mori was commissioned to design YORU in 2019...' },
  { id: '3', title: 'A Beginner\'s Guide to Jazz at YORU', category: 'guide', is_published: false, body_text: 'Jazz can feel intimidating from the outside. There are decades of records...' },
];

export default function AdminArticles() {
  const [articles, setArticles] = useState(MOCK_ARTICLES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});

  const handleEditClick = (article: any) => {
    setEditingId(article.id);
    setEditFormData({ ...article });
  };

  const handleSaveClick = () => {
    // 💡 Supabase Save Hook Here
    // supabase.from('articles').update(editFormData).eq('id', editingId);
    
    setArticles(articles.map(art => art.id === editingId ? editFormData : art));
    setEditingId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        setEditFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setEditFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="flex flex-col h-full text-cream pb-20">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif text-gold-400 tracking-wider mb-2">Articles & Subpage Content</h1>
          <p className="text-cream/60 font-sans text-sm tracking-widest uppercase">Write content, change tags, and publish posts.</p>
        </div>
        <button className="flex items-center space-x-2 bg-gold-400 text-dark px-4 py-2 uppercase tracking-widest font-bold text-sm hover:bg-gold-300 transition-colors">
            <Plus className="w-4 h-4" />
            <span>New Article</span>
        </button>
      </div>

      <div className="bg-dark/80 border border-gold-400/20 rounded-md overflow-hidden">
        <table className="w-full text-left font-sans text-sm">
          <thead className="bg-gold-400/10 border-b border-gold-400/20">
            <tr>
              <th className="p-4 text-cream/70 uppercase tracking-widest font-normal w-1/3">Title & Content Preview</th>
              <th className="p-4 text-cream/70 uppercase tracking-widest font-normal">Tag / Category</th>
              <th className="p-4 text-cream/70 uppercase tracking-widest font-normal">Publish Status</th>
              <th className="p-4 text-cream/70 uppercase tracking-widest font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((art) => {
              const isEditing = editingId === art.id;

              return (
                <tr key={art.id} className={`border-b border-cream/5 transition-colors ${isEditing ? 'bg-cream/5' : 'hover:bg-cream/5'}`}>
                  <td className="p-4">
                    {isEditing ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs text-gold-400 uppercase tracking-widest mb-1">Title</label>
                                <input type="text" name="title" value={editFormData.title} onChange={handleChange} className="w-full bg-dark border border-gold-400/50 p-2 text-cream" />
                            </div>
                            <div>
                                <label className="block text-xs text-gold-400 uppercase tracking-widest mb-1">Body Text (Markdown/HTML)</label>
                                <textarea name="body_text" value={editFormData.body_text} onChange={handleChange} rows={6} className="w-full bg-dark border border-gold-400/50 p-2 text-cream font-mono text-xs"></textarea>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="font-serif text-lg text-cream mb-2">{art.title}</div>
                            <div className="text-xs text-cream/50 line-clamp-2">{art.body_text}</div>
                        </div>
                    )}
                  </td>
                  
                  <td className="p-4 align-top pt-5">
                    {isEditing ? (
                      <select name="category" value={editFormData.category} onChange={handleChange} className="bg-dark border border-gold-400/50 p-2 text-cream outline-none focus:border-gold-400 w-full">
                        <option value="editorial">Editorial (Recommended)</option>
                        <option value="interview">Interview</option>
                        <option value="venue">Venue Info</option>
                        <option value="guide">Guide</option>
                      </select>
                    ) : (
                      <span className="px-2 py-1 text-[10px] uppercase tracking-widest border border-gold-400/30 text-gold-400 bg-gold-400/10 rounded-sm">
                        {art.category}
                      </span>
                    )}
                  </td>

                  <td className="p-4 align-top pt-5">
                    {isEditing ? (
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" name="is_published" checked={editFormData.is_published} onChange={handleChange} className="w-4 h-4 accent-gold-400" />
                            <span className="text-cream/90 tracking-widest uppercase text-xs">Published to Public</span>
                        </label>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${art.is_published ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-cream/80 uppercase tracking-widest text-xs">{art.is_published ? 'Published' : 'Draft'}</span>
                        </div>
                    )}
                  </td>

                  <td className="p-4 text-right align-top pt-5">
                    {isEditing ? (
                      <div className="flex justify-end space-x-2">
                        <button onClick={handleSaveClick} className="flex items-center space-x-1 px-3 py-1.5 bg-green-900/40 text-green-400 border border-green-500/30 hover:bg-green-900/60 rounded-sm transition-colors text-xs uppercase tracking-widest">
                          <Save className="w-3.5 h-3.5" /> <span>Save</span>
                        </button>
                        <button onClick={() => setEditingId(null)} className="flex items-center space-x-1 px-3 py-1.5 bg-red-900/40 text-red-400 border border-red-500/30 hover:bg-red-900/60 rounded-sm transition-colors text-xs uppercase tracking-widest">
                          <X className="w-3.5 h-3.5" /> <span>Cancel</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end space-x-2">
                        <Link to="/editorial/1" className="p-2 border border-cream/20 text-cream/60 hover:text-gold-400 hover:border-gold-400/50 rounded-sm transition-colors" title="View subpage">
                            <Eye className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleEditClick(art)} className="p-2 bg-gold-400/10 border border-gold-400/20 text-gold-400 hover:bg-gold-400/30 rounded-sm transition-colors" title="Edit content">
                            <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
