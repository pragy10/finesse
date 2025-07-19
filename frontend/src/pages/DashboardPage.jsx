import React from 'react';
import { useDocuments } from '../context/DocumentContext';
import { BarChart3, FileText, MessageSquare, Upload } from 'lucide-react';
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
      color: 'primary'
    },
    {
      icon: BarChart3,
      label: 'Chunks',
      value: totalChunks,
      color: 'secondary'
    },
    {
      icon: MessageSquare,
      label: 'AI Assistant',
      value: 'Ready',
      color: 'green'
    }
  ];

  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    secondary: 'bg-secondary-100 text-secondary-600',
    green: 'bg-green-100 text-green-600'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Document Analysis Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload, analyze, and chat with your documents using AI-powered intelligence
          </p>
        </div>
        
        {/* Stats Cards */}
        {documents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm font-medium text-gray-600">{stat.label}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Dashboard Content */}
        <div className="space-y-8">
          {/* File Upload Section */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200">
            <FileUpload />
          </section>

          {/* AI Assistant Section - Featured */}
          <section className="bg-white rounded-xl shadow-lg border-2 border-primary-200">
            <AIAssistant />
          </section>

          {/* Advanced Search Section */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200">
            <details className="group">
              <summary className="px-6 py-4 bg-gray-50 border-b border-gray-200 font-semibold text-gray-800 cursor-pointer hover:bg-gray-100 transition-colors flex items-center gap-2">
                <span>🔍 Advanced Search (Raw Results)</span>
                <svg className="w-5 h-5 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <ClauseSearch />
            </details>
          </section>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
