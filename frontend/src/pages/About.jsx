/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Eye,
  Activity,
  Globe,
  Zap,
  Heart,
  Users,
  Target,
  Link,
} from "lucide-react";
import { api } from "../lib/axios";

const iconMap = { Shield, Eye, Activity, Globe, Zap, Heart, Users, Target };

export default function About() {
  const [data, setData] = useState(null);
  const [realStats, setRealStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/public/pages/about");
        setData(JSON.parse(res.data.htmlContent));
      } catch (e) {
        console.error("Failed to parse About CMS data:", e);
      }
      
      try {
        const statsRes = await api.get('/public/platform-stats');
        setRealStats(statsRes.data);
      } catch (e) {
        console.error("Failed to fetch real platform stats", e);
      }

      setLoading(false);
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-light text-text-secondary">
        Loading...
      </div>
    );
  }

  if (!data || !data.hero) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-light text-text-secondary">
        Content not available.
      </div>
    );
  }

  const { hero, values, story, milestones, team } = data;
  
  const statsToDisplay = realStats ? [
    { val: `${(realStats.totalClicks / 1000000000).toFixed(0)}B+`, label: 'Links clicked monthly' },
    { val: `${realStats.countriesServed}+`, label: 'Countries served' },
    { val: `${realStats.uptime}%`, label: 'Uptime SLA' },
    { val: realStats.supportStatus, label: 'Global support' }
  ] : data.stats || [];

  return (
    <div className="bg-bg-light min-h-screen font-sans pb-32 text-brand-dark overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center px-4 sm:px-6 lg:px-8 border-b border-border-light overflow-hidden pt-16 pb-16">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-emerald/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-5xl lg:text-7xl font-extrabold text-brand-dark mb-8 tracking-tight leading-[1.05]">
              {hero.title1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-emerald">
                {hero.title2}
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              {hero.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-surface-light border-b border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsToDisplay.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl lg:text-6xl font-extrabold text-brand-dark mb-2">
                  {stat.val}
                </div>
                <div className="text-sm font-bold text-text-secondary uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story & Milestones */}
      {(story || (milestones && milestones.length > 0)) && (
        <section className="py-24 bg-white border-b border-border-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-16 items-start">
            {/* Story Text */}
            {story && (
              <div className="lg:w-1/2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-4xl font-extrabold text-brand-dark mb-6">
                    {story.title}
                  </h2>
                  <div className="text-lg text-text-secondary leading-relaxed whitespace-pre-line space-y-4">
                    {story.content}
                  </div>
                </motion.div>
              </div>
            )}

            {/* Milestones */}
            {milestones && milestones.length > 0 && (
              <div className="lg:w-1/2 w-full pl-0 lg:pl-12 border-l border-border-light">
                <div className="space-y-12">
                  {milestones.map((ms, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative"
                    >
                      <div className="absolute -left-[57px] lg:-left-[65px] top-1 w-6 h-6 rounded-full bg-surface-light border-4 border-brand-emerald shadow-sm hidden lg:block" />
                      <div className="text-brand-emerald font-bold text-xl mb-2">
                        {ms.year}
                      </div>
                      <h3 className="text-2xl font-extrabold text-brand-dark mb-2">
                        {ms.title}
                      </h3>
                      <p className="text-text-secondary leading-relaxed">
                        {ms.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Values Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-brand-dark mb-4">
            Our Core Values
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            The principles that guide every feature we build and every decision
            we make.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((val, idx) => {
            const Icon = iconMap[val.icon] || Shield;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-surface-light border border-border-light rounded-3xl p-10 hover:shadow-xl transition-shadow group"
              >
                <div className="w-16 h-16 rounded-2xl bg-brand-emerald/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8 text-brand-emerald" />
                </div>
                <h3 className="text-2xl font-bold text-brand-dark mb-4">
                  {val.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {val.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Creator Section */}
      {team && team.length > 0 && (
        <section className="py-24 bg-brand-dark text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-extrabold mb-4">The Creator</h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                The sole developer behind the product.
              </p>
            </div>

            <div className="flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="text-center max-w-md group"
              >
                <div className="relative w-56 h-56 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white/10 group-hover:border-brand-emerald transition-colors">
                  <img
                    src={team[0].imageUrl}
                    alt={team[0].name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <h3 className="text-3xl font-bold mb-2">{team[0].name}</h3>
                <p className="text-brand-emerald font-medium mb-4 text-lg">
                  {team[0].role}
                </p>
                {/* Fallback description if CMS doesn't have a description field in team */}
                <p className="text-white/80 leading-relaxed mb-6">
                  {team[0].description || "Avdesh Jadon is a B.Tech 4th year student who independently designed, developed, and handles every aspect of this project. A solo force driving the platform from vision to reality."}
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
