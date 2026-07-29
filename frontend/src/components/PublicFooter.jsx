/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../lib/axios";
import { Shield, Zap } from "lucide-react";

const TwitterIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const GithubIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
    <path d="M9 18c-4.51 2-5-2-7-2"></path>
  </svg>
);

const LinkedinIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export default function PublicFooter() {
  const [links, setLinks] = useState({});

  useEffect(() => {
    // Fetch dynamic footer links from Spring Boot Backend
    api
      .get("/public/navigation")
      .then((res) => {
        // Group by category
        const grouped = res.data.reduce((acc, link) => {
          if (!acc[link.category]) acc[link.category] = [];
          acc[link.category].push(link);
          return acc;
        }, {});
        setLinks(grouped);
      })
      .catch((err) => console.error("Failed to load navigation links", err));
  }, []);

  const renderLink = (link) => {
    const isExternal = link.isExternal || link.is_external;
    const badge = link.badgeText || link.badge_text;

    if (isExternal) {
      return (
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-brand transition-colors flex items-center gap-2"
        >
          {link.label}{" "}
          {badge && (
            <span className="bg-brand-emerald/10 text-brand-emerald text-[10px] px-1.5 py-0.5 rounded font-bold">
              {badge}
            </span>
          )}
        </a>
      );
    }

    return (
      <Link
        to={link.url}
        className="hover:text-brand transition-colors flex items-center gap-2"
      >
        {link.label}{" "}
        {badge && (
          <span className="bg-brand-emerald/10 text-brand-emerald text-[10px] px-1.5 py-0.5 rounded font-bold">
            {badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <footer className="bg-surface-light border-t border-border-light pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          {/* Brand & Newsletter */}
          <div className="col-span-1 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img
                src="/dragolink.svg"
                alt="Dragolink Logo"
                className="h-8 w-8"
              />
              <span className="text-2xl font-bold text-[#16803C] tracking-tight">
                Dragolink
              </span>
            </Link>
            <p className="text-text-secondary text-sm mb-6 max-w-sm">
              The professional URL shortener and analytics platform built for
              modern teams, creators, and enterprises. Optimize your links,
              track engagement, and scale your brand.
            </p>

            <div className="flex items-center gap-4 text-text-secondary">
              <a href="#" className="hover:text-brand transition-colors">
                <TwitterIcon className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-brand transition-colors">
                <GithubIcon className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-brand transition-colors">
                <LinkedinIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Dynamic Links Columns */}
          {["Product", "Resources", "Company"].map((category) => (
            <div key={category} className="col-span-1">
              <h4 className="font-bold text-text-primary mb-4">{category}</h4>
              <ul className="space-y-3 text-sm text-text-secondary">
                {links[category]?.map((link) => (
                  <li key={link.id}>{renderLink(link)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border-light flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-secondary">
          <p>
            © {new Date().getFullYear()} Dragolink Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-brand-emerald" /> Enterprise
              Secure
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-brand-accent" /> 99.99% Uptime
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
