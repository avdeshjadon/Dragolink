import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../lib/axios';

export default function MyLinks() {
  const navigate = useNavigate();
  const [selectedLinks, setSelectedLinks] = useState([]);
  const [activeFilter, setActiveFilter] = useState('Active');

  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [deleteModalLink, setDeleteModalLink] = useState(null);
  const [editModalLink, setEditModalLink] = useState(null);
  const [editUrl, setEditUrl] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editAlias, setEditAlias] = useState('');

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = () => {
    setLoading(true);
    api.get('/links')
      .then(res => {
        setLinks(res.data.content || res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load links", err);
        setLoading(false);
      });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedLinks(links.map(l => l.id));
    } else {
      setSelectedLinks([]);
    }
  };

  const handleSelect = (id) => {
    if (selectedLinks.includes(id)) {
      setSelectedLinks(selectedLinks.filter(linkId => linkId !== id));
    } else {
      setSelectedLinks([...selectedLinks, id]);
    }
  };

  const handleCopy = (shortCode) => {
    const url = `${import.meta.env.VITE_APP_URL || 'http://localhost:8080'}/${shortCode}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Link copied to clipboard!');
    });
  };

  const openEditModal = (link) => {
    setEditModalLink(link);
    setEditUrl(link.longUrl || '');
    setEditTitle(link.title || '');
    setEditAlias(link.shortCode || '');
  };

  const handleEditSubmit = async () => {
    if (!editModalLink) return;
    try {
      await api.put(`/links/${editModalLink.id}`, {
        longUrl: editUrl,
        title: editTitle,
        customAlias: editAlias
      });
      setEditModalLink(null);
      fetchLinks();
      toast.success('Link updated successfully!');
    } catch (err) {
      console.error("Failed to update link", err);
      toast.error(err.response?.data?.message || "Failed to update link");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/links/${id}`);
      setDeleteModalLink(null);
      fetchLinks();
      setSelectedLinks(selectedLinks.filter(selectedId => selectedId !== id));
      toast.success('Link deleted successfully!');
    } catch (err) {
      console.error("Failed to delete link", err);
      toast.error(err.response?.data?.message || "Failed to delete link");
    }
  };

  return (
    <div className="flex flex-col h-full bg-background font-sans relative">
      
      {/* Header Context for Desktop */}
      <div className="hidden md:flex flex-col mb-6">
        <h2 className="text-headline-lg font-headline-lg text-on-surface">My Links</h2>
        <span className="text-label-md font-label-md text-on-surface-variant mt-1">{links.length} Total Links</span>
      </div>

      <div className="space-y-6">
        {/* Toolbar & Filters */}
        {selectedLinks.length > 0 ? (
          <div className="flex items-center justify-between bg-secondary-container/40 border border-secondary-fixed/20 rounded-lg p-2 px-4 animate-fade-in">
            <span className="text-label-sm font-label-sm text-secondary-fixed">{selectedLinks.length} items selected</span>
            <div className="flex gap-2">
              <button className="text-label-sm font-label-sm text-on-surface hover:text-primary transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">label</span> Tag
              </button>
              <button className="text-label-sm font-label-sm text-error hover:text-error/80 transition-colors flex items-center gap-1 ml-2">
                <span className="material-symbols-outlined text-[16px]">delete</span> Delete
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-panel p-4 rounded-xl">
            <div className="flex items-center gap-2">
              <button className="bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface text-label-md font-label-md py-1.5 px-3 rounded-lg flex items-center gap-2 transition-colors">
                <span className="material-symbols-outlined text-[16px]">filter_list</span>
                Filter
              </button>
              <div className="flex bg-surface-container-lowest border border-outline-variant/20 rounded-lg p-1">
                {['Active', 'Expired', 'Scheduled'].map(filter => (
                  <button 
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 py-1 text-label-sm font-label-sm rounded-md transition-colors ${
                      activeFilter === filter 
                        ? 'bg-secondary-container text-on-secondary-container' 
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button className="hidden sm:flex bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface text-label-md font-label-md py-1.5 px-3 rounded-lg items-center gap-2 transition-colors">
                <span className="material-symbols-outlined text-[16px]">download</span>
                Export
              </button>
              <button 
                onClick={() => navigate('/create')}
                className="flex-1 sm:flex-none bg-primary-container hover:bg-primary-container/90 text-white text-label-md font-label-md py-1.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-[0_0_15px_rgba(21,128,61,0.3)]"
              >
                <span className="material-symbols-outlined text-[18px]">add_link</span>
                Create Link
              </button>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="glass-panel rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/20 bg-surface-container-lowest/50">
                  <th className="p-4 w-12 text-center">
                    <input 
                      type="checkbox" 
                      className="lp-checkbox"
                      checked={links.length > 0 && selectedLinks.length === links.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="p-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Link Details</th>
                  <th className="p-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider hidden sm:table-cell">Short URL</th>
                  <th className="p-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider text-right">Clicks</th>
                  <th className="p-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider text-center">Status</th>
                  <th className="p-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {links.map(link => (
                  <tr key={link.id} className={`hover:bg-surface-container-low transition-colors duration-150 group ${link.status === 'Expired' ? 'opacity-75' : ''}`}>
                    <td className="p-4 text-center">
                      <input 
                        type="checkbox" 
                        className="lp-checkbox row-checkbox" 
                        checked={selectedLinks.includes(link.id)}
                        onChange={() => handleSelect(link.id)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center border border-outline-variant/20 shrink-0">
                          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">link</span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-label-md font-label-md text-on-surface truncate">{link.title || link.shortCode}</span>
                          <span className="text-code-sm font-code-sm text-on-surface-variant/70 truncate hidden sm:block">{link.longUrl}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <div 
                        className="flex items-center gap-2 group/copy cursor-pointer"
                        onClick={() => handleCopy(link.shortCode)}
                        title="Copy to clipboard"
                      >
                        <span className="text-body-md font-body-md text-primary hover:underline">{import.meta.env.VITE_APP_URL || 'http://localhost:8080'}/{link.shortCode}</span>
                        <span className="material-symbols-outlined text-[14px] text-on-surface-variant transition-opacity">content_copy</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-code-sm font-code-sm text-on-surface">{link.clickCount?.toLocaleString()}</span>
                    </td>
                    <td className="p-4 text-center">
                      {link.active ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary-container/20 text-tertiary-fixed border border-tertiary-container/50 text-label-sm font-label-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed"></span> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant border border-outline-variant/30 text-label-sm font-label-sm">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 transition-opacity">
                        <button onClick={() => navigate(`/analytics/${link.id}`)} className="p-1.5 text-on-surface-variant hover:text-primary rounded-md hover:bg-surface-container-high transition-colors cursor-pointer" title="Analytics">
                          <span className="material-symbols-outlined text-[18px]">bar_chart</span>
                        </button>
                        <button onClick={() => openEditModal(link)} className="p-1.5 text-on-surface-variant hover:text-primary rounded-md hover:bg-surface-container-high transition-colors cursor-pointer" title="Edit">
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button onClick={() => setDeleteModalLink(link)} className="p-1.5 text-on-surface-variant hover:text-error rounded-md hover:bg-error-container/30 transition-colors cursor-pointer" title="Delete">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {links.length === 0 && !loading && (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-on-surface-variant text-label-md">
                      No links found. Create your first short link!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-4 py-2 border-t border-outline-variant/20 flex items-center justify-between bg-surface-container-lowest/30">
            <span className="text-label-sm font-label-sm text-on-surface-variant">Showing results</span>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container disabled:opacity-50" disabled>
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <button className="w-8 h-8 rounded flex items-center justify-center text-label-sm font-label-sm bg-primary-container text-white">1</button>
              <button className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50" disabled>
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-surface rounded-xl shadow-2xl p-6 w-full max-w-sm border border-outline-variant/20">
            <h3 className="text-headline-md font-headline-md text-on-surface mb-2">Delete Link</h3>
            <p className="text-body-md font-body-md text-on-surface-variant mb-6">
              Are you sure you want to delete the link for <strong className="text-on-surface">{deleteModalLink.title || deleteModalLink.shortCode}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteModalLink(null)} className="px-4 py-2 text-label-md font-label-md text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors border border-outline-variant/30">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteModalLink.id)} className="px-4 py-2 text-label-md font-label-md bg-error text-white rounded-lg hover:bg-error/90 transition-colors shadow-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-surface rounded-xl shadow-2xl p-6 w-full max-w-md border border-outline-variant/20">
            <h3 className="text-headline-md font-headline-md text-on-surface mb-4">Edit Link</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Destination URL</label>
                <input 
                  type="url" 
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="w-full bg-surface-container-lowest text-on-surface border border-outline-variant/50 rounded-lg px-4 py-2 font-code-sm text-code-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none shadow-sm" 
                />
              </div>
              <div>
                <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Link Title</label>
                <input 
                  type="text" 
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-surface-container-lowest text-on-surface border border-outline-variant/50 rounded-lg px-4 py-2 font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none shadow-sm" 
                />
              </div>
              <div>
                <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Custom Alias</label>
                <input 
                  type="text" 
                  value={editAlias}
                  onChange={(e) => setEditAlias(e.target.value)}
                  className="w-full bg-surface-container-lowest text-on-surface border border-outline-variant/50 rounded-lg px-4 py-2 font-code-sm text-code-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none shadow-sm" 
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setEditModalLink(null)} className="px-4 py-2 text-label-md font-label-md text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors border border-outline-variant/30">
                Cancel
              </button>
              <button onClick={handleEditSubmit} className="px-4 py-2 text-label-md font-label-md bg-primary-container text-white rounded-lg hover:bg-inverse-primary transition-colors shadow-sm">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
