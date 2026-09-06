require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Mount Routes
app.use("/", require("./routes/documents"));
app.use("/", require("./routes/profile"));
app.use("/", require("./routes/query"));
app.use("/", require("./routes/ask"));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`[✓] Backend running on http://localhost:${PORT}`);
  console.log(`[✓] Firebase Auth & Firestore DB connected`);
  console.log(`[✓] Supabase Cloud Storage active`);
  console.log(`[✓] AI Assistant ready with LLM integration`);
});
