import React, { useEffect } from 'react';
import { useDocuments } from '../context/DocumentContext';
import { FileText, MessageSquare, Upload, Search, ShieldCheck, FolderOpen } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import FileUpload from '../components/features/FileUpload';
import AIAssistant from '../components/features/AIAssistant';
import ClauseSearch from '../components/features/ClauseSearch';
import Card from '../components/ui/Card';

function DashboardPage() {
  const { documents, totalChunks } = useDocuments();
  const location = useLocation();

  // Fix hash-based scrolling after route navigation
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        // Small delay so page has rendered
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  const stats = [
    {
      icon: FileText,
      label: 'Policies Loaded',
      value: documents.length,
      description: 'In your document vault',
      color: 'navy',
    },
    {
      icon: ShieldCheck,
      label: 'Indexed Clauses',
      value: totalChunks,
      description: 'Searchable segments',
      color: 'amber',
    },
    {
      icon: FolderOpen,
      label: 'Cloud Storage',
      value: 'Active',
      description: 'Supabase + Qdrant',
      color: 'green',
    },
  ];

  const colorMap = {
    navy:  'bg-primary-100  dark:bg-primary-950/60  text-primary-700  dark:text-primary-300',
    amber: 'bg-secondary-100 dark:bg-secondary-950/60 text-secondary-700 dark:text-secondary-300',
    green: 'bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400',
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">

      {/* Page header */}
      <div className="bg-primary-900 dark:bg-primary-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <ShieldCheck className="w-7 h-7 text-secondary-400" />
            </div>
            <div>
              <h1 className="font-serif text-2xl md:text-3xl text-white mb-1">
                Policy Analysis Dashboard
              </h1>
              <p className="text-primary-200 text-sm">
                Upload your insurance policy, then ask any coverage question.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 relative z-10">

        {/* Stats strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, i) => (
            <Card key={i} className="px-5 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${colorMap[stat.color]}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{stat.label}</div>
                  <div className="text-[11px] text-slate-400">{stat.description}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main sections */}
        <div className="space-y-8 pb-16">

          {/* AI Assistant */}
          <section id="ai-chat" className="scroll-mt-20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400 rounded-lg">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">AI Policy Assistant</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Ask about coverage, waiting periods, claim eligibility</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Live
              </span>
            </div>
            <Card className="overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
              <AIAssistant />
            </Card>
          </section>

          {/* Document Upload */}
          <section id="upload" className="scroll-mt-20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-400 rounded-lg">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">Document Vault</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Upload or manage policy documents stored in cloud</p>
                </div>
              </div>
              <Link
                to="/documents"
                className="text-xs font-semibold text-primary-700 dark:text-primary-400 hover:underline flex items-center gap-1"
              >
                Open Document Manager →
              </Link>
            </div>
            <Card className="overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
              <FileUpload />
            </Card>
          </section>

          {/* Clause Search */}
          <section id="search" className="scroll-mt-20">
            <Card className="overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
              <details className="group/details">
                <summary className="px-5 py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 font-medium text-sm text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Search className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    Raw Semantic Clause Search
                  </div>
                  <svg className="w-4 h-4 transform group-open/details:rotate-180 transition-transform text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="p-4">
                  <ClauseSearch />
                </div>
              </details>
            </Card>
          </section>

        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
