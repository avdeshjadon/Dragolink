/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Calendar, User, Tag, Mail } from "lucide-react";
import { Button } from "../components/ui/Button";
import { api } from "../lib/axios";

export default function Blog() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [blogPosts, setBlogPosts] = useState([]);
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  const categories = useMemo(() => {
    if (pageData && pageData.categories && pageData.categories.length > 0) {
      return ["All", ...pageData.categories];
    }
    return [
      "All",
      "Product Updates",
      "Engineering",
      "Marketing",
      "Growth",
      "Case Studies",
    ];
  }, [pageData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, pageRes] = await Promise.all([
          api.get("/public/posts"),
          api.get("/public/pages/blog").catch(() => ({ data: null })),
        ]);
        setBlogPosts(postsRes.data);
        if (pageRes.data && pageRes.data.htmlContent) {
          setPageData(JSON.parse(pageRes.data.htmlContent));
        }
      } catch (err) {
        console.error("Failed to fetch blog data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const featuredPost = useMemo(
    () => blogPosts.find((p) => p.featured) || blogPosts[0],
    [blogPosts],
  );

  const filteredPosts = useMemo(() => {
    if (!featuredPost) return [];
    const rest = blogPosts.filter((p) => p.id !== featuredPost.id);
    if (activeCategory === "All") return rest;
    return rest.filter((p) => p.category === activeCategory);
  }, [activeCategory, featuredPost, blogPosts]);

  const categoryCounts = useMemo(() => {
    if (!featuredPost) return { All: 0 };
    const rest = blogPosts.filter((p) => p.id !== featuredPost.id);
    const counts = { All: rest.length };
    categories.slice(1).forEach((cat) => {
      counts[cat] = rest.filter((p) => p.category === cat).length;
    });
    return counts;
  }, [featuredPost, blogPosts, categories]);

  const goToPost = (id) => navigate(`/blog/${id}`);

  return (
    <div className="bg-bg-light min-h-screen font-sans">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {pageData && pageData.hero ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl lg:text-7xl font-extrabold text-brand-dark mb-6 tracking-tight">
              {pageData.hero.title1}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-emerald">
                {pageData.hero.title2}
              </span>
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed mb-10">
              {pageData.hero.subtitle}
            </p>
            <form
              className="max-w-md mx-auto flex gap-2 relative"
              onSubmit={(e) => e.preventDefault()}
            >
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-12 pr-4 h-14 rounded-xl border border-border-light bg-surface-light focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all text-brand-dark"
              />
              <Button
                type="submit"
                className="whitespace-nowrap px-8 !h-14 rounded-xl shadow-lg shadow-brand/20"
              >
                {pageData.hero.buttonText}
              </Button>
            </form>
          </motion.div>
        ) : (
          <div className="py-10">Loading Hero...</div>
        )}
      </section>

      {/* Featured Post */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-20 text-text-secondary">
            Loading posts...
          </div>
        ) : featuredPost ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            onClick={() => goToPost(featuredPost.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === " ") && goToPost(featuredPost.id)
            }
            className="group cursor-pointer"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12 bg-surface-light rounded-[2rem] border border-border-light overflow-hidden shadow-xl hover:shadow-2xl hover:border-brand/30 transition-all duration-300">
              {/* Featured Image */}
              <div
                className={`h-64 lg:h-full w-full bg-surface-light relative overflow-hidden flex items-center justify-center p-8`}
              >
                <img
                  src={featuredPost.imageUrl}
                  alt={featuredPost.title}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>

              {/* Featured Content */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-brand/10 text-brand font-bold px-3 py-1 rounded-full text-sm">
                    {featuredPost.category}
                  </span>
                  <span className="text-text-secondary text-sm flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" /> {featuredPost.date}
                  </span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-4 leading-tight group-hover:text-brand transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-text-secondary text-lg mb-8 line-clamp-3 leading-relaxed">
                  {featuredPost.excerpt}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-emerald/20 flex items-center justify-center text-brand-dark font-bold">
                      {featuredPost.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-dark">
                        {featuredPost.author}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {featuredPost.readTime}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="group-hover:translate-x-2 transition-transform"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPost(featuredPost.id);
                    }}
                  >
                    Read Article <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-20 text-text-secondary">
            No featured post found.
          </div>
        )}
      </section>

      {/* Category Filter */}
      {!loading && (
        <>
          <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-4 h-4 text-brand" />
              <p className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
                Browse by topic
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 lg:gap-3">
              {categories.map((category) => {
                const isActive = activeCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    aria-pressed={isActive}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                      isActive
                        ? "bg-brand text-white border-brand shadow-md shadow-brand/25 scale-[1.03]"
                        : "bg-surface-light text-text-secondary border-border-light hover:border-brand/40 hover:text-brand-dark hover:-translate-y-0.5"
                    }`}
                  >
                    {category}
                    <span
                      className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-brand/10 text-brand"
                      }`}
                    >
                      {categoryCounts[category]}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Recent Posts Grid */}
          <section className="pb-24 pt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredPosts.map((post, idx) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.07 }}
                    onClick={() => goToPost(post.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) =>
                      (e.key === "Enter" || e.key === " ") && goToPost(post.id)
                    }
                    className="group cursor-pointer bg-surface-light border border-border-light rounded-2xl overflow-hidden hover:shadow-xl hover:border-brand/30 transition-all flex flex-col h-full"
                  >
                    {/* Image */}
                    <div
                      className={`h-52 w-full bg-surface-light relative overflow-hidden shrink-0 flex items-center justify-center p-6`}
                    >
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-4 text-xs font-medium">
                        <span className="text-brand bg-brand/10 px-2.5 py-1 rounded-md">
                          {post.category}
                        </span>
                        <span className="text-text-secondary">{post.date}</span>
                      </div>

                      <h3 className="text-xl font-bold text-brand-dark mb-3 leading-snug group-hover:text-brand transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-text-secondary text-sm mb-6 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="mt-auto flex items-center justify-between border-t border-border-light pt-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-text-secondary" />
                          <span className="text-sm text-text-primary font-medium">
                            {post.author}
                          </span>
                        </div>
                        <span className="text-xs text-text-secondary">
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {filteredPosts.length === 0 && (
                  <div className="col-span-full text-center py-20 text-text-secondary">
                    No articles in this category yet.
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </section>
        </>
      )}

      {/* Newsletter Section */}
      {pageData && pageData.newsletter && (
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-brand-dark rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-emerald opacity-10 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand opacity-10 blur-[120px] rounded-full -translate-x-1/3 translate-y-1/3" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {pageData.newsletter.title}
                </h2>
                <p className="text-lg text-white/70">
                  {pageData.newsletter.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 bg-white/5 p-2 rounded-2xl backdrop-blur-sm border border-white/10">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 h-14 bg-transparent border-none text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-emerald rounded-xl"
                  />
                </div>
                <Button
                  size="lg"
                  className="h-14 px-8 bg-brand-emerald hover:bg-brand text-brand-dark hover:text-white shrink-0 shadow-lg"
                >
                  {pageData.newsletter.buttonText}
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
