# Monitoring Setup — finesse

Basic observability stack using **Prometheus** + **Grafana**. No Docker needed.

---

## What gets tracked

| Metric | Description |
|---|---|
| HTTP request rate | Requests per second per route |
| HTTP request duration | p50 and p95 latency per route |
| AI query latency | p50 and p95 for `/ask` and `/ask-smart` |
| AI query count | Total basic vs smart queries |
| Document uploads | Successful uploads over time |
| Document deletes | Deletes over time |
| Node.js memory | RSS + heap usage |
| Node.js internals | GC, event loop lag, CPU (built-in) |

---

## Step 1 — Download Prometheus

1. Go to https://prometheus.io/download/
2. Download the **Windows** zip (e.g. `prometheus-2.x.x.windows-amd64.zip`)
3. Unzip it anywhere, e.g. `C:\tools\prometheus\`

---

## Step 2 — Download Grafana

1. Go to https://grafana.com/grafana/download?platform=windows
2. Download the **standalone Windows zip** (not the installer)
3. Unzip it anywhere, e.g. `C:\tools\grafana\`

---

## Step 3 — Run everything

Open 3 terminals:

**Terminal 1 — Backend**
```bash
cd C:\Users\pragy\finesse\backend
npm run dev
```

**Terminal 2 — Prometheus**
```bash
cd C:\tools\prometheus
.\prometheus.exe --config.file=C:\Users\pragy\finesse\monitoring\prometheus.yml
```

**Terminal 3 — Grafana**
```bash
cd C:\tools\grafana\bin
.\grafana.exe server
```

---

## Step 4 — Open dashboards

- **Prometheus UI:** http://localhost:9090
  - Go to **Status → Targets** — `finesse-backend` should show **UP**
- **Grafana:** http://localhost:3000
  - Default login: `admin` / `admin`

---

## Step 5 — Connect Grafana to Prometheus

1. In Grafana: **Connections → Data Sources → Add data source**
2. Choose **Prometheus**
3. URL: `http://localhost:9090`
4. Click **Save & Test** — should say "Data source is working"

---

## Step 6 — Import the dashboard

1. In Grafana: **Dashboards → Import**
2. Click **Upload dashboard JSON file**
3. Select `C:\Users\pragy\finesse\monitoring\grafana-dashboard.json`
4. Select **Prometheus** as the data source
5. Click **Import**

You should see 6 panels with live data auto-refreshing every 15 seconds.

---

## Verify metrics are working

Visit http://localhost:5000/metrics in your browser while the backend is running.
You should see raw Prometheus text output starting with lines like:

```
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
...
```
