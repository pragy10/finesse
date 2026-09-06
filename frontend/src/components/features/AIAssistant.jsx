import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { useDocuments } from "../../context/DocumentContext";
import { useAuth } from "../../context/AuthContext";
import { 
  Send, 
  Bot, 
  User, 
  Trash2, 
  Settings, 
  Sparkles, 
  CheckCircle, 
  FileText, 
  Check, 
  Plus, 
  Filter, 
  ShieldCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../ui/Card';
import Button from '../ui/Button';

// ─── Clarification Form ───────────────────────────────────────────────────────
function ClarificationForm({ questions, onSubmit, disabled }) {
  const [answers, setAnswers] = useState(() => questions.map(() => ""));

  const setAnswer = (idx, value) => {
    setAnswers(prev => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
  };

  const handleSubmit = () => {
    const bundled = questions
      .map((q, i) => `Q: ${q}\nA: ${answers[i].trim() || "N/A"}`)
      .join("\n\n");
    onSubmit(bundled);
  };

  const allAnswered = answers.every(a => a.trim().length > 0);

  return (
    <div className="mt-4 space-y-4 border-t border-blue-200 dark:border-blue-900/60 pt-4">
      <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">Please answer the questions below:</p>
      {questions.map((q, idx) => (
        <div key={idx} className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {idx + 1}. {q}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={answers[idx]}
              onChange={e => setAnswer(idx, e.target.value)}
              disabled={disabled}
              placeholder="Type your answer..."
              className="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100 dark:disabled:bg-gray-800"
            />
            <button
              type="button"
              onClick={() => setAnswer(idx, "N/A")}
              disabled={disabled}
              className="px-3 py-2 text-xs font-medium bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-200 disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              N/A
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled || !allAnswered}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
      >
        Submit Answers →
      </button>
    </div>
  );
}

// ─── Markdown renderer component ─────────────────────────────────────────────
function MarkdownContent({ content }) {
  return (
    <ReactMarkdown
      components={{
        h2: ({ children }) => (
          <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100 mt-3 mb-1 first:mt-0">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-2 mb-1">{children}</h3>
        ),
        ul: ({ children }) => (
          <ul className="space-y-0.5 my-1">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="space-y-0.5 my-1 list-decimal list-inside">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="flex gap-1.5 text-sm leading-snug">
            <span className="text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0">•</span>
            <span className="text-gray-800 dark:text-gray-200">{children}</span>
          </li>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>
        ),
        p: ({ children }) => (
          <p className="text-sm leading-relaxed my-0.5 text-gray-800 dark:text-gray-200">{children}</p>
        ),
        hr: () => <hr className="my-2 border-gray-200 dark:border-gray-700" />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function AIAssistant() {
  const [query, setQuery] = useState("");
  const [conversation, setConversation] = useState(() => {
    try {
      const saved = sessionStorage.getItem("finesse_chat_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const [smartMode, setSmartMode] = useState(true);
  const [showDocPicker, setShowDocPicker] = useState(false);
  const chatEndRef = useRef(null);

  const { documents, activeDocIds, toggleActiveDocId, selectAllDocs, clearActiveDocs } = useDocuments();
  const { user, userProfile, idToken } = useAuth();

  // Persist conversation across tab switches
  useEffect(() => {
    try {
      sessionStorage.setItem("finesse_chat_history", JSON.stringify(conversation));
    } catch (e) {
      console.warn("Could not save chat history to sessionStorage:", e);
    }
  }, [conversation]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, loading]);

  const getHeaders = () => {
    return idToken ? { Authorization: `Bearer ${idToken}` } : {};
  };

  // ── Send a user text query ──────────────────────────────────────────────────
  const sendQuery = async (queryText, skipUserBubble = false) => {
    if (!queryText.trim() || loading) return;

    if (!skipUserBubble) {
      setConversation(prev => [...prev, {
        type: 'user',
        content: queryText,
        timestamp: new Date().toISOString()
      }]);
    }

    setLoading(true);

    try {
      const endpoint = smartMode ? '/ask-smart' : '/ask';

      const history = conversation.slice(-10).map(msg => ({
        type: msg.type,
        content: msg.content
      }));

      const payload = {
        query: queryText.trim(),
        documentIds: activeDocIds.length > 0 ? activeDocIds : undefined,
        returnStructured: false,
        history,
        userProfile: userProfile || undefined
      };

      const res = await axios.post(`http://localhost:3001${endpoint}`, payload, {
        headers: getHeaders()
      });

      const aiMessage = {
        type: 'ai',
        content: res.data.response,
        followUpQuestions: res.data.followUpQuestions || [],
        answered: false,
        confidence: res.data.confidence,
        sourceChunks: res.data.sourceChunks,
        parsedQuery: res.data.parsedQuery,
        metadata: res.data.metadata,
        timestamp: new Date().toISOString()
      };

      setConversation(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error("AI Assistant error:", error);
      setConversation(prev => [...prev, {
        type: 'ai',
        content: error.response?.data?.error || "I'm having trouble processing your request. Please try again.",
        followUpQuestions: [],
        answered: true,
        isError: true,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    const q = query;
    setQuery("");
    await sendQuery(q);
  };

  // ── Handle clarification form submission ────────────────────────────────────
  const handleClarificationSubmit = async (aiMsgIndex, bundledAnswers) => {
    setConversation(prev => prev.map((msg, i) =>
      i === aiMsgIndex ? { ...msg, answered: true } : msg
    ));

    const userMessage = {
      type: 'user',
      content: bundledAnswers,
      timestamp: new Date().toISOString()
    };
    setConversation(prev => [...prev, userMessage]);

    await sendQuery(bundledAnswers, true);
  };

  // ── Quick decision (structured mode) ───────────────────────────────────────
  const getQuickDecision = async (quickQuery) => {
    if (!quickQuery.trim() || documents.length === 0) return;

    setLoading(true);
    try {
      const history = conversation.slice(-10).map(msg => ({
        type: msg.type,
        content: msg.content
      }));

      const res = await axios.post("http://localhost:3001/ask-smart", {
        query: quickQuery.trim(),
        documentIds: activeDocIds.length > 0 ? activeDocIds : undefined,
        returnStructured: true,
        history,
        userProfile: userProfile || undefined
      }, {
        headers: getHeaders()
      });

      const decision = res.data.decision;
      const parsed = res.data.parsedQuery;

      const quickMessage = {
        type: 'ai',
        content: formatQuickDecision(decision, parsed),
        followUpQuestions: decision?.decision?.followUpQuestions || [],
        answered: false,
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
    const status = decision?.decision?.status || 'UNKNOWN';
    const summary = decision?.decision?.summary || 'Analysis completed';
    const followUps = decision?.decision?.followUpQuestions || [];
    const missing = decision?.decision?.missingInfo || [];

    if (status === 'NEEDS_CLARIFICATION' || status === 'INSUFFICIENT_INFO') {
      const questionsText = followUps.length > 0
        ? followUps.map((q, idx) => `${idx + 1}. ${q}`).join('\n')
        : missing.length > 0
        ? missing.map((m, idx) => `${idx + 1}. What is the ${m}?`).join('\n')
        : '1. How long has your insurance policy been active?\n2. Are you seeking treatment at a network hospital?';

      return `## Details Needed\n\n- **Summary:** ${summary}\n\n## Clarifying Questions\n${questionsText}\n\n- Simply reply below with your answers to finalize the assessment.`;
    }

    if (status === 'ERROR') {
      return `## Analysis Error\n\n- ${summary}\n\n- Please check your connection or try again.`;
    }

    let statusEmoji = '❓';
    switch (status) {
      case 'COVERED': statusEmoji = '✅'; break;
      case 'NOT_COVERED': statusEmoji = '❌'; break;
      case 'PARTIALLY_COVERED': statusEmoji = '⚠️'; break;
      default: statusEmoji = 'ℹ️';
    }

    return `## ${statusEmoji} ${status.replace(/_/g, ' ')}\n\n- **Summary:** ${summary}\n\n## Coverage Details\n- **Eligible:** ${decision?.coverage?.eligible ? 'Yes' : 'No'}\n- **Coverage:** ${decision?.coverage?.coveragePercentage ?? 'Not specified'}%\n- **Max Amount:** ${decision?.coverage?.maxAmount || 'Not specified'}\n\n## Requirements\n${decision?.requirements?.documentsNeeded?.map(d => `- ${d}`).join('\n') || '- Check policy terms'}\n\n## Next Steps\n${decision?.nextActions?.immediate?.map(a => `- ${a}`).join('\n') || '- Consult with insurance provider'}`;
  };

  const clearConversation = () => {
    try {
      sessionStorage.removeItem("finesse_chat_history");
    } catch (e) {
      console.warn("Could not remove chat history from sessionStorage:", e);
    }
    setConversation([]);
  };

  const quickQueries = [
    "46M, knee surgery, Pune, 3-month policy",
    "28F, maternity, Mumbai, 18-month policy",
    "35M, heart surgery, Delhi, 2-year policy",
    "50F, diabetes treatment, Bangalore, 6-month policy"
  ];

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5 text-white" />
            </div>
            Smart AI Assistant
          </h2>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
              Query Intelligence Active
            </span>
            {userProfile?.city && (
              <span className="text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Profile Loaded: {userProfile.city} ({userProfile.age || 'Age --'} yrs)
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {conversation.length > 0 && (
            <Button
              onClick={clearConversation}
              variant="outline"
              size="sm"
              className="text-red-600 dark:text-red-400 border-red-300 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/40"
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              Clear Chat
            </Button>
          )}
        </div>
      </div>

      {/* Document Selector & Smart Mode Bar */}
      <Card className="mb-6 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Active Document Selector */}
          <div className="relative">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowDocPicker(!showDocPicker)}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors border border-gray-300 dark:border-gray-600"
              >
                <Filter className="w-3.5 h-3.5 text-primary-500" />
                <span>
                  {activeDocIds.length === 0 
                    ? `Searching All Documents (${documents.length})` 
                    : `Searching ${activeDocIds.length} Selected Document(s)`}
                </span>
              </button>

              <Link
                to="/documents"
                className="inline-flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium ml-1"
              >
                <Plus className="w-3 h-3" />
                Manage Documents
              </Link>
            </div>

            {/* Document Picker Dropdown Popover */}
            {showDocPicker && (
              <div 
                className="absolute left-0 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-3 z-30 animate-fade-in"
                onMouseLeave={() => setShowDocPicker(false)}
              >
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-700 mb-2">
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">Query Scope</span>
                  <div className="space-x-1">
                    <button
                      onClick={selectAllDocs}
                      className="text-[11px] text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      All
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={clearActiveDocs}
                      className="text-[11px] text-gray-500 dark:text-gray-400 hover:underline"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {documents.length > 0 ? (
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {documents.map(doc => {
                      const selected = activeDocIds.includes(doc.id);
                      return (
                        <label
                          key={doc.id}
                          className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer text-xs text-gray-800 dark:text-gray-200"
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleActiveDocId(doc.id)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="truncate flex-1">{doc.fileName}</span>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 dark:text-gray-400 py-2 text-center">
                    No documents uploaded yet.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Smart Mode Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">Smart Reasoning</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={smartMode}
                onChange={(e) => setSmartMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* Quick Queries (shown only on empty conversation) */}
      {documents.length > 0 && conversation.length === 0 && (
        <Card className="mb-6 p-5 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-gray-800 dark:to-gray-800/80 border border-blue-100 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            🚀 Try Quick Analysis Queries
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
            Click any query below to see how Finesse processes eligibility against your policy documents:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {quickQueries.map((quickQuery, i) => (
              <button
                key={i}
                onClick={() => getQuickDecision(quickQuery)}
                disabled={loading}
                className="text-left p-3 bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-400 dark:hover:border-primary-500 transition-all text-xs text-gray-800 dark:text-gray-200 disabled:opacity-50"
              >
                "{quickQuery}"
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Chat Messages Interface */}
      <Card className="mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="h-[520px] overflow-y-auto p-4 sm:p-6 space-y-6">
          {conversation.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
              <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mb-3">
                <Bot className="w-7 h-7 text-gray-400 dark:text-gray-300" />
              </div>
              <p className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">
                Finesse Policy AI Ready
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm">
                Ask anything about your coverage, procedures, exclusions, or waiting periods.
              </p>
            </div>
          )}

          <AnimatePresence>
            {conversation.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white ${
                  message.type === 'user'
                    ? 'bg-primary-600'
                    : 'bg-gradient-to-br from-secondary-500 to-secondary-700'
                }`}>
                  {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`max-w-[85%] ${message.type === 'user' ? 'text-right' : ''}`}>
                  <div className={`rounded-2xl p-4 ${
                    message.type === 'user'
                      ? 'bg-primary-600 text-white text-sm shadow-sm'
                      : message.isError
                      ? 'bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
                      : message.isQuickDecision
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-900 border border-blue-200 dark:border-gray-700'
                      : 'bg-gray-50 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-700 shadow-sm'
                  }`}>
                    {message.type === 'user' ? (
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                    ) : (
                      <MarkdownContent content={message.content} />
                    )}

                    {/* Interactive Clarification Form */}
                    {message.type === 'ai' &&
                     !message.answered &&
                     (() => {
                       const validQs = (message.followUpQuestions || []).filter(q => 
                         typeof q === 'string' && 
                         q.trim().length > 6 && 
                         !q.trim().endsWith(':') &&
                         !/^(reasoning|requirements|next steps|documentation|action items|coverage details|unlimited care|waiting periods|documents needed)/i.test(q.trim())
                       );
                       return validQs.length > 0 ? (
                         <ClarificationForm
                           questions={validQs.slice(0, 3)}
                           disabled={loading}
                           onSubmit={(bundled) => handleClarificationSubmit(index, bundled)}
                         />
                       ) : null;
                     })()}

                    {/* Answered indicator */}
                    {message.type === 'ai' &&
                     message.answered &&
                     message.followUpQuestions?.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Answers submitted and synthesized
                      </div>
                    )}

                    {/* Confidence display */}
                    {message.type === 'ai' && message.confidence && !message.isError && (
                      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>
                          Confidence: <strong className="text-green-600 dark:text-green-400">{message.confidence.level} ({message.confidence.score}%)</strong>
                        </span>
                        <span>
                          Sources: {message.sourceChunks?.length || 0} chunks
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="text-[10px] text-gray-400 mt-1 px-1">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-secondary-500 to-secondary-700 rounded-full flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-300">
                    Finesse AI is analyzing documents & profile...
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Form */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50/50 dark:bg-gray-900/50">
          <form onSubmit={handleAskAI} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={
                  smartMode
                    ? "Try: '46M, knee surgery' or ask any insurance question..."
                    : "Ask anything about your policy documents..."
                }
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={loading}
                className="flex-1 px-4 py-2.5 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 dark:disabled:bg-gray-800"
              />

              <Button
                type="submit"
                disabled={!query.trim() || loading}
                loading={loading}
                size="md"
                className="px-5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-sm"
              >
                {!loading && <Send className="w-4 h-4" />}
                Ask
              </Button>
            </div>

            <div className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center justify-between px-1">
              <span>
                {activeDocIds.length > 0 
                  ? `Active filter: ${activeDocIds.length} document(s)` 
                  : `All ${documents.length} document(s) active`}
              </span>
              <span>Cloud & Profile Connected</span>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}

export default AIAssistant;
