/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

import { useState, useEffect } from "react";
import { api } from "../lib/axios";
import AsyncButton from "../components/AsyncButton";

export default function APIKeys() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState(null);

  const fetchKeys = async () => {
    try {
      const res = await api.get("/keys");
      setKeys(res.data);
    } catch (error) {
      console.error("Failed to load API keys", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleGenerateKey = async () => {
    if (!newKeyName.trim()) return;
    try {
      const res = await api.post("/keys", { name: newKeyName });
      setGeneratedKey(res.data.rawKey);
      await fetchKeys();
      setNewKeyName("");
    } catch (error) {
      console.error("Failed to generate key", error);
    }
  };

  const handleDeleteKey = async (id) => {
    try {
      await api.delete(`/keys/${id}`);
      await fetchKeys();
    } catch (error) {
      console.error("Failed to delete key", error);
    }
  };
  return (
    <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-on-surface tracking-tight mb-2">
            Developer API
          </h2>
          <p className="text-base text-on-surface-variant max-w-2xl">
            Manage your API keys and integrate Dragolink into your own
            applications and workflows.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-label-md font-label-md hover:bg-primary/90 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">key</span>
            Generate Key
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          Loading API keys...
        </div>
      ) : keys.length > 0 ? (
        <div className="bg-surface-container-low border border-outline-variant/20 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-outline-variant/10 bg-surface-container-lowest">
                <th className="p-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider font-medium">
                  Name
                </th>
                <th className="p-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider font-medium">
                  Key Prefix
                </th>
                <th className="p-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider font-medium">
                  Created
                </th>
                <th className="p-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider font-medium">
                  Last Used
                </th>
                <th className="p-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="text-body-md font-body-md">
              {keys.map((key) => (
                <tr
                  key={key.id}
                  className="border-b border-outline-variant/5 hover:bg-surface-container-high transition-colors"
                >
                  <td className="p-4 text-on-surface font-medium">
                    {key.name}
                  </td>
                  <td className="p-4">
                    <span className="font-code-sm text-code-sm text-on-surface-variant bg-surface-variant px-2 py-1 rounded">
                      {key.prefix}••••••••••••
                    </span>
                  </td>
                  <td className="p-4 text-on-surface-variant">
                    {new Date(key.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-on-surface-variant">
                    {key.lastUsedAt
                      ? new Date(key.lastUsedAt).toLocaleDateString()
                      : "Never"}
                  </td>
                  <td className="p-4 text-right">
                    <AsyncButton
                      onClick={() => handleDeleteKey(key.id)}
                      className="text-error hover:text-error/80 transition-colors p-2 rounded-full hover:bg-error-container"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        delete
                      </span>
                    </AsyncButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-surface-container-low border border-outline-variant/20 rounded-xl overflow-hidden shadow-sm flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4 text-primary shadow-inner">
            <span className="material-symbols-outlined text-[32px]">api</span>
          </div>
          <h3 className="text-lg font-bold text-on-surface mb-2">
            No API keys found
          </h3>
          <p className="text-sm text-on-surface-variant max-w-md text-center mb-6">
            Generate an API key to programmatically create short links, fetch
            analytics, and manage campaigns.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg text-label-md font-label-md hover:bg-primary/90 transition-colors shadow-sm"
          >
            Generate Key
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface border border-outline-variant/20 rounded-2xl w-full max-w-md shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
              <h3 className="text-title-lg font-title-lg text-on-surface">
                Generate API Key
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setGeneratedKey(null);
                }}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-variant transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4">
              {generatedKey ? (
                <div className="space-y-4">
                  <div className="p-4 bg-error-container/20 border border-error/20 rounded-lg flex gap-3 text-on-surface">
                    <span className="material-symbols-outlined text-error shrink-0">
                      warning
                    </span>
                    <p className="text-sm">
                      Please copy this key and store it securely. For your
                      protection, you will not be able to see it again.
                    </p>
                  </div>
                  <div>
                    <label className="block text-label-sm font-label-md text-on-surface-variant mb-1">
                      Your API Key
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        readOnly
                        value={generatedKey}
                        className="w-full bg-surface-container-highest border border-outline-variant rounded-l-lg px-4 py-2 text-on-surface font-code-sm outline-none"
                      />
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(generatedKey)
                        }
                        className="bg-primary text-on-primary px-4 rounded-r-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          content_copy
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => {
                        setIsModalOpen(false);
                        setGeneratedKey(null);
                      }}
                      className="px-6 py-2 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="mb-4">
                    <label className="block text-label-sm font-label-md text-on-surface-variant mb-1">
                      Key Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      placeholder="e.g., Zapier Integration"
                    />
                  </div>
                  <div className="pt-4 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-on-surface-variant hover:bg-surface-variant rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <AsyncButton
                      type="submit"
                      onClick={handleGenerateKey}
                      disabled={!newKeyName.trim()}
                      className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      Generate Key
                    </AsyncButton>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
