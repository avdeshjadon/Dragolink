import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/axios';

export default function MyLinks() {
  const navigate = useNavigate();
  const [selectedLinks, setSelectedLinks] = useState([]);
  const [activeFilter, setActiveFilter] = useState('Active');

  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/links')
      .then(res => {
        setLinks(res.data.content || res.data); // Support both paginated and list responses
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load links", err);
        setLoading(false);
      });
  }, []);

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

  return (
    <div className="flex flex-col h-full bg-background font-sans">
      
      {/* Header Context for Desktop */}
      <div className="hidden md:flex flex-col mb-6">
        <h2 className="text-headline-lg font-headline-lg text-on-surface">My Links</h2>
        <span className="text-label-md font-label-md text-on-surface-variant mt-1">42 Total Links</span>
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
                      checked={selectedLinks.length === links.length}
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
                      <div className="flex items-center gap-2 group/copy cursor-pointer">
                        <span className="text-body-md font-body-md text-primary hover:underline">{import.meta.env.VITE_APP_URL || 'http://localhost:8080'}/{link.shortCode}</span>
                        <span className="material-symbols-outlined text-[14px] text-on-surface-variant opacity-0 group-hover/copy:opacity-100 transition-opacity">content_copy</span>
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
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => navigate(`/analytics/${link.id}`)} className="p-1.5 text-on-surface-variant hover:text-primary rounded-md hover:bg-surface-container-high transition-colors" title="Analytics">
                          <span className="material-symbols-outlined text-[18px]">bar_chart</span>
                        </button>
                        <button className="p-1.5 text-on-surface-variant hover:text-primary rounded-md hover:bg-surface-container-high transition-colors" title="Edit">
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button className="p-1.5 text-on-surface-variant hover:text-error rounded-md hover:bg-error-container/30 transition-colors" title="Delete">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-4 py-2 border-t border-outline-variant/20 flex items-center justify-between bg-surface-container-lowest/30">
            <span className="text-label-sm font-label-sm text-on-surface-variant">Showing 1 to 3 of 42 results</span>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container disabled:opacity-50" disabled>
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <button className="w-8 h-8 rounded flex items-center justify-center text-label-sm font-label-sm bg-primary-container text-white">1</button>
              <button className="w-8 h-8 rounded flex items-center justify-center text-label-sm font-label-sm text-on-surface hover:bg-surface-container transition-colors">2</button>
              <button className="w-8 h-8 rounded flex items-center justify-center text-label-sm font-label-sm text-on-surface hover:bg-surface-container transition-colors">3</button>
              <span className="text-on-surface-variant px-1">...</span>
              <button className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
