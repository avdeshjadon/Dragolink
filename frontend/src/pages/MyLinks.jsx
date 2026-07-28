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
  
  // Click Log Modal State
  const [clickLogModalLink, setClickLogModalLink] = useState(null);
  const [clickLogs, setClickLogs] = useState([]);
  const [isClickLogLoading, setIsClickLogLoading] = useState(false);

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

  const fetchClickLogs = async (linkId) => {
    try {
      setIsClickLogLoading(true);
      const response = await api.get(`/analytics/links/${linkId}`);
      setClickLogs(response.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load click logs');
    } finally {
      setIsClickLogLoading(false);
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

  const downloadLogsCSV = () => {
    if (!clickLogs || clickLogs.length === 0) return;

    const headers = ['Time', 'IP Address', 'ISP', 'Location', 'Device', 'OS', 'Browser', 'Referrer'];
    
    const rows = clickLogs.map(log => {
      const time = new Date(log.clickedAt + (!log.clickedAt.endsWith('Z') ? 'Z' : '')).toLocaleString();
      const location = log.location && log.location !== 'Unknown' ? log.location.replace(/,/g, '') : 'Unknown';
      const isp = log.isp && log.isp !== 'Unknown' ? log.isp.replace(/,/g, '') : 'Unknown';
      
      return [
        `"${time}"`,
        `"${log.ipAddress || 'Unknown'}"`,
        `"${isp}"`,
        `"${location}"`,
        `"${log.deviceType || 'Unknown'}"`,
        `"${log.operatingSystem || 'Unknown'}"`,
        `"${log.browser || 'Unknown'}"`,
        `"${log.referrer || 'Direct / Unknown'}"`
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `click-logs-${clickLogModalLink?.customAlias || clickLogModalLink?.shortCode || 'export'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Logs downloaded successfully!');
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
              <button className="hidden sm:flex bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface text-label-md font-label-md py-1.5 px-3 rounded-lg items-center gap-2 transition-colors cursor-pointer">
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
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-label-sm font-label-sm shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant border border-outline-variant/30 text-label-sm font-label-sm">
                      <span className="w-2 h-2 rounded-full bg-on-surface-variant/50"></span> Inactive
                    </span>
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

      {/* Click Log Modal */}
      <MotionModal
        isOpen={!!clickLogModalLink}
        onClose={() => setClickLogModalLink(null)}
        title="Click Logs"
        className="max-w-6xl w-full"
        hideCloseButton={true}
      >
        <div className="bg-surface-container-lowest -mx-6 -mb-6 p-6 overflow-y-auto max-h-[85vh]">
          <div className="mb-6 pb-4 border-b border-outline-variant/10">
            <p className="text-label-lg text-on-surface-variant">Detailed tracking data for <span className="text-primary font-medium">{clickLogModalLink?.title || clickLogModalLink?.customAlias || clickLogModalLink?.shortCode}</span></p>
          </div>
          {isClickLogLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : clickLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px] mb-2 opacity-50">analytics</span>
              <p className="text-label-md">No clicks recorded yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {clickLogs.map((log, idx) => (
                <div key={idx} className="bg-surface/50 border border-outline-variant/30 rounded-2xl p-5 hover:bg-surface-container-lowest hover:shadow-md transition-all duration-300">
                  {/* Top Section: Time, IP, and ISP */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 border-b border-outline-variant/10 pb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-sm">
                        <span className="material-symbols-outlined text-[24px]">touch_app</span>
                      </div>
                      <div>
                        <p className="text-headline-sm font-headline-sm text-on-surface mb-1">
                          {new Date(log.clickedAt + (!log.clickedAt.endsWith('Z') ? 'Z' : '')).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-label-sm text-on-surface-variant">
                          <span className="font-code-sm px-2 py-0.5 bg-surface-container rounded-md text-primary font-medium">{log.ipAddress}</span>
                          {log.isp && log.isp !== 'Unknown' && (
                            <span className="flex items-center gap-1 bg-surface-container-high px-2 py-0.5 rounded-md text-on-surface max-w-[200px] truncate" title={log.isp}>
                              <span className="material-symbols-outlined text-[14px]">router</span>
                              {log.isp}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Device & Browser Pills */}
                    <div className="flex flex-wrap items-center gap-2">
                      {log.deviceType && (
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container border border-outline-variant/20 rounded-lg text-xs font-medium capitalize text-on-surface">
                          <span className="material-symbols-outlined text-[16px] text-primary">
                            {log.deviceType.toLowerCase() === 'mobile' ? 'smartphone' : log.deviceType.toLowerCase() === 'tablet' ? 'tablet_mac' : 'desktop_windows'}
                          </span>
                          {log.deviceType}
                        </span>
                      )}
                      {log.operatingSystem && log.operatingSystem !== 'Unknown' && (
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container border border-outline-variant/20 rounded-lg text-xs font-medium text-on-surface">
                          <span className="material-symbols-outlined text-[16px] text-tertiary">settings_system_daydream</span>
                          {log.operatingSystem}
                        </span>
                      )}
                      {log.browser && log.browser !== 'Unknown' && (
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container border border-outline-variant/20 rounded-lg text-xs font-medium text-on-surface">
                          <span className="material-symbols-outlined text-[16px] text-secondary">language</span>
                          {log.browser}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Bottom Section: Location and Referrer */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/10">
                      <div className="p-2 bg-secondary/10 rounded-lg text-secondary mt-0.5">
                        <span className="material-symbols-outlined text-[20px]">location_on</span>
                      </div>
                      <div>
                        <p className="text-label-md font-semibold text-on-surface mb-1">Location</p>
                        {log.country && log.country !== 'Unknown' ? (
                          <div className="text-body-sm text-on-surface-variant">
                            <p className="font-medium text-on-surface">
                              {log.city}{log.region && log.region !== 'Unknown' ? `, ${log.region}` : ''}, {log.country} {log.zip && log.zip !== 'Unknown' ? log.zip : ''}
                            </p>
                            {log.latitude && log.longitude && (
                              <p className="font-code-sm text-xs opacity-75 mt-1">Lat: {log.latitude}, Lon: {log.longitude}</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-body-sm text-on-surface-variant opacity-70 italic">Location unavailable</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/10">
                      <div className="p-2 bg-tertiary/10 rounded-lg text-tertiary mt-0.5">
                        <span className="material-symbols-outlined text-[20px]">link</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-label-md font-semibold text-on-surface mb-1">Referrer</p>
                        {log.referrer && log.referrer !== 'Unknown' && log.referrer !== '' ? (
                          <a href={log.referrer} target="_blank" rel="noopener noreferrer" className="text-body-sm text-primary hover:text-primary/80 transition-colors hover:underline break-all line-clamp-2" title={log.referrer}>
                            {log.referrer}
                          </a>
                        ) : (
                          <p className="text-body-sm text-on-surface-variant opacity-70 italic">Direct / Unknown</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-6 flex justify-end gap-3">
            <button 
              onClick={downloadLogsCSV} 
              className="px-6 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-label-md transition-colors cursor-pointer flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export CSV
            </button>
            <button 
              onClick={() => setClickLogModalLink(null)} 
              className="px-6 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-lg font-label-md transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </MotionModal>

      {/* Edit Modal */}
      <MotionModal
        isOpen={!!editModalLink}
        onClose={() => setEditModalLink(null)}
        title="Edit Link"
        className="max-w-md"
      >
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
