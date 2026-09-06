import React, { useState } from "react";
import axios from "axios";
import { useDocuments } from "../context/DocumentContext";
import { useAuth } from "../context/AuthContext";
import { 
  FileText, 
  Upload, 
  Trash2, 
  ExternalLink, 
  CheckCircle, 
  Search, 
  Plus, 
  X, 
  Cloud, 
  Database, 
  AlertTriangle 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { formatFileSize } from "../utils/constants";

function DocumentsPage() {
  const { documents, loading, fetchDocuments, deleteDocument, clearAllDocuments, activeDocIds, toggleActiveDocId } = useDocuments();
  const { idToken } = useAuth();

  const [files, setFiles] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
    setUploadMsg("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) {
      setFiles(e.dataTransfer.files);
      setUploadMsg("");
    }
  };

  const handleUpload = async () => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadMsg("Uploading to Supabase Storage & indexing with AI...");

    try {
      const formData = new FormData();
      Array.from(files).forEach(f => formData.append("files", f));

      const res = await axios.post("http://localhost:3001/documents/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${idToken}`
        }
      });

      const successCount = res.data.processedFiles?.filter(f => f.status === "success").length || 0;
      setUploadMsg(`✅ Successfully stored and indexed ${successCount} document(s) in Supabase!`);
      setFiles(null);
      await fetchDocuments();
    } catch (err) {
      console.error("Upload error:", err);
      setUploadMsg(`❌ Upload failed: ${err.response?.data?.error || err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId, fileName) => {
    if (!window.confirm(`Are you sure you want to delete "${fileName}"? This will permanently remove it from Supabase Storage and Qdrant.`)) {
      return;
    }

    try {
      setDeletingId(docId);
      await deleteDocument(docId);
    } catch (err) {
      alert("Failed to delete document: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("⚠️ Are you sure you want to delete ALL documents? This action cannot be undone.")) {
      return;
    }

    try {
      await clearAllDocuments();
    } catch (err) {
      alert("Failed to clear documents: " + err.message);
    }
  };

  const filteredDocs = documents.filter(doc => 
    doc.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Page header banner */}
      <div className="bg-primary-900 dark:bg-primary-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-white/10 rounded-xl">
                <Cloud className="w-7 h-7 text-secondary-400" />
              </div>
              <div>
                <h1 className="font-serif text-2xl md:text-3xl text-white mb-1">
                  Document Storage & Management
                </h1>
                <p className="text-primary-200 text-sm">
                  Uploaded files persist in your cloud storage (Supabase) and remain accessible across browser sessions.
                </p>
              </div>
            </div>

            {documents.length > 0 && (
              <Button
                onClick={handleClearAll}
                variant="outline"
                size="sm"
                className="text-red-300 border-red-400/40 hover:bg-red-500/20 hover:text-white"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Documents
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 relative z-10 pb-16">
        {/* Cloud Status Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Total Documents</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">{documents.length}</div>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary-100 dark:bg-secondary-950/60 text-secondary-700 dark:text-secondary-300 rounded-xl flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Indexed Vectors</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">
                {documents.reduce((acc, d) => acc + (d.chunkCount || 0), 0)} chunks
              </div>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400 rounded-xl flex items-center justify-center">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Storage Backend</div>
              <div className="text-sm font-semibold text-green-600 dark:text-green-400">Supabase Cloud Active</div>
            </div>
          </div>
        </div>

      {/* Upload Box */}
      <Card className="p-6 mb-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Upload className="w-5 h-5 text-primary-500" />
          Upload New Documents
        </h2>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById("doc-file-input").click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            dragOver 
              ? "border-primary-500 bg-primary-50/50 dark:bg-primary-950/20" 
              : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/40 hover:border-primary-400"
          }`}
        >
          <input
            type="file"
            id="doc-file-input"
            multiple
            accept=".pdf,.docx,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
          />
          <Upload className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            Click to browse or drag and drop documents here
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Supported: PDF, DOCX, PNG, JPG (up to 25MB)
          </p>
        </div>

        {/* Selected files preview */}
        {files && files.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Ready to upload ({files.length} file{files.length > 1 ? 's' : ''}):
            </div>
            <div className="space-y-1 mb-4">
              {Array.from(files).map((f, i) => (
                <div key={i} className="text-xs text-gray-600 dark:text-gray-400 flex items-center justify-between">
                  <span>📄 {f.name}</span>
                  <span>{formatFileSize(f.size)}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleUpload}
                loading={uploading}
                size="sm"
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium"
              >
                Start Cloud Upload
              </Button>
              <Button
                onClick={() => setFiles(null)}
                variant="ghost"
                size="sm"
                className="text-gray-600 dark:text-gray-400"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Upload status message */}
        {uploadMsg && (
          <div className="mt-4 text-sm font-medium text-gray-800 dark:text-gray-200">
            {uploadMsg}
          </div>
        )}
      </Card>

      {/* Document Library */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-secondary-500" />
            Your Documents ({documents.length})
          </h2>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Document Grid */}
        {filteredDocs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocs.map((doc) => {
              const isActive = activeDocIds.includes(doc.id);
              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-5 rounded-xl border transition-all bg-white dark:bg-gray-800 ${
                    isActive 
                      ? "border-primary-500 shadow-md ring-1 ring-primary-500" 
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                          {doc.fileName}
                        </h3>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 space-x-2">
                          <span>{doc.chunkCount || 0} chunks</span>
                          <span>•</span>
                          <span>{doc.fileSize ? formatFileSize(doc.fileSize) : "Document"}</span>
                          <span>•</span>
                          <span>{new Date(doc.uploadTime).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleActiveDocId(doc.id)}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                        isActive 
                          ? "bg-primary-500 text-white" 
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      {isActive ? "✓ Querying" : "+ Query in AI"}
                    </button>
                  </div>

                  {/* Card Actions */}
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    {doc.fileUrl ? (
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        View in Supabase
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">No cloud link</span>
                    )}

                    <button
                      onClick={() => handleDelete(doc.id, doc.fileName)}
                      disabled={deletingId === doc.id}
                      className="inline-flex items-center gap-1 text-xs text-red-600 dark:text-red-400 hover:text-red-700 font-medium disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {deletingId === doc.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <Card className="p-12 text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <Cloud className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">
              No documents found
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
              Upload your policy wording or insurance papers above to begin asking questions and verifying claim eligibility.
            </p>
          </Card>
        )}
      </div>
      </div>
    </div>
  );
}

export default DocumentsPage;
