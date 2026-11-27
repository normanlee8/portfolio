const TEAMS = {
  warriors: { name: "Warriors", abbr: "GSW", record: "33-36" },
  heat: { name: "Heat", abbr: "MIA", record: "38-30" },
  pistons: { name: "Pistons", abbr: "DET", record: "27-40" },
  wizards: { name: "Wizards", abbr: "WAS", record: "33-35" },
  thunder: { name: "Thunder", abbr: "OKC", record: "56-12" },
  magic: { name: "Magic", abbr: "ORL", record: "34-33" },
  pacers: { name: "Pacers", abbr: "IND", record: "13-56" },
  knicks: { name: "Knicks", abbr: "NYK", record: "42-26" },
  cavaliers: { name: "Cavaliers", abbr: "CLE", record: "27-42" },
  bucks: { name: "Bucks", abbr: "MIL", record: "30-36" },
  suns: { name: "Suns", abbr: "PHX", record: "36-32" },
  timberwolves: { name: "Timberwolves", abbr: "MIN", record: "27-40" },
  "76ers": { name: "76ers", abbr: "PHI", record: "21-45" },
  nuggets: { name: "Nuggets", abbr: "DEN", record: "41-26" },
  spurs: { name: "Spurs", abbr: "SAS", record: "40-29" },
  kings: { name: "Kings", abbr: "SAC", record: "19-48" },
  celtics: { name: "Celtics", abbr: "BOS", record: "41-27" },
  nets: { name: "Nets", abbr: "BKN", record: "34-34" },
  hornets: { name: "Hornets", abbr: "CHA", record: "27-40" },
  bulls: { name: "Bulls", abbr: "CHI", record: "42-25" },
  hawks: { name: "Hawks", abbr: "ATL", record: "42-24" },
  raptors: { name: "Raptors", abbr: "TOR", record: "34-33" },
  lakers: { name: "Lakers", abbr: "LAL", record: "51-18" },
  clippers: { name: "Clippers", abbr: "LAC", record: "12-56" },
  mavericks: { name: "Mavericks", abbr: "DAL", record: "36-30" },
  rockets: { name: "Rockets", abbr: "HOU", record: "47-20" },
  grizzlies: { name: "Grizzlies", abbr: "MEM", record: "27-41" },
  pelicans: { name: "Pelicans", abbr: "NOP", record: "22-47" },
  jazz: { name: "Jazz", abbr: "UTA", record: "36-31" },
  blazers: { name: "Trail Blazers", abbr: "POR", record: "24-42" },
};

const GAMES = {
  today: [
    { away: "warriors", home: "heat", time: "4:00 PM" },
    { away: "pistons", home: "wizards", time: "4:00 PM" },
    { away: "thunder", home: "magic", time: "4:30 PM" },
    { away: "nets", home: "celtics", time: "4:30 PM" },
    { away: "pacers", home: "knicks", time: "5:00 PM" },
    { away: "hornets", home: "hawks", time: "5:00 PM" },
    { away: "cavaliers", home: "bucks", time: "5:30 PM" },
    { away: "raptors", home: "bulls", time: "6:00 PM" },
    { away: "suns", home: "timberwolves", time: "6:30 PM" },
    { away: "76ers", home: "nuggets", time: "7:00 PM" },
    { away: "grizzlies", home: "pelicans", time: "7:00 PM" },
    { away: "rockets", home: "mavericks", time: "7:30 PM" },
    { away: "jazz", home: "blazers", time: "7:30 PM" },
    { away: "clippers", home: "lakers", time: "8:00 PM" },
    { away: "spurs", home: "kings", time: "8:30 PM" },
  ],
  // Grouped by day, most recent first
  previous: [
    {
      date: "Mon, Mar 16",
      games: [
        { away: "warriors", home: "heat", awayScore: 127, homeScore: 112 },
        { away: "pistons", home: "wizards", awayScore: 95, homeScore: 107 },
        { away: "thunder", home: "magic", awayScore: 131, homeScore: 104 },
        { away: "nets", home: "celtics", awayScore: 99, homeScore: 134 },
        { away: "pacers", home: "knicks", awayScore: 129, homeScore: 111 },
      ],
    },
    {
      date: "Thu, Mar 12",
      games: [
        { away: "hornets", home: "hawks", awayScore: 119, homeScore: 134 },
        { away: "cavaliers", home: "bucks", awayScore: 102, homeScore: 99 },
        { away: "raptors", home: "bulls", awayScore: 97, homeScore: 119 },
        { away: "suns", home: "timberwolves", awayScore: 119, homeScore: 114 },
        { away: "76ers", home: "nuggets", awayScore: 99, homeScore: 103 },
      ],
    },
    {
      date: "Sun, Mar 8",
      games: [
        { away: "grizzlies", home: "pelicans", awayScore: 131, homeScore: 125 },
        { away: "rockets", home: "mavericks", awayScore: 96, homeScore: 99, overtime: true },
        { away: "jazz", home: "blazers", awayScore: 103, homeScore: 106 },
        { away: "clippers", home: "lakers", awayScore: 95, homeScore: 99 },
        { away: "spurs", home: "kings", awayScore: 96, homeScore: 127 },
      ],
    },
  ],
  // Grouped by day, soonest first (today is Wed, Mar 18)
  upcoming: [
    {
      date: "Fri, Mar 20",
      games: [
        { away: "warriors", home: "heat", time: "4:00 PM" },
        { away: "pistons", home: "wizards", time: "4:00 PM" },
        { away: "thunder", home: "magic", time: "4:30 PM" },
        { away: "nets", home: "celtics", time: "4:30 PM" },
        { away: "pacers", home: "knicks", time: "5:00 PM" },
      ],
    },
    {
      date: "Sun, Mar 22",
      games: [
        { away: "hornets", home: "hawks", time: "5:00 PM" },
        { away: "cavaliers", home: "bucks", time: "5:30 PM" },
        { away: "raptors", home: "bulls", time: "6:00 PM" },
        { away: "suns", home: "timberwolves", time: "6:30 PM" },
        { away: "76ers", home: "nuggets", time: "7:00 PM" },
      ],
    },
    {
      date: "Tue, Mar 24",
      games: [
        { away: "grizzlies", home: "pelicans", time: "7:00 PM" },
        { away: "rockets", home: "mavericks", time: "7:30 PM" },
        { away: "jazz", home: "blazers", time: "7:30 PM" },
        { away: "clippers", home: "lakers", time: "8:00 PM" },
        { away: "spurs", home: "kings", time: "8:30 PM" },
      ],
    },
  ],
};

// Hand-written betting odds, keyed by "away@home"; every other matchup's odds
// are worked out from the teams' records (see gameOdds)
const GAME_ODDS = {
  "warriors@heat": {
    provider: "DraftKings",
    rows: [
      { team: "warriors", spread: ["+5.5", "-115"], total: ["O 236.5", "-112"], moneyline: "+130" },
      { team: "heat", spread: ["-5.5", "-105"], total: ["U 236.5", "-108"], moneyline: "-155" },
    ],
  },
};

// Games before the team pages' Previous Games lists begin (Series only)
const EARLIER_GAMES = [{ date: "Fri, Jan 2", away: "heat", home: "warriors", awayScore: 126, homeScore: 117 }];

// Team pages (opened from a team's logo in the game sheet). The Warriors' and
// Heat's are written by hand; every other team's is built from the league
// schedule (see buildTeamPage). Opponent records
// and spreads come from TEAMS; "home: true" is a home game ("vs"), else away ("@").
// Networks use short labels, as Apple Sports does (e.g. "Prime Video").
// Each theme colors the page's three-layer gradient (see .sheet-page--team):
//   glow   – radial glow at the top (RGB, used at 40% → 0%)
//   shade  – right-to-left darkening toward the left (RGB, used at 0% → 60%)
//   top / bottom – the top-to-bottom base gradient
const TEAM_PAGES = {
  warriors: {
    fullName: "Golden State Warriors",
    theme: { glow: "47, 95, 196", shade: "10, 21, 48", top: "#1d428a", bottom: "#0a1530" },
    next: { label: "Today", day: 18, opponent: "heat", home: false, time: "4:00 PM", network: "ESPN" },
    // Soonest first (after today's game)
    upcoming: [
      {
        month: "March",
        games: [
          { weekday: "Fri", day: 20, opponent: "heat", home: false, time: "4:00 PM", network: "ESPN" },
          { weekday: "Sat", day: 21, opponent: "hornets", home: false, time: "4:00 PM", network: "FDSN SE" },
          { weekday: "Mon", day: 23, opponent: "spurs", home: false, time: "6:30 PM", network: "NBA TV" },
          { weekday: "Wed", day: 25, opponent: "cavaliers", home: true, time: "5:00 PM", network: "Prime Video" },
          { weekday: "Fri", day: 27, opponent: "timberwolves", home: true, time: "3:30 PM", network: "NBC/Peacock" },
        ],
      },
      {
        month: "April",
        games: [
          { weekday: "Wed", day: 1, opponent: "kings", home: false, time: "4:00 PM", network: "NBCS Bay Area" },
          { weekday: "Thu", day: 2, opponent: "wizards", home: false, time: "4:30 PM", network: "Monumental" },
          { weekday: "Sat", day: 4, opponent: "lakers", home: true, time: "5:30 PM", network: "ABC" },
          { weekday: "Mon", day: 6, opponent: "nuggets", home: true, time: "7:00 PM", network: "NBCS Bay Area" },
          { weekday: "Wed", day: 8, opponent: "blazers", home: false, time: "7:00 PM", network: "NBA TV" },
          { weekday: "Fri", day: 10, opponent: "suns", home: true, time: "7:30 PM", network: "ESPN" },
          { weekday: "Sun", day: 12, opponent: "clippers", home: false, time: "12:30 PM", network: "ABC" },
        ],
      },
    ],
    // Newest first
    previous: [
      {
        month: "March",
        games: [
          { weekday: "Mon", day: 16, opponent: "heat", home: false, teamScore: 127, opponentScore: 112 },
          { weekday: "Sat", day: 14, opponent: "lakers", home: true, teamScore: 95, opponentScore: 104 },
          { weekday: "Thu", day: 12, opponent: "celtics", home: true, teamScore: 119, opponentScore: 110 },
          { weekday: "Tue", day: 10, opponent: "mavericks", home: false, teamScore: 87, opponentScore: 98 },
          { weekday: "Sun", day: 8, opponent: "bulls", home: true, teamScore: 114, opponentScore: 109 },
        ],
      },
      {
        month: "February",
        games: [
          { weekday: "Fri", day: 27, opponent: "kings", home: true, teamScore: 121, opponentScore: 104 },
          { weekday: "Wed", day: 25, opponent: "knicks", home: false, teamScore: 109, opponentScore: 118 },
          { weekday: "Mon", day: 23, opponent: "nets", home: false, teamScore: 99, opponentScore: 91 },
          { weekday: "Sat", day: 21, opponent: "thunder", home: true, teamScore: 88, opponentScore: 112 },
          { weekday: "Thu", day: 19, opponent: "pelicans", home: true, teamScore: 126, opponentScore: 111 },
          { weekday: "Thu", day: 12, opponent: "jazz", home: false, teamScore: 115, opponentScore: 117 },
        ],
      },
    ],
  },
  heat: {
    fullName: "Miami Heat",
    theme: { glow: "152, 0, 46", shade: "45, 10, 10", top: "#98002e", bottom: "#300a0a" },
    next: { label: "Today", day: 18, opponent: "warriors", home: true, time: "4:00 PM", network: "ESPN" },
    // Soonest first (after today's game). Times are Pacific, like the main list.
    upcoming: [
      {
        month: "March",
        games: [
          { weekday: "Fri", day: 20, opponent: "warriors", home: true, time: "4:00 PM", network: "ESPN" },
          { weekday: "Sat", day: 21, opponent: "hawks", home: false, time: "4:30 PM", network: "FDSN Sun" },
          { weekday: "Mon", day: 23, opponent: "bucks", home: true, time: "4:30 PM", network: "FDSN Sun" },
          { weekday: "Wed", day: 25, opponent: "knicks", home: true, time: "4:30 PM", network: "ESPN" },
          { weekday: "Fri", day: 27, opponent: "celtics", home: false, time: "4:30 PM", network: "FDSN Sun" },
        ],
      },
      {
        month: "April",
        games: [
          { weekday: "Wed", day: 1, opponent: "pistons", home: true, time: "4:30 PM", network: "FDSN Sun" },
          { weekday: "Thu", day: 2, opponent: "hornets", home: false, time: "4:00 PM", network: "NBA TV" },
          { weekday: "Sat", day: 4, opponent: "76ers", home: true, time: "5:00 PM", network: "FDSN Sun" },
          { weekday: "Mon", day: 6, opponent: "raptors", home: false, time: "4:30 PM", network: "NBA TV" },
          { weekday: "Wed", day: 8, opponent: "magic", home: true, time: "4:30 PM", network: "FDSN Sun" },
          { weekday: "Fri", day: 10, opponent: "cavaliers", home: false, time: "4:00 PM", network: "ESPN" },
          { weekday: "Sun", day: 12, opponent: "nets", home: true, time: "3:00 PM", network: "FDSN Sun" },
        ],
      },
    ],
    // Newest first
    previous: [
      {
        month: "March",
        games: [
          { weekday: "Mon", day: 16, opponent: "warriors", home: true, teamScore: 112, opponentScore: 127 },
          { weekday: "Sat", day: 14, opponent: "magic", home: false, teamScore: 108, opponentScore: 99 },
          { weekday: "Thu", day: 12, opponent: "knicks", home: true, teamScore: 96, opponentScore: 103 },
          { weekday: "Tue", day: 10, opponent: "hawks", home: true, teamScore: 118, opponentScore: 110 },
          { weekday: "Sun", day: 8, opponent: "pacers", home: false, teamScore: 121, opponentScore: 94 },
        ],
      },
      {
        month: "February",
        games: [
          { weekday: "Fri", day: 27, opponent: "76ers", home: false, teamScore: 104, opponentScore: 98 },
          { weekday: "Wed", day: 25, opponent: "celtics", home: true, teamScore: 87, opponentScore: 101 },
          { weekday: "Mon", day: 23, opponent: "raptors", home: true, teamScore: 115, opponentScore: 109 },
          { weekday: "Sat", day: 21, opponent: "bulls", home: false, teamScore: 92, opponentScore: 97 },
          { weekday: "Thu", day: 19, opponent: "hornets", home: false, teamScore: 110, opponentScore: 86 },
          { weekday: "Thu", day: 12, opponent: "pistons", home: true, teamScore: 99, opponentScore: 94 },
        ],
      },
    ],
  },
};

const HOME_COURT = 2;
const POINTS_PER_WIN_PCT = 40;

function winPct(id) {
  const [w, l] = TEAMS[id].record.split("-").map(Number);
  return w / (w + l);
}

// Point spread from the win-percentage gap plus home-court edge,
// always on a half point, e.g. "MIA -5.5".
function spreadMargin(g) {
  return (winPct(g.home) - winPct(g.away)) * POINTS_PER_WIN_PCT + HOME_COURT;
}

function spreadPoints(g) {
  return Math.floor(Math.abs(spreadMargin(g))) + 0.5;
}

function favoriteOf(g) {
  return spreadMargin(g) >= 0 ? g.home : g.away;
}

function spread(g) {
  return `${TEAMS[favoriteOf(g)].abbr} -${spreadPoints(g)}`;
}

// ---------- League schedule ----------
// One schedule for the whole league that every screen reads from: the main
// list's days, every team page and every Series card. It's made of the main
// list's games, the Warriors' and Heat's hand-written schedules, and generated
// games for everyone else (the same every time), so the same game always
// shows the same date, score, time and network everywhere. Today is
// Wed, Mar 18, 2026. Generated games:
//   - run from Feb 12 to the end of the regular season (Sun, Apr 12), with
//     none over the All-Star break (Feb 13–18);
//   - stay off the hand-written main list days (and Mar 17 and 19), so those
//     days keep their hand-picked games; Previous and Upcoming then list
//     every game day between them, too;
//   - never put a team on the court two days running, or two teams against
//     each other more than twice or within two weeks of another meeting.
// Each night's national TV goes to its best matchups; the rest are on each
// team's local channel.

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_MS = 86400000;
const TODAY = Date.UTC(2026, 2, 18);
const PAGES_FROM = Date.UTC(2026, 1, 1); // team pages' Previous Games start in February
const GENERATED_FROM = Date.UTC(2026, 1, 12);
const SEASON_END = Date.UTC(2026, 3, 12);
const ALL_STAR_BREAK = [Date.UTC(2026, 1, 13), Date.UTC(2026, 1, 18)];

// "Fri, Mar 20" → that day (Oct–Dec dates are in 2025, when the season began)
function parseDate(label) {
  const [, mon, day] = label.split(/[ ,]+/);
  const month = MONTHS.indexOf(mon);
  return Date.UTC(month >= 9 ? 2025 : 2026, month, Number(day));
}

function dateLabel(day) {
  const d = new Date(day);
  return `${DAY_NAMES[d.getUTCDay()]}, ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

const FULL_NAMES = {
  warriors: "Golden State Warriors", heat: "Miami Heat", pistons: "Detroit Pistons",
  wizards: "Washington Wizards", thunder: "Oklahoma City Thunder", magic: "Orlando Magic",
  pacers: "Indiana Pacers", knicks: "New York Knicks", cavaliers: "Cleveland Cavaliers",
  bucks: "Milwaukee Bucks", suns: "Phoenix Suns", timberwolves: "Minnesota Timberwolves",
  "76ers": "Philadelphia 76ers", nuggets: "Denver Nuggets", spurs: "San Antonio Spurs",
  kings: "Sacramento Kings", celtics: "Boston Celtics", nets: "Brooklyn Nets",
  hornets: "Charlotte Hornets", bulls: "Chicago Bulls", hawks: "Atlanta Hawks",
  raptors: "Toronto Raptors", lakers: "Los Angeles Lakers", clippers: "LA Clippers",
  mavericks: "Dallas Mavericks", rockets: "Houston Rockets", grizzlies: "Memphis Grizzlies",
  pelicans: "New Orleans Pelicans", jazz: "Utah Jazz", blazers: "Portland Trail Blazers",
};

// Each team page's gradient color (a team color dark enough for white text)
const PAGE_COLORS = {
  pistons: "#1d42ba", wizards: "#0c3a73", thunder: "#007ac1", magic: "#0077c0",
  pacers: "#0b3a7a", knicks: "#006bb6", cavaliers: "#860038", bucks: "#0b5a2a",
  suns: "#3b2a8f", timberwolves: "#236192", "76ers": "#006bb6", nuggets: "#1e4a85",
  spurs: "#6b6e70", kings: "#5a2d81", celtics: "#007a33", nets: "#55585b",
  hornets: "#00788c", bulls: "#ce1141", hawks: "#c8102e", raptors: "#ce1141",
  lakers: "#552583", clippers: "#1d428a", mavericks: "#00538c", rockets: "#ce1141",
  grizzlies: "#5d76a9", pelicans: "#1a3a6b", jazz: "#3e2680", blazers: "#b8282c",
};

// Local TV for home games (short names, like the hand-written schedules)
const REGIONAL_TV = {
  warriors: "NBCS Bay Area", heat: "FDSN Sun", pistons: "FDSN Detroit", wizards: "Monumental",
  thunder: "FDSN OK", magic: "FDSN FL", pacers: "FDSN Indiana", knicks: "MSG",
  cavaliers: "FDSN Ohio", bucks: "FDSN WI", suns: "AZFamily", timberwolves: "FDSN North",
  "76ers": "NBCS Philly", nuggets: "Altitude", spurs: "FDSN SW", kings: "NBCS CA",
  celtics: "NBCS Boston", nets: "YES", hornets: "FDSN SE", bulls: "CHSN", hawks: "FDSN SE",
  raptors: "TSN", lakers: "Spectrum SN", clippers: "FDSN SoCal", mavericks: "KFAA",
  rockets: "Space City", grizzlies: "FDSN SE", pelicans: "Gulf Coast SN", jazz: "Jazz+",
  blazers: "BlazerVision",
};
// Each night's national TV (one game per network), by weekday
const NATIONAL_TV = {
  Sun: ["ABC"], Mon: ["NBC/Peacock"], Tue: ["NBC/Peacock"], Wed: ["ESPN"],
  Thu: ["Prime Video"], Fri: ["ESPN", "Prime Video"], Sat: ["ABC"],
};
// Shown as is on both teams' pages; any other game shows each team's own
// local channel on its page
const NATIONAL_NETWORKS = ["ESPN", "ABC", "Prime Video", "NBC/Peacock", "NBA TV"];

// Usual start times by the home team's time zone, shown in Pacific time like
// the main list
const START_TIMES = {
  east: ["4:00 PM", "4:30 PM"],
  central: ["5:00 PM", "5:30 PM"],
  mountain: ["6:00 PM"],
  pacific: ["7:00 PM", "7:30 PM"],
};
const TIME_ZONES = {
  central: ["bulls", "mavericks", "rockets", "grizzlies", "bucks", "timberwolves", "pelicans", "thunder", "spurs"],
  mountain: ["nuggets", "jazz"],
  pacific: ["warriors", "lakers", "clippers", "kings", "blazers", "suns"],
};
function timeZoneOf(team) {
  return Object.keys(TIME_ZONES).find((zone) => TIME_ZONES[zone].includes(team)) ?? "east";
}

// Small seeded random number generator, so the generated games never change
function seededRandom(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const random = seededRandom(20260318);
const pick = (list) => list[Math.floor(random() * list.length)];

// A finished game's score: the better team (plus home court) usually wins
function generatedScore(away, home) {
  const homeChance = Math.min(0.85, Math.max(0.15, 0.56 + (winPct(home) - winPct(away)) * 0.9));
  const winner = 92 + Math.floor(random() * 40); // 92–131
  const loser = winner - 1 - Math.floor(random() * 20);
  return random() < homeChance ? { awayScore: loser, homeScore: winner } : { awayScore: winner, homeScore: loser };
}

function generatedTime(game) {
  const weekend = [0, 6].includes(new Date(game.day).getUTCDay());
  return weekend && random() < 0.2 ? "12:30 PM" : pick(START_TIMES[timeZoneOf(game.home)]);
}

// Each night's national networks go to its best matchups that don't have a
// network yet (by the two teams' combined records); the rest are on local TV
function assignNetworks(games) {
  const byDay = new Map();
  games.forEach((g) => byDay.set(g.day, [...(byDay.get(g.day) ?? []), g]));
  byDay.forEach((dayGames, day) => {
    const taken = dayGames.map((g) => g.network);
    const open = NATIONAL_TV[DAY_NAMES[new Date(day).getUTCDay()]].filter((n) => !taken.includes(n));
    dayGames
      .filter((g) => !g.network)
      .sort((a, b) => winPct(b.away) + winPct(b.home) - winPct(a.away) - winPct(a.home))
      .forEach((g, i) => (g.network = open[i] ?? REGIONAL_TV[g.home]));
  });
}

const LEAGUE = new Map(); // "day|away@home" → game ({ day, away, home, … })

// Adds a game, or fills in what's missing on one already added (e.g. a main
// list game gets its network from a hand-written team schedule)
function addLeagueGame(day, game) {
  const key = `${day}|${game.away}@${game.home}`;
  const known = LEAGUE.get(key);
  if (known) {
    Object.entries(game).forEach(([field, value]) => (known[field] ??= value));
    return known;
  }
  const added = { day, ...game };
  LEAGUE.set(key, added);
  return added;
}

const leagueGames = () => [...LEAGUE.values()];
const plays = (team, day) => leagueGames().some((g) => g.day === day && (g.away === team || g.home === team));
const meetingDays = (a, b) =>
  leagueGames().filter((g) => (g.away === a && g.home === b) || (g.away === b && g.home === a)).map((g) => g.day);
// Two teams can get a generated game if they've met less than twice and not
// within two weeks either side
const canMeet = (a, b, day) => {
  const days = meetingDays(a, b);
  return days.length < 2 && days.every((d) => Math.abs(d - day) > 14 * DAY_MS);
};

// A hand-written schedule entry as a league game
function handGame(teamId, month, g) {
  const day = Date.UTC(2026, MONTH_NAMES.indexOf(month), g.day);
  const [away, home] = g.home ? [g.opponent, teamId] : [teamId, g.opponent];
  const result = g.teamScore == null ? {} : g.home
    ? { awayScore: g.opponentScore, homeScore: g.teamScore }
    : { awayScore: g.teamScore, homeScore: g.opponentScore };
  const broadcast = g.time ? { time: g.time, network: g.network } : {};
  addLeagueGame(day, { away, home, ...result, ...broadcast });
}

function buildLeague() {
  EARLIER_GAMES.forEach(({ date, ...g }) => addLeagueGame(parseDate(date), g));
  GAMES.previous.forEach(({ date, games }) => games.forEach((g) => addLeagueGame(parseDate(date), g)));
  GAMES.today.forEach((g) => addLeagueGame(TODAY, g));
  GAMES.upcoming.forEach(({ date, games }) => games.forEach((g) => addLeagueGame(parseDate(date), g)));

  const handTeams = Object.keys(TEAM_PAGES);
  handTeams.forEach((id) => {
    const page = TEAM_PAGES[id];
    [...page.previous, ...page.upcoming].forEach(({ month, games }) => games.forEach((g) => handGame(id, month, g)));
    const { opponent, home, network } = page.next;
    addLeagueGame(TODAY, home ? { away: opponent, home: id, network } : { away: id, home: opponent, network });
  });

  const mainListDays = [...GAMES.previous, ...GAMES.upcoming].map(({ date }) => parseDate(date));
  const quietDays = [TODAY - DAY_MS, TODAY, TODAY + DAY_MS, ...mainListDays];
  const generatedTeams = Object.keys(TEAMS).filter((id) => !handTeams.includes(id));
  for (let day = GENERATED_FROM; day <= SEASON_END; day += DAY_MS) {
    if (quietDays.includes(day) || (day >= ALL_STAR_BREAK[0] && day <= ALL_STAR_BREAK[1])) continue;
    const free = generatedTeams
      .filter((id) => !plays(id, day) && !plays(id, day - DAY_MS) && !plays(id, day + DAY_MS))
      .filter(() => random() < 0.85) // some teams rest anyway
      .sort(() => random() - 0.5);
    while (free.length > 1) {
      const team = free.shift();
      const i = free.findIndex((other) => canMeet(team, other, day));
      if (i < 0) continue;
      const [other] = free.splice(i, 1);
      const [away, home] = random() < 0.5 ? [team, other] : [other, team];
      addLeagueGame(day, day < TODAY ? { away, home, ...generatedScore(away, home) } : { away, home });
    }
  }

  // Start times and networks for every game still to be played
  const unplayed = leagueGames().filter((g) => g.day >= TODAY && g.awayScore == null);
  unplayed.forEach((g) => (g.time ??= generatedTime(g)));
  assignNetworks(unplayed);

  // Previous and Upcoming list every game day in their range, not only the
  // hand-written ones, each with every game played on it, so no team's game
  // goes missing between them (Previous reaches back to its oldest
  // hand-written day, Upcoming ahead to its last)
  const gameDays = (from, to) =>
    [...new Set(leagueGames().map((g) => g.day))].filter((day) => day >= from && day <= to);
  const gamesOn = (day) => ({ date: dateLabel(day), games: leagueGames().filter((g) => g.day === day) });
  const previousDays = GAMES.previous.map(({ date }) => parseDate(date));
  const upcomingDays = GAMES.upcoming.map(({ date }) => parseDate(date));
  GAMES.previous = gameDays(Math.min(...previousDays), TODAY - DAY_MS).sort((a, b) => b - a).map(gamesOn);
  GAMES.upcoming = gameDays(TODAY + DAY_MS, Math.max(...upcomingDays)).sort((a, b) => a - b).map(gamesOn);
}

// "#1d428a" scaled toward black (< 1) or brighter (> 1), as "r, g, b"
function scaleColor(hex, factor) {
  return [1, 3, 5].map((i) => Math.min(255, Math.round(parseInt(hex.slice(i, i + 2), 16) * factor))).join(", ");
}

function rgbToHex(rgb) {
  return `#${rgb.split(", ").map((v) => Number(v).toString(16).padStart(2, "0")).join("")}`;
}

// Groups schedule entries by month, in the order given
function byMonth(games) {
  const months = [];
  games.forEach((g) => {
    const month = MONTH_NAMES[new Date(g.day).getUTCMonth()];
    if (months.at(-1)?.month !== month) months.push({ month, games: [] });
    months.at(-1).games.push(g.entry);
  });
  return months;
}

// A team page from the league schedule, in the hand-written pages' format
function buildTeamPage(id) {
  const color = PAGE_COLORS[id];
  const entry = (g) => {
    const home = g.home === id;
    const date = new Date(g.day);
    const base = { weekday: DAY_NAMES[date.getUTCDay()], day: date.getUTCDate(), opponent: home ? g.away : g.home, home };
    return g.awayScore != null
      ? { ...base, teamScore: home ? g.homeScore : g.awayScore, opponentScore: home ? g.awayScore : g.homeScore }
      : { ...base, time: g.time, network: NATIONAL_NETWORKS.includes(g.network) ? g.network : REGIONAL_TV[id] };
  };
  const games = leagueGames()
    .filter((g) => g.away === id || g.home === id)
    .map((g) => ({ day: g.day, entry: entry(g) }));
  const today = games.find((g) => g.day === TODAY).entry;
  return {
    fullName: FULL_NAMES[id],
    theme: {
      glow: scaleColor(color, 1.25),
      shade: scaleColor(color, 0.33),
      top: color,
      bottom: rgbToHex(scaleColor(color, 0.33)),
    },
    next: { ...today, weekday: undefined, label: "Today" },
    upcoming: byMonth(games.filter((g) => g.day > TODAY).sort((a, b) => a.day - b.day)),
    previous: byMonth(games.filter((g) => g.day < TODAY && g.day >= PAGES_FROM).sort((a, b) => b.day - a.day)),
  };
}

buildLeague();
Object.keys(TEAMS)
  .filter((id) => !(id in TEAM_PAGES))
  .forEach((id) => (TEAM_PAGES[id] = buildTeamPage(id)));

// ---------- Game sheet data ----------

// Odds worked out from the spread: -110 on both sides of the spread and the
// total, and moneylines that grow with the spread
function gameOdds(game) {
  if (GAME_ODDS[`${game.away}@${game.home}`]) return GAME_ODDS[`${game.away}@${game.home}`];
  const points = spreadPoints(game);
  const favorite = favoriteOf(game);
  const total = 220 + ([...game.away, ...game.home].reduce((sum, c) => sum + c.charCodeAt(0), 0) % 19) + 0.5;
  const roundTo5 = (n) => Math.round(n / 5) * 5;
  const row = (team, over) => ({
    team,
    spread: [`${team === favorite ? "-" : "+"}${points}`, "-110"],
    total: [`${over ? "O" : "U"} ${total}`, "-110"],
    moneyline: team === favorite ? `-${roundTo5(100 + points * 10)}` : `+${roundTo5(100 + points * 5.5)}`,
  });
  return { provider: "DraftKings", rows: [row(game.away, true), row(game.home, false)] };
}

// The season's meetings between two teams, newest first (the same wherever
// the sheet is opened from). Games without scores haven't been played yet.
function seasonSeries(a, b) {
  return leagueGames()
    .filter((g) => (g.away === a && g.home === b) || (g.away === b && g.home === a))
    .sort((x, y) => y.day - x.day)
    .map(({ day, away, home, awayScore, homeScore, time }) => {
      if (day === TODAY) return { away, home, date: "Today" };
      if (awayScore != null) return { away, home, date: dateLabel(day), awayScore, homeScore };
      return { away, home, date: dateLabel(day), time };
    });
}

// Share of each logo file left empty under the artwork (measured), so the
// text under a logo can sit a set distance below the artwork itself
const LOGO_EMPTY_BELOW = {
  warriors: 0.125, heat: 0.14, pistons: 0.1225, wizards: 0.125, thunder: 0.1875, magic: 0.1775,
  pacers: 0.125, knicks: 0.0975, cavaliers: 0.1575, bucks: 0.07, suns: 0.1525, timberwolves: 0.0625,
  "76ers": 0.12, nuggets: 0.1225, spurs: 0.1, kings: 0.13, celtics: 0.0725, nets: 0.1125,
  hornets: 0.0625, bulls: 0.155, hawks: 0.1175, raptors: 0.125, lakers: 0.195, clippers: 0.0975,
  mavericks: 0.13, rockets: 0, grizzlies: 0.1275, pelicans: 0.3025, jazz: 0.1975, blazers: 0.13,
};

// Margins that pull the text up into that empty space: the sheet's team name
// sits 8px below a 62px logo, the team page's record 6px below its 100px
// logo (the Warriors and Heat keep their hand-tuned values in the CSS)
const namePull = (id) => `${(5.4 - LOGO_EMPTY_BELOW[id] * 62).toFixed(1)}px`;
const recordPull = (id) => `${(2.9 - LOGO_EMPTY_BELOW[id] * 100).toFixed(1)}px`;

// Each matchup is a two-line grid:
//   logo | record | time   | record | logo
//   name |        | spread |        | name
function teamName(id, side) {
  return `<span class="team-name is-${side}"><span>${TEAMS[id].name}</span></span>`;
}

function gameRow(g, { awayStat, homeStat, time, detail, isKept = false }) {
  const key = `${g.away}@${g.home}`;
  return `
    <li class="game is-tappable${isKept ? " is-kept" : ""}" data-matchup="${key}" role="button" tabindex="0">
      <img class="team-logo is-away" src="logos/${g.away}.svg" alt="" />
      ${awayStat}
      <span class="time">${time}</span>
      ${homeStat}
      <img class="team-logo is-home" src="logos/${g.home}.svg" alt="" />
      ${teamName(g.away, "away")}
      ${detail ? `<span class="detail">${detail}</span>` : ""}
      ${teamName(g.home, "home")}
    </li>`;
}

function scheduledRow(g, { isKept = false } = {}) {
  return gameRow(g, {
    awayStat: `<span class="record is-away">${TEAMS[g.away].record}</span>`,
    homeStat: `<span class="record is-home">${TEAMS[g.home].record}</span>`,
    time: g.time,
    detail: spread(g),
    isKept,
  });
}

function finalRow(g, { isKept = false } = {}) {
  const awayWon = g.awayScore > g.homeScore;
  return gameRow(g, {
    awayStat: `<span class="score is-away${awayWon ? "" : " is-loser"}">${g.awayScore}</span>`,
    homeStat: `<span class="score is-home${awayWon ? " is-loser" : ""}">${g.homeScore}</span>`,
    time: g.overtime ? "Final/OT" : "Final",
    isKept,
  });
}

const CHEVRON_UP = `
  <svg class="chevron" width="12" height="8" viewBox="0 0 12 8" aria-hidden="true">
    <path d="M1.25 6.5 6 1.75l4.75 4.75" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
  </svg>`;

// A tappable date label that collapses that day's games down to its first
// one, like the team page's months.
function dayGroup({ date, games }, row) {
  return `
    <li class="day" data-date="${date}">
      <button class="day-header" type="button" aria-expanded="true">${date}${CHEVRON_UP}</button>
      <ul class="day-games keeps-one">${games.map((g, i) => row(g, { isKept: i === 0 })).join("")}</ul>
    </li>`;
}

const ROW_FOR_DAY_TAB = { previous: finalRow, upcoming: scheduledRow };

// ---------- Game sheet ----------

// A series game on the same two-line grid as the main list: the date sits on
// the logos' line and the spread on the names' line (start time just above the
// date). Finished games put their scores beside the logos.
function seriesRow(g, { isKept = false } = {}) {
  const final = g.awayScore != null;
  const awayWon = final && g.awayScore > g.homeScore;
  return `
    <li class="game series-game${isKept ? " is-kept" : ""}">
      <img class="team-logo is-away" src="logos/${g.away}.svg" alt="" />
      ${final ? `<span class="score is-away${awayWon ? "" : " is-loser"}">${g.awayScore}</span>` : ""}
      ${g.time ? `<span class="series-time">${g.time}</span>` : ""}
      <span class="${final ? "series-date" : "series-day"}">${g.date}</span>
      ${final ? `<span class="score is-home${awayWon ? " is-loser" : ""}">${g.homeScore}</span>` : ""}
      <img class="team-logo is-home" src="logos/${g.home}.svg" alt="" />
      ${teamName(g.away, "away")}
      ${g.line ? `<span class="detail">${g.line}</span>` : ""}
      ${teamName(g.home, "home")}
    </li>`;
}

// The series list (newest first); the most recent finished game is the one
// that stays visible when the Series card is collapsed. Dated upcoming games
// show their spread.
function seriesList(series) {
  const latestFinal = series.find((g) => g.awayScore != null);
  return series
    .map((g) => (g.time ? { ...g, line: spread(g) } : g))
    .map((g, i) => seriesRow(g, { isKept: series[i] === latestFinal }))
    .join("");
}

// Each team is a button that opens its team page. For a finished game, the team's score sits above its logo (dimmed if it lost).
function sheetTeam(id, final, pull) {
  const score = final
    ? `<span class="sheet-score${final.lost ? " is-loser" : ""}">${final.score}</span>`
    : "";
  const inner = `${score}
      <img class="sheet-logo" src="logos/${id}.svg" alt="" />
      <span class="sheet-team-name">${TEAMS[id].name}</span>
      <span class="sheet-team-record">${TEAMS[id].record}</span>`;
  return `<button class="sheet-team is-link" type="button" data-team="${id}" style="--name-pull: ${pull}" aria-label="${TEAM_PAGES[id].fullName} team page">${inner}</button>`;
}

function oddsCell([line, price]) {
  return `<span class="odds-line">${line}</span><span class="odds-price">${price}</span>`;
}

// Between the logos: the final score for a finished game, else the start time
// Between the logos: "Final" for a finished game (its scores sit above the
// logos), else the start time
function sheetCenter(game) {
  if (game.awayScore == null) return `<span class="sheet-time">${game.time}</span>`;
  return `<span class="sheet-final">${game.overtime ? "Final/OT" : "Final"}</span>`;
}

function sheetFinal(game, side) {
  if (game.awayScore == null) return null;
  const [mine, theirs] =
    side === "away" ? [game.awayScore, game.homeScore] : [game.homeScore, game.awayScore];
  return { score: mine, lost: mine < theirs };
}

function sheetContent(game) {
  const odds = gameOdds(game);
  // Both names on one line: 8px under the logo with less empty space below it
  const pull = namePull(LOGO_EMPTY_BELOW[game.away] < LOGO_EMPTY_BELOW[game.home] ? game.away : game.home);
  return `
    <p class="sheet-league">NBA</p>
    <div class="sheet-matchup">
      ${sheetTeam(game.away, sheetFinal(game, "away"), pull)}
      ${sheetCenter(game)}
      ${sheetTeam(game.home, sheetFinal(game, "home"), pull)}
    </div>
    ${tipsDone.card ? "" : CARD_TIP}
    <section class="sheet-card">
      <h3 class="sheet-card-title">Betting Odds</h3>
      <table class="odds">
        <thead>
          <tr><th>Team</th><th>Spread</th><th>Total</th><th>Moneyline</th></tr>
        </thead>
        <tbody>
          ${odds.rows
            .map(
              (r) => `
            <tr>
              <td class="odds-team">${TEAMS[r.team].abbr}</td>
              <td>${oddsCell(r.spread)}</td>
              <td>${oddsCell(r.total)}</td>
              <td><span class="odds-price">${r.moneyline}</span></td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
      <p class="odds-source">Odds Provided by <strong>${odds.provider}</strong></p>
    </section>
    <section class="sheet-card">
      <button class="day-header sheet-card-title" type="button" aria-expanded="true">Series${CHEVRON_UP}</button>
      <ul class="day-games series-games keeps-one">${seriesList(seasonSeries(game.away, game.home))}</ul>
    </section>`;
}

// ---------- Team page ----------

// An upcoming game in a team's schedule: date | opponent logo | two lines
//   vs/@ opponent ........ time
//   record ... network · spread
// Each line spans the full width, so a long name on one line can't collide
// with the other; if the bottom line is still too long, the network name is
// shortened with "…".
function teamGameRow(teamId, g, { isKept = false } = {}) {
  const matchup = g.home ? { away: g.opponent, home: teamId } : { away: teamId, home: g.opponent };
  const topRight = `<span class="tg-main tg-time">${g.time}</span>`;
  const bottomRight = `<span class="tg-sub tg-watch"><span class="tg-network">${g.network}</span>&nbsp;· ${spread(matchup)}</span>`;
  return `
    <li class="team-game${isKept ? " is-kept" : ""}">
      <div class="tg-date">
        <span class="tg-weekday">${g.weekday ?? g.label}</span>
        <span class="tg-day">${g.day}</span>
      </div>
      <img class="tg-logo" src="logos/${g.opponent}.svg" alt="" />
      <div class="tg-info">
        <div class="tg-line">
          <span class="tg-main"><span class="tg-prefix">${g.home ? "vs" : "@"}</span> ${TEAMS[g.opponent].name}</span>
          ${topRight}
        </div>
        <div class="tg-line">
          <span class="tg-sub tg-record">${TEAMS[g.opponent].record}</span>
          ${bottomRight}
        </div>
      </div>
    </li>`;
}

// A played game, laid out like the main list's Previous tab (via the Series
// row): away logo + name, score, date ("Mon, Mar 16"), score, home logo + name
function teamPreviousRow(teamId, month, g, options) {
  return seriesRow(
    {
      away: g.home ? g.opponent : teamId,
      home: g.home ? teamId : g.opponent,
      awayScore: g.home ? g.opponentScore : g.teamScore,
      homeScore: g.home ? g.teamScore : g.opponentScore,
      date: `${g.weekday}, ${month.slice(0, 3)} ${g.day}`,
    },
    options
  );
}

// Collapsible month groups, reusing the date-header markup (and its animation).
// Each month's first game stays showing when it's closed.
function teamMonths(teamId, months) {
  return months
    .map(({ month, games }) => {
      const rows = games.map((g, i) =>
        g.teamScore != null
          ? teamPreviousRow(teamId, month, g, { isKept: i === 0 })
          : teamGameRow(teamId, g, { isKept: i === 0 })
      );
      return `
    <li class="day">
      <button class="day-header" type="button" aria-expanded="true">${month}${CHEVRON_UP}</button>
      <ul class="day-games keeps-one">${rows.join("")}</ul>
    </li>`;
    })
    .join("");
}

// The schedule's games scroll inside their card; scrolling down the list also
// scrolls the page, which moves the logo and record away (see the schedule's
// scroll listener), and pulling down at the list's top brings them back.
function teamPageContent(teamId, cardRow, schedule) {
  return `
    <div class="team-hero" style="--record-pull: ${recordPull(teamId)}">
      <img class="team-page-logo" src="logos/${teamId}.svg" alt="" />
      <p class="team-page-record">${TEAMS[teamId].record}</p>
    </div>
    <div class="team-sticky">
      <section class="sheet-card team-card">
        <ul class="team-games">${cardRow}</ul>
      </section>
      <section class="sheet-card team-card team-schedule">
        <div class="segmented" data-active="upcoming" role="tablist">
          <span class="segmented-thumb" aria-hidden="true"></span>
          <button class="segment" type="button" role="tab" data-view="previous" aria-selected="false">Previous Games</button>
          <button class="segment" type="button" role="tab" data-view="upcoming" aria-selected="true">Upcoming</button>
        </div>
        <ul class="team-games" id="team-schedule">${teamMonths(teamId, schedule)}</ul>
      </section>
    </div>`;
}

const list = document.getElementById("games");
const tabs = document.querySelectorAll(".tab");
let activeTab = "today";

function render(tab) {
  activeTab = tab;
  const rows =
    tab === "today"
      ? GAMES.today.map((g) => scheduledRow(g))
      : GAMES[tab].map((day) => dayGroup(day, ROW_FOR_DAY_TAB[tab]));
  list.innerHTML = rows.join("");
  list.scrollTop = 0;
  tabs.forEach((t) => {
    const active = t.dataset.tab === tab;
    t.classList.toggle("is-active", active);
    t.setAttribute("aria-selected", String(active));
  });
}

tabs.forEach((t) => t.addEventListener("click", () => render(t.dataset.tab)));
// iOS's standard ease-in-out curve (UIView / Core Animation default)
const IOS_EASE_IN_OUT = "cubic-bezier(0.42, 0, 0.58, 1)";
const SECTION_DURATION = 300; // ms
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// Opens or closes the list under a date header (or the sheet's Series header),
// smoothly animating the height of whatever appears or disappears. A collapsed
// list that keeps one game (a date, a month, the Series card) only animates
// the others. Toggling mid-animation picks up from the current height.
function setSectionOpen(header, open) {
  const list = header.nextElementSibling;
  const targets = list.classList.contains("keeps-one")
    ? [...list.children].filter((row) => !row.classList.contains("is-kept"))
    : [list];

  const shownDisplay = targets.map((el) => getComputedStyle(el).display);
  const fromHeight = targets.map((el) => el.getBoundingClientRect().height);
  targets.forEach((el) => {
    el.getAnimations().forEach((a) => a.cancel());
    el.style.display = "";
    el.style.overflow = "";
  });

  header.setAttribute("aria-expanded", String(open));
  const schedule = header.closest("#team-schedule");
  if (schedule) followPinnedMonth(schedule, reduceMotion.matches ? 0 : SECTION_DURATION + 50);
  if (reduceMotion.matches) return;

  targets.forEach((el, i) => {
    // CSS hides collapsed content at once; keep it showing while it shrinks
    if (!open && shownDisplay[i] !== "none") el.style.display = shownDisplay[i];
    const toHeight = open ? el.getBoundingClientRect().height : 0;
    el.style.overflow = "hidden";
    const animation = el.animate(
      [
        { height: `${fromHeight[i]}px`, opacity: open ? 0 : 1 },
        { height: `${toHeight}px`, opacity: open ? 1 : 0 },
      ],
      { duration: SECTION_DURATION, easing: IOS_EASE_IN_OUT }
    );
    animation.finished
      .then(() => {
        if (el.getAnimations().length) return; // a newer toggle owns the element now
        el.style.display = "";
        el.style.overflow = "";
      })
      .catch(() => {}); // cancelled by a newer toggle, which resets the styles itself
  });
}

document.addEventListener("click", (e) => {
  const header = e.target.closest(".day-header");
  if (!header) return;
  setSectionOpen(header, header.getAttribute("aria-expanded") !== "true");
});
const WEEKDAYS = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday" };

// "Wed, Mar 18" → "Wednesday, Mar 18"
function longDate(date) {
  return date.replace(/^(\w{3}),/, (_, day) => `${WEEKDAYS[day]},`);
}

// The tapped game's data and the date label for the sheet's title
function sheetGameFor(row) {
  const key = row.dataset.matchup;
  const date = row.closest(".day")?.dataset.date;
  const games = date ? GAMES[activeTab].find((day) => day.date === date).games : GAMES.today;
  return {
    game: games.find((g) => `${g.away}@${g.home}` === key),
    date: date ?? null, // e.g. "Wed, Mar 18"; null for Today
    dateLabel: date ? longDate(date) : "Today",
  };
}

// Each end of a row opens that team's page: its whole outer column, top to
// bottom (above the logo, the logo, the name and below it), the grid's 58px
// or as wide as the name when a long one (Timberwolves) spills past it.
// Anywhere else opens the game.
const TEAM_COLUMN = 58; // px

function teamTappedIn(row, x) {
  const box = row.getBoundingClientRect();
  const name = (side) => row.querySelector(`.team-name.is-${side} > span`).getBoundingClientRect();
  const [away, home] = row.dataset.matchup.split("@");
  if (x < Math.max(box.left + TEAM_COLUMN, name("away").right)) return { team: away, side: "away" };
  if (x > Math.min(box.right - TEAM_COLUMN, name("home").left)) return { team: home, side: "home" };
  return null;
}

list.addEventListener("click", (e) => {
  const row = e.target.closest(".game[data-matchup]");
  if (!row) return;
  // A click with no pointer position (e.detail 0: keyboard or script) opens the game
  const tapped = e.detail ? teamTappedIn(row, e.clientX) : null;
  if (tapped) openTeamSheet(tapped.team);
  else openSheet(sheetGameFor(row));
});

// Pressing a team's end dims its logo instead of highlighting the whole row,
// so it's clear the team (not the game) is what opens
let pressedRow = null;
list.addEventListener("pointerdown", (e) => {
  const row = e.target.closest(".game[data-matchup]");
  const tapped = row && teamTappedIn(row, e.clientX);
  if (!tapped) return;
  pressedRow = row;
  row.dataset.press = tapped.side;
});
const endPress = () => {
  if (pressedRow) delete pressedRow.dataset.press;
  pressedRow = null;
};
["pointerup", "pointercancel", "pointerleave"].forEach((type) => list.addEventListener(type, endPress));
list.addEventListener("keydown", (e) => {
  const row = e.target.closest(".game[data-matchup]");
  if (row && (e.key === "Enter" || e.key === " ")) {
    e.preventDefault();
    openSheet(sheetGameFor(row));
  }
});
render("today");

// Game sheet: slides up over a black backdrop. Dragging the grabber down far
// (or flicking it), tapping the backdrop, or Escape closes it.
const sheet = document.getElementById("game-sheet");
const sheetBody = document.getElementById("sheet-body");
const sheetHandle = document.getElementById("sheet-handle");
const sheetScrim = document.getElementById("sheet-scrim");
const sheetDate = document.getElementById("sheet-date");
const teamPage = document.getElementById("team-page");
const teamBody = document.getElementById("team-body");
const teamTitle = document.getElementById("team-title");
const gamePage = document.getElementById("game-page");

const DISMISS_DISTANCE = 120; // px dragged
const DISMISS_VELOCITY = 0.5; // px per ms

function setSheetOpen(open, { showDate = true } = {}) {
  sheet.classList.toggle("is-open", open);
  sheetScrim.classList.toggle("is-open", open);
  sheetDate.classList.toggle("is-open", open && showDate);
  sheet.setAttribute("aria-hidden", String(!open));
  sheet.inert = !open;
  // Shown inside the case study's popup, which keeps its close button off the
  // card's date while it's open (script.js there)
  if (window.parent !== window) window.parent.postMessage({ type: "proto-sheet", open }, location.origin);
}

// The game the sheet was opened for, and its date (null for Today)
let sheetGame = null;

function openSheet({ game, date, dateLabel }) {
  sheetGame = { game, date };
  sheet.setAttribute("aria-label", `${TEAMS[game.away].name} at ${TEAMS[game.home].name}, ${dateLabel}`);
  sheetDate.textContent = dateLabel;
  logoFlight?.finish(); // in case the sheet was closed mid-flight
  sheet.classList.remove("is-team-root");
  sheetBody.innerHTML = sheetContent(game);
  sheetBody.scrollTop = 0;
  showGamePage({ animate: false });
  setSheetOpen(true);
}

// Opens the sheet straight to a team page (from the NBA menu, or a team's end
// of a row in the main list). With no game
// underneath, the team page is the sheet's only page: no back button, no
// game date above the sheet.
function openTeamSheet(teamId) {
  logoFlight?.finish();
  sheet.setAttribute("aria-label", TEAM_PAGES[teamId].fullName);
  sheet.classList.add("is-team-root", "no-page-anim");
  showTeamPage(teamId);
  void sheet.offsetWidth; // show the team page at once, without the page fade
  sheet.classList.remove("no-page-anim");
  setSheetOpen(true, { showDate: false });
}

// Team page: fades in over the game page while the tapped logo flies to it
// (back reverses it). The game's date above the sheet only shows with the
// game page.
// The team page's top card for the game the sheet was opened for:
//   from Today      "Today 18 · @ Heat · 4:00 PM"
//   from Upcoming   "Fri 20 · @ Heat · 4:00 PM" (its schedule entry)
//   from Previous   the final score, like the Previous Games rows, as "Today"
//   from the menu   the team's usual next game
function teamCardRow(teamId, opened) {
  const game = opened?.game;
  if (game?.awayScore != null) {
    const { away, home, awayScore, homeScore } = game;
    return seriesRow({ away, home, awayScore, homeScore, date: "Today" });
  }
  return teamGameRow(teamId, teamCardGame(teamId, opened));
}

// A team's scheduled game on a date like "Fri, Mar 20"
function scheduledGame(teamId, date) {
  const [, month, day] = date.split(/[ ,]+/);
  return TEAM_PAGES[teamId].upcoming
    .find((m) => m.month.startsWith(month))
    ?.games.find((g) => g.day === Number(day));
}

// Today's game (from Today or the menu), or the Upcoming game's entry in
// the team's schedule
function teamCardGame(teamId, opened) {
  return (opened?.date && scheduledGame(teamId, opened.date)) || TEAM_PAGES[teamId].next;
}

// The schedule, minus the game already shown in the top card
let teamUpcoming = null;
function scheduleWithout(teamId, shown) {
  return TEAM_PAGES[teamId].upcoming
    .map(({ month, games }) => ({ month, games: games.filter((g) => g !== shown) }))
    .filter(({ games }) => games.length);
}

function showTeamPage(teamId, opened = null) {
  dismissLaunchTip({ retire: true }); // they've found team pages
  teamTitle.textContent = TEAM_PAGES[teamId].fullName;
  teamPage.dataset.team = teamId; // per-team styling hooks
  Object.entries(TEAM_PAGES[teamId].theme).forEach(([name, value]) =>
    teamPage.style.setProperty(`--team-${name}`, value)
  );
  teamUpcoming = scheduleWithout(teamId, opened?.game.awayScore == null && teamCardGame(teamId, opened));
  teamBody.innerHTML = teamPageContent(teamId, teamCardRow(teamId, opened), teamUpcoming);
  teamBody.dataset.team = teamId;
  teamBody.scrollTop = 0;
  placeSchedule();
  markPinnedMonth(document.getElementById("team-schedule"));
  sheet.classList.add("is-team");
  teamPage.inert = false;
  gamePage.inert = true;
  sheetDate.classList.remove("is-open");
}

function showGamePage({ animate = true } = {}) {
  if (!animate) sheet.classList.add("no-page-anim");
  sheet.classList.remove("is-team");
  teamPage.inert = true;
  gamePage.inert = false;
  if (sheet.classList.contains("is-open")) sheetDate.classList.add("is-open");
  if (!animate) {
    void sheet.offsetWidth; // apply the jump before re-enabling transitions
    sheet.classList.remove("no-page-anim");
  }
}

// Logo morph: a copy of the logo flies (moving and resizing) from one logo to
// the other while the pages crossfade underneath; both real logos stay hidden
// until it lands, so it reads as one logo moving between the pages.
const LOGO_FLIGHT_MS = 500;
let logoFlight = null;

function flyLogo(fromLogo, toLogo) {
  logoFlight?.finish();
  if (reduceMotion.matches) return;
  const box = sheet.getBoundingClientRect();
  const from = fromLogo.getBoundingClientRect();
  const to = toLogo.getBoundingClientRect();

  // Sits on the landing spot; the animation starts it over the take-off spot
  const copy = document.createElement("img");
  copy.className = "logo-flight";
  copy.src = toLogo.src;
  copy.alt = "";
  Object.assign(copy.style, {
    left: `${to.left - box.left - sheet.clientLeft}px`,
    top: `${to.top - box.top - sheet.clientTop}px`,
    width: `${to.width}px`,
    height: `${to.height}px`,
  });
  sheet.append(copy);
  fromLogo.style.visibility = "hidden";
  toLogo.style.visibility = "hidden";

  const flight = copy.animate(
    [
      {
        transform: `translate(${from.left - to.left}px, ${from.top - to.top}px)
                    scale(${from.width / to.width}, ${from.height / to.height})`,
      },
      { transform: "none" },
    ],
    { duration: LOGO_FLIGHT_MS, easing: "cubic-bezier(0.32, 0.72, 0, 1)" }
  );
  logoFlight = flight;
  const land = () => {
    copy.remove();
    fromLogo.style.visibility = "";
    toLogo.style.visibility = "";
    if (logoFlight === flight) logoFlight = null;
  };
  flight.finished.then(land, land);
}

// The tapped team's logo in the game sheet header
function headerLogo(teamId) {
  return sheetBody.querySelector(`.sheet-team[data-team="${teamId}"] .sheet-logo`);
}

sheetBody.addEventListener("click", (e) => {
  if (e.target.closest(".tip-close")) {
    retireTip("card");
    collapseCardTip();
    return;
  }
  const team = e.target.closest(".sheet-team[data-team]");
  if (!team) return;
  retireTip("card"); // they've found the logo; the tip goes once they're back
  showTeamPage(team.dataset.team, sheetGame);
  flyLogo(headerLogo(team.dataset.team), teamBody.querySelector(".team-page-logo"));
});

document.getElementById("sheet-back").addEventListener("click", () => {
  // Fly the logo home unless it has scrolled out of view (then just fade)
  const teamLogo = teamBody.querySelector(".team-page-logo");
  if (teamLogo.getBoundingClientRect().bottom > teamBody.getBoundingClientRect().top) {
    flyLogo(teamLogo, headerLogo(teamBody.dataset.team));
  }
  showGamePage();
  if (tipsDone.card) collapseCardTip();
});

// Previous Games | Upcoming
teamBody.addEventListener("click", (e) => {
  const segment = e.target.closest(".segment");
  if (!segment) return;
  const view = segment.dataset.view;
  const control = segment.closest(".segmented");
  if (control.dataset.active === view) return;
  control.dataset.active = view;
  control.querySelectorAll(".segment").forEach((s) => s.setAttribute("aria-selected", String(s === segment)));
  const teamId = teamBody.dataset.team;
  const schedule = document.getElementById("team-schedule");
  schedule.innerHTML = teamMonths(teamId, view === "upcoming" ? teamUpcoming : TEAM_PAGES[teamId].previous);
  schedule.scrollTop = 0;
  scheduleTop = 0; // swapping the list can reset its scroll without a scroll event
  markPinnedMonth(schedule);
});

// ---- Pinned months ----
// The month label at the top of the schedule stays put while its games scroll
// under it (position: sticky). Since the card is see-through, the pinned label
// paints the page's background behind itself (styles.css, .is-stuck), lined up
// using where the schedule sits on the page. That only moves while the page
// scrolls the logo away, or if the window resizes.
function placeSchedule() {
  const schedule = document.getElementById("team-schedule");
  if (!schedule) return;
  const page = teamPage.getBoundingClientRect();
  const box = schedule.getBoundingClientRect();
  schedule.style.setProperty("--page-size", `${page.width}px ${page.height}px`);
  schedule.style.setProperty("--page-at", `${page.left - box.left}px ${page.top - box.top}px`);
}

// Marks the label of the month being scrolled through (the pinned one)
function markPinnedMonth(schedule) {
  const top = schedule.scrollTop;
  for (const day of schedule.children) {
    const pinned = day.offsetTop <= top && top < day.offsetTop + day.offsetHeight;
    day.firstElementChild.classList.toggle("is-stuck", pinned);
  }
}

// While a month opens or closes, the months below it move without the list
// scrolling, so the pinned label is checked every frame until it's done
function followPinnedMonth(schedule, ms) {
  const end = performance.now() + ms;
  const step = (now) => {
    markPinnedMonth(schedule);
    if (now < end) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

window.addEventListener("resize", placeSchedule);

// Scrolling down the schedule also scrolls the page so the logo and record
// move out of the way, as iOS shrinks a large title. The schedule card is sized
// for the page scrolled that far, so until then its last games sit below the
// sheet; Safari won't pass one swipe from the list on to the page, so they
// stayed hidden until a second swipe. Pulling down at the list's top still
// brings the logo back. Scroll events don't bubble, hence capture (the list is
// rebuilt with each team page). The page's scroll is started once, not again on
// each of the list's scroll events, which would keep restarting it.
let scheduleList = null;
let scheduleTop = 0;
let pageScrollAt = -Infinity;
teamBody.addEventListener(
  "scroll",
  (e) => {
    const list = e.target;
    if (list === teamBody) return placeSchedule();
    if (list.id !== "team-schedule") return;
    markPinnedMonth(list);
    if (list !== scheduleList) {
      scheduleList = list;
      scheduleTop = 0;
    }
    const down = list.scrollTop > scheduleTop;
    scheduleTop = list.scrollTop;
    const pageEnd = teamBody.scrollHeight - teamBody.clientHeight;
    if (down && teamBody.scrollTop < pageEnd - 1 && e.timeStamp - pageScrollAt > 600) {
      pageScrollAt = e.timeStamp;
      teamBody.scrollTo({ top: pageEnd, behavior: "smooth" });
    }
  },
  { capture: true, passive: true }
);

// ---- Swipe down to close ----
// The grabber always drags the sheet. Anywhere else, a downward swipe drags it
// too when the content under the finger is scrolled to its top (otherwise it
// scrolls the content, as in iOS sheets).
let drag = null;

function beginDrag(y, time) {
  drag = { startY: y, startTime: time, dy: 0 };
  sheet.classList.add("is-dragging");
  sheetDate.style.transition = "none"; // fade with the finger, not after it
}

function moveDrag(y) {
  if (!drag) return;
  drag.dy = Math.max(0, y - drag.startY);
  sheet.style.transform = `translateY(${drag.dy}px)`;
  const fade = String(1 - drag.dy / sheet.offsetHeight);
  sheetScrim.style.opacity = fade;
  if (sheetDate.classList.contains("is-open")) sheetDate.style.opacity = fade;
}

function endDrag(time) {
  if (!drag) return;
  const velocity = drag.dy / Math.max(1, time - drag.startTime);
  const dismiss = drag.dy > DISMISS_DISTANCE || (drag.dy > 20 && velocity > DISMISS_VELOCITY);
  drag = null;
  // Clearing the inline styles lets the transition carry on from where the finger let go
  sheet.classList.remove("is-dragging");
  sheet.style.transform = "";
  sheetScrim.style.opacity = "";
  sheetDate.style.opacity = "";
  sheetDate.style.transition = "";
  if (dismiss) setSheetOpen(false);
}

// True when every scrollable box between the target and the sheet is at its top
function scrolledToTop(target) {
  for (let el = target; el && el !== sheet; el = el.parentElement) {
    const scrollable = /(auto|scroll)/.test(getComputedStyle(el).overflowY) && el.scrollHeight > el.clientHeight;
    if (scrollable && el.scrollTop > 0) return false;
  }
  return true;
}

// Grabber
sheetHandle.addEventListener("pointerdown", (e) => {
  sheetHandle.setPointerCapture(e.pointerId);
  beginDrag(e.clientY, e.timeStamp);
});
sheetHandle.addEventListener("pointermove", (e) => moveDrag(e.clientY));
sheetHandle.addEventListener("pointerup", (e) => endDrag(e.timeStamp));
sheetHandle.addEventListener("pointercancel", (e) => endDrag(e.timeStamp));

// Swipe gestures start as "maybe": the first few pixels of movement decide
// whether it's a sheet drag (down, mostly vertical, content at its top) or
// a normal scroll / tap.
const DRAG_SLOP = 6; // px before deciding
let swipe = null;

function decideSwipe(dx, dy) {
  return dy > 0 && Math.abs(dy) > Math.abs(dx) && scrolledToTop(swipe.target);
}

// Touch: decided on the first move, then the native scroll is blocked
sheet.addEventListener(
  "touchstart",
  (e) => {
    if (e.touches.length !== 1 || sheetHandle.contains(e.target)) return;
    const t = e.touches[0];
    swipe = { x: t.clientX, y: t.clientY, time: e.timeStamp, target: e.target, decided: false };
  },
  { passive: true }
);

sheet.addEventListener(
  "touchmove",
  (e) => {
    if (!swipe) return;
    const t = e.touches[0];
    if (!swipe.decided) {
      const dx = t.clientX - swipe.x;
      const dy = t.clientY - swipe.y;
      if (Math.abs(dx) < DRAG_SLOP && Math.abs(dy) < DRAG_SLOP) return;
      swipe.decided = true;
      if (e.cancelable && decideSwipe(dx, dy)) beginDrag(swipe.y, swipe.time);
    }
    if (drag) {
      e.preventDefault();
      moveDrag(t.clientY);
    }
  },
  { passive: false }
);

const endTouch = (e) => {
  if (drag && swipe) endDrag(e.timeStamp);
  swipe = null;
};
sheet.addEventListener("touchend", endTouch);
sheet.addEventListener("touchcancel", endTouch);

// Mouse: same idea; a drag swallows the click that would follow it
sheet.addEventListener("pointerdown", (e) => {
  if (e.pointerType !== "mouse" || e.button !== 0 || sheetHandle.contains(e.target)) return;
  swipe = { x: e.clientX, y: e.clientY, time: e.timeStamp, target: e.target, decided: false, mouse: true };
});

window.addEventListener("pointermove", (e) => {
  if (!swipe?.mouse) return;
  if (!swipe.decided) {
    const dx = e.clientX - swipe.x;
    const dy = e.clientY - swipe.y;
    if (Math.abs(dx) < DRAG_SLOP && Math.abs(dy) < DRAG_SLOP) return;
    swipe.decided = true;
    if (decideSwipe(dx, dy)) beginDrag(swipe.y, swipe.time);
  }
  if (drag) moveDrag(e.clientY);
});

window.addEventListener("pointerup", (e) => {
  if (!swipe?.mouse) return;
  if (drag) {
    endDrag(e.timeStamp);
    // Swallow the click this release produces (if any) — only this one
    const swallow = (c) => c.stopPropagation();
    window.addEventListener("click", swallow, { capture: true, once: true });
    setTimeout(() => window.removeEventListener("click", swallow, { capture: true }), 0);
  }
  swipe = null;
});
sheetScrim.addEventListener("click", () => setSheetOpen(false));

// League / team menu: opens from the NBA button; a tap anywhere outside it,
// a tap on an item, or Escape closes it.
const pill = document.getElementById("league-pill");
const menu = document.getElementById("league-menu");
const scrim = document.getElementById("menu-scrim");

// Pin the menu's top-right corner to the button's and start it at the button's size.
function anchorMenuToPill() {
  const phone = menu.offsetParent;
  menu.style.top = `${pill.offsetTop}px`;
  menu.style.right = `${phone.clientWidth - pill.offsetLeft - pill.offsetWidth}px`;
  menu.style.setProperty("--from-sx", pill.offsetWidth / menu.offsetWidth);
  menu.style.setProperty("--from-sy", pill.offsetHeight / menu.offsetHeight);
}

function setMenuOpen(open) {
  if (open) anchorMenuToPill();
  menu.classList.toggle("is-open", open);
  scrim.classList.toggle("is-open", open);
  pill.setAttribute("aria-expanded", String(open));
}

anchorMenuToPill();
pill.addEventListener("click", () => setMenuOpen(true));
scrim.addEventListener("click", () => setMenuOpen(false));
menu.addEventListener("click", (e) => {
  const item = e.target.closest(".menu-item");
  if (!item) return;
  setMenuOpen(false);
  if (item.dataset.team) openTeamSheet(item.dataset.team);
});
// Escape closes whichever is on top: the game sheet first, then the menu
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (sheet.classList.contains("is-open")) setSheetOpen(false);
  else setMenuOpen(false);
});

// ---------- Tips ----------
// One-time tips that point out team pages, in the style of iOS inline tips
// (TipKit):
//   - on launch, above the scores: tap a team's logo, or pick it in the menu
//   - in a game's card, under the matchup: tap a team's logo
// Each stays until it's closed with its ×, or until the user does what it
// suggests (opens a team page; for the game card's, from that card's logo).
// Unlike real tips, they come back whenever the page is loaded again, so
// every test session (and every "reload to start over") starts with them.
const tipsDone = {};

function retireTip(name) {
  tipsDone[name] = true;
}

const CARD_TIP = `
  <div class="tip-slot">
    <aside class="tip tip--inline" aria-label="Tip">
      <h2 class="tip-title">Discover Team Pages</h2>
      <p class="tip-message">Tap on the team logo to explore upcoming and previous games.</p>
      <button class="tip-close" type="button" aria-label="Close tip">
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M1.4 1.4l7.2 7.2M8.6 1.4L1.4 8.6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </button>
    </aside>
  </div>`;

// Shrinks a tip's slot away. The slot holds the tip's top margin and the next
// card's margin is smaller while the tip is there, so the slot ends at the
// difference: once it's gone, the gap is the next card's usual margin.
function collapseTip(slot) {
  if (!slot || slot.hidden) return;
  const tipMargin = parseFloat(getComputedStyle(slot.firstElementChild).marginTop);
  const nextMargin = parseFloat(getComputedStyle(slot.nextElementSibling).marginTop);
  const done = () => (slot.id ? (slot.hidden = true) : slot.remove());
  if (reduceMotion.matches) return done();
  slot.style.overflow = "hidden";
  const shrink = slot.animate(
    [
      { height: `${slot.getBoundingClientRect().height}px`, opacity: 1 },
      { height: `${tipMargin - nextMargin}px`, opacity: 0 },
    ],
    { duration: SECTION_DURATION, easing: IOS_EASE_IN_OUT, fill: "forwards" }
  );
  shrink.finished.then(() => {
    done();
    shrink.cancel();
    slot.style.overflow = "";
  }, () => {});
}

function collapseCardTip() {
  collapseTip(sheetBody.querySelector(".tip-slot"));
}

const launchTip = document.getElementById("launch-tip");
launchTip.hidden = false;

function dismissLaunchTip({ retire = false } = {}) {
  if (retire) retireTip("launch");
  collapseTip(launchTip);
}

launchTip.querySelector(".tip-close").addEventListener("click", () => dismissLaunchTip({ retire: true }));
