import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/axios";
import AsyncButton from "../components/AsyncButton";

export default function CreateCampaign() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!name.trim()) return;
    try {
      await api.post("/campaigns", {
        name,
        description,
      });
      navigate("/campaigns");
    } catch (error) {
      console.error("Failed to create campaign", error);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-10 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-on-surface tracking-tight mb-2">
          Create New Campaign
        </h2>
        <p className="text-base text-on-surface-variant">
          Group your links and track their performance across your marketing channels.
        </p>
      </div>

      <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-6 md:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-label-md font-label-md text-on-surface">
              Campaign Name <span className="text-error">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface-container-highest border border-outline-variant/30 rounded-xl px-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/50"
              placeholder="e.g., Summer Sale 2024"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-label-md font-label-md text-on-surface">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-surface-container-highest border border-outline-variant/30 rounded-xl px-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/50 resize-y min-h-[120px]"
              placeholder="Track performance for our summer marketing channels..."
            ></textarea>
            <p className="text-body-sm text-on-surface-variant mt-1">
              Add details to help you and your team remember the purpose of this campaign.
            </p>
          </div>

          <div className="pt-6 border-t border-outline-variant/10 flex flex-col-reverse sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/campaigns")}
              className="w-full sm:w-auto px-6 py-2.5 text-on-surface-variant hover:bg-surface-variant rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <AsyncButton
              type="submit"
              onClick={handleSubmit}
              disabled={!name.trim()}
              className="w-full sm:w-auto px-6 py-2.5 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              Create Campaign
            </AsyncButton>
          </div>
        </form>
      </div>
    </div>
  );
}
