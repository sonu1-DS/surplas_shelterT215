// Shared settings. Change things here, in ONE place.
const API_BASE = "http://localhost:5000";   // Person 1's Flask server
const USE_FAKE_DATA = true;                 // set to false once Person 1's API is live
const KG_PER_PORTION = 0.4;                 // assumption: 1 portion = 1 meal = about 0.4 kg
const CO2E_PER_KG = 2.5;                    // assumption: about 2.5 kg CO2e avoided per kg of food
const MAP_CENTER = [26.9124, 75.7873];      // Jaipur
