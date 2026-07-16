export default function APIKeys() {
  return (
    <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-on-surface tracking-tight mb-2">Developer API</h2>
          <p className="text-base text-on-surface-variant max-w-2xl">Manage your API keys and integrate Dragolink into your own applications and workflows.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 px-4 py-2 bg-primary-container text-on-primary-container rounded-lg font-medium hover:bg-primary-fixed transition-colors">
            <span className="material-symbols-outlined text-[18px]">key</span>
            Generate Key
          </button>
        </div>
      </div>

      <div className="bg-surface-container-low border border-outline-variant/20 rounded-xl overflow-hidden shadow-sm flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4 text-primary shadow-inner">
            <span className="material-symbols-outlined text-[32px]">api</span>
          </div>
          <h3 className="text-lg font-bold text-on-surface mb-2">No API keys found</h3>
          <p className="text-sm text-on-surface-variant max-w-md text-center mb-6">Generate an API key to programmatically create short links, fetch analytics, and manage campaigns.</p>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-surface-container border border-outline-variant/30 rounded-lg text-on-surface font-medium hover:border-primary/50 transition-colors">
            View Documentation
          </button>
      </div>
    </div>
  );
}
