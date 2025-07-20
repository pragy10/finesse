import React, { useState } from "react";
import axios from "axios";
import { useDocuments } from "../../context/DocumentContext";
import { Search, FileText, AlertCircle, Filter, Download, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../ui/Card';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';

function ClauseSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const { documents } = useDocuments();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || documents.length === 0) return;

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3001/search", { 
        query: query.trim(),
        fileName: selectedDoc || undefined
      });
      setResults(res.data || []);
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const getRelevanceLevel = (score) => {
    if (score >= 0.7) return { 
      text: "High", 
      color: "text-green-600", 
      bg: "bg-green-100",
      border: "border-green-200"
    };
    if (score >= 0.4) return { 
      text: "Medium", 
      color: "text-yellow-600", 
      bg: "bg-yellow-100",
      border: "border-yellow-200"
    };
    return { 
      text: "Low", 
      color: "text-red-600", 
      bg: "bg-red-100",
      border: "border-red-200"
    };
  };

  const highlightText = (text, query) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? 
        <mark key={index} className="bg-yellow-200 px-1 rounded font-medium">{part}</mark> : part
    );
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const exportResults = () => {
    const exportData = {
      query,
      timestamp: new Date().toISOString(),
      totalResults: results.length,
      results: results.map(item => ({
        fileName: item.payload?.fileName,
        content: item.payload?.text,
        relevanceScore: item.score,
        relevanceLevel: getRelevanceLevel(item.score).text
      }))
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `search-results-${query.replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-900 mb-2">
          <Search className="w-8 h-8 text-primary-500" />
          Advanced Semantic Search
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Find specific information with raw document chunks and relevance scores. 
          Perfect for detailed research and data extraction.
        </p>
      </div>
      
      {/* No Documents Warning */}
      {documents.length === 0 && (
        <Card className="mb-6 bg-yellow-50 border-yellow-200">
          <Card.Content>
            <div className="flex items-start gap-4">
              <AlertCircle className="w-8 h-8 text-yellow-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Documents Available</h3>
                <p className="text-yellow-700 leading-relaxed mb-4">
                  Upload documents first to enable semantic search functionality. 
                  The search works across all document types and finds content based on meaning, not just keywords.
                </p>
                <Button 
                  as="a" 
                  href="#upload" 
                  variant="outline"
                  size="sm"
                  className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
                >
                  Go to Upload Section
                </Button>
              </div>
            </div>
          </Card.Content>
        </Card>
      )}
      
      {/* Search Form */}
      <Card className="mb-6">
        <Card.Content>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter your search query (e.g., 'eligibility criteria', 'payment terms', 'coverage limits')..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={documents.length === 0}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:text-gray-500 text-base"
                />
              </div>
              
              <Button 
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                size="lg"
                className={documents.length > 1 ? '' : 'hidden'}
              >
                <Filter className="w-5 h-5" />
                Filters
              </Button>
              
              <Button 
                type="submit" 
                disabled={loading || documents.length === 0 || !query.trim()}
                loading={loading}
                size="lg"
                className="px-8"
              >
                {!loading && <Search className="w-5 h-5" />}
                Search
              </Button>
            </div>

            {/* Filters Panel */}
            <AnimatePresence>
              {showFilters && documents.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-gray-200 pt-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                      Search in:
                    </span>
                    <select
                      value={selectedDoc}
                      onChange={(e) => setSelectedDoc(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">All Documents ({documents.length})</option>
                      {documents.map((doc, i) => (
                        <option key={i} value={doc.fileName}>
                          {doc.fileName.length > 50 ? 
                            doc.fileName.substring(0, 50) + "..." : 
                            doc.fileName
                          }
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {selectedDoc && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="w-4 h-4" />
                      <span>Searching in: <span className="font-medium">{selectedDoc}</span></span>
                      <Button
                        type="button"
                        onClick={() => setSelectedDoc("")}
                        variant="ghost"
                        size="sm"
                        className="ml-2 text-xs"
                      >
                        Clear Filter
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </Card.Content>
      </Card>
      
      {/* Loading State */}
      {loading && (
        <Card className="mb-6">
          <Card.Content>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <LoadingSpinner size="lg" className="mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Searching Documents</h3>
              <p className="text-gray-600">
                Analyzing {selectedDoc ? "1" : documents.length} document{documents.length > 1 ? 's' : ''} 
                for semantic matches...
              </p>
            </div>
          </Card.Content>
        </Card>
      )}
      
      {/* Search Results */}
      {results.length > 0 && (
        <div className="space-y-6">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Search Results ({results.length} matches found)
              </h3>
              <p className="text-gray-600 mt-1">
                Results ranked by semantic similarity to your query
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {selectedDoc && (
                <div className="bg-primary-100 text-primary-700 px-3 py-2 rounded-lg text-sm font-medium border border-primary-200">
                  📄 {selectedDoc}
                </div>
              )}
              
              <Button
                onClick={exportResults}
                variant="outline"
                size="sm"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
          
          {/* Results Grid */}
          <div className="space-y-4">
            {results.map((item, i) => {
              const relevance = getRelevanceLevel(item.score);
              
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card hover className="overflow-hidden">
                    {/* Result Header */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {item.payload?.fileName}
                          </h4>
                          <div className="text-sm text-gray-500">
                            Match #{i + 1} • {item.payload?.text?.length || 0} characters
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900 mb-1">
                            {item.score?.toFixed(3)}
                          </div>
                          <div className={`text-xs font-medium px-2 py-1 rounded-full ${relevance.bg} ${relevance.color} ${relevance.border} border`}>
                            {relevance.text} Relevance
                          </div>
                        </div>
                        
                        <Button
                          onClick={() => copyToClipboard(item.payload?.text || "")}
                          variant="ghost"
                          size="sm"
                          title="Copy text"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Result Content */}
                    <div className="p-6">
                      <div className="prose prose-sm max-w-none">
                        <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                          {highlightText(item.payload?.text || "No text available", query)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Relevance Indicator */}
                    <div className="px-6 pb-4">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Semantic similarity score: {(item.score * 100).toFixed(1)}%</span>
                        <div className="flex items-center gap-1">
                          <div className="w-20 bg-gray-200 rounded-full h-1">
                            <div 
                              className={`h-1 rounded-full ${
                                relevance.text === 'High' ? 'bg-green-500' :
                                relevance.text === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.max(item.score * 100, 5)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Empty State */}
      {!loading && results.length === 0 && query.trim() && documents.length > 0 && (
        <Card className="text-center py-12">
          <Card.Content>
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No matches found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              No results found for <span className="font-medium">"{query}"</span>.
              {selectedDoc && " Try searching in all documents or "}
              Try different keywords or upload more relevant documents.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {selectedDoc && (
                <Button 
                  onClick={() => setSelectedDoc("")}
                  variant="outline"
                >
                  Search All Documents
                </Button>
              )}
              
              <Button 
                onClick={() => setQuery("")}
                variant="ghost"
              >
                Clear Search
              </Button>
            </div>

            {/* Search Tips */}
            <div className="mt-8 text-left max-w-md mx-auto">
              <h4 className="font-medium text-gray-800 mb-3">💡 Search Tips:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Try broader terms (e.g., "coverage" instead of "specific coverage type")</li>
                <li>• Use synonyms (e.g., "eligibility" or "qualification")</li>
                <li>• Search for concepts rather than exact phrases</li>
                <li>• Check spelling and try related keywords</li>
              </ul>
            </div>
          </Card.Content>
        </Card>
      )}
    </div>
  );
}

export default ClauseSearch;
