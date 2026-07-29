/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Globe,
  Heart,
  BookOpen,
  Coffee,
  Zap,
  Target,
  Users,
  Shield,
  ArrowRight,
  MapPin,
  Briefcase,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { api } from "../lib/axios";

const iconMap = { Globe, Heart, BookOpen, Coffee, Zap, Target, Users, Shield };

export default function Careers() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/public/pages/careers")
      .then((res) => {
        try {
          setData(JSON.parse(res.data.htmlContent));
        } catch (e) {
          console.error("Failed to parse Careers CMS data:", e);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
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

  const { hero, perks, jobs } = data;

  return (
    <div className="bg-bg-light min-h-screen font-sans pb-32 text-brand-dark overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-emerald/5 to-transparent pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-5xl lg:text-8xl font-extrabold text-brand-dark mb-8 tracking-tight leading-[1.05]">
              {hero.title1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-emerald">
                {hero.title2}
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed mb-10">
              {hero.description}
            </p>

            <Button
              size="lg"
              className="h-14 px-8 bg-brand-dark text-white hover:bg-black shadow-xl"
              onClick={() =>
                document
                  .getElementById("jobs")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              View Open Roles <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Perks Grid */}
      <section className="py-24 bg-surface-light border-y border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-brand-dark mb-4">
              Why work here?
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              We invest heavily in our team so they can invest heavily in our
              product.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {perks.map((perk, idx) => {
              const Icon = iconMap[perk.icon] || Globe;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white border border-border-light rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand/5 border border-brand/10 flex items-center justify-center mb-6 text-brand">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-dark mb-2">
                    {perk.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {perk.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Jobs Board */}
      <section
        id="jobs"
        className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-brand-dark mb-4">
            Open Positions
          </h2>
          <p className="text-xl text-text-secondary">
            Join us on our mission to secure the web's links.
          </p>
        </div>

        <div className="space-y-4">
          {jobs.map((job, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link
                to={`/careers/${job.id || "#"}`}
                className="block bg-surface-light border border-border-light rounded-2xl p-6 hover:border-brand-emerald hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-brand-emerald transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary font-medium">
                      <span className="flex items-center gap-1.5 bg-bg-light px-3 py-1 rounded-full border border-border-light">
                        <Briefcase className="w-4 h-4 text-brand-emerald" />{" "}
                        {job.dept}
                      </span>
                      <span className="flex items-center gap-1.5 bg-bg-light px-3 py-1 rounded-full border border-border-light">
                        <MapPin className="w-4 h-4 text-brand-emerald" />{" "}
                        {job.loc}
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 shrink-0 rounded-full bg-white border border-border-light flex items-center justify-center group-hover:bg-brand-emerald group-hover:text-white group-hover:border-brand-emerald transition-all shadow-sm">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
          {jobs.length === 0 && (
            <div className="text-center p-12 bg-surface-light rounded-2xl border border-dashed border-border-light">
              <p className="text-text-secondary font-medium">
                No open positions at the moment. Check back later!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
