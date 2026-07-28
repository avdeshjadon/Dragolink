import re

with open('frontend/src/pages/MyLinks.jsx', 'r') as f:
    content = f.read()

# 1. Add state variables
states_to_add = """
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
"""
content = content.replace("  const [editAlias, setEditAlias] = useState('');", "  const [editAlias, setEditAlias] = useState('');" + states_to_add)

# 2. Update openEditModal
open_modal_old = """  const openEditModal = (link) => {
    setEditModalLink(link);
    setEditUrl(link.longUrl || '');
    setEditTitle(link.title || '');
    setEditAlias(link.customAlias || link.shortCode || '');
  };"""
open_modal_new = """  const openEditModal = (link) => {
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
  };"""
content = content.replace(open_modal_old, open_modal_new)

# 3. Update handleEditSubmit
submit_old = """      await api.put(`/links/${editModalLink.id}`, {
        longUrl: editUrl,
        title: editTitle,
        customAlias: editAlias
      });"""
submit_new = """      await api.put(`/links/${editModalLink.id}`, {
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
      });"""
content = content.replace(submit_old, submit_new)

# 4. Update Modal UI
modal_old = """      <MotionModal
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
        </div>"""

modal_new = """      <MotionModal
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
        </div>"""

content = content.replace(modal_old, modal_new)

with open('frontend/src/pages/MyLinks.jsx', 'w') as f:
    f.write(content)

