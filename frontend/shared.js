// Shared helpers. Person 2 can use these on their pages too:
// load config.js, fake-data.js, then shared.js (in that order).

// ---- Status badges ----
const STATUS_INFO = {
  posted:    { label: "Waiting for match", cls: "grey",   color: "#8f9b94" },
  matched:   { label: "Matched",           cls: "blue",   color: "#2f6fdb" },
  accepted:  { label: "Accepted",          cls: "purple", color: "#7b4fd1" },
  picked_up: { label: "Picked up",         cls: "orange", color: "#e9a23b" },
  delivered: { label: "Delivered",         cls: "green",  color: "#2e9b57" },
  rejected:  { label: "Rejected",          cls: "red",    color: "#c8402f" },
  expired:   { label: "Expired",           cls: "grey",   color: "#8f9b94" }
};
function getStatusBadge(status) {
  if (!STATUS_INFO[status]) console.warn("Unknown status string:", status); // catches typo mismatches early
  const s = STATUS_INFO[status] || { label: status, cls: "grey" };
  return `<span class="badge ${s.cls}">${s.label}</span>`;
}

// ---- Expiry countdown: green > 2h, yellow 30m-2h, red < 30m, grey expired ----
function expiryInfo(expires_at) {
  const mins = Math.round((new Date(expires_at) - Date.now()) / 60000);
  if (mins <= 0) return { cls: "grey", text: "Expired" };
  const text = mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m left` : `${mins}m left`;
  return { cls: mins > 120 ? "green" : mins >= 30 ? "yellow" : "red", text };
}
function getExpiryBadge(expires_at) {
  const i = expiryInfo(expires_at);
  return `<span class="badge ${i.cls}" data-expires="${expires_at}">${i.text}</span>`;
}
function startExpiryTimers() {  // call once per page; keeps every badge ticking
  setInterval(() => document.querySelectorAll("[data-expires]").forEach(el => {
    const i = expiryInfo(el.dataset.expires);
    el.className = "badge " + i.cls;
    el.textContent = i.text;
  }), 15000);
}

// ---- Simulated notification popup: showToast("SMS sent to Hope Shelter") ----
function showToast(message) {
  let box = document.getElementById("toast-box");
  if (!box) { box = document.createElement("div"); box.id = "toast-box"; document.body.appendChild(box); }
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = message;
  box.appendChild(t);
  setTimeout(() => t.remove(), 4500);
}

// ---- Safety: always wrap user-typed text in this before putting it in HTML ----
function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// ---- Data layer: fake data now, real API later (just flip USE_FAKE_DATA in config.js) ----
async function apiGet(path, fake) {
  if (USE_FAKE_DATA) return fake;
  const res = await fetch(API_BASE + path);
  if (!res.ok) throw new Error("API error " + res.status);
  return res.json();
}
const getDonations = () => apiGet("/api/donations", FAKE_DONATIONS);
const getOrgs = () => apiGet("/api/orgs", FAKE_ORGS);
const getStats = () => apiGet("/api/stats", FAKE_STATS);
