/**
 * MLBB Profile Analyzer - Main App Controller (Integrated with Live /api/player Endpoint)
 */

import { MOCK_PROFILES } from './data/mockProfiles.js';
import { ALL_HEROES } from './data/allHeroes.js';
import { renderRadarChart, calculateCombatPower, getLetterGrade } from './components/radarChart.js';
import { calculateWinRateGoal } from './components/calculator.js';
import { generateDiagnostics } from './components/diagnostics.js';
import { setupScreenshotParser } from './components/screenshotParser.js';

let currentProfile = MOCK_PROFILES['12345678_2024'];
let activeRoleFilter = 'ALL';
let activeRosterRoleFilter = 'ALL';
let rosterSearchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  // Load initial profile
  loadProfile(currentProfile);

  // Render complete official hero database (132 heroes)
  renderOfficialRoster(ALL_HEROES, activeRosterRoleFilter, rosterSearchQuery);

  // Setup UI event listeners
  setupEventListeners();

  // Setup Screenshot Parser
  setupScreenshotParser((parsedProfile) => {
    document.getElementById('scannerModal').classList.remove('active');
    loadProfile(parsedProfile);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function loadProfile(profile) {
  currentProfile = profile;

  // 1. Update Profile Overview
  document.getElementById('playerIgn').textContent = profile.ign.replace(/^[^\w\s]+/, '').trim();
  document.getElementById('playerAvatar').src = profile.avatar;
  document.getElementById('playerLevel').textContent = profile.level || 99;
  document.getElementById('displayUserId').textContent = profile.id;
  document.getElementById('displayZoneId').textContent = profile.zone;
  document.getElementById('displaySeason').textContent = profile.currentSeason || 'Season 33';
  document.getElementById('displayHighestRank').textContent = profile.highestRank || `${profile.currentRank} 50★`;
  document.getElementById('currentRankText').textContent = profile.currentRank;
  document.getElementById('rankStarsText').textContent = `${profile.stars || 0} Stars`;

  // Sidebar sync
  const sidebarIgn = document.getElementById('sidebarIgn');
  const sidebarRank = document.getElementById('sidebarRank');
  const sidebarAvatar = document.getElementById('sidebarAvatar');
  if (sidebarIgn) sidebarIgn.textContent = profile.ign.replace(/^[^\w\s]+/, '').trim();
  if (sidebarRank) sidebarRank.textContent = profile.currentRank;
  if (sidebarAvatar) sidebarAvatar.src = profile.avatar;

  // 2. Update Quick Metrics
  document.getElementById('statOverallWR').textContent = `${profile.overallWinRate}%`;
  document.getElementById('statTotalMatches').textContent = Number(profile.totalMatches).toLocaleString();
  document.getElementById('statMvpCount').textContent = Number(profile.mvpCount || 0).toLocaleString();
  document.getElementById('statSavageManiac').textContent = `${profile.savageCount || 0} / ${profile.maniacCount || 0}`;
  document.getElementById('statWinStreak').textContent = `${profile.winStreak || 1} Wins`;

  // 3. Render 6-Axis Radar & Combat Grade
  renderRadarChart('radarChartCanvas', profile.radar, profile.ign);
  const powerScore = calculateCombatPower(profile.radar);
  const gradeInfo = getLetterGrade(powerScore);
  
  document.getElementById('combatPowerScore').textContent = `${powerScore} / 100`;
  const gradeBadge = document.getElementById('letterGradeBadge');
  gradeBadge.textContent = gradeInfo.grade;
  gradeBadge.style.color = gradeInfo.color;
  gradeBadge.style.borderColor = gradeInfo.color;
  document.getElementById('radarSubtitle').textContent = `${gradeInfo.grade} • ${gradeInfo.desc}`;

  // 4. Update Win Rate Goal Calculator Default Values
  document.getElementById('calcTotalMatches').value = profile.totalMatches;
  document.getElementById('calcCurrentWR').value = profile.overallWinRate;
  
  const targetWR = Math.min(99, Math.ceil(profile.overallWinRate + 1.5));
  document.getElementById('calcTargetWR').value = targetWR;
  runWinRateCalculation();

  // 5. Render Hero Mastery
  renderHeroMastery(profile.topHeroes, activeRoleFilter);

  // 6. Render Role Distribution
  renderRoleDistribution(profile.roles);

  // 7. Render AI Diagnostics & Strategy
  renderDiagnostics(profile);

  // 8. Render Recent Matches
  renderRecentMatches(profile.recentMatches || []);
}

function findHeroAvatar(heroName) {
  const match = ALL_HEROES.find(h => h.name.toLowerCase() === heroName.toLowerCase());
  if (match && match.avatar) {
    return match.avatar;
  }
  const slug = heroName.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  return `assets/heroes/${slug}.png`;
}

function renderHeroMastery(heroesList = [], roleFilter = 'ALL') {
  const container = document.getElementById('heroesGrid');
  container.innerHTML = '';

  let filtered = heroesList;
  if (roleFilter !== 'ALL') {
    filtered = heroesList.filter(h => h.role.toLowerCase() === roleFilter.toLowerCase());
  }

  if (!filtered || filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 20px; text-align: center; color: var(--text-dim); font-size: 13px;">
        No heroes found for role: ${roleFilter}.
      </div>
    `;
    return;
  }

  filtered.forEach(hero => {
    const avatarUrl = findHeroAvatar(hero.name);
    const heroInfo = ALL_HEROES.find(h => h.name.toLowerCase() === hero.name.toLowerCase());
    const laneText = heroInfo ? heroInfo.lane : hero.role;

    const card = document.createElement('div');
    card.className = 'hero-entry';
    card.innerHTML = `
      <img src="${avatarUrl}" alt="${hero.name}" class="hero-thumb" onerror="this.src='assets/heroes/miya.png'">
      <div class="hero-meta-clean">
        <div class="hero-name-clean">${hero.name}</div>
        <div style="font-size: 11px; color: var(--text-dim); margin-top: 1px;">${laneText}</div>
        <div class="hero-stats-clean">
          <span>${hero.matches} matches</span>
          <span style="font-weight: 600; color: var(--text-white);">${hero.winRate}% WR</span>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderOfficialRoster(heroesList = ALL_HEROES, roleFilter = 'ALL', search = '') {
  const container = document.getElementById('allHeroesGrid');
  if (!container) return;
  container.innerHTML = '';

  let results = heroesList;

  // Filter by Role
  if (roleFilter !== 'ALL') {
    results = results.filter(h => 
      h.role.toLowerCase() === roleFilter.toLowerCase() || 
      (h.roles && h.roles.some(r => r.toLowerCase() === roleFilter.toLowerCase()))
    );
  }

  // Filter by Search Query
  if (search.trim() !== '') {
    const q = search.trim().toLowerCase();
    results = results.filter(h => 
      h.name.toLowerCase().includes(q) || 
      h.lane.toLowerCase().includes(q) ||
      h.role.toLowerCase().includes(q)
    );
  }

  if (results.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 30px; text-align: center; color: var(--text-dim);">
        No heroes matching "${search}" in role "${roleFilter}".
      </div>
    `;
    return;
  }

  results.forEach(hero => {
    const card = document.createElement('div');
    card.className = 'hero-entry';
    card.innerHTML = `
      <img src="${hero.avatar}" alt="${hero.name}" class="hero-thumb" onerror="this.src='${hero.cdnAvatar}'">
      <div class="hero-meta-clean">
        <div class="hero-name-clean">${hero.name}</div>
        <div style="font-size: 11.5px; color: var(--accent-primary); font-weight: 500;">${hero.role}</div>
        <div style="font-size: 11px; color: var(--text-dim); margin-top: 2px;">${hero.lane}</div>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderRoleDistribution(roles = {}) {
  const container = document.getElementById('roleDistributionWrap');
  container.innerHTML = '';

  const roleKeys = Object.keys(roles);
  if (roleKeys.length === 0) {
    container.innerHTML = `<div style="color: var(--text-dim); font-size: 12px;">No role data available.</div>`;
    return;
  }

  roleKeys.forEach(roleKey => {
    const roleData = roles[roleKey];
    const roleName = roleKey.charAt(0).toUpperCase() + roleKey.slice(1);

    const item = document.createElement('div');
    item.className = 'role-row';
    item.innerHTML = `
      <div class="role-row-header">
        <span class="role-name-text">${roleName}</span>
        <span class="role-metric-text">${roleData.matches} matches • ${roleData.winRate}% WR (${roleData.percentage}%)</span>
      </div>
      <div class="role-track">
        <div class="role-fill" style="width: ${roleData.percentage}%;"></div>
      </div>
    `;
    container.appendChild(item);
  });
}

function renderDiagnostics(profile) {
  const diag = generateDiagnostics(profile);

  // Strengths
  const strengthsContainer = document.getElementById('strengthsList');
  strengthsContainer.innerHTML = diag.strengths.map(s => `
    <div class="insight-box">
      <div class="insight-title">${s.title}</div>
      <div class="insight-desc">${s.desc}</div>
    </div>
  `).join('');

  // Weaknesses
  const weaknessesContainer = document.getElementById('weaknessesList');
  weaknessesContainer.innerHTML = diag.weaknesses.map(w => `
    <div class="insight-box">
      <div class="insight-title">${w.title}</div>
      <div class="insight-desc">${w.desc}</div>
    </div>
  `).join('');

  // Tactical Tips
  const tipsContainer = document.getElementById('tacticalTipsList');
  tipsContainer.innerHTML = diag.tips.map(t => `
    <div class="insight-box">
      <div class="insight-title">${t.title}</div>
      <div class="insight-desc">${t.text}</div>
    </div>
  `).join('');

  // Recommended Meta Heroes
  document.getElementById('recRoleTitle').textContent = diag.primaryRole;
  const metaContainer = document.getElementById('metaHeroesList');
  metaContainer.innerHTML = diag.metaHeroRecommendations.map(hero => `
    <div class="meta-pick-card">
      <div class="meta-pick-header">
        <span class="meta-pick-name">${hero.name}</span>
        <span class="meta-tier-badge">${hero.tier}</span>
      </div>
      <div style="font-size: 12px; color: var(--text-dim);">${hero.role}</div>
      <div class="meta-pick-reason">${hero.reason}</div>
    </div>
  `).join('');
}

function renderRecentMatches(matches = []) {
  const tbody = document.getElementById('recentMatchList');
  tbody.innerHTML = '';

  if (matches.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-dim);">No recent matches recorded.</td></tr>`;
    return;
  }

  matches.forEach(m => {
    const isWin = m.result === 'Victory';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="pill-status ${isWin ? 'pill-victory' : 'pill-defeat'}">${m.result}</span></td>
      <td><strong style="color: var(--text-white);">${m.hero}</strong></td>
      <td>${m.mode || 'Ranked'}</td>
      <td style="font-family: var(--font-heading); font-weight: 600; color: var(--text-white);">${m.kda}</td>
      <td>${m.medal || 'Gold'} (${m.score})</td>
      <td style="color: var(--text-dim);">${m.duration}</td>
    `;
    tbody.appendChild(tr);
  });
}

function runWinRateCalculation() {
  const matches = document.getElementById('calcTotalMatches').value;
  const currentWR = document.getElementById('calcCurrentWR').value;
  const targetWR = document.getElementById('calcTargetWR').value;

  const result = calculateWinRateGoal(matches, currentWR, targetWR);
  const numberElem = document.getElementById('consecutiveWinsResult');
  const summaryElem = document.getElementById('calcSummaryText');
  const scenario80Elem = document.getElementById('scenario80');

  if (!result.valid) {
    numberElem.textContent = '--';
    summaryElem.textContent = result.message;
    scenario80Elem.textContent = '--';
    return;
  }

  numberElem.textContent = result.consecutiveWinsNeeded.toLocaleString();
  summaryElem.textContent = `To reach ${result.targetWR}% win rate with a 100% win streak. Projected total: ${result.newTotalMatches.toLocaleString()} matches.`;
  
  if (result.matchesAt80) {
    scenario80Elem.textContent = `At 80% win rate pace: ~${result.matchesAt80.toLocaleString()} matches`;
  } else {
    scenario80Elem.textContent = 'Not applicable for target >80%';
  }
}

async function fetchPlayerProfile(userId, zoneId) {
  const btnAnalyze = document.getElementById('btnAnalyze');
  const originalText = btnAnalyze.textContent;
  btnAnalyze.textContent = 'Fetching...';
  btnAnalyze.disabled = true;

  try {
    const res = await fetch(`/api/player?userId=${encodeURIComponent(userId)}&zoneId=${encodeURIComponent(zoneId)}`);
    if (res.ok) {
      const data = await res.json();
      loadProfile(data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      throw new Error('API response not ok');
    }
  } catch (err) {
    console.warn('API error, using local resolution:', err);
    const key = `${userId}_${zoneId}`;
    if (MOCK_PROFILES[key]) {
      loadProfile(MOCK_PROFILES[key]);
    }
  } finally {
    btnAnalyze.textContent = originalText;
    btnAnalyze.disabled = false;
  }
}

function setupEventListeners() {
  // Search Form Submit
  const searchForm = document.getElementById('searchForm');
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userId = document.getElementById('userIdInput').value.trim();
    const zoneId = document.getElementById('zoneIdInput').value.trim();
    if (userId && zoneId) {
      fetchPlayerProfile(userId, zoneId);
    }
  });

  // Preset Buttons
  const presetBtns = document.querySelectorAll('.preset-button');
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const presetKey = btn.dataset.preset;
      if (MOCK_PROFILES[presetKey]) {
        const p = MOCK_PROFILES[presetKey];
        document.getElementById('userIdInput').value = p.id;
        document.getElementById('zoneIdInput').value = p.zone;
        loadProfile(p);
      }
    });
  });

  // Hero Role Filter Tabs (Mastery)
  const roleTabs = document.querySelectorAll('#heroRoleFilters .filter-tab-btn');
  roleTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      roleTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeRoleFilter = tab.dataset.role;
      renderHeroMastery(currentProfile.topHeroes, activeRoleFilter);
    });
  });

  // Roster Filter Tabs (132 Hero Database)
  const rosterTabs = document.querySelectorAll('#rosterRoleFilters .filter-tab-btn');
  rosterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      rosterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeRosterRoleFilter = tab.dataset.rosterRole;
      renderOfficialRoster(ALL_HEROES, activeRosterRoleFilter, rosterSearchQuery);
    });
  });

  // Roster Search Input
  const rosterSearchInput = document.getElementById('rosterSearchInput');
  if (rosterSearchInput) {
    rosterSearchInput.addEventListener('input', (e) => {
      rosterSearchQuery = e.target.value;
      renderOfficialRoster(ALL_HEROES, activeRosterRoleFilter, rosterSearchQuery);
    });
  }

  // Calculator Input Changes
  ['calcTotalMatches', 'calcCurrentWR', 'calcTargetWR'].forEach(id => {
    document.getElementById(id).addEventListener('input', runWinRateCalculation);
  });

  // Modals
  const scannerModal = document.getElementById('scannerModal');
  const manualModal = document.getElementById('manualModal');

  const openScanner = () => scannerModal.classList.add('active');
  const closeScanner = () => scannerModal.classList.remove('active');
  const openManual = () => manualModal.classList.add('active');
  const closeManual = () => manualModal.classList.remove('active');

  const btnOpenScanner = document.getElementById('btnOpenScanner');
  const btnHeaderScanner = document.getElementById('btnHeaderScanner');
  if (btnOpenScanner) btnOpenScanner.addEventListener('click', (e) => { e.preventDefault(); openScanner(); });
  if (btnHeaderScanner) btnHeaderScanner.addEventListener('click', openScanner);
  document.getElementById('btnCloseScanner').addEventListener('click', closeScanner);

  const btnOpenManual = document.getElementById('btnOpenManual');
  const btnHeaderManual = document.getElementById('btnHeaderManual');
  if (btnOpenManual) btnOpenManual.addEventListener('click', (e) => { e.preventDefault(); openManual(); });
  if (btnHeaderManual) btnHeaderManual.addEventListener('click', openManual);
  document.getElementById('btnCloseManual').addEventListener('click', closeManual);

  // Custom Profile Form Submit
  document.getElementById('customProfileForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const customIgn = document.getElementById('customIgn').value;
    const customRank = document.getElementById('customRank').value;
    const customStars = parseInt(document.getElementById('customStars').value, 10) || 25;
    const customMatches = parseInt(document.getElementById('customMatches').value, 10) || 1000;
    const customWR = parseFloat(document.getElementById('customWinRate').value) || 55.0;
    const customMvp = parseInt(document.getElementById('customMvp').value, 10) || 200;

    const customProfile = {
      id: '88991122',
      zone: '1001',
      ign: customIgn,
      level: 80,
      avatar: 'assets/heroes/chou.png',
      currentRank: customRank,
      stars: customStars,
      highestRank: `${customRank} ${customStars + 10}★`,
      currentSeason: 'Season 33',
      overallWinRate: customWR,
      totalMatches: customMatches,
      mvpCount: customMvp,
      savageCount: Math.round(customMvp * 0.05),
      maniacCount: Math.round(customMvp * 0.15),
      winStreak: 4,
      creditScore: 110,
      radar: {
        combat: Math.min(99, Math.round(customWR * 1.3)),
        push: Math.min(99, Math.round(customWR * 1.1)),
        farming: Math.min(99, Math.round(customWR * 1.2)),
        survivability: Math.min(99, Math.round(customWR * 1.15)),
        teamfight: Math.min(99, Math.round(customWR * 1.25)),
        versatility: 75
      },
      roles: {
        fighter: { matches: Math.round(customMatches * 0.4), winRate: customWR + 1, percentage: 40.0 },
        assassin: { matches: Math.round(customMatches * 0.25), winRate: customWR, percentage: 25.0 },
        marksman: { matches: Math.round(customMatches * 0.2), winRate: customWR - 2, percentage: 20.0 },
        tank: { matches: Math.round(customMatches * 0.1), winRate: customWR - 1, percentage: 10.0 },
        mage: { matches: Math.round(customMatches * 0.05), winRate: customWR, percentage: 5.0 }
      },
      topHeroes: [
        { name: 'Chou', matches: Math.round(customMatches * 0.3), winRate: customWR + 2, kda: '6.5 / 2.8 / 7.2', role: 'Fighter' },
        { name: 'Fanny', matches: Math.round(customMatches * 0.2), winRate: customWR + 1, kda: '8.1 / 3.0 / 5.4', role: 'Assassin' },
        { name: 'Beatrix', matches: Math.round(customMatches * 0.15), winRate: customWR, kda: '7.0 / 3.2 / 6.0', role: 'Marksman' }
      ],
      recentMatches: [
        { result: 'Victory', hero: 'Chou', kda: '8/2/11', medal: 'MVP', score: 13.5, duration: '14:20', mode: 'Ranked' },
        { result: 'Victory', hero: 'Beatrix', kda: '9/3/8', medal: 'Gold', score: 11.2, duration: '16:10', mode: 'Ranked' },
        { result: 'Defeat', hero: 'Fanny', kda: '6/5/4', medal: 'Silver', score: 7.1, duration: '17:40', mode: 'Ranked' }
      ]
    };

    manualModal.classList.remove('active');
    loadProfile(customProfile);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Backdrop click to close
  window.addEventListener('click', (e) => {
    if (e.target === scannerModal) scannerModal.classList.remove('active');
    if (e.target === manualModal) manualModal.classList.remove('active');
  });
}
