// App constants
export const APP_NAME = 'Finesse';
export const APP_DESCRIPTION = 'AI-powered document analysis and reasoning platform';

// API endpoints
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-domain.com' 
  : 'http://localhost:3001';

// File upload constants
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_FILES = 10;
export const SUPPORTED_FILE_TYPES = ['.pdf', '.docx', '.jpg', '.jpeg', '.png', '.eml'];

// Features data
export const FEATURES = [
  {
    icon: 'FileText',
    title: "Multi-Format Support",
    description: "Upload PDFs, DOCX, images, and more. Our system extracts text from any document format with 99% accuracy.",
    benefits: ["PDF, DOCX, Images", "OCR Technology", "Batch Processing"]
  },
  {
    icon: 'Brain',
    title: "AI-Powered Analysis",
    description: "Advanced language models analyze your documents and provide intelligent insights powered by Google Gemini.",
    benefits: ["Google Gemini", "Context Understanding", "Smart Reasoning"]
  },
  {
    icon: 'Search',
    title: "Semantic Search",
    description: "Find information based on meaning, not just keywords. Ask questions in natural language.",
    benefits: ["Natural Language", "Vector Search", "Contextual Results"]
  },
  {
    icon: 'Shield',
    title: "Secure & Private",
    description: "Enterprise-grade encryption and privacy protection. No data retention after processing.",
    benefits: ["End-to-end Encryption", "Privacy First", "GDPR Compliant"]
  },
  {
    icon: 'Zap',
    title: "Lightning Fast",
    description: "Get instant results with sub-3 second response times and optimized processing.",
    benefits: ["< 3s Response", "Real-time Processing", "Optimized Pipeline"]
  },
  {
    icon: 'Globe',
    title: "Cloud-Powered",
    description: "Scalable infrastructure ensures reliable performance with 99.9% uptime guarantee.",
    benefits: ["99.9% Uptime", "Auto-scaling", "Global CDN"]
  }
];

// Stats data
export const STATS = [
  { number: "10K+", label: "Documents Processed", description: "Successfully analyzed and processed" },
  { number: "99.9%", label: "Accuracy Rate", description: "Precision in document analysis" },
  { number: "< 3s", label: "Average Response", description: "Lightning fast AI processing" },
  { number: "100%", label: "Secure Processing", description: "Enterprise-grade security" }
];

// How it works steps
export const HOW_IT_WORKS_STEPS = [
  {
    icon: 'Upload',
    title: "Upload Documents",
    description: "Drag and drop your files or browse to upload. Support for multiple formats with automatic detection.",
    details: ["Multiple file formats", "Batch upload support", "Automatic text extraction", "Error handling"]
  },
  {
    icon: 'Cpu',
    title: "AI Processing",
    description: "Our AI analyzes, chunks, and creates searchable embeddings from your content using advanced NLP.",
    details: ["Document parsing", "Smart chunking", "Vector embeddings", "Knowledge graph creation"]
  },
  {
    icon: 'MessageSquare',
    title: "Ask Questions",
    description: "Chat with your documents using natural language and get intelligent answers with source citations.",
    details: ["Natural language queries", "Contextual understanding", "Source citations", "Confidence scoring"]
  }
];

// Quick questions for AI assistant
export const QUICK_QUESTIONS = {
  general: [
    "What are the key points in my documents?",
    "Summarize my policy coverage",
    "What are the important terms and conditions?",
    "Are there any exclusions I should know about?"
  ],
  claim_analysis: [
    "Am I eligible for knee surgery coverage?",
    "What's covered for a 45M with diabetes?",
    "Can I claim for dental treatment after 6 months?",
    "Is maternity coverage available in Mumbai?"
  ],
  document_summary: [
    "Give me a summary of all uploaded documents",
    "What are the main topics covered?",
    "List all important dates and deadlines",
    "What are the key financial terms?"
  ]
};

// Utility functions
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getConfidenceColor = (level) => {
  const colors = {
    'Very High': 'text-green-600 bg-green-100',
    'High': 'text-green-500 bg-green-50', 
    'Medium': 'text-yellow-500 bg-yellow-50',
    'Low': 'text-red-500 bg-red-50',
    'Very Low': 'text-red-600 bg-red-100'
  };
  return colors[level] || 'text-gray-500 bg-gray-50';
};

export const extractUserProfile = (query) => {
  const profile = {};
  
  const ageMatch = query.match(/(\d{1,2})[MF]|\b(\d{1,2})\s*year/i);
  if (ageMatch) profile.age = ageMatch[1] || ageMatch[2];
  
  const locationMatch = query.match(/mumbai|delhi|bangalore|pune|chennai|kolkata|hyderabad|ahmedabad/i);
  if (locationMatch) profile.location = locationMatch[0];
  
  const durationMatch = query.match(/(\d+)\s*month|(\d+)\s*year.*policy/i);
  if (durationMatch) {
    profile.policyDuration = durationMatch[1] ? `${durationMatch[1]} months` : `${durationMatch[2]} years`;
  }
  
  return profile;
};
