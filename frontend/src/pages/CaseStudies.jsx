/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Quote,
  ArrowRight,
  Play,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { api } from "../lib/axios";

export default function CaseStudies() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndustry, setActiveIndustry] = useState("All");

  useEffect(() => {
    api
      .get("/public/pages/case-studies")
      .then((res) => {
        setData(JSON.parse(res.data.htmlContent));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const industries = useMemo(() => {
    if (!data || !data.cases) return ["All"];
    const inds = new Set(data.cases.map((c) => c.industry));
    return ["All", ...Array.from(inds)];
  }, [data]);

  const filteredCases = useMemo(() => {
    if (!data || !data.cases) return [];
    if (activeIndustry === "All") return data.cases;
    return data.cases.filter((c) => c.industry === activeIndustry);
  }, [activeIndustry, data]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-light text-text-secondary">
        Loading Case Studies...
      </div>
    );
  }

  if (!data || !data.hero) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-light text-text-secondary">
        Case Studies data not available.
      </div>
    );
  }

  const { hero, cta } = data;

  return (
    <div className="bg-bg-light min-h-screen font-sans pb-24 text-brand-dark overflow-hidden">
      {/* Immersive Impact Hero */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 border-b border-border-light">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-emerald/10 via-transparent to-transparent blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h1 className="text-5xl lg:text-8xl font-extrabold text-brand-dark mb-8 tracking-tight leading-[1.05]">
              {hero.title1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-emerald">
                {hero.title2}
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed mb-12">
              {hero.description}
            </p>

            {/* Massive Metrics Ribbon */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto p-4 bg-surface-light backdrop-blur-xl border border-border-light rounded-3xl shadow-xl">
              {hero.stats.map((stat, i) => (
                <div key={i} className="text-center p-4">
                  <div className="text-3xl lg:text-4xl font-extrabold text-brand-dark mb-1">
                    {stat.val}
                  </div>
                  <div className="text-sm font-bold text-text-secondary uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Industry Filter Sticky Tab Bar */}
      <div className="sticky top-0 z-40 bg-bg-light/80 backdrop-blur-2xl border-b border-border-light py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 min-w-max">
            {industries.map((ind, i) => {
              const isActive = ind === activeIndustry;
              return (
                <button
                  key={i}
                  onClick={() => setActiveIndustry(ind)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${isActive ? "bg-brand-dark text-white shadow-md" : "bg-surface-light border border-border-light text-text-secondary hover:text-brand-dark hover:bg-white"}`}
                >
                  {ind}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Immersive Case Studies Alternating Blocks */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-24 min-h-[600px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndustry}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-32"
          >
            {filteredCases.length > 0 ? (
              filteredCases.map((study, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                  className={`flex flex-col ${idx % 2 !== 0 ? "lg:flex-row-reverse" : "lg:flex-row"} gap-12 lg:gap-24 items-center`}
                >
                  {/* Abstract Graphic Side */}
                  <div className="w-full lg:w-1/2 relative group">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${study.color} rounded-[3rem] blur-2xl opacity-80 group-hover:opacity-100 transition-opacity duration-1000`}
                    />
                    <div className="relative aspect-square lg:aspect-auto lg:h-[600px] w-full bg-surface-light border border-border-light rounded-[3rem] overflow-hidden p-12 flex flex-col justify-between shadow-2xl">
                      <div className="flex justify-between items-center relative z-10">
                        <div
                          className={`text-sm font-bold tracking-widest uppercase ${study.accent}`}
                        >
                          {study.industry}
                        </div>
                        <div
                          className={`w-12 h-12 rounded-full ${study.iconColor} shadow-lg flex items-center justify-center backdrop-blur-sm`}
                        >
                          <TrendingUp className="w-5 h-5" />
                        </div>
                      </div>

                      <div className="relative z-10 text-center flex-1 flex items-center justify-center">
                        <div
                          className={`text-5xl font-black ${study.accent} opacity-80`}
                        >
                          {study.company}
                        </div>
                      </div>

                      <div className="relative z-10 bg-white/80 backdrop-blur-xl border border-border-light rounded-3xl p-8 shadow-md">
                        <Quote
                          className={`w-8 h-8 ${study.accent} mb-4 opacity-70`}
                        />
                        <p className="text-lg text-brand-dark font-medium leading-relaxed italic mb-4">
                          "{study.quote}"
                        </p>
                        <p className="text-sm text-text-secondary font-bold tracking-wide uppercase">
                          — {study.author}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Content Side */}
                  <div className="w-full lg:w-1/2 flex flex-col justify-center">
                    <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-light border border-border-light text-text-secondary text-xs font-bold uppercase tracking-wider shadow-sm">
                      Case Study
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-brand-dark mb-10 leading-[1.1]">
                      {study.title}
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                      {study.metrics.map((m, i) => (
                        <div
                          key={i}
                          className="border-l-4 border-border-light pl-6"
                        >
                          <div
                            className={`text-3xl font-extrabold ${study.accent} mb-2`}
                          >
                            {m.value}
                          </div>
                          <div className="text-sm text-text-secondary font-bold">
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        size="lg"
                        className="h-14 px-8 bg-brand-dark text-white hover:bg-brand-dark/90 shadow-lg"
                      >
                        Read Full Story
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="h-14 px-8 text-brand-dark bg-surface-light border-border-light hover:bg-black/5"
                      >
                        <Play className="mr-2 w-5 h-5" /> Watch Video
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-32">
                <p className="text-2xl text-text-secondary font-medium">
                  No case studies found for this industry.
                </p>
                <p className="text-text-secondary mt-2">
                  Check back later or browse other categories.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Bottom Sales CTA */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mb-24">
        <div className="bg-gradient-to-r from-brand-emerald to-brand rounded-[3rem] p-1 border border-brand/20 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent transition-colors duration-500" />
          <div className="bg-brand-dark rounded-[2.8rem] p-12 md:p-20 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              {cta.title}
            </h2>
            <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
              {cta.description}
            </p>
            <Button
              size="lg"
              className="h-16 px-10 text-lg bg-brand-emerald text-brand-dark hover:bg-brand shadow-xl shadow-brand-emerald/20 border-none font-bold"
            >
              {cta.buttonText} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <ul className="mt-8 flex flex-wrap justify-center gap-6 text-sm font-bold text-white/70">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-emerald" />{" "}
                Personalized Demo
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-emerald" /> ROI
                Calculation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-emerald" /> Custom
                Pricing
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
