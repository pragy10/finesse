import React, { useState } from "react";
import axios from "axios";
import { useDocuments } from "../../context/DocumentContext";
import { Send, Bot, User, Trash2, Settings, Lightbulb, Sparkles, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../ui/Card';
import Button from '../ui/Button';

function AIAssistant() {
  const [query, setQuery] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState("");
  const [smartMode, setSmartMode] = useState(true); // Smart processing by default
  
  const { documents } = useDocuments();

  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!query.trim() || documents.length === 0 || loading) return;

    const userMessage = {
      type: 'user',
      content: query,
      timestamp: new Date().toISOString()
    };

    setConversation(prev => [...prev, userMessage]);
    const currentQuery = query;
    setQuery("");
    setLoading(true);

    try {
      // Use smart endpoint for better processing
      const endpoint = smartMode ? '/ask-smart' : '/ask';
      
      const res = await axios.post(`http://localhost:3001${endpoint}`, {
        query: currentQuery.trim(),
        fileName: selectedDoc || undefined,
        returnStructured: false // Get conversational response
      });

      const aiMessage = {
        type: 'ai',
        content: res.data.response,
        confidence: res.data.confidence,
        sourceChunks: res.data.sourceChunks,
        parsedQuery: res.data.parsedQuery, // New: show what AI understood
        metadata: res.data.metadata,
        timestamp: new Date().toISOString()
      };

      setConversation(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error("AI Assistant error:", error);
      
      const errorMessage = {
        type: 'ai',
        content: error.response?.data?.error || "I'm having trouble processing your request. Please try again.",
        isError: true,
        timestamp: new Date().toISOString()
      };

      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const getQuickDecision = async (quickQuery) => {
    if (!quickQuery.trim() || documents.length === 0) return;

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3001/ask-smart", {
        query: quickQuery.trim(),
        returnStructured: true // Get structured decision
      });

      const decision = res.data.decision;
      const parsed = res.data.parsedQuery;

      const quickMessage = {
        type: 'ai',
        content: formatQuickDecision(decision, parsed),
        confidence: res.data.confidence,
        isQuickDecision: true,
        structuredData: decision,
        parsedQuery: parsed,
        timestamp: new Date().toISOString()
      };

      setConversation(prev => [...prev, {
        type: 'user',
        content: quickQuery,
        timestamp: new Date().toISOString()
      }, quickMessage]);

    } catch (error) {
      console.error("Quick decision error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatQuickDecision = (decision, parsed) => {
    const status = decision.decision?.status || 'UNKNOWN';
    const summary = decision.decision?.summary || 'Analysis completed';
    
    let statusEmoji = '❓';
    let statusColor = 'gray';
    
    switch (status) {
      case 'COVERED':
        statusEmoji = '✅';
        statusColor = 'green';
        break;
      case 'NOT_COVERED':
        statusEmoji = '❌';
        statusColor = 'red';
        break;
      case 'PARTIALLY_COVERED':
        statusEmoji = '⚠️';
        statusColor = 'yellow';
        break;
      default:
        statusEmoji = '❓';
        statusColor = 'gray';
    }

    return `${statusEmoji} **QUICK DECISION: ${status.replace('_', ' ')}**

**Summary:** ${summary}

**Coverage Details:**
• Eligibility: ${decision.coverage?.eligible ? 'Yes' : 'No'}
• Coverage: ${decision.coverage?.coveragePercentage || 'Not specified'}%
• Max Amount: ${decision.coverage?.maxAmount || 'Not specified'}

**Key Requirements:**
${decision.requirements?.documentsNeeded?.map(doc => `• ${doc}`).join('\n') || '• Check policy terms'}

**Next Steps:**
${decision.nextActions?.immediate?.map(action => `• ${action}`).join('\n') || '• Consult with insurance provider'}`;
  };

  const clearConversation = () => {
    setConversation([]);
  };

  const quickQueries = [
    "46M, knee surgery, Pune, 3-month policy",
    "28F, maternity, Mumbai, 18-month policy", 
    "35M, heart surgery, Delhi, 2-year policy",
    "50F, diabetes treatment, Bangalore, 6-month policy"
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-900 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            Smart AI Assistant
          </h2>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full font-medium">
              Enhanced with Query Intelligence
            </span>
          </div>
        </div>
        
        {conversation.length > 0 && (
          <Button 
            onClick={clearConversation}
            variant="outline"
            size="sm"
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            Clear Chat
          </Button>
        )}
      </div>

      {/* Smart Mode Toggle */}
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <Card.Content>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-blue-600" />
              <div>
                <span className="font-semibold text-blue-800">Smart Processing Mode</span>
                <p className="text-sm text-blue-600">AI automatically understands vague queries and extracts key information</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={smartMode}
                onChange={(e) => setSmartMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </Card.Content>
      </Card>

      {/* Quick Decisions */}
      {documents.length > 0 && conversation.length === 0 && (
        <Card className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
          <Card.Content>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🚀 Try These Quick Queries
            </h3>
            <p className="text-gray-600 mb-4">
              Smart AI can understand vague queries and provide instant decisions:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {quickQueries.map((quickQuery, i) => (
                <button
                  key={i}
                  onClick={() => getQuickDecision(quickQuery)}
                  disabled={loading}
                  className="text-left p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary-300 transition-all group disabled:opacity-50"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary-600">Q</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-primary-600">
                        "{quickQuery}"
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Get instant eligibility decision
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Chat Interface */}
      <Card className="mb-6">
        <div className="h-96 overflow-y-auto p-6 space-y-6">
          {conversation.length === 0 && documents.length > 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Bot className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg font-medium text-gray-600 mb-2">Smart AI Ready!</p>
              <p className="text-gray-500">Ask anything - even vague queries like "46M, knee surgery, Pune"</p>
            </div>
          )}

          <AnimatePresence>
            {conversation.map((message, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex gap-4 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gradient-to-br from-secondary-400 to-secondary-600 text-white'
                }`}>
                  {message.type === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                <div className={`max-w-[80%] ${message.type === 'user' ? 'text-right' : ''}`}>
                  <div className={`rounded-xl p-4 ${
                    message.type === 'user'
                      ? 'bg-primary-500 text-white'
                      : message.isError
                      ? 'bg-red-50 border border-red-200 text-red-800'
                      : message.isQuickDecision
                      ? 'bg-gradient-to-r from-green-50 to-blue-50 border border-green-200'
                      : 'bg-white border border-gray-200 shadow-sm'
                  }`}>
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </div>

                    {/* Show parsed query understanding */}
                    {message.parsedQuery && smartMode && (
                      <details className="mt-4 pt-4 border-t border-gray-100">
                        <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800">
                          🧠 What AI Understood
                        </summary>
                        <div className="mt-2 text-xs bg-gray-50 p-3 rounded border">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <strong>Demographics:</strong><br/>
                              Age: {message.parsedQuery.demographics?.age || 'Unknown'}<br/>
                              Gender: {message.parsedQuery.demographics?.gender || 'Unknown'}<br/>
                              Location: {message.parsedQuery.demographics?.location || 'Unknown'}
                            </div>
                            <div>
                              <strong>Medical:</strong><br/>
                              Condition: {message.parsedQuery.medical?.condition || 'Unknown'}<br/>
                              Treatment: {message.parsedQuery.medical?.treatmentType || 'Unknown'}
                            </div>
                          </div>
                        </div>
                      </details>
                    )}

                    {/* Standard confidence display */}
                    {message.type === 'ai' && message.confidence && !message.isError && (
                      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-600">Confidence:</span>
                          <span className="font-semibold text-green-600">
                            {message.confidence.level} ({message.confidence.score}%)
                          </span>
                        </div>
                        <div className="text-gray-500">
                          Sources: {message.sourceChunks?.length || 0} chunks • 
                          Processing: {message.metadata?.processingType || 'standard'}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-gray-400 mt-2 px-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full flex items-center justify-center text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-600">
                    {smartMode ? 'Smart AI analyzing query...' : 'Processing with AI...'}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Form */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <form onSubmit={handleAskAI} className="space-y-4">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder={smartMode 
                  ? "Try: '46M, knee surgery, Pune, 3-month policy' or ask anything..."
                  : "Ask me anything about your documents..."
                }
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={documents.length === 0 || loading}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
              />
              
              <Button 
                type="submit" 
                disabled={!query.trim() || documents.length === 0 || loading}
                loading={loading}
                size="lg"
                className="px-6"
              >
                {!loading && <Send className="w-5 h-5" />}
                Ask
              </Button>
            </div>
            
            <div className="text-xs text-gray-500 flex items-center justify-between">
              <span>
                {smartMode ? (
                  <><Sparkles className="w-3 h-3 inline mr-1" />Smart mode: Understands vague queries</>
                ) : (
                  '💬 Standard mode: Detailed queries work best'
                )}
              </span>
              <span>{documents.length} document{documents.length > 1 ? 's' : ''} ready</span>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}

export default AIAssistant;
