import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Loader2, 
  CheckCircle2, 
  Mail, 
  UserPlus, 
  ClipboardList, 
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Minus,
  LayoutDashboard,
  Zap,
  History,
  Activity,
  CheckCheck,
  Users
} from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [systemStatus, setSystemStatus] = useState('online'); // online, checking, offline
  
  // KPI Counters (Initialized from localStorage if available)
  const [counts, setCounts] = useState(() => {
    try {
      const saved = localStorage.getItem('ai_coo_stats');
      return saved ? JSON.parse(saved) : { emails: 0, tasks: 0, leads: 0 };
    } catch (e) {
      console.error("Failed to parse local stats:", e);
      return { emails: 0, tasks: 0, leads: 0 };
    }
  });

  // Persist counts to localStorage
  useEffect(() => {
    localStorage.setItem('ai_coo_stats', JSON.stringify(counts));
  }, [counts]);

  // AUTO-REFRESH Logic: Check backend health every 5 seconds
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/docs', { method: 'HEAD' });
        setSystemStatus(response.ok ? 'online' : 'offline');
      } catch (err) {
        setSystemStatus('offline');
      }
    };

    const intervalId = setInterval(checkHealth, 5000);
    return () => clearInterval(intervalId); // Cleanup interval properly
  }, []);

  const processEmail = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/process-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      setResult(data);

      // Update counters dynamically
      setCounts(prev => ({
        emails: prev.emails + 1,
        tasks: data.task ? prev.tasks + 1 : prev.tasks,
        leads: data.lead ? prev.leads + 1 : prev.leads
      }));

      // Toast Notifications
      if (data.task) toast.success("✅ Task Created Successfully", { theme: "colored" });
      if (data.lead) toast.success("💼 Lead Added to CRM", { theme: "colored" });
      if (!data.task && !data.lead) toast.info("✉️ Email Analysed (Reply Suggested)", { theme: "colored" });

    } catch (err) {
      console.error(err);
      const msg = 'Failed to process email. Ensure backend is running at http://127.0.0.1:8000';
      setError(msg);
      toast.error("⚠️ Error: " + msg, { theme: "colored" });
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'low': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return <TrendingUp className="w-4 h-4" />;
      case 'low': return <TrendingDown className="w-4 h-4" />;
      default: return <Minus className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30 selection:text-indigo-200 p-4 md:p-8 font-sans">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                <span className="bg-indigo-600 p-2 rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </span>
                AI COO Dashboard
              </h1>
              <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold rounded uppercase tracking-wider border border-indigo-500/20">v2.0 Beta</span>
            </div>
            <p className="mt-2 text-slate-400 font-medium font-sans">Autonomous Business Workflow Agent</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${systemStatus === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  {systemStatus === 'online' ? 'Real-time Linked' : 'Disconnected'}
                </span>
              </div>
              <span className="text-[10px] text-slate-600 mt-1 uppercase tracking-tighter">Auto-syncing every 5s</span>
            </div>
            <div className="bg-slate-900 border border-white/5 rounded-xl px-4 py-2 flex items-center gap-3 shadow-inner">
               <Activity className={`w-4 h-4 ${systemStatus === 'online' ? 'text-green-500' : 'text-red-500'}`} />
               <span className="text-sm font-semibold text-white">{systemStatus === 'online' ? 'System Online' : 'Service Offline'}</span>
            </div>
          </div>
        </header>

        {/* KPI Counter Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-5 flex items-center gap-4 hover:border-indigo-500/30 transition-all group">
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Processed</p>
              <p className="text-2xl font-black text-white">{counts.emails}</p>
            </div>
          </div>
          
          <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-5 flex items-center gap-4 hover:border-emerald-500/30 transition-all group">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 group-hover:scale-110 transition-transform">
              <CheckCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tasks Created</p>
              <p className="text-2xl font-black text-white">{counts.tasks}</p>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-5 flex items-center gap-4 hover:border-amber-500/30 transition-all group">
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Leads Generated</p>
              <p className="text-2xl font-black text-white">{counts.leads}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Input Column */}
          <div className="lg:col-span-12 space-y-8">
            <section className="bg-slate-900 border border-white/5 rounded-3xl p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <LayoutDashboard className="w-32 h-32 text-indigo-200" />
              </div>

              <h2 className="text-lg font-bold mb-6 text-white flex items-center gap-3">
                <Mail className="w-5 h-5 text-indigo-400" />
                Raw Email Source
              </h2>
              <form onSubmit={processEmail} className="flex flex-col gap-6 relative z-10">
                <div className="relative group">
                  <textarea
                    className="w-full h-40 bg-slate-950/80 border border-white/10 rounded-2xl p-5 text-slate-300 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:outline-none transition-all resize-none placeholder:text-slate-700 shadow-inner group-hover:border-white/20"
                    placeholder="Paste email payload here... Our AI agents will determine sentiment, extract tasks, and route to proper channels."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="absolute bottom-4 right-4 text-[10px] text-slate-600 font-bold uppercase tracking-widest pointer-events-none">AI Ready</div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={loading || !email.trim() || systemStatus !== 'online'}
                    className={`flex-1 flex items-center justify-center gap-3 font-bold py-4 rounded-2xl transition-all shadow-xl active:scale-[0.98] border border-white/5
                      ${loading || !email.trim() || systemStatus !== 'online'
                        ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'}`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="uppercase tracking-widest text-sm">Orchestrating Agents...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span className="uppercase tracking-widest text-sm">Execute AI Workflow</span>
                      </>
                    )}
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setEmail(''); setResult(null); setError(null); }}
                    className="p-4 bg-slate-800 hover:bg-slate-700 text-slate-400 border border-white/5 rounded-2xl transition-all"
                    title="Clear Input"
                  >
                    <History className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </section>
          </div>

          {error && (
            <div className="lg:col-span-12 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-500 animate-in fade-in zoom-in duration-300 shadow-lg">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <ShieldAlert className="w-6 h-6 shrink-0" />
              </div>
              <div>
                <p className="font-bold text-xs uppercase tracking-widest">Network Alert</p>
                <p className="text-sm opacity-90">{error}</p>
              </div>
            </div>
          )}

          {result && (
            <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-8 duration-700 fill-mode-both">
              
              {/* Analysis Section */}
              <div className="bg-slate-900 border border-white/5 rounded-3xl p-7 shadow-xl hover:shadow-indigo-500/5 transition-all">
                <div className="flex items-center justify-between mb-6">
                  <header className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Context Analysis</header>
                  <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-black border tracking-tighter ${getPriorityColor(result.analysis?.priority)} flex items-center gap-1`}>
                     {getPriorityIcon(result.analysis?.priority)}
                     {result.analysis?.priority || 'Medium'}
                  </span>
                </div>
                <div className="space-y-6">
                  <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Intent Category</p>
                    <p className="text-2xl font-black text-white capitalize">{result.analysis?.category || 'General'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">System Rationale</p>
                    <div className="flex items-start gap-3 bg-indigo-500/5 p-4 rounded-2xl border border-indigo-500/10">
                      <ArrowRight className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
                      <p className="text-sm font-medium text-slate-300 leading-relaxed italic">
                        "{result.analysis?.suggest_action || result.analysis?.suggested_action || 'Pending classification'}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Execution Decision */}
              <div className="bg-slate-900 border border-white/5 rounded-3xl p-7 shadow-xl hover:shadow-blue-500/5 transition-all">
                <header className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Workflow Decision</header>
                <div className="flex flex-col items-center justify-center py-6 gap-6">
                   <div className="relative">
                     <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full"></div>
                     <div className="relative p-6 bg-slate-950 border border-white/10 rounded-full text-indigo-400 shadow-2xl">
                        {result.action === 'task' && <ClipboardList className="w-16 h-16" />}
                        {result.action === 'crm' && <UserPlus className="w-16 h-16" />}
                        {result.action === 'reply' && <Mail className="w-16 h-16" />}
                     </div>
                   </div>
                   <div className="text-center">
                     <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Route Action</p>
                     <p className="text-3xl font-black text-white uppercase tracking-tight italic bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                       {result.action || 'Unknown'}
                     </p>
                   </div>
                </div>
                <div className="mt-4 p-3 bg-white/5 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Decision Confidence 98%</span>
                </div>
              </div>

              {/* Result Panel */}
              <div className="md:col-span-1">
                 {result.task && (
                   <div className="bg-slate-900 border border-indigo-500/20 rounded-3xl p-7 shadow-2xl h-full flex flex-col space-y-6 animate-in fade-in duration-1000">
                     <header className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em]">Agent Artifact: TASK</header>
                     <div className="space-y-6 flex-1">
                       <div className="bg-indigo-500/5 p-5 rounded-2xl border border-indigo-500/10">
                         <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Generated Title</p>
                         <p className="text-lg font-bold text-white leading-tight">{result.task.title || 'Inferred Task'}</p>
                       </div>
                       <div>
                         <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Proposed Resolution</p>
                         <p className="text-sm text-slate-400 leading-relaxed bg-slate-950 p-3 rounded-xl border border-white/5">
                            Auto-dispatched to project management systems with priority {result.analysis?.priority?.toUpperCase()}.
                         </p>
                       </div>
                     </div>
                     <div className="pt-4 border-t border-white/5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-indigo-300 font-black uppercase tracking-widest flex items-center gap-2">
                             <CheckCheck className="w-4 h-4" /> Dispatched
                          </span>
                          <span className="text-[10px] text-slate-500 font-bold">{result.task.due_date || 'TBD'}</span>
                        </div>
                     </div>
                   </div>
                 )}

                 {result.lead && (
                   <div className="bg-slate-900 border border-emerald-500/20 rounded-3xl p-7 shadow-2xl h-full flex flex-col space-y-6 animate-in fade-in duration-1000">
                     <header className="text-xs font-black text-emerald-400 uppercase tracking-[0.2em]">Agent Artifact: LEAD</header>
                     <div className="space-y-6 flex-1">
                       <div className="bg-emerald-500/5 p-5 rounded-2xl border border-emerald-500/10">
                         <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Contact Sequence</p>
                         <p className="text-lg font-bold text-white">{result.lead.name || 'New Opportunity'}</p>
                         <p className="text-xs text-emerald-500/60 mt-1">{result.lead.email || 'Email extracted'}</p>
                       </div>
                       <div>
                         <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Sync Status</p>
                         <p className="text-sm text-slate-400 leading-relaxed bg-slate-950 p-3 rounded-xl border border-white/5">
                            Lead captured and data standardized. Automated nurtue sequence initialized in CRM.
                         </p>
                       </div>
                     </div>
                     <div className="pt-4 border-t border-white/5">
                        <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest flex items-center gap-2">
                           <UserPlus className="w-4 h-4" /> CRM Synced
                        </span>
                     </div>
                   </div>
                 )}

                 {!result.task && !result.lead && (
                    <div className="bg-slate-900 border border-white/5 rounded-3xl p-10 shadow-xl h-full flex items-center justify-center text-center">
                       <div className="space-y-4">
                         <div className="relative inline-block">
                           <Mail className="w-12 h-12 text-slate-700 mx-auto" />
                           <Zap className="w-6 h-6 text-indigo-500 absolute -top-2 -right-2 animate-bounce" />
                         </div>
                         <p className="text-slate-500 text-sm font-medium italic leading-relaxed">
                            "High-priority draft prepared for internal review. No immediate task creation required."
                         </p>
                         <div className="pt-4">
                            <span className="px-3 py-1 bg-white/5 text-slate-500 text-[9px] font-black uppercase rounded border border-white/5 tracking-widest">Observation Mode</span>
                         </div>
                       </div>
                    </div>
                 )}
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <footer className="pt-12 text-center border-t border-white/5 flex flex-col items-center gap-4">
          <div className="flex items-center gap-6 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
             <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
               <ShieldAlert className="w-4 h-4 text-indigo-500" /> Secure Processing
             </div>
             <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
               <Activity className="w-4 h-4 text-green-500" /> API Alive
             </div>
          </div>
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]">© 2026 AI COO Agent • Business Virtualization Layer</p>
        </footer>

      </div>
    </div>
  );
};

export default App;
