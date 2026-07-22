import { useState, useEffect } from 'react';
import { api } from '../lib/axios';

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignDesc, setNewCampaignDesc] = useState('');

  const fetchCampaigns = async () => {
    try {
      const res = await api.get('/campaigns');
      setCampaigns(res.data);
    } catch (error) {
      console.error("Failed to load campaigns", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    if (!newCampaignName.trim()) return;
    try {
      await api.post('/campaigns', {
        name: newCampaignName,
        description: newCampaignDesc
      });
      setIsModalOpen(false);
      setNewCampaignName('');
      setNewCampaignDesc('');
      fetchCampaigns();
    } catch (error) {
      console.error("Failed to create campaign", error);
    }
  };
  return (
    <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full flex flex-col">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-on-surface tracking-tight mb-2">Campaigns</h2>
          <p className="text-base text-on-surface-variant max-w-2xl">Group your links, track overall performance, and manage marketing campaigns across multiple channels.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 px-4 py-2 bg-primary-container text-on-primary-container rounded-lg font-medium hover:bg-primary-fixed transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Campaign
          </button>
        </div>
      </div>

      {/* Campaign List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">Loading campaigns...</div>
      ) : campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map(campaign => (
            <div key={campaign.id} className="bg-surface-container border border-outline-variant/20 rounded-xl p-6 shadow-sm hover:border-primary/30 transition-colors flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined">campaign</span>
                </div>
                <span className="text-label-sm font-label-sm text-on-surface-variant">
                  {new Date(campaign.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-title-lg font-title-lg text-on-surface mb-2">{campaign.name}</h3>
              <p className="text-body-md font-body-md text-on-surface-variant line-clamp-2 mb-6 flex-1">
                {campaign.description || "No description provided."}
              </p>
              
              <div className="flex gap-4 pt-4 border-t border-outline-variant/10">
                <div>
                  <div className="text-label-sm font-label-sm text-on-surface-variant">Total Links</div>
                  <div className="text-title-md font-title-md text-on-surface">{campaign.totalLinks?.toLocaleString() || 0}</div>
                </div>
                <div className="border-l border-outline-variant/20 pl-4">
                  <div className="text-label-sm font-label-sm text-on-surface-variant">Total Clicks</div>
                  <div className="text-title-md font-title-md text-primary font-bold">{campaign.totalClicks?.toLocaleString() || 0}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface-container-low border border-outline-variant/20 rounded-xl overflow-hidden shadow-sm flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4 text-primary shadow-inner">
            <span className="material-symbols-outlined text-[32px]">campaign</span>
          </div>
          <h3 className="text-lg font-bold text-on-surface mb-2">No campaigns yet</h3>
          <p className="text-sm text-on-surface-variant max-w-md text-center mb-6">Create your first campaign to group related links and track their collective performance over time.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-surface-container border border-outline-variant/30 rounded-lg text-on-surface font-medium hover:border-primary/50 transition-colors"
          >
            Get Started
          </button>
        </div>
      )}

      {/* New Campaign Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface border border-outline-variant/20 rounded-2xl w-full max-w-md shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
              <h3 className="text-title-lg font-title-lg text-on-surface">New Campaign</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-variant transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleCreateCampaign} className="p-6 space-y-4">
              <div>
                <label className="block text-label-sm font-label-md text-on-surface-variant mb-1">Campaign Name</label>
                <input 
                  type="text" 
                  required
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="e.g., Summer Sale 2024"
                />
              </div>
              
              <div>
                <label className="block text-label-sm font-label-md text-on-surface-variant mb-1">Description (Optional)</label>
                <textarea 
                  value={newCampaignDesc}
                  onChange={(e) => setNewCampaignDesc(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none h-24"
                  placeholder="Track performance for our summer marketing channels..."
                ></textarea>
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-on-surface-variant hover:bg-surface-variant rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={!newCampaignName.trim()}
                  className="px-6 py-2 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
