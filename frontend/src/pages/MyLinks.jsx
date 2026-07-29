import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import MotionAlert from '../components/motion/MotionAlert';
import MotionModal from '../components/motion/MotionModal';
import { api } from '../lib/axios';
import { QRCodeSVG } from 'qrcode.react';
import AsyncButton from '../components/AsyncButton';

export default function MyLinks() {
  const navigate = useNavigate();
  const [selectedLinks, setSelectedLinks] = useState([]);
  const [activeFilter, setActiveFilter] = useState('Active');
  const [activeTab, setActiveTab] = useState('links'); // 'links' or 'qr'

  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Modal states
  const [deleteModalLink, setDeleteModalLink] = useState(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [editModalLink, setEditModalLink] = useState(null);
  const [editUrl, setEditUrl] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editAlias, setEditAlias] = useState('');
  const [editTrackIp, setEditTrackIp] = useState(false);
  const [editTrackBrowser, setEditTrackBrowser] = useState(true);
  const [editTrackOs, setEditTrackOs] = useState(true);
  const [editTrackDevice, setEditTrackDevice] = useState(true);
  const [editTrackReferrer, setEditTrackReferrer] = useState(true);
  
  const [editUtmSource, setEditUtmSource] = useState('');
  const [editUtmMedium, setEditUtmMedium] = useState('');
  const [editUtmCampaign, setEditUtmCampaign] = useState('');
  const [editUtmTerm, setEditUtmTerm] = useState('');
  const [editUtmContent, setEditUtmContent] = useState('');
  
  const [editRoutingRules, setEditRoutingRules] = useState([]);

  
  // Click Log Modal State

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/links');
      setLinks(response.data.map(link => ({
        ...link,
        createdAt: new Date(link.createdAt).toLocaleDateString()
      })));
    } catch (err) {
      console.error(err);
      toast.error('Failed to load links');
    } finally {
      setLoading(false);
    }
  };




  const openClickLogModal = (link) => {
    setClickLogModalLink(link);
    fetchClickLogs(link.id);
  };

  const displayedLinks = links.filter(link => {
    const isQR = link.title && link.title.startsWith('[QR]');
    if (activeTab === 'qr') return isQR;
    return !isQR;
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedLinks(displayedLinks.map(l => l.id));
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
    const url = `${import.meta.env.VITE_APP_URL}/${shortCode}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Link copied to clipboard!');
    });
  };

  const openEditModal = (link) => {
    setEditModalLink(link);
    setEditUrl(link.longUrl || '');
    setEditTitle(link.title || '');
    setEditAlias(link.customAlias || link.shortCode || '');
    setEditTrackIp(link.trackIp ?? false);
    setEditTrackBrowser(link.trackBrowser ?? true);
    setEditTrackOs(link.trackOs ?? true);
    setEditTrackDevice(link.trackDevice ?? true);
    setEditTrackReferrer(link.trackReferrer ?? true);
    setEditUtmSource(link.utmSource || '');
    setEditUtmMedium(link.utmMedium || '');
    setEditUtmCampaign(link.utmCampaign || '');
    setEditUtmTerm(link.utmTerm || '');
    setEditUtmContent(link.utmContent || '');
    setEditRoutingRules(link.routingRules || []);
  };
  
  const addEditRoutingRule = () => {
    setEditRoutingRules([...editRoutingRules, { type: 'OS', conditionValue: '', destinationUrl: '' }]);
  };

  const removeEditRoutingRule = (index) => {
    const newRules = [...editRoutingRules];
    newRules.splice(index, 1);
    setEditRoutingRules(newRules);
  };

  const updateEditRoutingRule = (index, field, value) => {
    const newRules = [...editRoutingRules];
    newRules[index][field] = value;
    if (field === 'type') {
      newRules[index].conditionValue = '';
    }
    setEditRoutingRules(newRules);
  };

  const handleEditSubmit = async () => {
    if (!editModalLink) return;
    try {
      await api.put(`/links/${editModalLink.id}`, {
        longUrl: editUrl,
        title: editTitle,
        customAlias: editAlias,
        trackIp: editTrackIp,
        trackBrowser: editTrackBrowser,
        trackOs: editTrackOs,
        trackDevice: editTrackDevice,
        trackReferrer: editTrackReferrer,
        utmSource: editUtmSource || undefined,
        utmMedium: editUtmMedium || undefined,
        utmCampaign: editUtmCampaign || undefined,
        utmTerm: editUtmTerm || undefined,
        utmContent: editUtmContent || undefined,
        routingRules: editRoutingRules.filter(r => r.conditionValue && r.destinationUrl)
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

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await api.patch(`/links/${id}/toggle`);
      fetchLinks();
      toast.success(`Link ${currentStatus ? 'deactivated' : 'activated'} successfully!`);
    } catch (err) {
      console.error("Failed to toggle link status", err);
      toast.error(err.response?.data?.message || "Failed to update link status");
    }
  };

  const handleBulkDelete = () => {
    if (selectedLinks.length === 0) return;
    setIsBulkDeleteModalOpen(true);
  };

  const executeBulkDelete = async () => {
    try {
      await Promise.all(selectedLinks.map(id => api.delete(`/links/${id}`)));
      setSelectedLinks([]);
      setIsBulkDeleteModalOpen(false);
      fetchLinks();
      toast.success(`${selectedLinks.length} items deleted successfully!`);
    } catch (err) {
      console.error("Failed to bulk delete", err);
      toast.error("Failed to delete some items");
    }
  };


  const handleExportLinks = () => {
    if (!filteredLinks || filteredLinks.length === 0) return;

    const headers = ['Title', 'Long URL', 'Short Code', 'Custom Alias', 'Status', 'Click Count', 'Created At', 'Expires At'];
    
    const rows = filteredLinks.map(link => {
      const createdAt = new Date(link.createdAt).toLocaleString();
      const expiresAt = link.expiryDate ? new Date(link.expiryDate).toLocaleString() : 'Never';
      
      return [
        `"${link.title || ''}"`,
        `"${link.longUrl || ''}"`,
        `"${link.shortCode || ''}"`,
        `"${link.customAlias || ''}"`,
        `"${link.active ? 'Active' : 'Inactive'}"`,
        `"${link.clickCount || 0}"`,
        `"${createdAt}"`,
        `"${expiresAt}"`
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.setAttribute('download', `dragolink-export-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    toast.success('Links exported successfully!');
  };

  return (
    <div className="flex flex-col h-full bg-background font-sans relative">
      
      {/* Header Context for Desktop */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="hidden md:flex flex-col">
          <h2 className="text-headline-lg font-headline-lg text-on-surface">
            {activeTab === 'links' ? 'My Links' : 'My QR Codes'}
          </h2>
          <span className="text-label-md font-label-md text-on-surface-variant mt-1">
            {links.length} Total {activeTab === 'links' ? 'Links' : 'QR Codes'}
          </span>
        </div>
        
        {/* Toggle Switch */}
        <div className="mt-4 sm:mt-0 flex bg-surface-container-lowest border border-outline-variant/20 rounded-lg p-1 w-full sm:w-auto">
          <button 
            onClick={() => setActiveTab('links')}
            className={`flex-1 sm:flex-none px-4 py-1.5 text-label-md font-label-md rounded-md transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'links' 
                ? 'bg-primary text-white shadow-md' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">link</span>
            Links
          </button>
          <button 
            onClick={() => setActiveTab('qr')}
            className={`flex-1 sm:flex-none px-4 py-1.5 text-label-md font-label-md rounded-md transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'qr' 
                ? 'bg-primary-container text-on-primary-container shadow-sm' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
            QR Codes
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Toolbar & Filters */}
        {selectedLinks.length > 0 ? (
          <div className="flex items-center justify-between bg-secondary-container/40 border border-secondary-fixed/20 rounded-lg p-2 px-4 animate-fade-in">
            <span className="text-label-sm font-label-sm text-secondary-fixed">{selectedLinks.length} items selected</span>
            <div className="flex gap-2">
              <button className="text-label-sm font-label-sm text-on-surface hover:text-primary transition-colors flex items-center gap-1 cursor-pointer">
                <span className="material-symbols-outlined text-[16px]">label</span> Tag
              </button>
              <button 
                onClick={handleBulkDelete}
                className="text-label-sm font-label-sm text-error hover:text-error/80 transition-colors flex items-center gap-1 ml-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span> Delete
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-panel p-4 rounded-xl relative z-20">
            <div className="flex items-center gap-2">
              <button className="bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface text-label-md font-label-md py-1.5 px-3 rounded-lg flex items-center gap-2 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[16px]">filter_list</span>
                Filter
              </button>
              <div className="flex bg-surface-container-lowest border border-outline-variant/20 rounded-lg p-1">
                {['Active', 'Expired', 'Scheduled'].map(filter => (
                  <button 
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 py-1 text-label-sm font-label-sm rounded-md transition-colors cursor-pointer ${
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
              <button 
                onClick={handleExportLinks}
                className="hidden sm:flex bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface text-label-md font-label-md py-1.5 px-3 rounded-lg items-center gap-2 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                Export
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setIsCreateOpen(!isCreateOpen)}
                  className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-white text-label-md font-label-md py-1.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-[0_0_15px_rgba(21,128,61,0.3)] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">add_link</span>
                  Create Link
                  <span className="material-symbols-outlined text-[18px] ml-1 transition-transform" style={{ transform: isCreateOpen ? 'rotate(180deg)' : 'none' }}>expand_more</span>
                </button>

                <AnimatePresence>
                  {isCreateOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 top-full mt-2 w-48 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/20 overflow-hidden z-50 flex flex-col p-2"
                    >
                      <Link 
                        to="/create" 
                        onClick={() => setIsCreateOpen(false)} 
                        className="px-4 py-2 flex items-center gap-3 text-label-md font-medium text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors rounded-lg"
                      >
                        <span className="material-symbols-outlined text-[20px]">link</span>
                        Shorten Link
                      </Link>
                      <Link 
                        to="/qr" 
                        onClick={() => setIsCreateOpen(false)} 
                        className="px-4 py-2 flex items-center gap-3 text-label-md font-medium text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors rounded-lg"
                      >
                        <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
                        QR Code
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

        {/* Premium Data List */}
        <div className="flex flex-col gap-4">
          {/* Cards */}
          {displayedLinks.map(link => (
            <div 
              key={link.id} 
              className={`group relative flex flex-col xl:flex-row xl:items-center gap-4 p-5 bg-surface/60 backdrop-blur-xl border border-outline-variant/20 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 ${link.status === 'Expired' ? 'opacity-75 grayscale-[0.2]' : ''}`}
            >
              {/* Icon/Preview & Main Info */}
              {activeTab === 'qr' ? (
                <div className="flex flex-1 items-center gap-5 min-w-0">
                  <div className="w-20 h-20 bg-white rounded-xl border border-outline-variant/20 p-2 shrink-0 flex items-center justify-center shadow-sm relative overflow-hidden group-hover:shadow-md transition-shadow">
                    <QRCodeSVG 
                      value={`${import.meta.env.VITE_APP_URL}/${link.customAlias || link.shortCode}`} 
                      size={64} 
                    />
                  </div>
                  <div className="flex flex-col min-w-0 justify-center">
                    <span className="text-headline-sm font-headline-sm text-on-surface truncate mb-1 group-hover:text-primary transition-colors">{link.title || link.customAlias || link.shortCode}</span>
                    <span className="text-body-md font-body-md text-on-surface-variant/70 truncate">{link.longUrl}</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-1 items-center gap-4 min-w-0">
                  <div className="flex flex-col min-w-0 justify-center gap-1">
                    <span className="text-headline-sm font-headline-sm text-on-surface truncate group-hover:text-primary transition-colors">{link.title || link.customAlias || link.shortCode}</span>
                    <span className="text-body-md font-body-md text-on-surface-variant/70 truncate hidden sm:block">{link.longUrl}</span>
                  </div>
                </div>
              )}

              {/* Stats & Actions Area */}
              <div className="flex items-center justify-between xl:justify-end gap-6 xl:w-[500px] shrink-0 mt-4 xl:mt-0 pt-4 xl:pt-0 border-t border-outline-variant/10 xl:border-t-0">
                
                {/* Short URL Pill (Only in Links tab) */}
                {activeTab === 'links' && (
                  <div 
                    className="group/copy flex items-center gap-2 px-3 py-1.5 bg-surface-container-lowest border border-outline-variant/20 rounded-full cursor-pointer hover:border-primary/30 hover:bg-primary/5 transition-all w-fit max-w-[180px] overflow-hidden shadow-sm"
                    onClick={() => handleCopy(link.customAlias || link.shortCode)}
                    title="Copy to clipboard"
                  >
                    <span className="text-code-sm font-code-sm text-on-surface truncate flex-1">{import.meta.env.VITE_APP_URL}/{link.customAlias || link.shortCode}</span>
                    <span className="material-symbols-outlined text-[14px] text-on-surface-variant opacity-50 group-hover/copy:opacity-100 group-hover/copy:text-primary transition-opacity shrink-0">content_copy</span>
                  </div>
                )}

                {/* Clicks */}
                <div className="flex items-center gap-2" title="Total Clicks">
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px]">ads_click</span>
                  <span className="text-label-lg font-label-lg text-on-surface">{link.clickCount?.toLocaleString()}</span>
                </div>

                {/* Status Badge */}
                <div className="hidden sm:block">
                  {link.active ? (
                    <button onClick={() => handleToggleActive(link.id, link.active)} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-label-sm font-label-sm shadow-[0_0_10px_rgba(16,185,129,0.1)] hover:bg-emerald-500/20 transition-colors cursor-pointer" title="Click to deactivate">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
                      Active
                    </button>
                  ) : (
                    <button onClick={() => handleToggleActive(link.id, link.active)} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant border border-outline-variant/30 text-label-sm font-label-sm hover:bg-surface-container-highest transition-colors cursor-pointer" title="Click to activate">
                      <div className="w-1.5 h-1.5 rounded-full bg-on-surface-variant/50"></div>
                      Inactive
                    </button>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 ml-2">
                  <button onClick={() => openClickLogModal(link)} className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer" title="Click Log / Info">
                    <span className="material-symbols-outlined text-[20px]">info</span>
                  </button>
                  <button onClick={() => navigate(`/analytics/${link.id}`)} className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer" title="Analytics">
                    <span className="material-symbols-outlined text-[20px]">bar_chart</span>
                  </button>
                  <button onClick={() => openEditModal(link)} className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer" title="Edit">
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                  <button onClick={() => setDeleteModalLink(link)} className="text-on-surface-variant hover:text-error transition-colors cursor-pointer" title="Delete">
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {displayedLinks.length === 0 && !loading && (
            <div className="p-12 flex flex-col items-center justify-center bg-surface/50 rounded-2xl border border-outline-variant/20 border-dashed animate-fade-in mt-4">
              <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mb-6 shadow-inner">
                <span className="material-symbols-outlined text-[40px] text-on-surface-variant/50">link_off</span>
              </div>
              <h3 className="text-headline-sm font-headline-sm text-on-surface mb-2">No links found</h3>
              <p className="text-body-md text-on-surface-variant text-center max-w-sm mb-6">You haven't created any {activeTab === 'qr' ? 'QR Codes' : 'links'} in this category yet. Start sharing to see them here.</p>
              <button 
                onClick={() => navigate(activeTab === 'qr' ? '/qr' : '/create')}
                className="bg-primary text-white px-6 py-2.5 rounded-lg text-label-md font-label-md hover:bg-primary/90 transition-colors shadow-md flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">{activeTab === 'qr' ? 'qr_code_2' : 'add_link'}</span>
                Create {activeTab === 'qr' ? 'QR Code' : 'Short Link'}
              </button>
            </div>
          )}

          {/* Pagination */}
          {displayedLinks.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-label-sm font-label-sm text-on-surface-variant ml-2">Showing {displayedLinks.length} results</span>
              <div className="flex items-center gap-2 bg-surface/60 backdrop-blur-sm border border-outline-variant/20 rounded-lg p-1 shadow-sm">
                <button className="p-1.5 rounded-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" disabled>
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button className="w-8 h-8 rounded-md flex items-center justify-center text-label-sm font-label-sm bg-primary text-white shadow-sm cursor-pointer">1</button>
                <button className="p-1.5 rounded-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" disabled>
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <MotionAlert
        isOpen={!!deleteModalLink}
        onClose={() => setDeleteModalLink(null)}
        onConfirm={() => handleDelete(deleteModalLink?.id)}
        title="Delete Link?"
        description={
          <>
            Are you sure you want to delete <span className="font-bold text-on-surface">{deleteModalLink?.title || deleteModalLink?.customAlias || deleteModalLink?.shortCode}</span>? This action cannot be undone.
          </>
        }
        confirmText="Delete"
        isDestructive={true}
        icon={<span className="material-symbols-outlined text-[32px]">warning</span>}
      />

      {/* Bulk Delete Confirmation Modal */}
      <MotionAlert
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={executeBulkDelete}
        title={`Delete ${selectedLinks.length} Items?`}
        description={`This will permanently delete the ${selectedLinks.length} selected ${activeTab === 'qr' ? 'QR Codes' : 'links'}. This action cannot be undone.`}
        confirmText="Delete"
        isDestructive={true}
        icon={<span className="material-symbols-outlined text-[32px]">delete_sweep</span>}
      />





      {/* Edit Modal */}
      <MotionModal
        isOpen={!!editModalLink}
        onClose={() => setEditModalLink(null)}
        title="Edit Link"
        className="max-w-2xl max-h-[85vh] overflow-y-auto"
      >
        <div className="space-y-6 mb-6">
          <section className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
            <h3 className="font-label-lg text-[14px] text-on-surface uppercase tracking-wider mb-4 border-b border-outline-variant/20 pb-2">Basic Info</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Destination URL</label>
                <input 
                  type="url" 
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="w-full bg-surface-container text-on-surface border border-outline-variant/50 rounded-lg px-4 py-2 font-code-sm text-code-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Link Title</label>
                  <input 
                    type="text" 
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-surface-container text-on-surface border border-outline-variant/50 rounded-lg px-4 py-2 font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Custom Alias</label>
                  <input 
                    type="text" 
                    value={editAlias}
                    onChange={(e) => setEditAlias(e.target.value)}
                    className="w-full bg-surface-container text-on-surface border border-outline-variant/50 rounded-lg px-4 py-2 font-code-sm text-code-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
            <div className="flex justify-between items-center mb-4 border-b border-outline-variant/20 pb-2">
              <h3 className="font-label-lg text-[14px] text-on-surface uppercase tracking-wider">Dynamic Routing</h3>
              <button onClick={addEditRoutingRule} className="text-primary hover:text-primary/80 font-label-sm uppercase tracking-wider text-[12px] bg-primary/10 px-3 py-1 rounded-full transition-colors cursor-pointer">
                + Add Rule
              </button>
            </div>
            <div className="space-y-4">
              {editRoutingRules.map((rule, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-surface-container p-3 rounded-xl border border-outline-variant/20 group transition-all hover:border-primary/30">
                  <div className="flex w-full sm:w-auto items-center gap-2">
                    <select
                      value={rule.type}
                      onChange={(e) => updateEditRoutingRule(index, 'type', e.target.value)}
                      className="bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-2 py-1.5 font-label-sm uppercase tracking-wider text-[12px] text-on-surface focus:border-primary outline-none cursor-pointer"
                    >
                      <option value="OS">OS</option>
                      <option value="DEVICE">Device</option>
                    </select>
                    {rule.type === 'OS' ? (
                      <select
                        value={rule.conditionValue}
                        onChange={(e) => updateEditRoutingRule(index, 'conditionValue', e.target.value)}
                        className="bg-surface-container-lowest flex-1 sm:w-32 border border-outline-variant/50 rounded-lg px-3 py-1.5 font-body-sm text-[13px] text-on-surface outline-none"
                      >
                        <option value="">Select OS...</option>
                        <option value="ios">iOS</option>
                        <option value="android">Android</option>
                        <option value="macos">macOS</option>
                        <option value="windows">Windows</option>
                        <option value="linux">Linux</option>
                      </select>
                    ) : (
                      <select
                        value={rule.conditionValue}
                        onChange={(e) => updateEditRoutingRule(index, 'conditionValue', e.target.value)}
                        className="bg-surface-container-lowest flex-1 sm:w-32 border border-outline-variant/50 rounded-lg px-3 py-1.5 font-body-sm text-[13px] text-on-surface outline-none"
                      >
                        <option value="">Select Device...</option>
                        <option value="mobile">Mobile</option>
                        <option value="tablet">Tablet</option>
                        <option value="desktop">Desktop</option>
                      </select>
                    )}
                  </div>
                  <span className="text-on-surface-variant text-[12px] hidden sm:block">➔</span>
                  <input
                    type="url"
                    placeholder="https://destination.com"
                    value={rule.destinationUrl}
                    onChange={(e) => updateEditRoutingRule(index, 'destinationUrl', e.target.value)}
                    className="bg-surface-container-lowest border border-outline-variant/50 flex-1 rounded-lg px-3 py-1.5 font-code-sm text-[13px] w-full outline-none"
                  />
                  <button
                    onClick={() => removeEditRoutingRule(index)}
                    className="p-1.5 text-error/70 hover:text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer w-full sm:w-auto flex justify-center"
                    title="Remove rule"
                  >
                    ✖
                  </button>
                </div>
              ))}
              {editRoutingRules.length === 0 && (
                <div className="text-center py-6 text-on-surface-variant text-body-sm bg-surface-container/50 rounded-xl border border-dashed border-outline-variant/50">
                  No routing rules configured. <br/>
                  <span className="text-[12px] opacity-70">Redirect users based on their OS or Device.</span>
                </div>
              )}
            </div>
          </section>

          <section className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
            <h3 className="font-label-lg text-[14px] text-on-surface uppercase tracking-wider mb-4 border-b border-outline-variant/20 pb-2">UTM Parameters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Source</label>
                <input 
                  type="text" 
                  list="edit_utm_source"
                  value={editUtmSource}
                  onChange={(e) => setEditUtmSource(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-3 py-1.5 font-code-sm text-[13px] outline-none" 
                  placeholder="Select or type..." 
                />
                <datalist id="edit_utm_source">
                  <option value="google" /><option value="facebook" /><option value="instagram" /><option value="twitter" /><option value="linkedin" /><option value="youtube" /><option value="tiktok" /><option value="newsletter" />
                </datalist>
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Medium</label>
                <input 
                  type="text" 
                  list="edit_utm_medium"
                  value={editUtmMedium}
                  onChange={(e) => setEditUtmMedium(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-3 py-1.5 font-code-sm text-[13px] outline-none" 
                  placeholder="Select or type..." 
                />
                <datalist id="edit_utm_medium">
                  <option value="social" /><option value="email" /><option value="cpc" /><option value="banner" /><option value="referral" /><option value="organic" /><option value="affiliate" />
                </datalist>
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Campaign</label>
                <input 
                  type="text" 
                  list="edit_utm_campaign"
                  value={editUtmCampaign}
                  onChange={(e) => setEditUtmCampaign(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-3 py-1.5 font-code-sm text-[13px] outline-none" 
                  placeholder="Select or type..." 
                />
                <datalist id="edit_utm_campaign">
                  <option value="spring_sale" /><option value="summer_promo" /><option value="black_friday" /><option value="holiday_specials" /><option value="welcome_series" /><option value="retargeting" />
                </datalist>
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Term</label>
                <input 
                  type="text" 
                  value={editUtmTerm}
                  onChange={(e) => setEditUtmTerm(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-3 py-1.5 font-code-sm text-[13px] outline-none" 
                  placeholder="e.g. running+shoes" 
                />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Content</label>
                <input 
                  type="text" 
                  list="edit_utm_content"
                  value={editUtmContent}
                  onChange={(e) => setEditUtmContent(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-3 py-1.5 font-code-sm text-[13px] outline-none" 
                  placeholder="Select or type..." 
                />
                <datalist id="edit_utm_content">
                  <option value="logolink" /><option value="textlink" /><option value="sidebar" /><option value="header_banner" /><option value="video_ad" /><option value="button_blue" />
                </datalist>
              </div>
            </div>
          </section>

          <section className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
            <h3 className="font-label-lg text-[14px] text-on-surface uppercase tracking-wider mb-4 border-b border-outline-variant/20 pb-2">Tracking Options</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'trackBrowser', label: 'Browser Analytics', state: editTrackBrowser, setter: setEditTrackBrowser },
                { id: 'trackOs', label: 'OS Analytics', state: editTrackOs, setter: setEditTrackOs },
                { id: 'trackDevice', label: 'Device Analytics', state: editTrackDevice, setter: setEditTrackDevice },
                { id: 'trackReferrer', label: 'Referrer Tracking', state: editTrackReferrer, setter: setEditTrackReferrer },
                { id: 'trackIp', label: 'IP Address Logging', state: editTrackIp, setter: setEditTrackIp },
              ].map((opt) => (
                <label key={opt.id} className="flex items-center gap-3 p-3 rounded-xl border border-outline-variant/20 bg-surface-container cursor-pointer hover:bg-surface-container-highest transition-colors group">
                  <div className="relative flex items-center">
                    <input type="checkbox" checked={opt.state} onChange={(e) => opt.setter(e.target.checked)} className="peer sr-only" />
                    <div className="w-10 h-5 bg-outline-variant/30 rounded-full peer-checked:bg-primary transition-colors"></div>
                    <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-sm"></div>
                  </div>
                  <span className="font-body-sm text-[13px] text-on-surface select-none group-hover:text-primary transition-colors">{opt.label}</span>
                </label>
              ))}
            </div>
          </section>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setEditModalLink(null)} className="px-4 py-2 text-label-md font-label-md text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors border border-outline-variant/30 cursor-pointer">
            Cancel
          </button>
          <AsyncButton onClick={handleEditSubmit} className="px-4 py-2 text-label-md font-label-md bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm cursor-pointer">
            Save Changes
          </AsyncButton>
        </div>
      </MotionModal>

    </div>
  );
}
