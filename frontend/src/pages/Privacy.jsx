import { useState, useEffect, useMemo } from 'react';
import { api } from '../lib/axios';

const DEFAULT_PRIVACY = {
  lastUpdated: new Date().toISOString().split('T')[0],
  sections: [
    { heading: "1. Introduction", content: "At Dragolink, we are committed to protecting your privacy and ensuring the highest level of security for your data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our link management infrastructure." },
    { heading: "2. Information We Collect", content: "We collect information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.\n\nThe personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use." },
    { heading: "3. How We Use Your Information", content: "We use personal information collected via our Services for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.\n\n- To facilitate account creation and logon process.\n- To send administrative information to you.\n- To fulfill and manage your orders.\n- To protect our Services.\n- To enforce our terms, conditions, and policies for business purposes, to comply with legal and regulatory requirements." },
    { heading: "4. Data Sharing and Disclosure", content: "We may process or share your data that we hold based on the following legal basis:\n\n- Consent: We may process your data if you have given us specific consent to use your personal information for a specific purpose.\n- Legitimate Interests: We may process your data when it is reasonably necessary to achieve our legitimate business interests.\n- Legal Obligations: We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process." },
    { heading: "5. Data Security", content: "We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security, and improperly collect, access, steal, or modify your information." },
    { heading: "6. Your Privacy Rights", content: "In some regions (like the EEA and UK), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability. In certain circumstances, you may also have the right to object to the processing of your personal information." }
  ]
};

export default function Privacy() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    api.get('/public/pages/privacy')
      .then(res => {
        let parsedData;
        try {
          parsedData = JSON.parse(res.data.htmlContent);
          if (!parsedData.sections) {
            parsedData = DEFAULT_PRIVACY;
          }
        } catch (e) {
          console.error("Failed to parse Privacy CMS data:", e);
          parsedData = DEFAULT_PRIVACY;
        }
        setData({ ...res.data, ...parsedData });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const toc = useMemo(() => {
    if (!data || !data.sections) return [];
    return data.sections.map(sec => ({
      id: sec.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      title: sec.heading
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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [toc]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-bg-light text-text-secondary">Loading Document...</div>;
  }

  if (!data || !data.sections) {
    return <div className="min-h-screen flex items-center justify-center bg-bg-light text-text-secondary">Document not available.</div>;
  }

  return (
    <div className="bg-bg-light min-h-screen font-sans pb-24 text-brand-dark">
      
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-border-light">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold text-brand-dark mb-6 tracking-tight">
            {data.title || "Privacy Policy"}
          </h1>
          <p className="text-lg text-text-secondary font-mono">
            Last Updated: <span className="font-bold text-brand-dark">{data.lastUpdated}</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col lg:flex-row gap-16 relative">
        
        {/* Sticky Sidebar Navigation */}
        <div className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-32 bg-surface-light border border-border-light rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-sm uppercase tracking-widest text-text-secondary mb-4">Table of Contents</h3>
            <nav className="space-y-1">
              {toc.map((item) => (
                <a 
                  key={item.id} 
                  href={`#${item.id}`}
                  className={`block py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === item.id 
                      ? 'bg-brand/10 text-brand' 
                      : 'text-text-secondary hover:bg-black/5 hover:text-brand-dark'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {item.title}
                </a>
              ))}
              {toc.length === 0 && <p className="text-sm text-text-secondary">No headers found.</p>}
            </nav>
          </div>
        </div>

        {/* Document Content */}
        <div className="flex-1 max-w-3xl">
           <div className="prose-custom">
             {data.sections.map((section, idx) => (
               <div key={idx} className="mb-12">
                 <h2 id={toc[idx]?.id} className="scroll-mt-32 text-3xl font-bold text-brand-dark mb-6">
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
