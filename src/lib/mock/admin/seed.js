/** Deterministic pseudo-random helpers so demo data is stable across reloads. */

export function createRandom(seed = 20260105) {
  let state = seed >>> 0;
  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const int = (min, max) => Math.floor(next() * (max - min + 1)) + min;
  const pick = (list) => list[Math.floor(next() * list.length)];
  const weighted = (entries) => {
    const total = entries.reduce((sum, [, w]) => sum + w, 0);
    let roll = next() * total;
    for (const [value, w] of entries) {
      roll -= w;
      if (roll <= 0) return value;
    }
    return entries[entries.length - 1][0];
  };
  const money = (min, max) => Math.round((next() * (max - min) + min) * 100) / 100;
  const chance = (p) => next() < p;
  return { next, int, pick, weighted, money, chance };
}

export const NOW = new Date("2026-10-05T09:00:00.000Z").getTime();
export const DAY = 86400000;

export function daysAgo(days, rand) {
  const jitter = rand ? rand.int(0, 86399) * 1000 : 0;
  return new Date(NOW - days * DAY - jitter).toISOString();
}

export function pad(value, size) {
  return String(value).padStart(size, "0");
}

export const firstNames = ["Ramesh", "Suresh", "Mahesh", "Rajesh", "Sunita", "Anita", "Vikas", "Pooja", "Arjun", "Kavita", "Manoj", "Deepak", "Neha", "Sanjay", "Priya", "Ravi", "Geeta", "Amit", "Rekha", "Santosh", "Lakhan", "Bhagwan", "Harish", "Kiran", "Mohan", "Savita", "Prakash", "Ajay", "Seema", "Dinesh"];
export const lastNames = ["Patel", "Yadav", "Sharma", "Verma", "Singh", "Kushwaha", "Patidar", "Choudhary", "Meena", "Rathore", "Jat", "Gupta", "Tiwari", "Dhakad", "Lodhi", "Mishra", "Thakur", "Pawar", "Rajput", "Sahu"];

export const places = [
  { city: "Bhopal", state: "Madhya Pradesh", pincode: "462042", zone: "within_state" },
  { city: "Indore", state: "Madhya Pradesh", pincode: "452001", zone: "within_state" },
  { city: "Vidisha", state: "Madhya Pradesh", pincode: "464001", zone: "within_state" },
  { city: "Sehore", state: "Madhya Pradesh", pincode: "466001", zone: "within_city" },
  { city: "Jaipur", state: "Rajasthan", pincode: "302001", zone: "rest_of_india" },
  { city: "Kota", state: "Rajasthan", pincode: "324001", zone: "rest_of_india" },
  { city: "Nagpur", state: "Maharashtra", pincode: "440001", zone: "rest_of_india" },
  { city: "Pune", state: "Maharashtra", pincode: "411001", zone: "metro_to_metro" },
  { city: "Lucknow", state: "Uttar Pradesh", pincode: "226001", zone: "rest_of_india" },
  { city: "Ahmedabad", state: "Gujarat", pincode: "380001", zone: "metro_to_metro" },
  { city: "Raipur", state: "Chhattisgarh", pincode: "492001", zone: "rest_of_india" },
  { city: "Guwahati", state: "Assam", pincode: "781001", zone: "north_east_jk" },
  { city: "Ludhiana", state: "Punjab", pincode: "141001", zone: "rest_of_india" },
  { city: "Patna", state: "Bihar", pincode: "800001", zone: "rest_of_india" },
];

export const couriers = ["NimbusPost", "Shiprocket", "Delhivery"];

export function personName(rand) {
  return `${rand.pick(firstNames)} ${rand.pick(lastNames)}`;
}

export function mobile(rand) {
  return `${rand.pick(["6", "7", "8", "9"])}${pad(rand.int(0, 999999999), 9)}`;
}

export function financialYear(iso) {
  const d = new Date(iso);
  const y = d.getUTCFullYear();
  const start = d.getUTCMonth() >= 3 ? y : y - 1;
  return `${String(start).slice(2)}${String(start + 1).slice(2)}`;
}
