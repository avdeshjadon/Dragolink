/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

import { useState, useEffect, useMemo } from "react";
import { api } from "../lib/axios";

const DEFAULT_TERMS = {
  lastUpdated: new Date().toISOString().split("T")[0],
  sections: [
    {
      heading: "1. Acceptance of Terms",
      content:
        "By accessing or using the Dragolink platform, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the service. These terms apply to all visitors, users, and others who access or use the Service.",
    },
    {
      heading: "2. Description of Service",
      content:
        "Dragolink provides a comprehensive link management platform, including URL shortening, dynamic QR code generation, advanced analytics, and link routing infrastructure. We reserve the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice.",
    },
    {
      heading: "3. User Accounts",
      content:
        "When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.\n\nYou are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.",
    },
    {
      heading: "4. Acceptable Use Policy",
      content:
        "You agree not to use the Service to:\n\n- Link to malware, phishing sites, or any malicious content designed to harm or exploit users.\n- Distribute spam or engage in abusive marketing practices.\n- Violate any applicable laws, regulations, or third-party rights.\n- Interfere with or disrupt the integrity or performance of the Service.\n\nWe employ automated security scanning and reserve the right to immediately suspend accounts and disable links found violating these rules.",
    },
    {
      heading: "5. Intellectual Property",
      content:
        "The Service and its original content, features, and functionality are and will remain the exclusive property of Dragolink and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Dragolink.",
    },
    {
      heading: "6. Limitation of Liability",
      content:
        "In no event shall Dragolink, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content.",
    },
  ],
};

export default function Terms() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    api
      .get("/public/pages/terms")
      .then((res) => {
        let parsedData;
        try {
          parsedData = JSON.parse(res.data.htmlContent);
          if (!parsedData.sections) {
            parsedData = DEFAULT_TERMS;
          }
        } catch (e) {
          console.error("Failed to parse Terms CMS data:", e);
          parsedData = DEFAULT_TERMS;
        }
        setData({ ...res.data, ...parsedData });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const toc = useMemo(() => {
    if (!data || !data.sections) return [];
    return data.sections.map((sec) => ({
      id: sec.heading
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
      title: sec.heading,
    }));
  }, [data]);

  useEffect(() => {
    if (toc.length === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      let currentSection = toc[0].id;
      for (const section of toc) {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPosition) {
          currentSection = section.id;
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [toc]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-light text-text-secondary">
        Loading Document...
      </div>
    );
  }

  if (!data || !data.sections) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-light text-text-secondary">
        Document not available.
      </div>
    );
  }

  return (
    <div className="bg-bg-light min-h-screen font-sans pb-24 text-brand-dark">
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-border-light">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold text-brand-dark mb-6 tracking-tight">
            {data.title || "Terms of Service"}
          </h1>
          <p className="text-lg text-text-secondary font-mono">
            Last Updated:{" "}
            <span className="font-bold text-brand-dark">
              {data.lastUpdated}
            </span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col lg:flex-row gap-16 relative">
        {/* Sticky Sidebar Navigation */}
        <div className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-32 bg-surface-light border border-border-light rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-sm uppercase tracking-widest text-text-secondary mb-4">
              Table of Contents
            </h3>
            <nav className="space-y-1">
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`block py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? "bg-brand/10 text-brand"
                      : "text-text-secondary hover:bg-black/5 hover:text-brand-dark"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById(item.id)
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {item.title}
                </a>
              ))}
              {toc.length === 0 && (
                <p className="text-sm text-text-secondary">No headers found.</p>
              )}
            </nav>
          </div>
        </div>

        {/* Document Content */}
        <div className="flex-1 max-w-3xl">
          <div className="prose-custom">
            {data.sections.map((section, idx) => (
              <div key={idx} className="mb-12">
                <h2
                  id={toc[idx]?.id}
                  className="scroll-mt-32 text-3xl font-bold text-brand-dark mb-6"
                >
                  {section.heading}
                </h2>
                <div className="text-text-secondary text-lg leading-relaxed whitespace-pre-line space-y-4">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
