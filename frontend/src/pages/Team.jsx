/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

import React, { useState, useEffect } from "react";
import { api } from "../lib/axios";
import AsyncButton from "../components/AsyncButton";

export default function Team() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      const res = await api.get("/team");
      setMembers(res.data);
    } catch (error) {
      console.error("Failed to fetch team members", error);
    } finally {
      setLoading(false);
    }
  };

  const removeMember = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    try {
      await api.delete(`/team/${id}`);
      await fetchMembers();
    } catch (error) {
      console.error("Failed to remove team member", error);
    }
  };

  const updateRole = async (id, newRole) => {
    try {
      await api.put(`/team/${id}/role`, { role: newRole });
      fetchMembers();
    } catch (error) {
      console.error("Failed to update team member role", error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);
  return (
    <div className="flex flex-col h-full bg-background font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-headline-lg font-headline-lg text-on-background tracking-tight">
            Team Management
          </h2>
          <p className="text-body-md font-body-md text-on-surface-variant mt-1">
            Manage workspace access, roles, and pending invitations.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-lg text-label-md font-label-md transition-colors duration-200 shadow-sm border border-primary-fixed/20">
          <span className="material-symbols-outlined text-[18px]">
            person_add
          </span>
          Invite Member
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-8 max-w-7xl mx-auto w-full">
        {/* Usage Overview Card */}
        <section className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-6 relative overflow-hidden group">
          {/* Hover subtle glow effect */}
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500 pointer-events-none"></div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-6 w-full md:w-auto">
              <div className="w-12 h-12 rounded-full bg-secondary-container/50 border border-secondary/20 flex items-center justify-center shrink-0">
                <span
                  className="material-symbols-outlined text-secondary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  groups
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-headline-md font-headline-md text-on-background">
                  Seats Utilized
                </h3>
                <p className="text-body-md font-body-md text-on-surface-variant mt-1">
                  You are currently using 4 out of 10 available seats on the
                  Enterprise Tier.
                </p>
              </div>
            </div>

            <div className="w-full md:w-64 space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-headline-md font-headline-md text-primary">
                  4
                </span>
                <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">
                  / 10 Seats
                </span>
              </div>
              <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full w-[40%] transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(121,219,141,0.5)]"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Active Members Grid/List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
            <h3 className="text-label-md font-label-md text-on-surface-variant uppercase tracking-widest">
              Active Members
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {loading ? (
              <div className="p-8 text-center text-on-surface-variant">
                Loading members...
              </div>
            ) : members.filter((m) => m.status === "ACTIVE").length > 0 ? (
              members
                .filter((m) => m.status === "ACTIVE")
                .map((member) => (
                  <div
                    key={member.id}
                    className="bg-surface-container border border-outline-variant/10 rounded-lg p-4 flex items-center justify-between hover:border-primary/30 hover:bg-surface-container-high transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-4">
                      {member.profileImage ? (
                        <img
                          className="w-10 h-10 rounded-full object-cover border border-outline-variant/20"
                          alt={member.name}
                          src={member.profileImage}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-sm border border-secondary/20">
                          {(member.name
                            ? member.name.substring(0, 2)
                            : "U"
                          ).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-label-md font-label-md text-on-background">
                          {member.name || "Unknown User"}
                        </p>
                        <p className="text-label-sm font-label-sm text-on-surface-variant font-code-sm">
                          {member.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <select
                        value={member.role}
                        onChange={(e) => updateRole(member.id, e.target.value)}
                        className={`inline-flex items-center px-2 py-1 rounded-full text-label-sm font-label-sm outline-none border border-transparent hover:border-outline-variant/30 ${
                          member.role === "ADMIN"
                            ? "bg-secondary-container text-on-secondary-container shadow-sm"
                            : "bg-surface-container-highest text-on-surface"
                        }`}
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="MEMBER">MEMBER</option>
                        <option value="VIEWER">VIEWER</option>
                      </select>
                      <AsyncButton
                        onClick={(e) => removeMember(member.id, e)}
                        className="text-on-surface-variant hover:text-error transition-colors p-1 opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Remove Member"
                      >
                        <span className="material-symbols-outlined">
                          person_remove
                        </span>
                      </AsyncButton>
                    </div>
                  </div>
                ))
            ) : (
              <div className="p-8 text-center text-on-surface-variant">
                No active members found.
              </div>
            )}
          </div>
        </section>

        {/* Pending Invitations */}
        <section className="space-y-4 pt-6">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
            <h3 className="text-label-md font-label-md text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
              Pending Invitations
              <span className="bg-surface-variant text-on-surface rounded-full px-2 py-0.5 text-[10px]">
                {members.filter((m) => m.status === "INVITED").length}
              </span>
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {members.filter((m) => m.status === "INVITED").length > 0 ? (
              members
                .filter((m) => m.status === "INVITED")
                .map((member) => (
                  <div
                    key={member.id}
                    className="bg-surface-container-lowest border border-outline-variant/20 border-dashed rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-primary/50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant/20">
                        <span
                          className="material-symbols-outlined text-on-surface-variant"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          mail
                        </span>
                      </div>
                      <div>
                        <p className="text-label-md font-label-md text-on-surface-variant italic">
                          Waiting for acceptance...
                        </p>
                        <p className="text-label-sm font-label-sm text-primary font-code-sm">
                          {member.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-surface-container-highest text-on-surface-variant text-label-sm font-label-sm border border-outline-variant/10">
                        {member.role}
                      </span>
                      <div className="flex-1 flex justify-end gap-2">
                        <button
                          onClick={() => alert("Invitation resent!")}
                          className="text-label-sm font-label-sm text-on-surface hover:text-primary transition-colors px-2 py-1 rounded border border-outline-variant/20 hover:border-primary/50"
                        >
                          Resend
                        </button>
                        <AsyncButton
                          onClick={(e) => removeMember(member.id, e)}
                          className="text-label-sm font-label-sm text-error hover:text-on-error hover:bg-error transition-colors px-2 py-1 rounded border border-error/20"
                        >
                          Revoke
                        </AsyncButton>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="p-8 text-center text-on-surface-variant">
                No pending invitations.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
