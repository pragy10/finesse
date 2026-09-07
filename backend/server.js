require("dotenv").config();
const express = require("express");
const cors = require("cors");
const {
  register,
  httpRequestsTotal,
  httpRequestDuration,
  activeRequests,
} = require("./config/metrics");

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// ─── Metrics Middleware ───────────────────────────────────────────────────────
app.use((req, res, next) => {
  // Skip the /metrics endpoint itself to avoid self-measuring noise
  if (req.path === "/metrics") return next();

  activeRequests.inc();
  const end = httpRequestDuration.startTimer();

  res.on("finish", () => {
    const route = req.route ? req.baseUrl + req.route.path : req.path;
    const labels = { method: req.method, route, status: res.statusCode };
    httpRequestsTotal.inc(labels);
    end(labels);
    activeRequests.dec();
  });

  next();
});

// ─── Prometheus Metrics Endpoint ──────────────────────────────────────────────
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/", require("./routes/documents"));
app.use("/", require("./routes/profile"));
app.use("/", require("./routes/query"));
app.use("/", require("./routes/ask"));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`[✓] Backend running on http://localhost:${PORT}`);
  console.log(`[✓] Metrics available at http://localhost:${PORT}/metrics`);
  console.log(`[✓] Firebase Auth & Firestore DB connected`);
  console.log(`[✓] Supabase Cloud Storage active`);
  console.log(`[✓] AI Assistant ready with LLM integration`);
});
