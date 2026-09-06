import React from 'react';
import { useDocuments } from '../context/DocumentContext';
import { BarChart3, FileText, MessageSquare, Upload, Zap, Search, TrendingUp, Cloud } from 'lucide-react';
import { Link } from 'react-router-dom';
import FileUpload from '../components/features/FileUpload';
import AIAssistant from '../components/features/AIAssistant';
import ClauseSearch from '../components/features/ClauseSearch';
import Card from '../components/ui/Card';

function DashboardPage() {
  const { documents, totalChunks } = useDocuments();

  const stats = [
    {
      icon: FileText,
      label: 'Documents',
      value: documents.length,
      color: 'primary',
      description: 'Uploaded & indexed files'
    },
    {
      icon: BarChart3,
      label: 'Chunks',
      value: totalChunks,
      color: 'secondary',
      description: 'Analyzed vector segments'
    },
    {
      icon: Cloud,
      label: 'Storage',
      value: 'Cloud',
      color: 'green',
      description: 'Supabase + Qdrant'
    }
  ];

  const colorClasses = {
    primary: 'bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400',
    secondary: 'bg-secondary-100 dark:bg-secondary-950/60 text-secondary-600 dark:text-secondary-400',
    green: 'bg-green-100 dark:bg-green-950/60 text-green-600 dark:text-green-400'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 dark:from-primary-800 dark:via-primary-900 dark:to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-white/10 dark:bg-white/5 rounded-2xl backdrop-blur-sm">
                <Zap className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Document Analysis
              <span className="block text-primary-200">Dashboard</span>
            </h1>
            <p className="text-base md:text-lg text-primary-100 max-w-2xl mx-auto leading-relaxed">
              Verify claims, interpret policy terms, and search clauses using intelligent multi-turn AI.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        {/* Floating Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-5 bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${colorClasses[stat.color]}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">{stat.label}</div>
                    <div className="text-[11px] text-gray-500 dark:text-gray-400">{stat.description}</div>
                  </div>
                </div>
                <TrendingUp className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content Sections */}
        <div className="space-y-10 pb-16">
          {/* AI Assistant Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-green-100 dark:bg-green-950/60 text-green-600 dark:text-green-400 rounded-xl">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Policy Assistant</h2>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Ask questions, verify waiting periods, and check surgery coverage</p>
                </div>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></div>
                Active
              </span>
            </div>
            <Card className="overflow-hidden shadow-lg border border-green-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <AIAssistant />
            </Card>
          </section>

          {/* Quick Document Upload & Management Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 rounded-xl">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Document Management</h2>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Upload or review files stored in your persistent cloud storage</p>
                </div>
              </div>
              <Link 
                to="/documents" 
                className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
              >
                Go to Document Manager →
              </Link>
            </div>
            <Card className="overflow-hidden shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <FileUpload />
            </Card>
          </section>

          {/* Advanced Search Accordion Section */}
          <section>
            <Card className="overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <details className="group/details">
                <summary className="px-6 py-4 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 font-semibold text-sm text-gray-800 dark:text-gray-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Search className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
                    <span>Raw Semantic Search & Clause Lookup</span>
                  </div>
                  <svg className="w-4 h-4 transform group-open/details:rotate-180 transition-transform text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="p-4 bg-white dark:bg-gray-800">
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
