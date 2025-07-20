import React from 'react';
import { useDocuments } from '../context/DocumentContext';
import { BarChart3, FileText, MessageSquare, Upload, Zap, Search, TrendingUp } from 'lucide-react';
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
      description: 'Uploaded files'
    },
    {
      icon: BarChart3,
      label: 'Chunks',
      value: totalChunks,
      color: 'secondary',
      description: 'Analyzed segments'
    },
    {
      icon: MessageSquare,
      label: 'AI Assistant',
      value: 'Ready',
      color: 'green',
      description: 'Status active'
    }
  ];

  const features = [
    {
      icon: Upload,
      title: 'Document Upload',
      description: 'Upload and process your documents with AI-powered analysis',
      color: 'primary'
    },
    {
      icon: MessageSquare,
      title: 'Smart Assistant',
      description: 'Get instant answers and insights from your documents',
      color: 'green',
      featured: true
    },
    {
      icon: Search,
      title: 'Advanced Search',
      description: 'Find specific clauses and information with semantic search',
      color: 'secondary'
    }
  ];

  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    secondary: 'bg-secondary-100 text-secondary-600',
    green: 'bg-green-100 text-green-600'
  };

  const borderClasses = {
    primary: 'border-primary-200',
    secondary: 'border-secondary-200',
    green: 'border-green-200'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                <Zap className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Document Analysis
              <span className="block text-primary-200">Dashboard</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Upload, analyze, and chat with your documents using AI-powered intelligence
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        {/* Stats Cards - Floating */}
        {documents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`p-4 rounded-xl ${colorClasses[stat.color]} shadow-sm`}>
                      <stat.icon className="w-7 h-7" />
                    </div>
                    <div className="ml-4">
                      <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm font-semibold text-gray-700">{stat.label}</div>
                      <div className="text-xs text-gray-500">{stat.description}</div>
                    </div>
                  </div>
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Feature Overview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
                feature.featured 
                  ? 'bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 shadow-lg' 
                  : 'bg-white border border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`inline-flex p-4 rounded-2xl mb-6 ${colorClasses[feature.color]} shadow-sm`}>
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              {feature.featured && (
                <div className="mt-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-200 text-green-800">
                    <Zap className="w-3 h-3 mr-1" />
                    Featured
                  </span>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Main Content Sections */}
        <div className="space-y-12 pb-16">
          {/* File Upload Section */}
          <section className="group">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-primary-100 text-primary-600 rounded-xl mr-4">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Document Upload</h2>
                <p className="text-gray-600">Upload your documents to get started with AI analysis</p>
              </div>
            </div>
            <Card className="overflow-hidden shadow-lg border-0 group-hover:shadow-xl transition-shadow duration-300">
              <FileUpload />
            </Card>
          </section>

          {/* AI Assistant Section - Featured */}
          <section className="group">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 text-green-600 rounded-xl mr-4">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">AI Assistant</h2>
                  <p className="text-gray-600">Get instant answers and insights from your documents</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  Active
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  <Zap className="w-3 h-3 mr-1" />
                  Featured
                </span>
              </div>
            </div>
            <Card className="overflow-hidden shadow-xl border-2 border-green-200 group-hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-green-50">
              <AIAssistant />
            </Card>
          </section>

          {/* Advanced Search Section */}
          <section className="group">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-secondary-100 text-secondary-600 rounded-xl mr-4">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Advanced Search</h2>
                <p className="text-gray-600">Semantic search through your document collection</p>
              </div>
            </div>
            <Card className="overflow-hidden shadow-lg border-0 group-hover:shadow-xl transition-shadow duration-300">
              <details className="group/details">
                <summary className="px-8 py-6 bg-gradient-to-r from-secondary-50 to-secondary-100 border-b border-secondary-200 font-semibold text-gray-800 cursor-pointer hover:from-secondary-100 hover:to-secondary-200 transition-all duration-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Search className="w-5 h-5 text-secondary-600" />
                    <span>Advanced Search & Raw Results</span>
                  </div>
                  <svg className="w-6 h-6 transform group-open/details:rotate-180 transition-transform duration-200 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="bg-white">
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
