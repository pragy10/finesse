
export const APP_NAME = 'Finesse';
export const APP_DESCRIPTION = 'Understand your insurance policy — in plain language.';

export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-domain.com' 
  : 'http://localhost:3001';

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_FILES = 10;
export const SUPPORTED_FILE_TYPES = ['.pdf', '.docx', '.jpg', '.jpeg', '.png', '.eml'];

export const FEATURES = [
  {
    icon: 'FileText',
    title: 'Policy Document Upload',
    description: 'Upload your health, life, motor, or home insurance policy as a PDF, DOCX, or scanned image. We handle the rest.',
    benefits: ['PDF, DOCX, Scanned images', 'Multi-policy support', 'Persistent cloud storage']
  },
  {
    icon: 'Search',
    title: 'Clause & Coverage Lookup',
    description: 'Find exactly what your policy says about any treatment, event, or situation — no more reading 80 pages of fine print.',
    benefits: ['Natural language search', 'Exact clause references', 'Highlighted matches']
  },
  {
    icon: 'Brain',
    title: 'Claim Eligibility Check',
    description: 'Ask whether a specific procedure, treatment, or event is covered under your policy. Get a clear yes, no, or conditional answer.',
    benefits: ['Condition-based analysis', 'Waiting period checks', 'Exclusion detection']
  },
  {
    icon: 'Shield',
    title: 'Privacy-First Processing',
    description: 'Your documents are encrypted and stored securely. We never share your policy data or personal details with third parties.',
    benefits: ['End-to-end encryption', 'No third-party sharing', 'Delete any time']
  },
  {
    icon: 'Zap',
    title: 'Plain Language Answers',
    description: 'Insurance policies are written for lawyers. Our AI translates them into simple, jargon-free answers you can actually use.',
    benefits: ['Jargon-free summaries', 'Section citations', 'Confidence indicators']
  },
  {
    icon: 'Globe',
    title: 'Multi-Policy Comparison',
    description: 'Upload more than one policy and compare coverage, waiting periods, and exclusions side by side.',
    benefits: ['Side-by-side comparison', 'Gap detection', 'Multiple insurers']
  }
];

export const STATS = [
  { number: '50+', label: 'Policy Clauses Decoded', description: 'Per document, on average' },
  { number: '≈ 15s', label: 'Average Response', description: 'From question to answer' },
  { number: '6+', label: 'Document Formats', description: 'PDF, DOCX, images & more' },
  { number: '100%', label: 'Private & Secure', description: 'Your data, your control' }
];

export const HOW_IT_WORKS_STEPS = [
  {
    icon: 'Upload',
    title: 'Upload Your Policy',
    description: 'Drop your insurance policy document — PDF, DOCX, or a scanned image. It is stored securely in your personal document vault.',
    details: ['Health, life, motor, home policies', 'Multiple formats supported', 'Persists until you delete it', 'Up to 10 documents']
  },
  {
    icon: 'Cpu',
    title: 'AI Reads the Fine Print',
    description: 'Our AI parses every clause, identifies exclusions, waiting periods, coverage limits, and key conditions — so you do not have to.',
    details: ['Clause-by-clause parsing', 'Exclusion & waiting period detection', 'Vector search index built', 'Ready in seconds']
  },
  {
    icon: 'MessageSquare',
    title: 'Ask in Plain English',
    description: 'Ask any question about your coverage. Get precise, plain-language answers with the exact policy section cited as proof.',
    details: ['Natural language questions', 'Exact clause citations', 'Claim eligibility checks', 'Multi-turn conversation']
  }
];

export const QUICK_QUESTIONS = {
  general: [
    'What does my policy cover overall?',
    'Summarise all exclusions in my policy',
    'What are the important terms and conditions?',
    'Are there any sub-limits I should know about?'
  ],
  claim_analysis: [
    'Am I eligible for knee surgery coverage?',
    'Is dental treatment covered after 6 months?',
    'What is the waiting period for maternity benefits?',
    'Does my policy cover day-care procedures?'
  ],
  document_summary: [
    'Give me a summary of all uploaded documents',
    'What are the main topics covered?',
    'List all important dates and deadlines',
    'What are the key financial limits in my policy?'
  ]
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getConfidenceColor = (level) => {
  const colors = {
    'Very High': 'text-green-700 bg-green-100',
    'High':      'text-green-600 bg-green-50',
    'Medium':    'text-amber-600 bg-amber-50',
    'Low':       'text-red-500 bg-red-50',
    'Very Low':  'text-red-600 bg-red-100'
  };
  return colors[level] || 'text-slate-500 bg-slate-50';
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
