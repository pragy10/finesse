import React, { useState } from "react";
import axios from "axios";
import { useDocuments } from "../../context/DocumentContext";
import { Search, FileText, AlertCircle, Filter, Download, Copy, Check } from 'lucide-react';
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
  const [copiedIndex, setCopiedIndex] = useState(null);
  
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
      color: "text-green-600 dark:text-green-400", 
      bg: "bg-green-100 dark:bg-green-950/60",
      border: "border-green-200 dark:border-green-800"
    };
    if (score >= 0.4) return { 
      text: "Medium", 
      color: "text-yellow-600 dark:text-yellow-400", 
      bg: "bg-yellow-100 dark:bg-yellow-950/60",
      border: "border-yellow-200 dark:border-yellow-800"
    };
    return { 
      text: "Low", 
      color: "text-red-600 dark:text-red-400", 
      bg: "bg-red-100 dark:bg-red-950/60",
      border: "border-red-200 dark:border-red-800"
    };
  };

  const highlightText = (text, query) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? 
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-400 text-gray-900 px-1 rounded font-semibold">{part}</mark> : part
    );
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
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
    <div className="p-4 sm:p-6 text-gray-900 dark:text-gray-100 transition-colors">
      {/* Header */}
      <div className="mb-6">
        <h2 className="flex items-center gap-2.5 text-xl font-bold text-gray-900 dark:text-white mb-1">
          <Search className="w-6 h-6 text-primary-500" />
          Advanced Semantic Search
        </h2>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Find exact document chunks and similarity scores across your uploaded documents.
        </p>
      </div>
      
      {/* Search Form Card */}
      <Card className="mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <Card.Content>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter query (e.g., 'waiting period for knee surgery', 'pre-existing diseases')..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={documents.length === 0}
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                />
              </div>
              
              <Button 
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                size="md"
                className={`text-xs ${documents.length > 1 ? '' : 'hidden'}`}
              >
                <Filter className="w-4 h-4 mr-1.5" />
                Filter Doc
              </Button>
              
              <Button 
                type="submit" 
                disabled={loading || documents.length === 0 || !query.trim()}
                loading={loading}
                size="md"
                className="px-6 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl shadow-sm"
              >
                {!loading && <Search className="w-4 h-4 mr-1.5" />}
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
                  className="border-t border-gray-200 dark:border-gray-700 pt-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      Search in:
                    </span>
                    <select
                      value={selectedDoc}
                      onChange={(e) => setSelectedDoc(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
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
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </Card.Content>
      </Card>
      
      {/* Loading State */}
      {loading && (
        <div className="py-12 text-center">
          <LoadingSpinner size="lg" className="mb-3 mx-auto" />
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Searching Vector Space</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Finding high-confidence chunks for your query...
          </p>
        </div>
      )}
      
      {/* Search Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Search Results ({results.length} chunks)
            </h3>
            <Button
              onClick={exportResults}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              Export JSON
            </Button>
          </div>
          
          <div className="space-y-3">
            {results.map((item, i) => {
              const relevance = getRelevanceLevel(item.score);
              
              return (
                <Card key={i} hover className="overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                  {/* Result Header */}
                  <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="w-8 h-8 bg-primary-100 dark:bg-primary-950/60 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="truncate">
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                          {item.payload?.fileName}
                        </h4>
                        <div className="text-[11px] text-gray-500 dark:text-gray-400">
                          Chunk #{i + 1} • {item.payload?.text?.length || 0} characters
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${relevance.bg} ${relevance.color} ${relevance.border} border`}>
                        {relevance.text} ({item.score?.toFixed(3)})
                      </span>
                      
                      <button
                        onClick={() => copyToClipboard(item.payload?.text || "", i)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg"
                        title="Copy text"
                      >
                        {copiedIndex === i ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  
                  {/* Result Content */}
                  <div className="p-4">
                    <div className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap font-mono bg-gray-50/50 dark:bg-gray-900/40 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                      {highlightText(item.payload?.text || "No text available", query)}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ClauseSearch;
