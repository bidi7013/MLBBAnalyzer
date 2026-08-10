/**
 * MLBB Profile Analyzer - Mock Profiles Dataset (Integrated with Official Heroes)
 */

export const MOCK_PROFILES = {
  '12345678_2024': {
    id: '12345678',
    zone: '2024',
    ign: 'Xinnn_Vibe',
    level: 120,
    avatar: 'assets/heroes/fanny.png',
    currentRank: 'Mythical Immortal',
    stars: 128,
    highestRank: 'Mythical Immortal 185★',
    currentSeason: 'Season 33',
    overallWinRate: 73.8,
    seasonWinRate: 76.5,
    totalMatches: 4820,
    seasonMatches: 342,
    mvpCount: 1640,
    savageCount: 42,
    maniacCount: 189,
    tripleKillCount: 612,
    winStreak: 11,
    creditScore: 110,
    calculatedMMR: 96.8,
    radar: {
      combat: 98,
      push: 88,
      farming: 96,
      survivability: 91,
      teamfight: 94,
      versatility: 82
    },
    roles: {
      assassin: { matches: 2150, winRate: 76.2, percentage: 44.6 },
      marksman: { matches: 1240, winRate: 74.5, percentage: 25.7 },
      fighter: { matches: 680, winRate: 70.1, percentage: 14.1 },
      mage: { matches: 450, winRate: 68.4, percentage: 9.3 },
      tank: { matches: 200, winRate: 64.0, percentage: 4.2 },
      support: { matches: 100, winRate: 61.0, percentage: 2.1 }
    },
    topHeroes: [
      { name: 'Fanny', matches: 1420, winRate: 78.4, kda: '8.4 / 2.1 / 6.2', role: 'Assassin' },
      { name: 'Ling', matches: 840, winRate: 75.1, kda: '7.9 / 2.4 / 7.1', role: 'Assassin' },
      { name: 'Beatrix', matches: 620, winRate: 73.5, kda: '9.1 / 2.8 / 5.8', role: 'Marksman' },
      { name: 'Claude', matches: 510, winRate: 72.0, kda: '7.4 / 3.0 / 6.9', role: 'Marksman' },
      { name: 'Chou', matches: 430, winRate: 71.2, kda: '5.8 / 3.1 / 8.5', role: 'Fighter' }
    ],
    recentMatches: [
      { result: 'Victory', hero: 'Fanny', kda: '14/1/8', medal: 'MVP', score: 14.8, duration: '12:45', mode: 'Ranked' },
      { result: 'Victory', hero: 'Ling', kda: '11/2/9', medal: 'MVP', score: 13.5, duration: '14:20', mode: 'Ranked' },
      { result: 'Victory', hero: 'Beatrix', kda: '9/3/11', medal: 'Gold', score: 11.2, duration: '16:02', mode: 'Ranked' },
      { result: 'Victory', hero: 'Fanny', kda: '16/0/7', medal: 'MVP', score: 16.0, duration: '11:10', mode: 'Ranked' },
      { result: 'Defeat', hero: 'Claude', kda: '8/4/6', medal: 'Gold', score: 9.8, duration: '19:40', mode: 'Ranked' }
    ]
  },

  '87654321_3012': {
    id: '87654321',
    zone: '3012',
    ign: 'KaguraSimp',
    level: 95,
    avatar: 'assets/heroes/kagura.png',
    currentRank: 'Mythical Glory',
    stars: 64,
    highestRank: 'Mythical Glory 78★',
    currentSeason: 'Season 33',
    overallWinRate: 62.4,
    seasonWinRate: 64.8,
    totalMatches: 3100,
    seasonMatches: 215,
    mvpCount: 820,
    savageCount: 8,
    maniacCount: 64,
    tripleKillCount: 310,
    winStreak: 6,
    creditScore: 110,
    calculatedMMR: 88.5,
    radar: {
      combat: 89,
      push: 68,
      farming: 85,
      survivability: 92,
      teamfight: 97,
      versatility: 75
    },
    roles: {
      mage: { matches: 1850, winRate: 65.2, percentage: 59.7 },
      support: { matches: 620, winRate: 61.8, percentage: 20.0 },
      tank: { matches: 310, winRate: 58.4, percentage: 10.0 },
      marksman: { matches: 180, winRate: 54.2, percentage: 5.8 },
      fighter: { matches: 100, winRate: 51.0, percentage: 3.2 },
      assassin: { matches: 40, winRate: 45.0, percentage: 1.3 }
    },
    topHeroes: [
      { name: 'Lunox', matches: 820, winRate: 66.8, kda: '7.2 / 2.5 / 9.1', role: 'Mage' },
      { name: 'Valentina', matches: 610, winRate: 64.5, kda: '6.8 / 3.0 / 10.4', role: 'Mage' },
      { name: 'Mathilda', matches: 420, winRate: 63.1, kda: '4.2 / 2.1 / 14.8', role: 'Support' },
      { name: 'Angela', matches: 380, winRate: 61.0, kda: '2.5 / 1.8 / 16.5', role: 'Support' },
      { name: 'Kadita', matches: 290, winRate: 59.5, kda: '8.1 / 3.4 / 6.2', role: 'Mage' }
    ],
    recentMatches: [
      { result: 'Victory', hero: 'Valentina', kda: '8/2/14', medal: 'MVP', score: 13.9, duration: '14:10', mode: 'Ranked' },
      { result: 'Victory', hero: 'Lunox', kda: '10/3/8', medal: 'Gold', score: 12.1, duration: '17:35', mode: 'Ranked' },
      { result: 'Victory', hero: 'Mathilda', kda: '2/1/18', medal: 'MVP', score: 14.2, duration: '13:50', mode: 'Ranked' },
      { result: 'Defeat', hero: 'Lunox', kda: '6/4/5', medal: 'Silver', score: 7.9, duration: '18:15', mode: 'Ranked' },
      { result: 'Victory', hero: 'Angela', kda: '1/2/19', medal: 'Gold', score: 11.5, duration: '15:22', mode: 'Ranked' }
    ]
  },

  '55443322_1050': {
    id: '55443322',
    zone: '1050',
    ign: 'TigrealGod_Roam',
    level: 82,
    avatar: 'assets/heroes/tigreal.png',
    currentRank: 'Mythic',
    stars: 25,
    highestRank: 'Mythical Honor 38★',
    currentSeason: 'Season 33',
    overallWinRate: 56.5,
    seasonWinRate: 58.2,
    totalMatches: 2450,
    seasonMatches: 180,
    mvpCount: 390,
    savageCount: 1,
    maniacCount: 12,
    tripleKillCount: 88,
    winStreak: 3,
    creditScore: 110,
    calculatedMMR: 81.2,
    radar: {
      combat: 64,
      push: 42,
      farming: 60,
      survivability: 95,
      teamfight: 98,
      versatility: 70
    },
    roles: {
      tank: { matches: 1520, winRate: 58.8, percentage: 62.0 },
      support: { matches: 450, winRate: 56.2, percentage: 18.4 },
      fighter: { matches: 300, winRate: 52.0, percentage: 12.2 },
      mage: { matches: 100, winRate: 49.0, percentage: 4.1 },
      marksman: { matches: 50, winRate: 44.0, percentage: 2.0 },
      assassin: { matches: 30, winRate: 40.0, percentage: 1.3 }
    },
    topHeroes: [
      { name: 'Tigreal', matches: 780, winRate: 60.2, kda: '2.1 / 3.2 / 15.4', role: 'Tank' },
      { name: 'Franco', matches: 490, winRate: 57.1, kda: '3.4 / 3.8 / 11.2', role: 'Tank' },
      { name: 'Minotaur', matches: 320, winRate: 59.4, kda: '1.8 / 2.9 / 16.1', role: 'Tank' },
      { name: 'Khufra', matches: 260, winRate: 55.0, kda: '2.5 / 4.1 / 13.0', role: 'Tank' },
      { name: 'Chou', matches: 180, winRate: 53.3, kda: '4.1 / 4.0 / 9.2', role: 'Fighter' }
    ],
    recentMatches: [
      { result: 'Victory', hero: 'Tigreal', kda: '1/3/17', medal: 'MVP', score: 13.8, duration: '15:40', mode: 'Ranked' },
      { result: 'Victory', hero: 'Minotaur', kda: '2/2/14', medal: 'Gold', score: 11.7, duration: '14:20', mode: 'Ranked' },
      { result: 'Defeat', hero: 'Franco', kda: '3/5/8', medal: 'Silver', score: 7.2, duration: '18:50', mode: 'Ranked' },
      { result: 'Victory', hero: 'Tigreal', kda: '0/2/19', medal: 'MVP', score: 14.1, duration: '13:10', mode: 'Ranked' },
      { result: 'Defeat', hero: 'Khufra', kda: '2/6/9', medal: 'Silver', score: 6.8, duration: '16:45', mode: 'Ranked' }
    ]
  },

  '99887766_4099': {
    id: '99887766',
    zone: '4099',
    ign: 'EpicGlory_99',
    level: 46,
    avatar: 'assets/heroes/layla.png',
    currentRank: 'Epic',
    stars: 3,
    highestRank: 'Legend IV 2★',
    currentSeason: 'Season 33',
    overallWinRate: 48.2,
    seasonWinRate: 47.5,
    totalMatches: 1150,
    seasonMatches: 140,
    mvpCount: 95,
    savageCount: 2,
    maniacCount: 15,
    tripleKillCount: 72,
    winStreak: 1,
    creditScore: 104,
    calculatedMMR: 64.5,
    radar: {
      combat: 68,
      push: 38,
      farming: 52,
      survivability: 46,
      teamfight: 58,
      versatility: 50
    },
    roles: {
      marksman: { matches: 580, winRate: 48.5, percentage: 50.4 },
      fighter: { matches: 310, winRate: 49.0, percentage: 27.0 },
      assassin: { matches: 140, winRate: 42.1, percentage: 12.2 },
      mage: { matches: 70, winRate: 46.0, percentage: 6.1 },
      tank: { matches: 35, winRate: 41.0, percentage: 3.0 },
      support: { matches: 15, winRate: 40.0, percentage: 1.3 }
    },
    topHeroes: [
      { name: 'Layla', matches: 340, winRate: 47.2, kda: '6.4 / 7.1 / 4.8', role: 'Marksman' },
      { name: 'Miya', matches: 220, winRate: 49.1, kda: '5.8 / 6.5 / 5.2', role: 'Marksman' },
      { name: 'Zilong', matches: 190, winRate: 50.5, kda: '6.1 / 6.8 / 3.9', role: 'Fighter' },
      { name: 'Alucard', matches: 110, winRate: 44.5, kda: '5.2 / 7.9 / 4.1', role: 'Fighter' },
      { name: 'Nana', matches: 60, winRate: 48.0, kda: '4.0 / 5.2 / 8.5', role: 'Mage' }
    ],
    recentMatches: [
      { result: 'Defeat', hero: 'Layla', kda: '7/9/3', medal: 'Silver', score: 6.5, duration: '17:15', mode: 'Ranked' },
      { result: 'Victory', hero: 'Miya', kda: '10/5/6', medal: 'Gold', score: 10.4, duration: '19:30', mode: 'Ranked' },
      { result: 'Defeat', hero: 'Zilong', kda: '4/8/2', medal: 'Bronze', score: 4.8, duration: '13:40', mode: 'Ranked' },
      { result: 'Defeat', hero: 'Layla', kda: '5/7/4', medal: 'Silver', score: 6.9, duration: '16:20', mode: 'Ranked' },
      { result: 'Victory', hero: 'Layla', kda: '12/4/8', medal: 'MVP', score: 13.2, duration: '18:05', mode: 'Ranked' }
    ]
  }
};
