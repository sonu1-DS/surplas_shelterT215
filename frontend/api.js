// ===== SETTINGS =====
const USE_FAKE = true;                    // set to false when Person 1's backend is live
const BASE = "http://localhost:5000";     // Person 1's Flask server (CORS is on)

// Status names must match Person 1's backend EXACTLY. Always use S.xxx, never type the string by hand.
const S = {MATCHED:"matched", ACCEPTED:"accepted", PICKED_UP:"picked_up", DELIVERED:"delivered", REJECTED:"rejected"};

// ===== FAKE MODE (works without backend) =====
const FAKE_ORGS = [
  {id:1,name:"Hope Shelter",lat:26.9124,lng:75.7873,capacity_portions:60},
  {id:2,name:"Annapurna Food Bank",lat:26.8500,lng:75.8000,capacity_portions:120},
  {id:3,name:"Seva Sadan",lat:26.9500,lng:75.7500,capacity_portions:30}
];
const load = () => JSON.parse(localStorage.getItem("donations") || "[]");
const save = d => localStorage.setItem("donations", JSON.stringify(d));
function km(a,b,c,d){const r=x=>x*Math.PI/180,h=Math.sin(r(c-a)/2)**2+Math.cos(r(a))*Math.cos(r(c))*Math.sin(r(d-b)/2)**2;return 12742*Math.asin(Math.sqrt(h));}

// ===== API FUNCTIONS (the only place that talks to the backend) =====
async function call(path, opts){
  const r = await fetch(BASE+path, opts);
  let data = {}; try{ data = await r.json(); }catch(e){}
  if(!r.ok) throw new Error(data.error || "Something went wrong");
  return data;
}
const post = body => ({method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body)});

async function getOrgs(){                 // needs GET /api/orgs from Person 1 (not in contract yet!)
  return USE_FAKE ? FAKE_ORGS : call("/api/orgs");
}
async function postDonation(d){
  if(USE_FAKE){
    const ok = FAKE_ORGS.filter(o => o.capacity_portions >= d.quantity_portions)
      .map(o => ({o, dist: km(d.lat,d.lng,o.lat,o.lng)})).sort((a,b)=>a.dist-b.dist)[0];
    const rec = {...d, id:Date.now(), created_at:localISO(new Date()),
      status: ok ? S.MATCHED : "posted", matched_org_id: ok?ok.o.id:null,
      matched_org_name: ok?ok.o.name:null, distance_km: ok?+ok.dist.toFixed(1):null};
    save([...load(), rec]); return rec;
  }
  return call("/api/donations", post(d));
}
async function getDonations(orgId){       // orgId is optional
  if(USE_FAKE) return load().filter(d => !orgId || d.matched_org_id == orgId);
  return call("/api/donations" + (orgId ? "?org_id="+orgId : ""));
}
async function setStatus(id, status){
  if(USE_FAKE){ save(load().map(d => d.id===id ? {...d,status} : d)); return {id,status}; }
  return call(`/api/donations/${id}/status`, post({status}));
}

// ===== HELPERS =====
function localISO(t){ const p=n=>String(n).padStart(2,"0");   // "2026-09-24T18:00:00", no Z, like Person 1's example
  return `${t.getFullYear()}-${p(t.getMonth()+1)}-${p(t.getDate())}T${p(t.getHours())}:${p(t.getMinutes())}:${p(t.getSeconds())}`; }
function timeLeft(iso){
  const m = Math.round((new Date(iso) - Date.now())/60000);
  if(m <= 0) return {text:"Expired", cls:"bad"};
  return {text: m>=60 ? `${Math.floor(m/60)}h ${m%60}m left` : `${m}m left`, cls: m<45?"bad":m<120?"warn":""};
}
function navbar(active){
  const l=[["donor.html","Donate food"],["shelter.html","Shelter"],["driver.html","Driver"],["dashboard.html","Impact"]];
  document.write(`<nav><b>Surplus-to-Shelter</b>${l.map(([h,t])=>`<a href="${h}" class="${h===active?"on":""}">${t}</a>`).join("")}</nav>`);
}
