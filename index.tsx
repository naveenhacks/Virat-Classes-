import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, BookOpen, Users, Phone, Menu, X, 
  Bell, Award, Calendar, FileText, Download, Edit, Trash, 
  Plus, Settings, ChevronRight, MapPin, Search, 
  ExternalLink, User as UserIcon, LogOut, Sparkles, Zap, GraduationCap,
  Youtube, Facebook, Instagram, Mail, PhoneCall, Code, Save, XCircle,
  Lock, Shield, AlertTriangle, ChevronDown, ChevronUp, Image as ImageIcon, Video, File, Type,
  Bot, Send, MessageSquare, Loader
} from 'lucide-react';
import { User as UserType, Notice, Course, TestResult, TestSchedule, StudyMaterial, SiteConfig, ChatMessage } from './types';
import { GoogleGenAI } from "@google/genai";
import { createClient } from '@supabase/supabase-js';

// --- SUPABASE CONFIG ---
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://egfbgumncawvykqzhirn.supabase.co';
const supabaseKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnZmJndW1uY2F3dnlrcXpoaXJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NjEyOTEsImV4cCI6MjA4MDQzNzI5MX0.SzXDn5mQJMOV4O1a-sc52HfPie__xvP2Xu0gAZxHdrI';
const supabase = createClient(supabaseUrl, supabaseKey);

// --- INITIAL FALLBACK CONFIG ---
const FALLBACK_CONFIG: SiteConfig = {
  heroTitle: "Strong Foundation, Virat Results.",
  heroSubtitle: "Unlock your potential with expert coaching for Class 1 to 12.",
  heroTagline: "Admissions Open for 2024-25",
  featuresTitle: "The Virat Advantage",
  featuresSubtitle: "Why students choose Virat Classes",
  coursesPageTitle: "Our Courses",
  coursesPageSubtitle: "Structured learning paths",
  aboutPageTitle: "About Us",
  aboutPageSubtitle: "The story behind Virat Classes",
  ownerName: "Sunny Singh",
  ownerTitle: "Owner & Director",
  ownerQuote: "Education is not just about syllabus completion; it is about igniting curiosity.",
  philosophyTitle: "Our Philosophy",
  philosophyDescription: "Founded with a vision to provide quality education at Ajgain.",
  contactPageTitle: "Get In Touch",
  ownerContact: "8318935619",
  address: "Ajgain Railway Crossing, Near Homeopathy Hospital, Unnao",
  email: "info@viratclasses.com",
  footerDescription: "Empowering students with knowledge and confidence.",
  facebookUrl: "#",
  instagramUrl: "#",
  youtubeUrl: "#"
};

// --- REUSABLE UI COMPONENTS ---

const NeonCard = ({ children, className = '', onClick }: any) => (
  <div 
    onClick={onClick}
    className={`glass-card p-6 rounded-2xl relative overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-2 group ${className}`}
  >
    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    
    {/* Glow effect on hover */}
    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
    
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

const SectionTitle = ({ children, subtitle }: any) => (
  <div className="text-center mb-16 relative z-10 px-4">
    <h2 className="text-4xl md:text-5xl font-bold font-heading text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-300 mb-4 inline-block relative animate-fade-in-up">
      {children}
      <div className="absolute -bottom-2 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
    </h2>
    {subtitle && <p className="text-slate-400 max-w-2xl mx-auto text-lg">{subtitle}</p>}
  </div>
);

const GlassButton = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false }: any) => {
  const baseStyle = "px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500 hover:text-white shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]",
    secondary: "bg-purple-500/10 text-purple-400 border border-purple-500/50 hover:bg-purple-500 hover:text-white shadow-[0_0_20px_rgba(168,85,247,0.15)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]",
    outline: "bg-transparent text-slate-300 border border-slate-700 hover:border-slate-500 hover:bg-slate-800",
    danger: "bg-red-500/10 text-red-400 border border-red-500/50 hover:bg-red-500 hover:text-white shadow-[0_0_20px_rgba(239,68,68,0.15)] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)]"
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
    </button>
  );
};

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className={`relative z-10 w-full ${maxWidth} bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto custom-scrollbar`}>
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50 sticky top-0 backdrop-blur-md z-20">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const AIChatModal = ({ isOpen, onClose, studentName, history, onSendMessage, userClass }: any) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [isOpen, history]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setLoading(true);

    try {
      await onSendMessage(userMsg);
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-black animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-lg">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
               <Bot size={24} className="text-white" />
            </div>
            <div>
               <h3 className="text-lg font-bold text-white">Virat AI Tutor</h3>
               <p className="text-xs text-cyan-400 flex items-center gap-1">
                 <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Online
               </p>
            </div>
         </div>
         <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-800 text-slate-400 hover:text-white transition-colors">
            <X size={24} />
         </button>
      </div>

      {/* Chat Area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-5">
         <div className="text-center text-xs text-zinc-500 my-4">
            Today
         </div>
         {history.length === 0 && (
             <div className="text-center text-zinc-500 mt-10">
                 <p>Hello {studentName}! How can I help you with your Class {userClass} studies today?</p>
             </div>
         )}
         {history.map((msg: ChatMessage, idx: number) => (
           <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 ${
                msg.role === 'user' 
                ? 'bg-cyan-600/20 text-cyan-50 border border-cyan-500/30 rounded-tr-sm' 
                : 'bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-tl-sm'
              }`}>
                 <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                 <span className="text-[10px] opacity-50 mt-2 block text-right">
                   {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                 </span>
              </div>
           </div>
         ))}
         {loading && (
           <div className="flex justify-start">
              <div className="bg-zinc-900 rounded-2xl p-4 rounded-tl-sm border border-zinc-800 flex items-center gap-2">
                 <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce animation-delay-2000"></div>
                 <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce animation-delay-4000"></div>
              </div>
           </div>
         )}
         <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-900/90 backdrop-blur">
         <form onSubmit={handleSend} className="max-w-4xl mx-auto relative flex items-center gap-3">
            <div className="relative flex-grow">
               <input 
                 type="text" 
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 placeholder="Ask a doubt or question..." 
                 className="w-full bg-black border border-zinc-700 rounded-full pl-6 pr-12 py-4 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 shadow-inner placeholder-zinc-600"
               />
            </div>
            <button 
              type="submit" 
              disabled={!input.trim() || loading}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            >
               <Send size={20} className={input.trim() ? "ml-1" : ""} />
            </button>
         </form>
         <p className="text-center text-[10px] text-zinc-600 mt-2">
            AI can make mistakes. Please verify important information.
         </p>
      </div>
    </div>
  );
};

// --- PAGES & SECTIONS ---

const Navbar = ({ user, currentPage, setPage, logout }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Home', page: 'home' },
    { name: 'Courses', page: 'courses' },
    { name: 'Gallery', page: 'gallery' },
    { name: 'About', page: 'about' },
    { name: 'Contact', page: 'contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
      <div className={`mx-auto max-w-7xl px-4 transition-all duration-300`}>
        <div className={`rounded-full border border-white/10 backdrop-blur-md transition-all duration-300 ${scrolled ? 'bg-slate-900/80 shadow-lg shadow-cyan-900/20 py-2' : 'bg-transparent border-transparent py-2'}`}>
          <div className="flex items-center justify-between px-6">
            {/* Logo */}
            <div 
              className="flex items-center space-x-3 cursor-pointer group" 
              onClick={() => setPage('home')}
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-cyan-500 rounded-lg blur opacity-40 group-hover:opacity-75 transition duration-200"></div>
                <div className="relative w-10 h-10 rounded-lg bg-slate-950 border border-cyan-500/50 flex items-center justify-center text-white font-bold text-xl">
                  <span className="bg-gradient-to-br from-cyan-400 to-purple-500 bg-clip-text text-transparent">V</span>
                </div>
              </div>
              <span className="text-xl font-bold font-heading tracking-wider text-white">
                VIRAT <span className="text-cyan-400">CLASSES</span>
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center bg-slate-950/50 rounded-full border border-white/5 px-2 py-1">
              {links.map((link) => (
                <button
                  key={link.name}
                  onClick={() => setPage(link.page)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    currentPage === link.page 
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)]' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                   <div className="flex flex-col text-right">
                      <span className="text-xs text-slate-400">
                        {user.role === 'admin' ? 'Teacher/Admin' : 'Student'}
                      </span>
                      <span className="text-sm font-bold text-cyan-400">{user.name.split(' ')[0]}</span>
                   </div>
                   <button
                    onClick={() => setPage(user.role === 'admin' ? 'admin-dashboard' : 'student-dashboard')}
                    className="p-2 rounded-full bg-slate-800 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all hover:scale-110"
                    title="Dashboard"
                  >
                    <Users size={20} />
                  </button>
                  <button onClick={logout} className="p-2 text-slate-400 hover:text-red-400 transition-colors" title="Logout">
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setPage('login')}
                  className="px-6 py-2 rounded-full border border-cyan-500 text-cyan-400 text-sm font-bold hover:bg-cyan-500 hover:text-white transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] flex items-center gap-2"
                >
                  <UserIcon size={16} /> Login
                </button>
              )}
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="text-slate-300 hover:text-white p-2">
                {isOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="absolute top-20 left-4 right-4 glass-card rounded-2xl p-4 md:hidden animate-slide-up z-50 border border-slate-700/50 shadow-2xl">
           <div className="flex flex-col space-y-2">
             {links.map((link) => (
                <button
                  key={link.name}
                  onClick={() => { setPage(link.page); setIsOpen(false); }}
                  className={`p-3 rounded-xl text-left font-medium transition-all ${
                    currentPage === link.page ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </button>
              ))}
              <div className="h-px bg-slate-700/50 my-2"></div>
              {user ? (
                <>
                  <div className="px-3 py-2 text-sm text-slate-400">
                    Signed in as <span className="text-cyan-400 font-bold">{user.name}</span>
                  </div>
                  <button
                    onClick={() => { setPage(user.role === 'admin' ? 'admin-dashboard' : 'student-dashboard'); setIsOpen(false); }}
                    className="p-3 rounded-xl text-left text-white bg-gradient-to-r from-cyan-600 to-blue-600 font-bold shadow-lg"
                  >
                    Go to Dashboard
                  </button>
                  <button onClick={() => { logout(); setIsOpen(false); }} className="p-3 text-red-400 text-left">
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setPage('login'); setIsOpen(false); }}
                  className="w-full p-3 rounded-xl bg-cyan-500 text-white font-bold text-center shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                >
                  Login
                </button>
              )}
           </div>
        </div>
      )}
    </nav>
  );
};

const Hero = ({ setPage, config, setInitialRole }: any) => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
    {/* Background Elements */}
    <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none"></div>
    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
    <div className="absolute top-20 right-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
    <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

    <div className="container mx-auto px-6 relative z-10 text-center">
      <div className="inline-block mb-4 px-4 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm">
        <span className="text-cyan-400 font-medium text-sm flex items-center gap-2">
          <Sparkles size={14} /> {config?.heroTagline || "Welcome"}
        </span>
      </div>
      
      <h1 className="text-6xl md:text-8xl font-bold font-heading mb-6 tracking-tight leading-tight">
        {config?.heroTitle || "Loading..."}
      </h1>
      
      <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
        {config?.heroSubtitle}
      </p>

      {/* Login Action Area */}
      <div className="flex flex-col items-center gap-6">
        
        {/* Prominent Teacher Login Button (Above Student Login) */}
        <button 
           onClick={() => { setInitialRole('teacher'); setPage('login'); }}
           className="group relative px-8 py-2.5 rounded-full overflow-hidden transition-all duration-300 hover:scale-105"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-80 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <span className="relative z-10 flex items-center gap-2 text-white font-bold tracking-wide text-sm shadow-sm">
             <Shield size={16} className="text-white fill-white/20"/> Teacher / Admin Login
          </span>
          {/* Glow */}
          <div className="absolute inset-0 rounded-full ring-2 ring-purple-400/50 group-hover:ring-purple-400 transition-all shadow-[0_0_20px_rgba(168,85,247,0.5)]"></div>
        </button>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <GlassButton variant="primary" onClick={() => { setInitialRole('student'); setPage('login'); }}>
            Student Login <ChevronRight size={18} />
          </GlassButton>
          <GlassButton variant="outline" onClick={() => setPage('courses')}>
            Explore Courses
          </GlassButton>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-slate-800 pt-8">
        {[
          { label: 'Students', value: '500+' },
          { label: 'Expert Faculty', value: '15+' },
          { label: 'Success Rate', value: '98%' },
          { label: 'Years', value: '10+' }
        ].map((stat, idx) => (
          <div key={idx} className="text-center">
            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-slate-500 text-sm uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Features = ({ config }: any) => (
  <section className="py-24 relative bg-slate-950/50">
    <div className="container mx-auto px-6">
      <SectionTitle subtitle={config?.featuresSubtitle}>
        {config?.featuresTitle}
      </SectionTitle>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          { icon: Users, title: 'Small Batch Size', desc: 'Personalized attention with limited students per batch.' },
          { icon: Zap, title: 'Expert Faculty', desc: 'Learn from experienced mentors who care about your growth.' },
          { icon: FileText, title: 'Regular Testing', desc: 'Weekly tests and detailed performance analysis.' },
          { icon: BookOpen, title: 'Study Material', desc: 'Comprehensive notes and problem sets curated by experts.' },
          { icon: Phone, title: 'Doubt Support', desc: '24/7 doubt resolution via app and offline sessions.' },
          { icon: Award, title: 'Proven Results', desc: 'Consistent track record of toppers in Board exams.' }
        ].map((feature, idx) => (
          <NeonCard key={idx} className="flex flex-col items-start gap-4 h-full">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-2 group-hover:bg-cyan-500 group-hover:text-white transition-all">
              <feature.icon size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">{feature.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
          </NeonCard>
        ))}
      </div>
    </div>
  </section>
);

const CoursesPage = ({ courses, setPage, config }: any) => {
  const [filter, setFilter] = useState('all');

  const filteredCourses = courses.filter((c: Course) => 
    filter === 'all' || c.classRange === filter
  );

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="container mx-auto px-6">
        <SectionTitle subtitle={config?.coursesPageSubtitle}>
          {config?.coursesPageTitle}
        </SectionTitle>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-12 space-x-2">
          {['all', '1-10', '11-12'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                filter === f
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/40'
                : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {f === 'all' ? 'All Classes' : `Class ${f}`}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course: Course) => (
            <NeonCard key={course.id} className="flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 text-xs font-bold rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Class {course.classRange}
                </span>
                <div className="flex gap-1">
                  {course.boards.map((b: string) => (
                    <span key={b} className="text-[10px] uppercase px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-400">{b}</span>
                  ))}
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">{course.title}</h3>
              <p className="text-slate-400 text-sm mb-6 flex-grow">{course.description}</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-slate-300">
                  <BookOpen size={16} className="text-cyan-400 mr-2" />
                  {course.subjects.join(', ')}
                </div>
                <div className="flex items-center text-sm text-slate-300">
                  <Calendar size={16} className="text-cyan-400 mr-2" />
                  {course.timing}
                </div>
              </div>

              <GlassButton variant="primary" className="w-full mt-auto" onClick={() => setPage('login')}>
                Enroll Now
              </GlassButton>
            </NeonCard>
          ))}
        </div>
      </div>
    </div>
  );
};

const AboutPage = ({ config }: any) => (
  <div className="pt-32 pb-20 min-h-screen">
    <div className="container mx-auto px-6">
      <SectionTitle subtitle={config?.aboutPageSubtitle}>{config?.aboutPageTitle}</SectionTitle>
      
      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-purple-500 rounded-2xl blur-lg opacity-30 transform rotate-3"></div>
          <div className="glass-card p-8 rounded-2xl relative">
            <h3 className="text-2xl font-bold text-white mb-4">{config?.ownerName}</h3>
            <p className="text-cyan-400 text-sm mb-6 font-mono">{config?.ownerTitle}</p>
            <p className="text-slate-300 leading-relaxed mb-6 italic">
              "{config?.ownerQuote}"
            </p>
            <div className="flex items-center gap-4 pt-4 border-t border-slate-700">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-xl">👨‍🏫</div>
              <div>
                <p className="text-white font-bold">10+ Years Exp.</p>
                <p className="text-slate-500 text-xs">Mathematics Specialist</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <h3 className="text-3xl font-bold text-white">{config?.philosophyTitle}</h3>
          <p className="text-slate-400 leading-relaxed whitespace-pre-line">
            {config?.philosophyDescription}
          </p>
          <ul className="space-y-4">
            {[
              'Focus on fundamentals and core concepts',
              'Disciplined yet friendly learning environment',
              'Use of modern teaching aids and technology',
              'Regular feedback loop with parents'
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-300">
                <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const GalleryPage = () => (
  <div className="pt-32 pb-20 min-h-screen">
    <div className="container mx-auto px-6">
      <SectionTitle subtitle="Glimpses of life at Virat Classes">Campus Gallery</SectionTitle>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
        {[...Array(7)].map((_, i) => (
          <div 
            key={i} 
            className={`rounded-2xl overflow-hidden relative group cursor-pointer border border-slate-800 ${i === 0 || i === 4 ? 'col-span-2 row-span-2' : ''}`}
          >
            <div className="absolute inset-0 bg-slate-800 animate-pulse"></div> 
            {/* Placeholder for actual images */}
            <div className="absolute inset-0 flex items-center justify-center text-slate-600 bg-slate-900 group-hover:scale-110 transition duration-700">
              <span className="text-xs font-mono">Image {i + 1}</span>
            </div>
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
              <Search className="text-white" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ContactPage = ({ config }: any) => (
  <div className="pt-32 pb-20 min-h-screen">
    <div className="container mx-auto px-6">
      <SectionTitle>{config?.contactPageTitle}</SectionTitle>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <NeonCard className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">
              <MapPin />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Visit Us</h3>
              <p className="text-slate-400">{config?.address}</p>
            </div>
          </NeonCard>

          <NeonCard className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
              <Phone />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Call Us</h3>
              <p className="text-slate-400">+91 {config?.ownerContact}</p>
              <p className="text-slate-500 text-sm mt-1">Mon - Sat: 9:00 AM - 7:00 PM</p>
            </div>
          </NeonCard>

          {/* Map Placeholder */}
          <div className="h-64 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Ajgain&zoom=14&size=600x300&key=YOUR_API_KEY_HERE')] opacity-30 bg-cover bg-center grayscale group-hover:grayscale-0 transition duration-500"></div>
            <div className="z-10 bg-slate-950/80 p-4 rounded-xl backdrop-blur-sm border border-slate-700">
              <span className="text-slate-300 text-sm flex items-center gap-2"><MapPin size={16}/> Google Maps Location</span>
            </div>
          </div>
        </div>

        <NeonCard>
          <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }}>
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Full Name</label>
              <input type="text" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-colors" placeholder="John Doe" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Phone</label>
                <input type="tel" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-colors" placeholder="+91" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Class</label>
                <select className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-colors">
                  <option>Class 9</option>
                  <option>Class 10</option>
                  <option>Class 11</option>
                  <option>Class 12</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Message</label>
              <textarea rows={4} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-colors" placeholder="I want to enquire about..."></textarea>
            </div>
            <GlassButton variant="primary" className="w-full mt-4" type="submit">
              Send Enquiry
            </GlassButton>
          </form>
        </NeonCard>
      </div>
    </div>
  </div>
);

const AuthPage = ({ login, initialRole = 'student' }: any) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'student' | 'teacher'>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRole(initialRole);
    if (initialRole === 'teacher') setIsLogin(true);
  }, [initialRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await login(email, password, role);
    setLoading(false);
  };

  const toggleRole = () => {
    setRole(prev => prev === 'student' ? 'teacher' : 'student');
    setIsLogin(true); // Always force login state for teacher
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4">
      <div className="w-full max-w-md">
        
        <NeonCard className="relative overflow-hidden">
          {/* Upper Side Button: Absolute Top Right */}
          <button 
             onClick={() => setRole(prev => prev === 'student' ? 'teacher' : 'student')}
             className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${role === 'teacher' ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-slate-800 text-slate-500 hover:text-purple-400'}`}
             title={role === 'teacher' ? "Back to Student Mode" : "Admin Access"}
          >
             {role === 'teacher' ? <UserIcon size={20} /> : <Shield size={20} />}
          </button>

          <div className="text-center mb-8 mt-2">
            <h2 className="text-3xl font-bold text-white mb-2">
              {role === 'teacher' ? 'Admin Portal' : (isLogin ? 'Welcome Back' : 'Join Virat Classes')}
            </h2>
            <p className="text-slate-400 text-sm">
              {role === 'teacher' 
               ? 'Enter your credentials to manage the institute' 
               : (isLogin ? 'Login to access your dashboard' : 'Start your journey to success')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && role === 'student' && (
              <>
                <input type="text" placeholder="Full Name" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:outline-none" />
                <div className="grid grid-cols-2 gap-3">
                  <select className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-white focus:border-cyan-500 focus:outline-none text-sm">
                    <option>Class 10</option>
                    <option>Class 11</option>
                    <option>Class 12</option>
                  </select>
                  <select className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-white focus:border-cyan-500 focus:outline-none text-sm">
                    <option>CBSE</option>
                    <option>ICSE</option>
                    <option>UP Board</option>
                  </select>
                </div>
              </>
            )}

            <div className="space-y-4">
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:outline-none" 
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <GlassButton variant={role === 'teacher' ? 'secondary' : 'primary'} className="w-full" type="submit" disabled={loading}>
              {loading ? 'Authenticating...' : (role === 'teacher' ? 'Login as Teacher' : (isLogin ? 'Login Dashboard' : 'Create Account'))}
            </GlassButton>
            
            {role === 'student' && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
                  <div className="relative flex justify-center text-sm"><span className="px-2 bg-slate-900 text-slate-500">Or continue with</span></div>
                </div>

                <button type="button" className="w-full bg-white text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Google
                </button>
              </>
            )}
          </form>

          {role === 'student' && (
             <div className="mt-8 pt-6 border-t border-slate-800">
                <p className="text-center text-sm text-slate-400">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button onClick={() => setIsLogin(!isLogin)} className="text-cyan-400 hover:underline">
                    {isLogin ? "Sign Up" : "Login"}
                  </button>
                </p>
             </div>
          )}

          {role === 'teacher' && (
             <div className="mt-6 text-center">
                <button 
                  onClick={toggleRole}
                  className="text-sm text-slate-400 hover:text-white flex items-center justify-center gap-2 mx-auto"
                >
                  <UserIcon size={14} /> Back to Student Login
                </button>
             </div>
          )}
        </NeonCard>
      </div>
    </div>
  );
};

// --- DASHBOARDS ---

const DashboardLayout = ({ title, user, children, logout }: any) => (
  <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 bg-slate-950">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 font-heading">{title}</h1>
          <p className="text-slate-400">Welcome back, <span className="text-cyan-400 font-bold">{user.name}</span></p>
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-900 px-4 py-2 rounded-lg border border-slate-800 text-sm text-slate-300">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>
      {children}
    </div>
  </div>
);

const StudentDashboard = ({ user, logout, data, onUpdateChatHistory }: any) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [chatOpen, setChatOpen] = useState(false);

  // Filter materials based on student's class
  const studentMaterials = data.materials.filter((m: StudyMaterial) => {
    const course = data.courses.find((c: Course) => c.id === m.courseId);
    if (!course) return false;
    return course.classRange.includes(user.class);
  });

  const getMaterialIcon = (type: string) => {
    switch(type) {
      case 'pdf': return <FileText size={24} className="text-red-400"/>;
      case 'image': return <ImageIcon size={24} className="text-purple-400"/>;
      case 'video': return <Video size={24} className="text-blue-400"/>;
      case 'text': return <Type size={24} className="text-green-400"/>;
      default: return <File size={24} className="text-slate-400"/>;
    }
  };

  const handleSendMessage = async (text: string) => {
     // Add user message to state/DB
     const userMsg: ChatMessage = { role: 'user', text, timestamp: new Date().toISOString() };
     
     // Optimistically update UI
     const currentHistory = data.chatSessions[user.id] || [];
     const newHistory = [...currentHistory, userMsg];
     onUpdateChatHistory(user.id, newHistory);

     try {
       // Gemini API Call (Using Vite Env Var)
       const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY;
       if (!apiKey) throw new Error("Missing API Key");
       
       const ai = new GoogleGenAI({ apiKey });
       
       const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
             { role: 'user', parts: [{ text: `You are a helpful AI tutor for school students (Class 1-12) named Virat AI. Answer the following question for a Class ${user.class} student. Keep it concise and encouraging.\n\nQuestion: ${text}` }] }
          ]
       });

       const aiResponseText = response.text || "I'm sorry, I couldn't process that request right now.";

       const aiMsg: ChatMessage = { role: 'model', text: aiResponseText, timestamp: new Date().toISOString() };
       const finalHistory = [...newHistory, aiMsg];
       
       // Update UI
       onUpdateChatHistory(user.id, finalHistory);

       // Save to DB (Upsert)
       const { error } = await supabase
         .from('chat_history')
         .upsert({ user_id: user.id, messages: finalHistory }, { onConflict: 'user_id' });
       
       if (error) console.error("Error saving chat", error);

     } catch (err) {
       console.error("AI Error", err);
       const errorMsg: ChatMessage = { role: 'model', text: "Sorry, I'm having trouble connecting to the server. Please check your internet or API key configuration.", timestamp: new Date().toISOString() };
       onUpdateChatHistory(user.id, [...newHistory, errorMsg]);
     }
  };

  return (
    <DashboardLayout title="Student Portal" user={user} logout={logout}>
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <NeonCard className="p-4">
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-white">
                {user.name.charAt(0)}
              </div>
              <h3 className="font-bold text-white">{user.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{user.class}th • {user.stream} • {user.board}</p>
            </div>
            <nav className="space-y-2">
              {[
                { id: 'overview', icon: Home, label: 'Overview' },
                { id: 'materials', icon: BookOpen, label: 'Study Material' },
                { id: 'results', icon: Award, label: 'My Results' },
                { id: 'schedule', icon: Calendar, label: 'Schedule' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === item.id 
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <item.icon size={18} /> {item.label}
                </button>
              ))}
            </nav>
          </NeonCard>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-slate-400 text-xs uppercase">Attendance</span>
                    <Users size={16} className="text-purple-400"/>
                  </div>
                  <div className="text-2xl font-bold text-white">92%</div>
                  <div className="text-xs text-green-400 mt-1">Excellent</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-slate-400 text-xs uppercase">Avg. Score</span>
                    <Award size={16} className="text-cyan-400"/>
                  </div>
                  <div className="text-2xl font-bold text-white">85%</div>
                  <div className="text-xs text-cyan-400 mt-1">Top 10% in batch</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-slate-400 text-xs uppercase">Next Test</span>
                    <Calendar size={16} className="text-pink-400"/>
                  </div>
                  <div className="text-lg font-bold text-white truncate">Physics U3</div>
                  <div className="text-xs text-slate-400 mt-1">In 2 days</div>
                </div>
              </div>

               {/* AI Assistant Widget */}
               <NeonCard 
                  className="cursor-pointer bg-gradient-to-r from-slate-900 to-purple-900/20 border-purple-500/30 hover:border-purple-500/60"
                  onClick={() => setChatOpen(true)}
               >
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-purple-900/50">
                        <Bot size={24} />
                     </div>
                     <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                           Virat AI Assistant <span className="text-[10px] bg-purple-500 text-white px-2 py-0.5 rounded-full">New</span>
                        </h3>
                        <p className="text-slate-400 text-sm">
                           Stuck on a problem? Ask your personal AI tutor for instant help with doubts, concepts, and more.
                        </p>
                     </div>
                     <div className="ml-auto">
                        <ChevronRight className="text-purple-400"/>
                     </div>
                  </div>
               </NeonCard>

              <NeonCard>
                <div className="flex items-center gap-2 mb-4">
                  <Bell className="text-cyan-400" size={20} />
                  <h3 className="text-lg font-bold text-white">Notice Board</h3>
                </div>
                <div className="space-y-4">
                  {data.notices.map((notice: Notice) => (
                    <div key={notice.id} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex gap-4">
                      <div className={`w-1 shrink-0 rounded-full ${notice.type === 'test' ? 'bg-red-500' : 'bg-cyan-500'}`}></div>
                      <div>
                        <h4 className="font-bold text-slate-200 text-sm">{notice.title}</h4>
                        <p className="text-slate-400 text-xs mt-1">{notice.content}</p>
                        <span className="text-[10px] text-slate-500 mt-2 block">{notice.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </NeonCard>
            </>
          )}

          {activeTab === 'materials' && (
            <div className="space-y-6">
               <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">Your Study Materials</h3>
                  <span className="text-xs text-slate-400 px-3 py-1 rounded-full bg-slate-800">
                    Class {user.class} {user.stream}
                  </span>
               </div>
               
               {studentMaterials.length === 0 ? (
                 <div className="text-center py-10 text-slate-500">
                   <p>No materials posted for your class yet.</p>
                 </div>
               ) : (
                 <div className="grid gap-4">
                  {studentMaterials.map((mat: StudyMaterial) => (
                    <NeonCard key={mat.id} className="group">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-slate-800 shrink-0">
                          {getMaterialIcon(mat.type)}
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                             <h4 className="font-bold text-white text-lg">{mat.title}</h4>
                             <span className="text-[10px] text-slate-500">{mat.date}</span>
                          </div>
                          
                          {/* Type-Specific Content Rendering */}
                          {mat.type === 'text' && (
                            <div className="mt-2 text-slate-300 text-sm bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                               {mat.content}
                            </div>
                          )}
                          
                          {mat.type === 'image' && (
                            <div className="mt-2 relative rounded-lg overflow-hidden border border-slate-800 max-w-md">
                               <img src={mat.url} alt={mat.title} className="w-full h-auto object-cover" />
                            </div>
                          )}

                          {mat.type === 'pdf' && (
                             <div className="mt-2 flex items-center gap-2 text-sm text-cyan-400">
                                <ExternalLink size={14}/> PDF Document
                             </div>
                          )}
                          
                          {/* Footer / Actions */}
                          <div className="mt-4 flex items-center justify-between">
                            <span className="text-xs uppercase tracking-wider text-slate-500 font-bold bg-slate-900 px-2 py-1 rounded">
                              {data.courses.find((c:Course) => c.id === mat.courseId)?.title || 'General'}
                            </span>
                            
                            {(mat.type === 'pdf' || mat.type === 'image') && (
                              <a href={mat.url} download={mat.title} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all text-sm font-bold">
                                <Download size={16} /> Download
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </NeonCard>
                  ))}
                 </div>
               )}
            </div>
          )}

          {activeTab === 'results' && (
            <div className="space-y-4">
              {data.results.filter((r: TestResult) => r.studentId === user.id).length === 0 && <div className="text-center text-slate-500 py-10">No results found</div>}
              {data.results.filter((r: TestResult) => r.studentId === user.id).map((res: TestResult) => (
                <NeonCard key={res.id}>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-white text-lg">{res.testName}</h4>
                    <span className="text-xs text-slate-400">{res.date}</span>
                  </div>
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-cyan-400">
                          {res.score}/{res.totalMarks} Marks
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-cyan-400">
                          {Math.round((res.score / res.totalMarks) * 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-800">
                      <div style={{ width: `${(res.score / res.totalMarks) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-cyan-500 to-blue-500"></div>
                    </div>
                  </div>
                </NeonCard>
              ))}
            </div>
          )}
        </div>

        {/* Floating Chat Button (Bottom Right) */}
        <button 
           onClick={() => setChatOpen(true)}
           className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:scale-110 transition-transform animate-bounce-slow"
           title="Ask AI"
        >
          <Bot className="text-white" size={28} />
        </button>

        {/* Full Screen Chat Modal */}
        <AIChatModal 
           isOpen={chatOpen} 
           onClose={() => setChatOpen(false)}
           studentName={user.name}
           userClass={user.class}
           history={data.chatSessions[user.id] || []}
           onSendMessage={handleSendMessage}
        />
      </div>
    </DashboardLayout>
  );
};

const AdminDashboard = ({ user, logout, data, setData }: any) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'notice', 'course', 'site', 'content'
  const [editingItem, setEditingItem] = useState<any>(null);

  // Content Management State
  const [managingCourseId, setManagingCourseId] = useState<string | null>(null);
  const [materialType, setMaterialType] = useState('pdf');
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  // Delete Confirmation State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{type: string, id: string} | null>(null);

  // Site Config State (local to form)
  const [siteForm, setSiteForm] = useState(data.siteConfig || FALLBACK_CONFIG);
  // Collapsible sections for Site Editor
  const [editorSection, setEditorSection] = useState({
    hero: true,
    about: false,
    headers: false,
    contact: false
  });

  // Handlers for managing data
  const handleDeleteClick = (type: string, id: string) => {
    setDeleteTarget({ type, id });
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { type, id } = deleteTarget;

    try {
      if (type === 'notice') {
        await supabase.from('notices').delete().eq('id', id);
        setData({ ...data, notices: data.notices.filter((n: any) => n.id !== id) });
      } else if (type === 'course') {
        await supabase.from('courses').delete().eq('id', id);
        setData({ ...data, courses: data.courses.filter((c: any) => c.id !== id) });
      } else if (type === 'material') {
        await supabase.from('study_materials').delete().eq('id', id);
        setData({ ...data, materials: data.materials.filter((m: any) => m.id !== id) });
      }
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete item.");
    }

    setDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  const handleEdit = (type: string, item: any) => {
    setModalType(type);
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleAddNew = (type: string) => {
    setModalType(type);
    setEditingItem(null); // Clear for new
    setModalOpen(true);
  };

  const handleManageContent = (courseId: string) => {
    setManagingCourseId(courseId);
    setModalType('content');
    // Reset form states
    setMaterialType('pdf');
    setUploadFile(null);
    setModalOpen(true);
  };

  const saveNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newNotice = {
      title: formData.get('title'),
      content: formData.get('content'),
      date: new Date().toISOString().split('T')[0],
      type: formData.get('type')
    };

    try {
      if (editingItem) {
        const { data: updated } = await supabase.from('notices').update(newNotice).eq('id', editingItem.id).select().single();
        if (updated) {
           setData({ ...data, notices: data.notices.map((n: any) => n.id === editingItem.id ? updated : n) });
        }
      } else {
        const { data: inserted } = await supabase.from('notices').insert(newNotice).select().single();
        if (inserted) {
           setData({ ...data, notices: [inserted, ...data.notices] });
        }
      }
      setModalOpen(false);
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save notice");
    }
  };

  const saveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const boards = (formData.get('boards') as string).split(',').map(s => s.trim());
    const subjects = (formData.get('subjects') as string).split(',').map(s => s.trim());
    
    const newCourse = {
      title: formData.get('title'),
      class_range: formData.get('classRange'),
      description: formData.get('description'),
      timing: formData.get('timing'),
      boards: boards,
      subjects: subjects
    };

    try {
      if (editingItem) {
        const { data: updated } = await supabase.from('courses').update(newCourse).eq('id', editingItem.id).select().single();
        if (updated) {
           // Map back snake_case to camelCase for local state if needed, or update types to match DB
           // For simplicity in this demo, we assume types match roughly or we just reload
           const mappedUpdated = { ...updated, classRange: updated.class_range };
           setData({ ...data, courses: data.courses.map((c: any) => c.id === editingItem.id ? mappedUpdated : c) });
        }
      } else {
        const { data: inserted } = await supabase.from('courses').insert(newCourse).select().single();
        if (inserted) {
           const mappedInserted = { ...inserted, classRange: inserted.class_range };
           setData({ ...data, courses: [...data.courses, mappedInserted] });
        }
      }
      setModalOpen(false);
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save course");
    }
  };

  const saveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingCourseId) return;
    
    const formData = new FormData(e.target as HTMLFormElement);
    const type = materialType as 'pdf' | 'image' | 'text' | 'video';
    let url = formData.get('url') as string;

    // Handle File Upload for PDF/Image
    if ((type === 'pdf' || type === 'image') && uploadFile) {
       try {
         url = await new Promise((resolve, reject) => {
           const reader = new FileReader();
           reader.onload = () => resolve(reader.result as string);
           reader.onerror = reject;
           reader.readAsDataURL(uploadFile);
         });
       } catch (err) {
         console.error("File reading failed", err);
         alert("Failed to upload file");
         return;
       }
    }

    const newMaterial = {
      course_id: managingCourseId,
      title: formData.get('title'),
      type: type,
      url: type !== 'text' ? url : null,
      content: type === 'text' ? formData.get('content') : null,
      date: new Date().toISOString().split('T')[0]
    };

    try {
      const { data: inserted } = await supabase.from('study_materials').insert(newMaterial).select().single();
      if (inserted) {
         const mapped = { ...inserted, courseId: inserted.course_id };
         setData({ ...data, materials: [mapped, ...data.materials] });
      }
      // Reset Form
      (e.target as HTMLFormElement).reset();
      setUploadFile(null);
      setMaterialType('pdf'); // Reset to default
      alert('Material Added Successfully!');
    } catch (err) {
      console.error("Save content failed", err);
      alert("Failed to save material");
    }
  };

  const saveSiteConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Upsert config to row id=1
      const { error } = await supabase.from('site_config').upsert({ id: 1, config: siteForm });
      if (error) throw error;
      
      setData({ ...data, siteConfig: siteForm });
      alert("Website content updated successfully!");
    } catch (err) {
      console.error("Config update failed", err);
      alert("Failed to update site config");
    }
  };

  const toggleEditorSection = (section: keyof typeof editorSection) => {
    setEditorSection(prev => ({...prev, [section]: !prev[section]}));
  };

  const EditorField = ({ label, value, field, type = "text" }: any) => (
    <div className="mb-4">
      <label className="text-sm text-slate-400 mb-1 block">{label}</label>
      {type === "textarea" ? (
         <textarea 
           value={value || ''} 
           onChange={e => setSiteForm({...siteForm, [field]: e.target.value})} 
           className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none transition-colors"
           rows={4}
         />
      ) : (
         <input 
           type={type}
           value={value || ''} 
           onChange={e => setSiteForm({...siteForm, [field]: e.target.value})} 
           className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none transition-colors"
         />
      )}
    </div>
  );

  return (
    <DashboardLayout title="Teacher Command Center" user={user} logout={logout}>
       <div className="grid lg:grid-cols-5 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <NeonCard className="p-4">
            <nav className="space-y-2">
              {[
                { id: 'overview', icon: Home, label: 'Overview' },
                { id: 'site', icon: Settings, label: 'Site Editor' },
                { id: 'notices', icon: Bell, label: 'Announcements' },
                { id: 'courses', icon: BookOpen, label: 'Courses & Content' },
                { id: 'students', icon: Users, label: 'Students' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === item.id 
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <item.icon size={18} /> {item.label}
                </button>
              ))}
            </nav>
          </NeonCard>
        </div>

        {/* Content */}
        <div className="lg:col-span-4">
           {activeTab === 'overview' && (
             <div className="space-y-8">
               <div className="grid md:grid-cols-3 gap-6">
                 <NeonCard className="text-center">
                   <h3 className="text-4xl font-bold text-white mb-2">{data.users.filter((u:any) => u.role === 'student').length}</h3>
                   <p className="text-slate-400 uppercase text-xs tracking-wider">Total Students</p>
                 </NeonCard>
                 <NeonCard className="text-center">
                   <h3 className="text-4xl font-bold text-white mb-2">{data.courses.length}</h3>
                   <p className="text-slate-400 uppercase text-xs tracking-wider">Active Courses</p>
                 </NeonCard>
                 <NeonCard className="text-center">
                   <h3 className="text-4xl font-bold text-white mb-2">{data.notices.length}</h3>
                   <p className="text-slate-400 uppercase text-xs tracking-wider">Notices Posted</p>
                 </NeonCard>
               </div>
               
               <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                 <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                 <div className="flex gap-4">
                   <GlassButton variant="primary" onClick={() => handleAddNew('notice')}>
                      <Plus size={16} /> Post Notice
                   </GlassButton>
                   <GlassButton variant="outline" onClick={() => handleAddNew('course')}>
                      <Plus size={16} /> Add Course
                   </GlassButton>
                 </div>
               </div>
             </div>
           )}

           {activeTab === 'site' && (
             <NeonCard>
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                   <Settings className="text-purple-400"/> Website Content Editor
                 </h3>
                 <GlassButton variant="primary" onClick={saveSiteConfig} className="py-2 text-sm">
                   <Save size={16}/> Save All Changes
                 </GlassButton>
               </div>
               
               <form className="space-y-4">
                  
                  {/* HERO SECTION */}
                  <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                    <button type="button" onClick={() => toggleEditorSection('hero')} className="w-full flex justify-between items-center p-4 bg-slate-800/50 hover:bg-slate-800 transition-colors">
                       <span className="font-bold text-cyan-400">Home & Hero Section</span>
                       {editorSection.hero ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                    </button>
                    {editorSection.hero && (
                      <div className="p-4 space-y-2">
                        <EditorField label="Main Hero Title" value={siteForm.heroTitle} field="heroTitle" />
                        <EditorField label="Hero Subtitle" value={siteForm.heroSubtitle} field="heroSubtitle" type="textarea" />
                        <EditorField label="Tagline (Small Text)" value={siteForm.heroTagline} field="heroTagline" />
                        <div className="h-px bg-slate-800 my-4"></div>
                        <EditorField label="Features Title" value={siteForm.featuresTitle} field="featuresTitle" />
                        <EditorField label="Features Subtitle" value={siteForm.featuresSubtitle} field="featuresSubtitle" />
                      </div>
                    )}
                  </div>

                  {/* ABOUT PAGE */}
                  <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                    <button type="button" onClick={() => toggleEditorSection('about')} className="w-full flex justify-between items-center p-4 bg-slate-800/50 hover:bg-slate-800 transition-colors">
                       <span className="font-bold text-cyan-400">About Us Page</span>
                       {editorSection.about ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                    </button>
                    {editorSection.about && (
                      <div className="p-4 space-y-2">
                        <div className="grid grid-cols-2 gap-4">
                           <EditorField label="Owner Name" value={siteForm.ownerName} field="ownerName" />
                           <EditorField label="Owner Title" value={siteForm.ownerTitle} field="ownerTitle" />
                        </div>
                        <EditorField label="Owner Quote" value={siteForm.ownerQuote} field="ownerQuote" type="textarea" />
                        <EditorField label="Philosophy Title" value={siteForm.philosophyTitle} field="philosophyTitle" />
                        <EditorField label="Philosophy Text" value={siteForm.philosophyDescription} field="philosophyDescription" type="textarea" />
                      </div>
                    )}
                  </div>

                  {/* PAGE HEADERS */}
                  <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                    <button type="button" onClick={() => toggleEditorSection('headers')} className="w-full flex justify-between items-center p-4 bg-slate-800/50 hover:bg-slate-800 transition-colors">
                       <span className="font-bold text-cyan-400">Page Titles & Headers</span>
                       {editorSection.headers ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                    </button>
                    {editorSection.headers && (
                      <div className="p-4 space-y-2">
                        <div className="grid md:grid-cols-2 gap-4">
                           <EditorField label="Courses Page Title" value={siteForm.coursesPageTitle} field="coursesPageTitle" />
                           <EditorField label="Courses Page Subtitle" value={siteForm.coursesPageSubtitle} field="coursesPageSubtitle" />
                           <EditorField label="About Page Title" value={siteForm.aboutPageTitle} field="aboutPageTitle" />
                           <EditorField label="About Page Subtitle" value={siteForm.aboutPageSubtitle} field="aboutPageSubtitle" />
                           <EditorField label="Contact Page Title" value={siteForm.contactPageTitle} field="contactPageTitle" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CONTACT & FOOTER */}
                  <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                    <button type="button" onClick={() => toggleEditorSection('contact')} className="w-full flex justify-between items-center p-4 bg-slate-800/50 hover:bg-slate-800 transition-colors">
                       <span className="font-bold text-cyan-400">Contact Info & Footer</span>
                       {editorSection.contact ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                    </button>
                    {editorSection.contact && (
                      <div className="p-4 space-y-2">
                         <div className="grid grid-cols-2 gap-4">
                           <EditorField label="Phone Number" value={siteForm.ownerContact} field="ownerContact" />
                           <EditorField label="Email Address" value={siteForm.email} field="email" />
                         </div>
                         <EditorField label="Full Address" value={siteForm.address} field="address" />
                         <EditorField label="Footer Description" value={siteForm.footerDescription} field="footerDescription" type="textarea" />
                         
                         <div className="h-px bg-slate-800 my-4"></div>
                         <h4 className="text-sm font-bold text-slate-300 mb-2">Social Media Links</h4>
                         <div className="space-y-2">
                            <EditorField label="Facebook URL" value={siteForm.facebookUrl} field="facebookUrl" />
                            <EditorField label="Instagram URL" value={siteForm.instagramUrl} field="instagramUrl" />
                            <EditorField label="YouTube URL" value={siteForm.youtubeUrl} field="youtubeUrl" />
                         </div>
                      </div>
                    )}
                  </div>

               </form>
             </NeonCard>
           )}

           {activeTab === 'notices' && (
             <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">Active Notices</h3>
                  <GlassButton variant="secondary" className="px-4 py-2 text-sm" onClick={() => handleAddNew('notice')}>
                    <Plus size={16} /> Create Notice
                  </GlassButton>
                </div>
                <div className="grid gap-4">
                  {data.notices.map((notice: Notice) => (
                    <div key={notice.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex justify-between items-center group hover:border-purple-500/50 transition-all">
                      <div>
                        <h4 className="font-bold text-white">{notice.title}</h4>
                        <p className="text-sm text-slate-400">{notice.content}</p>
                        <span className="text-xs text-slate-500 mt-1 inline-block capitalize px-2 py-0.5 rounded bg-slate-800">{notice.type}</span>
                        <span className="text-xs text-slate-500 ml-2">{notice.date}</span>
                      </div>
                      <div className="flex gap-2">
                         <button onClick={() => handleEdit('notice', notice)} className="p-2 text-slate-400 hover:text-cyan-400 transition-colors"><Edit size={18} /></button>
                         <button onClick={() => handleDeleteClick('notice', notice.id)} className="p-2 text-slate-400 hover:text-red-400 transition-colors"><Trash size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
           )}

           {activeTab === 'courses' && (
             <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">Manage Courses</h3>
                  <GlassButton variant="secondary" className="px-4 py-2 text-sm" onClick={() => handleAddNew('course')}>
                    <Plus size={16} /> Add Course
                  </GlassButton>
                </div>
                <div className="grid gap-4">
                  {data.courses.map((course: Course) => (
                    <div key={course.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between md:items-center gap-4 group hover:border-purple-500/50 transition-all">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white">{course.title}</h4>
                          <span className="text-xs bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/30">{course.classRange}</span>
                        </div>
                        <p className="text-sm text-slate-400 mt-1">{course.description}</p>
                        <div className="flex gap-2 mt-2">
                           {course.boards.map((b: string) => <span key={b} className="text-[10px] bg-slate-800 px-1.5 rounded text-slate-500">{b}</span>)}
                        </div>
                      </div>
                      <div className="flex gap-2 self-end md:self-center">
                         <button 
                           onClick={() => handleManageContent(course.id)}
                           className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white border border-blue-500/30 text-xs font-bold transition-all flex items-center gap-1"
                         >
                           <FileText size={14}/> Manage Content
                         </button>
                         <button onClick={() => handleEdit('course', course)} className="p-2 text-slate-400 hover:text-cyan-400 transition-colors"><Edit size={18} /></button>
                         <button onClick={() => handleDeleteClick('course', course.id)} className="p-2 text-slate-400 hover:text-red-400 transition-colors"><Trash size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
           )}

           {activeTab === 'students' && (
             <NeonCard>
               <h3 className="text-xl font-bold text-white mb-4">Student List</h3>
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="border-b border-slate-700 text-slate-400 text-sm">
                       <th className="p-3">Name</th>
                       <th className="p-3">Email</th>
                       <th className="p-3">Class</th>
                       <th className="p-3">Stream</th>
                     </tr>
                   </thead>
                   <tbody>
                     {data.users.filter((u:any) => u.role === 'student').map((student: UserType) => (
                       <tr key={student.id} className="border-b border-slate-800 text-slate-300 text-sm hover:bg-slate-900/50">
                         <td className="p-3 font-medium text-white">{student.name}</td>
                         <td className="p-3">{student.email}</td>
                         <td className="p-3">{student.class}</td>
                         <td className="p-3">{student.stream || '-'}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             </NeonCard>
           )}
        </div>
       </div>

       {/* Forms Modal */}
       <Modal 
          isOpen={modalOpen} 
          onClose={() => setModalOpen(false)} 
          title={
            modalType === 'notice' ? (editingItem ? 'Edit Notice' : 'New Notice') : 
            modalType === 'course' ? (editingItem ? 'Edit Course' : 'New Course') :
            modalType === 'content' ? 'Course Content Manager' : ''
          }
          maxWidth={modalType === 'content' ? 'max-w-4xl' : 'max-w-2xl'}
       >
          {modalType === 'notice' && (
            <form onSubmit={saveNotice} className="space-y-4">
              <div>
                <label className="text-sm text-slate-400">Title</label>
                <input name="title" required defaultValue={editingItem?.title} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label className="text-sm text-slate-400">Content</label>
                <textarea name="content" required defaultValue={editingItem?.content} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-cyan-500" rows={3}></textarea>
              </div>
              <div>
                <label className="text-sm text-slate-400">Type</label>
                <select name="type" defaultValue={editingItem?.type || 'general'} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-cyan-500">
                  <option value="general">General</option>
                  <option value="test">Test</option>
                  <option value="batch">Batch Info</option>
                </select>
              </div>
              <GlassButton type="submit" className="w-full">Save Notice</GlassButton>
            </form>
          )}

          {modalType === 'course' && (
             <form onSubmit={saveCourse} className="space-y-4">
              <div>
                <label className="text-sm text-slate-400">Course Title</label>
                <input name="title" required defaultValue={editingItem?.title} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-cyan-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="text-sm text-slate-400">Class Range</label>
                  <input name="classRange" placeholder="e.g. 11-12" required defaultValue={editingItem?.classRange} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-cyan-500" />
                 </div>
                 <div>
                  <label className="text-sm text-slate-400">Timing</label>
                  <input name="timing" placeholder="e.g. 4 PM - 6 PM" required defaultValue={editingItem?.timing} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-cyan-500" />
                 </div>
              </div>
              <div>
                <label className="text-sm text-slate-400">Description</label>
                <textarea name="description" required defaultValue={editingItem?.description} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-cyan-500" rows={2}></textarea>
              </div>
              <div>
                <label className="text-sm text-slate-400">Boards (comma separated)</label>
                <input name="boards" placeholder="CBSE, ICSE" required defaultValue={editingItem?.boards.join(', ')} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label className="text-sm text-slate-400">Subjects (comma separated)</label>
                <input name="subjects" placeholder="Maths, Physics" required defaultValue={editingItem?.subjects.join(', ')} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-cyan-500" />
              </div>
              <GlassButton type="submit" className="w-full">Save Course</GlassButton>
             </form>
          )}

          {modalType === 'content' && managingCourseId && (
            <div className="grid md:grid-cols-2 gap-8">
               {/* List of existing content */}
               <div className="border-r border-slate-800 pr-4">
                  <h4 className="font-bold text-white mb-4">Current Materials</h4>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                     {data.materials.filter((m:StudyMaterial) => m.courseId === managingCourseId).length === 0 && (
                        <p className="text-slate-500 text-sm">No materials uploaded yet.</p>
                     )}
                     {data.materials.filter((m:StudyMaterial) => m.courseId === managingCourseId).map((m: StudyMaterial) => (
                        <div key={m.id} className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 flex justify-between items-start">
                           <div>
                              <p className="text-sm font-bold text-slate-200">{m.title}</p>
                              <span className="text-[10px] uppercase text-cyan-400 bg-cyan-900/20 px-1 rounded">{m.type}</span>
                           </div>
                           <button onClick={() => handleDeleteClick('material', m.id)} className="text-slate-500 hover:text-red-400"><Trash size={14}/></button>
                        </div>
                     ))}
                  </div>
               </div>
               
               {/* Add New Content Form */}
               <div>
                  <h4 className="font-bold text-white mb-4">Upload New Material</h4>
                  <form onSubmit={saveContent} className="space-y-4">
                     <div>
                        <label className="text-sm text-slate-400">Title</label>
                        <input name="title" required placeholder="e.g. Chapter 1 Notes" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-cyan-500" />
                     </div>
                     
                     {/* Type Selector with Conditional Fields */}
                     <div>
                        <label className="text-sm text-slate-400">Material Type</label>
                        <select 
                           name="type" 
                           value={materialType}
                           onChange={(e) => setMaterialType(e.target.value)}
                           className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-cyan-500"
                        >
                           <option value="pdf">PDF Document</option>
                           <option value="image">Image</option>
                           <option value="text">Text / Announcement</option>
                           <option value="video">Video Link</option>
                        </select>
                     </div>

                     {/* Conditional File Inputs */}
                     {(materialType === 'pdf' || materialType === 'image') && (
                       <div>
                          <label className="text-sm text-slate-400">Upload File</label>
                          <div className="relative">
                              <input 
                                type="file" 
                                accept={materialType === 'image' ? "image/*" : "application/pdf"}
                                onChange={(e) => setUploadFile(e.target.files ? e.target.files[0] : null)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-cyan-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20"
                              />
                              <p className="text-[10px] text-slate-500 mt-1">Select a file from your device.</p>
                          </div>
                       </div>
                     )}

                     {materialType === 'video' && (
                        <div>
                           <label className="text-sm text-slate-400">Video URL</label>
                           <input name="url" placeholder="https://youtube.com/..." className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-cyan-500" />
                        </div>
                     )}

                     {materialType === 'text' && (
                        <div>
                           <label className="text-sm text-slate-400">Description / Text Content</label>
                           <textarea name="content" placeholder="Write your post here..." rows={4} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-cyan-500" />
                        </div>
                     )}

                     <GlassButton type="submit" className="w-full">Upload Material</GlassButton>
                  </form>
               </div>
            </div>
          )}
       </Modal>

       {/* Delete Confirmation Modal */}
       <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Confirm Deletion">
          <div className="text-center p-2">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <Trash size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Are you sure?</h3>
            <p className="text-slate-400 mb-6 text-sm">
              This action cannot be undone. This {deleteTarget?.type} will be permanently removed from the system.
            </p>
            <div className="flex gap-4">
              <GlassButton variant="outline" onClick={() => setDeleteModalOpen(false)} className="w-full justify-center">
                Cancel
              </GlassButton>
              <GlassButton variant="danger" onClick={confirmDelete} className="w-full justify-center">
                Yes, Delete
              </GlassButton>
            </div>
          </div>
       </Modal>
    </DashboardLayout>
  );
};

const Footer = ({ config }: any) => (
  <footer className="bg-slate-950 border-t border-slate-800 pt-20 pb-10 relative overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
    
    <div className="container mx-auto px-6 grid md:grid-cols-3 gap-12 mb-16 relative z-10">
      <div className="md:col-span-2">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold">V</div>
          <span className="text-xl font-bold font-heading text-white">VIRAT <span className="text-cyan-400">CLASSES</span></span>
        </div>
        <p className="text-slate-400 mb-6 max-w-sm">
          {config?.footerDescription}
        </p>
        <div className="flex gap-4">
           {[Facebook, Instagram, Youtube, Mail].map((Icon, i) => (
             <a key={i} href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-cyan-500 hover:text-white transition-all">
               <Icon size={18} />
             </a>
           ))}
        </div>
      </div>
      
      <div>
        <h4 className="text-white font-bold mb-6">Contact Info</h4>
        <ul className="space-y-4 text-slate-400 text-sm">
          <li className="flex items-start gap-3">
             <MapPin size={18} className="text-cyan-400 shrink-0 mt-1" />
             <span>{config?.address}</span>
          </li>
          <li className="flex items-center gap-3">
             <Phone size={18} className="text-cyan-400 shrink-0" />
             <span>+91 {config?.ownerContact}</span>
          </li>
          <li className="flex items-center gap-3">
             <Mail size={18} className="text-cyan-400 shrink-0" />
             <span>{config?.email}</span>
          </li>
        </ul>
      </div>
    </div>

    <div className="container mx-auto px-6 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500">
      <p className="text-slate-400">&copy; 2024 Virat Classes. All rights reserved.</p>
      
      {/* Developer Profile Widget */}
      <div className="group relative">
         <div className="relative overflow-hidden rounded-xl bg-slate-900/50 border border-slate-800 p-[1px] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <div className="relative bg-slate-950/90 rounded-[11px] px-5 py-2.5 flex items-center gap-3">
                <div className="flex flex-col text-right">
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 group-hover:text-cyan-400 transition-colors">Developed By</span>
                    <span className="text-sm font-bold text-slate-200 group-hover:text-white">Naveen Rajpoot</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 group-hover:border-cyan-500 overflow-hidden transition-colors">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Naveen" alt="Dev" />
                </div>
            </div>
         </div>
         
         {/* Tooltip Card */}
         <div className="absolute bottom-full right-0 mb-4 w-72 p-5 rounded-2xl glass-card border border-cyan-500/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 z-50 shadow-2xl shadow-cyan-900/40">
            <div className="flex items-center gap-4 mb-4">
               <div className="w-14 h-14 rounded-full bg-slate-900 overflow-hidden border-2 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Naveen" alt="Dev" />
               </div>
               <div>
                  <h5 className="text-white font-bold text-lg">Naveen Rajpoot</h5>
                  <p className="text-xs text-cyan-400 font-mono border border-cyan-500/30 px-2 py-0.5 rounded-full inline-block bg-cyan-950/30">Full Stack Developer</p>
               </div>
            </div>
            <div className="space-y-3 mb-4">
               <div className="flex items-center gap-3 text-sm text-slate-300 bg-slate-900/50 p-2 rounded-lg"><Phone size={14} className="text-cyan-400"/> +91 9511091769</div>
               <div className="flex items-center gap-3 text-sm text-slate-300 bg-slate-900/50 p-2 rounded-lg"><Code size={14} className="text-purple-400"/> React / Next.js / Node</div>
            </div>
            <a 
              href="https://naveenrajpoot-portfolio.vercel.app" 
              target="_blank"
              rel="noreferrer" 
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all active:scale-95"
            >
              <ExternalLink size={16} /> Visit Portfolio
            </a>
         </div>
      </div>
    </div>
  </footer>
);

// --- MAIN APP EXPORT ---

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState<UserType | null>(null);
  const [initialAuthRole, setInitialAuthRole] = useState<'student' | 'teacher'>('student');
  const [loading, setLoading] = useState(true);
  
  // App Data State
  const [appData, setAppData] = useState({
    users: [] as UserType[],
    notices: [] as Notice[],
    courses: [] as Course[],
    results: [] as TestResult[],
    materials: [] as StudyMaterial[],
    schedule: [] as TestSchedule[],
    siteConfig: FALLBACK_CONFIG,
    chatSessions: {} as Record<string, ChatMessage[]>
  });

  // INITIAL DATA FETCH
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          { data: notices },
          { data: courses },
          { data: materials },
          { data: results },
          { data: users },
          { data: siteConfig },
          { data: chatHistory }
        ] = await Promise.all([
          supabase.from('notices').select('*').order('created_at', { ascending: false }),
          supabase.from('courses').select('*'),
          supabase.from('study_materials').select('*').order('created_at', { ascending: false }),
          supabase.from('test_results').select('*'),
          supabase.from('app_users').select('*'),
          supabase.from('site_config').select('*').single(),
          supabase.from('chat_history').select('*')
        ]);

        // Map snake_case from DB to camelCase for local state where needed
        const mappedCourses = (courses || []).map((c: any) => ({ ...c, classRange: c.class_range }));
        const mappedMaterials = (materials || []).map((m: any) => ({ ...m, courseId: m.course_id }));
        const mappedResults = (results || []).map((r: any) => ({ ...r, studentId: r.student_id, testName: r.test_name, totalMarks: r.total_marks }));
        
        // Convert chat history array to map
        const chatMap: Record<string, ChatMessage[]> = {};
        (chatHistory || []).forEach((ch: any) => {
           chatMap[ch.user_id] = ch.messages;
        });

        setAppData(prev => ({
          ...prev,
          notices: notices || [],
          courses: mappedCourses,
          materials: mappedMaterials,
          results: mappedResults,
          users: users || [],
          siteConfig: siteConfig?.config || FALLBACK_CONFIG,
          chatSessions: chatMap
        }));
      } catch (err) {
        console.error("Failed to load initial data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateChatHistory = (studentId: string, history: ChatMessage[]) => {
     setAppData(prev => ({
       ...prev,
       chatSessions: {
         ...prev.chatSessions,
         [studentId]: history
       }
     }));
  };

  const handleLogin = async (email: string, pass: string, role: string) => {
    // Check against DB
    const requiredRole = role === 'teacher' ? 'admin' : 'student';
    
    try {
      const { data: foundUser, error } = await supabase
        .from('app_users')
        .select('*')
        .eq('email', email)
        .eq('password', pass) // Note: Plain text for demo; use hashing in prod
        .eq('role', requiredRole)
        .single();

      if (error || !foundUser) {
        throw new Error("Invalid credentials");
      }

      setUser(foundUser);
      setCurrentPage(foundUser.role === 'admin' ? 'admin-dashboard' : 'student-dashboard');
    } catch (err) {
      if (role === 'teacher') {
         alert('Invalid Credentials for Teacher Access!');
      } else {
         alert('Login failed. Please check your email and password.');
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
         <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
         <p className="animate-pulse text-cyan-400 font-bold">Connecting to Virat Classes...</p>
      </div>
    );
  }

  // Render Page Logic
  const renderPage = () => {
    switch(currentPage) {
      case 'home': return (
        <>
          <Hero setPage={setCurrentPage} config={appData.siteConfig} setInitialRole={setInitialAuthRole} />
          <Features config={appData.siteConfig} />
          <div className="py-20 bg-slate-950">
            <div className="container mx-auto px-6 text-center">
              <SectionTitle subtitle="See what our students have achieved">Latest Updates</SectionTitle>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                 <NeonCard className="text-left">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Bell className="text-cyan-400"/> Notices</h3>
                    <div className="space-y-4">
                       {appData.notices.length > 0 ? appData.notices.slice(0, 3).map(n => (
                         <div key={n.id} className="pb-3 border-b border-slate-800 last:border-0">
                            <p className="text-slate-200 font-medium">{n.title}</p>
                            <span className="text-xs text-slate-500">{n.date}</span>
                         </div>
                       )) : <p className="text-slate-500 text-sm">No notices at the moment.</p>}
                    </div>
                 </NeonCard>
                 <NeonCard className="text-left">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Award className="text-purple-400"/> Toppers</h3>
                    <div className="flex items-center gap-4 mb-4">
                       <div className="w-12 h-12 rounded-full bg-slate-800 border border-purple-500"></div>
                       <div>
                          <p className="text-white font-bold">Amit Kumar</p>
                          <p className="text-xs text-purple-400">98.5% (Class 12)</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-full bg-slate-800 border border-cyan-500"></div>
                       <div>
                          <p className="text-white font-bold">Sneha Gupta</p>
                          <p className="text-xs text-cyan-400">97.2% (Class 10)</p>
                       </div>
                    </div>
                 </NeonCard>
              </div>
            </div>
          </div>
        </>
      );
      case 'courses': return <CoursesPage courses={appData.courses} setPage={setCurrentPage} config={appData.siteConfig} />;
      case 'about': return <AboutPage config={appData.siteConfig} />;
      case 'gallery': return <GalleryPage />;
      case 'contact': return <ContactPage config={appData.siteConfig} />;
      case 'login': return <AuthPage login={handleLogin} initialRole={initialAuthRole} />;
      case 'student-dashboard': 
        return user?.role === 'student' 
          ? <StudentDashboard user={user} logout={handleLogout} data={appData} onUpdateChatHistory={handleUpdateChatHistory} /> 
          : <AuthPage login={handleLogin} initialRole={initialAuthRole} />;
      case 'admin-dashboard':
        return user?.role === 'admin'
          ? <AdminDashboard user={user} logout={handleLogout} data={appData} setData={setAppData} />
          : <AuthPage login={handleLogin} initialRole={initialAuthRole} />;
      default: return <Hero setPage={setCurrentPage} config={appData.siteConfig} setInitialRole={setInitialAuthRole} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar user={user} currentPage={currentPage} setPage={setCurrentPage} logout={handleLogout} />
      
      {/* Main Content */}
      <main className="animate-fade-in">
        {renderPage()}
      </main>

      {currentPage !== 'login' && !currentPage.includes('dashboard') && <Footer config={appData.siteConfig} />}

      {/* Floating Action Button - Call */}
      <a 
        href={`tel:+91${appData.siteConfig?.ownerContact}`}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:scale-110 transition-transform animate-bounce-slow"
        title="Call Virat Classes"
      >
        <PhoneCall className="text-white" />
      </a>
    </div>
  );
};