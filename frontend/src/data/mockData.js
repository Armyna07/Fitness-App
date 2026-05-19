export const mockChallenges = [
  { id: 1, name: "10K Steps Daily", type: "steps", goal: 10000, unit: "steps", status: "active", rank: 2, daysLeft: 14, streak: 7, progress: 7800, start: "May 1", end: "May 31", participants: 24, privacy: "public", description: "Walk 10,000 steps every day for the month of May." },
  { id: 2, name: "Morning Workout Grind", type: "workout", goal: 1, unit: "session", status: "active", rank: 1, daysLeft: 6, streak: 5, progress: 1, start: "May 12", end: "May 18", participants: 11, privacy: "private", description: "Log at least one workout session every morning." },
  { id: 3, name: "30-Day Yoga Flow", type: "custom", goal: 20, unit: "min", status: "upcoming", rank: null, daysLeft: 30, streak: 0, progress: 0, start: "Jun 1", end: "Jun 30", participants: 8, privacy: "public", description: "20 minutes of yoga every day for 30 days." },
  { id: 4, name: "February Run Club", type: "steps", goal: 5000, unit: "steps", status: "completed", rank: 3, daysLeft: 0, streak: 12, progress: 5000, start: "Feb 1", end: "Feb 28", participants: 30, privacy: "public", description: "Daily 5K steps through February." },
];

export const mockLeaderboard = [
  { rank: 1, name: "Alex K.", total: 145200, streak: 14, today: true, me: false },
  { rank: 2, name: "Maryam S.", total: 132900, streak: 7, today: true, me: true },
  { rank: 3, name: "Jordan L.", total: 128400, streak: 9, today: false, me: false },
  { rank: 4, name: "Sam T.", total: 119000, streak: 5, today: true, me: false },
  { rank: 5, name: "Chris P.", total: 107300, streak: 3, today: false, me: false },
  { rank: 6, name: "Rina V.", total: 98500, streak: 6, today: true, me: false },
];

export const heatmapData = Array.from({ length: 28 }, (_, i) => ({
  day: i + 1,
  hit: [0,1,1,1,0,1,1,1,1,1,0,0,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0][i],
  today: i === 16,
}));
