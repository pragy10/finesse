const client = require("prom-client");

// Enable default Node.js metrics (CPU, memory, GC, event loop lag, etc.)
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// ─── HTTP Metrics ─────────────────────────────────────────────────────────────

const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
  registers: [register],
});

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status"],
  buckets: [0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register],
});

const activeRequests = new client.Gauge({
  name: "http_active_requests",
  help: "Number of currently in-flight HTTP requests",
  registers: [register],
});

// ─── AI / LLM Metrics ─────────────────────────────────────────────────────────

const aiQueriesTotal = new client.Counter({
  name: "ai_queries_total",
  help: "Total number of AI queries made",
  labelNames: ["type"], // 'basic' | 'smart'
  registers: [register],
});

const aiQueryDuration = new client.Histogram({
  name: "ai_query_duration_seconds",
  help: "Duration of AI LLM queries in seconds",
  labelNames: ["type"],
  buckets: [0.5, 1, 2, 5, 10, 20, 30],
  registers: [register],
});

const aiQueryErrors = new client.Counter({
  name: "ai_query_errors_total",
  help: "Total number of AI query errors",
  labelNames: ["type"],
  registers: [register],
});

// ─── Document Metrics ─────────────────────────────────────────────────────────

const documentsUploadedTotal = new client.Counter({
  name: "documents_uploaded_total",
  help: "Total number of documents successfully uploaded",
  registers: [register],
});

const documentsDeletedTotal = new client.Counter({
  name: "documents_deleted_total",
  help: "Total number of documents deleted",
  registers: [register],
});

module.exports = {
  register,
  httpRequestsTotal,
  httpRequestDuration,
  activeRequests,
  aiQueriesTotal,
  aiQueryDuration,
  aiQueryErrors,
  documentsUploadedTotal,
  documentsDeletedTotal,
};
