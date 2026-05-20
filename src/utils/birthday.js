// src/utils/birthday.js

/**
 * Calculate days until next birthday (ignores year)
 */
export function calculateDaysUntilBirthday(birthday) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const bday = new Date(birthday);
  const month = bday.getMonth(); // 0-indexed
  const day = bday.getDate();

  let nextBirthday = new Date(today.getFullYear(), month, day);
  nextBirthday.setHours(0, 0, 0, 0);

  if (nextBirthday < today) {
    nextBirthday = new Date(today.getFullYear() + 1, month, day);
  }

  const diffMs = nextBirthday - today;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Check if birthday is today
 */
export function isBirthdayToday(birthday) {
  const today = new Date();
  const bday = new Date(birthday);
  return (
    today.getMonth() === bday.getMonth() &&
    today.getDate() === bday.getDate()
  );
}

/**
 * Calculate age from birthday
 */
export function calculateAge(birthday) {
  const today = new Date();
  const bday = new Date(birthday);
  let age = today.getFullYear() - bday.getFullYear();
  const m = today.getMonth() - bday.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < bday.getDate())) {
    age--;
  }
  return age;
}

/**
 * Format birthday as "20 May"
 */
export function formatBirthdayDate(birthday) {
  const bday = new Date(birthday);
  return bday.toLocaleDateString("en-IN", { day: "numeric", month: "long" });
}

/**
 * Generate a random 6-char invite code
 */
export function generateInviteCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Sort members by upcoming birthday (closest first, today first)
 */
export function sortMembersByUpcomingBirthday(members) {
  return [...members].sort((a, b) => {
    const daysA = calculateDaysUntilBirthday(a.birthday);
    const daysB = calculateDaysUntilBirthday(b.birthday);
    return daysA - daysB;
  });
}

/**
 * Get status label for countdown
 */
export function getBirthdayStatus(birthday) {
  const days = calculateDaysUntilBirthday(birthday);
  if (days === 0) return { label: "Today 🎉", color: "text-yellow-500", urgent: true };
  if (days === 1) return { label: "Tomorrow 🌟", color: "text-orange-400", urgent: false };
  if (days <= 7) return { label: `In ${days} days`, color: "text-pink-400", urgent: false };
  if (days <= 30) return { label: "This month", color: "text-purple-400", urgent: false };
  return { label: `In ${days} days`, color: "text-slate-400", urgent: false };
}

/**
 * Random website-generated birthday wish
 */
const WISH_TEMPLATES = [
  (name) => `Happy Birthday ${name}! 🎂 May your day be filled with cake, laughter, and unforgettable memories.`,
  (name) => `${name} has officially leveled up today! 🎮 Wishing you happiness, success, and unlimited good vibes.`,
  (name) => `Today is all about ${name}. ✨ May this year bring new adventures, great memories, and lots of happiness.`,
  (name) => `Happy Birthday ${name}! 🥳 Your group is celebrating you today — you deserve all the love!`,
  (name) => `${name}, another year of being absolutely amazing! 🌟 Here's to an incredible year ahead.`,
  (name) => `Wishing the happiest of birthdays to ${name}! 🎈 May every moment of today feel magical.`,
  (name) => `${name}, today the universe celebrates YOU! 🌙 May your birthday be as wonderful as you are.`,
];

export function getRandomWebsiteWish(name) {
  const template = WISH_TEMPLATES[Math.floor(Math.random() * WISH_TEMPLATES.length)];
  return template(name);
}
