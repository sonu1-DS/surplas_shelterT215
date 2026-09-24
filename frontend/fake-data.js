// Fake data in the SAME shape as Person 1's API. Used only while USE_FAKE_DATA = true.
function hoursFromNow(h) {  // local time, no timezone, like "2026-09-24T18:00:00"
  const d = new Date(Date.now() + h * 3600000), p = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}
const FAKE_ORGS = [
  { id: 1, name: "Hope Shelter", address: "Malviya Nagar, Jaipur", lat: 26.8560, lng: 75.8130, capacity_portions: 60 },
  { id: 2, name: "Asha Kiran Food Bank", address: "Mansarovar, Jaipur", lat: 26.8500, lng: 75.7600, capacity_portions: 80 },
  { id: 3, name: "Seva Sadan", address: "Raja Park, Jaipur", lat: 26.9030, lng: 75.8330, capacity_portions: 40 },
  { id: 4, name: "Anna Daan Kendra", address: "Bani Park, Jaipur", lat: 26.9310, lng: 75.7930, capacity_portions: 50 },
  { id: 5, name: "Sahara Night Shelter", address: "Sindhi Camp, Jaipur", lat: 26.9195, lng: 75.7995, capacity_portions: 35 },
  { id: 6, name: "Jyoti Children's Home", address: "Vaishali Nagar, Jaipur", lat: 26.9100, lng: 75.7300, capacity_portions: 30 },
  { id: 7, name: "Karuna Community Kitchen", address: "Jagatpura, Jaipur", lat: 26.8270, lng: 75.8590, capacity_portions: 100 },
  { id: 8, name: "Amar Ashray Old-Age Home", address: "Amer Road, Jaipur", lat: 26.9535, lng: 75.8420, capacity_portions: 25 }
];
function fd(id, donor, food, qty, addr, lat, lng, hrs, status, orgId, km) {
  const org = FAKE_ORGS.find(o => o.id === orgId);
  return { id, donor_name: donor, food_description: food, quantity_portions: qty, pickup_address: addr, lat, lng,
    expires_at: hoursFromNow(hrs), status, matched_org_id: orgId, matched_org_name: org ? org.name : null,
    distance_km: km, created_at: hoursFromNow(-1) };
}
const FAKE_DONATIONS = [
  fd(1, "Rajwada Restaurant", "Dal makhani, jeera rice and roti", 25, "C-Scheme, Jaipur", 26.9030, 75.7970, 3, "matched", 5, 1.8),
  fd(2, "Bikaner Sweets & Snacks", "Samosa and kachori", 12, "MI Road, Jaipur", 26.9160, 75.8020, 1.5, "accepted", 4, 1.9),
  fd(3, "Grand Banquet Hall", "Wedding buffet leftovers", 60, "Malviya Nagar, Jaipur", 26.8620, 75.8080, 4, "picked_up", 1, 0.8),
  fd(4, "Sunrise University Canteen", "Veg biryani and raita", 30, "Jagatpura Road, Jaipur", 26.8420, 75.8480, 5, "matched", 7, 2.0),
  fd(5, "FreshMart Grocers", "Packed sandwiches and fruit", 18, "Vaishali Nagar, Jaipur", 26.9130, 75.7420, 0.4, "accepted", 6, 1.2),
  fd(6, "Grand Banquet Hall", "Large event surplus", 150, "Malviya Nagar, Jaipur", 26.8620, 75.8080, 4, "posted", null, null),
  fd(7, "Hotel Marigold Kitchen", "Buffet leftovers", 20, "Civil Lines, Jaipur", 26.9010, 75.7860, -22, "delivered", 5, 2.5),
  fd(8, "Rajwada Restaurant", "Curry, rice and naan", 35, "C-Scheme, Jaipur", 26.9030, 75.7970, -16, "delivered", 1, 5.4)
];
const FAKE_STATS = {
  total_meals_saved: 120,
  active_donations: FAKE_DONATIONS.filter(d => ["matched", "accepted", "picked_up"].includes(d.status)).length,
  total_orgs: FAKE_ORGS.length,
  co2_saved_kg: 120 * KG_PER_PORTION * CO2E_PER_KG
};
