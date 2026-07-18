import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share2, MessageCircle, Mail, Copy } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/cms/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error("Failed to fetch post", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-bg-light flex items-center justify-center font-sans">Loading post...</div>;
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-bg-light flex flex-col items-center justify-center font-sans">
        <h1 className="text-4xl font-bold text-brand-dark mb-4">Post not found</h1>
        <Link to="/blog">
          <Button>Back to Blog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-bg-light min-h-screen font-sans pb-24 text-brand-dark">
      {/* Article Header (Cream Background) */}
      <div className="bg-[#F9F7F1] pt-32 pb-16 px-4 sm:px-6 lg:px-8 border-b border-border-light">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Text */}
          <div>
            <Link to="/blog" className="inline-flex items-center text-text-secondary hover:text-brand transition-colors mb-10 text-sm font-medium">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to blog
            </Link>
            
            <div className="uppercase tracking-widest text-sm font-bold text-text-secondary mb-4">
              {post.category}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-brand-dark mb-6 leading-[1.1] tracking-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-3 text-lg font-medium text-text-secondary">
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="w-full aspect-[4/3] rounded-[2rem] shadow-2xl relative overflow-hidden bg-brand">
            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Article Content & Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          <article className="lg:col-span-8">
            <p className="text-xl text-text-secondary leading-relaxed mb-12 italic border-l-4 border-brand pl-6">
              {post.excerpt}
            </p>

            {/* Post Content */}
            <div className="prose prose-lg prose-green max-w-none">
              {post.content && typeof post.content === 'string' && post.content.startsWith('[') ? 
                JSON.parse(post.content).map((section, idx) => (
                  <div key={idx} className="mb-12">
                    <h2 id={`section-${idx}`} className="text-3xl font-bold text-brand-dark mb-6 tracking-tight">
                      {section.heading}
                    </h2>
                    {section.body.map((para, pIdx) => (
                      <p key={pIdx} className="text-lg text-text-secondary leading-relaxed mb-6">
                        {para}
                      </p>
                    ))}
                  </div>
                )) : (
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
              )}
            </div>
          </article>
          
          {/* Sticky Sidebar */}
          <aside className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-32 space-y-6">
              
              <div className="bg-surface-light border border-border-light rounded-3xl p-8 mb-8 sticky top-24">
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-6">In this article</h3>
              <ul className="space-y-4">
                {post.content && typeof post.content === 'string' && post.content.startsWith('[') && JSON.parse(post.content).map((section, idx) => (
                  <li key={idx}>
                    <a href={`#section-${idx}`} className="text-text-secondary hover:text-brand font-medium transition-colors line-clamp-2">
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </div>  
              <div className="bg-[#F9F7F1] rounded-[2rem] p-8 flex items-center justify-between">
                <span className="text-sm font-bold tracking-widest text-brand-dark uppercase">Share:</span>
                <div className="flex gap-2">
                  <Button variant="ghost" className="w-10 h-10 p-0 rounded-full bg-white hover:bg-brand/10 text-brand-dark shadow-sm">
                    <MessageCircle className="w-4 h-4"/>
                  </Button>
                  <Button variant="ghost" className="w-10 h-10 p-0 rounded-full bg-white hover:bg-brand/10 text-brand-dark shadow-sm">
                    <Mail className="w-4 h-4"/>
                  </Button>
                  <Button variant="ghost" className="w-10 h-10 p-0 rounded-full bg-white hover:bg-brand/10 text-brand-dark shadow-sm" onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied!');
                  }}>
                    <Copy className="w-4 h-4"/>
                  </Button>
                </div>
              </div>

            </div>
          </aside>

        </div>
      </div>

      {/* Footer / CTA */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mt-24 pt-12 border-t border-border-light text-center">
        <h3 className="text-2xl font-bold text-brand-dark mb-4">Enjoyed this article?</h3>
        <p className="text-text-secondary mb-8">Share it with your network or read more from the Dragolink team.</p>
        <div className="flex justify-center gap-4">
          <Link to="/blog">
             <Button variant="outline" className="border-border-light hover:bg-surface-light text-brand-dark">More Articles</Button>
          </Link>
          <Button 
            className="bg-brand text-white hover:bg-brand/90 shadow-lg shadow-brand/20"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: post.title, url: window.location.href }).catch(() => {});
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
              }
            }}
          >
            <Share2 className="w-4 h-4 mr-2" /> Share Post
          </Button>
        </div>
      </div>

    </div>
  );
}
