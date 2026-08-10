/**
 * MLBB Profile Analyzer - AI Gameplay Diagnostics (Clean Minimalist Theme)
 */

export function generateDiagnostics(profile) {
  const radar = profile.radar || { combat: 50, push: 50, farming: 50, survivability: 50, teamfight: 50, versatility: 50 };
  const strengths = [];
  const weaknesses = [];
  const tips = [];
  const metaHeroRecommendations = [];

  // Determine Primary Role
  let primaryRole = 'Assassin';
  let highestRoleCount = -1;
  if (profile.roles) {
    Object.keys(profile.roles).forEach(r => {
      if (profile.roles[r].matches > highestRoleCount) {
        highestRoleCount = profile.roles[r].matches;
        primaryRole = r.charAt(0).toUpperCase() + r.slice(1);
      }
    });
  }

  // Combat Assessment
  if (radar.combat >= 85) {
    strengths.push({
      title: 'High Kill Threat & Execution',
      desc: 'Consistent early-game kill conversion and strong team fight burst execution.'
    });
  } else if (radar.combat <= 60) {
    weaknesses.push({
      title: 'Lower Damage Output & Execution',
      desc: 'Struggling to secure eliminations during pivotal 5v5 skirmishes. Focus on combo discipline and priority targeting.'
    });
  }

  // Push & Objective Assessment
  if (radar.push >= 80) {
    strengths.push({
      title: 'Objective & Turret Pressure',
      desc: 'Strong macro focus on outer and inhibitor towers, consistently forcing enemy map rotations.'
    });
  } else if (radar.push <= 55) {
    weaknesses.push({
      title: 'Neglected Lane Management',
      desc: 'Over-indexing on skirmishes while leaving side-lane waves and turrets unmanaged.'
    });
  }

  // Farming & Economy Assessment
  if (radar.farming >= 85) {
    strengths.push({
      title: 'Efficient Gold Per Minute (GPM)',
      desc: 'Rapid jungle pathing and minion wave clearing, hitting key core items ahead of curve.'
    });
  } else if (radar.farming <= 60) {
    weaknesses.push({
      title: 'Delayed Core Item Spikes',
      desc: 'Net worth falls behind in mid-game due to idle roaming. Prioritize clearing crashing waves.'
    });
  }

  // Survivability Assessment
  if (radar.survivability >= 85) {
    strengths.push({
      title: 'Strong Positioning & Survival Rate',
      desc: 'Low death ratio, disciplined disengagement, and tracking of key enemy crowd control spells.'
    });
  } else if (radar.survivability <= 60) {
    weaknesses.push({
      title: 'High Early Game Death Count',
      desc: 'Frequent unforced deaths concede tempo. Avoid face-checking unwarded river bushes.'
    });
  }

  // Team Fight Assessment
  if (radar.teamfight >= 85) {
    strengths.push({
      title: 'Reliable Teamfight Presence',
      desc: 'Consistently joins Turtle and Lord contests on timing.'
    });
  } else if (radar.teamfight <= 60) {
    weaknesses.push({
      title: 'Delayed Teamfight Rotations',
      desc: 'Often late to cross-map objective skirmishes.'
    });
  }

  // Versatility Assessment
  if (radar.versatility <= 60) {
    weaknesses.push({
      title: 'Narrow Role Specialization',
      desc: `High concentration in ${primaryRole}. In draft mode, expand your hero pool to mitigate bans.`
    });
  }

  if (strengths.length === 0) {
    strengths.push({
      title: 'Consistent Overall Fundamentals',
      desc: 'Balanced performance baseline across laning and team objective phases.'
    });
  }
  if (weaknesses.length === 0) {
    weaknesses.push({
      title: 'Micro Itemization Adjustments',
      desc: 'Solid macro game. Fine-tune reactive counter-building in late game stages.'
    });
  }

  // Rank-Up Tips
  tips.push({
    title: 'Wave Synchronization',
    text: 'Clear the opposite side wave 30 seconds before Lord spawn to create 4v5 pressure.'
  });
  tips.push({
    title: 'Adaptive Builds',
    text: 'Adjust your third item dynamically based on opponent damage distribution rather than static presets.'
  });

  // Meta Hero Recommendations
  const metaDatabase = {
    Assassin: [
      { name: 'Nolan', role: 'Assassin', tier: 'Tier 1', reason: 'High clear speed, low resource constraints, and built-in ultimate cleanse.' },
      { name: 'Joy', role: 'Assassin', tier: 'Tier 1', reason: 'High mobility and crowd-control immunity to dive enemy backlines.' },
      { name: 'Fanny', role: 'Assassin', tier: 'Tier 1', reason: 'Unmatched rotation speed across the map when mechanics are perfected.' }
    ],
    Marksman: [
      { name: 'Claude', role: 'Marksman', tier: 'Tier 1', reason: 'High team fight AOE damage and battle spell flexibility.' },
      { name: 'Beatrix', role: 'Marksman', tier: 'Tier 1', reason: 'Versatile weapon kit providing sniper poke and close-range burst.' },
      { name: 'Brody', role: 'Marksman', tier: 'Tier 2', reason: 'High single-hit base physical scaling and laning phase advantage.' }
    ],
    Mage: [
      { name: 'Valentina', role: 'Mage', tier: 'Tier 1', reason: 'Steals high-impact enemy ultimates and maintains solid mobility.' },
      { name: 'Lunox', role: 'Mage', tier: 'Tier 1', reason: 'High percentage tank shredding and temporary invulnerability.' },
      { name: 'Novaria', role: 'Mage', tier: 'Tier 2', reason: 'Provides vision scouting and long-range poke before objectives.' }
    ],
    Tank: [
      { name: 'Tigreal', role: 'Tank', tier: 'Tier 1', reason: 'Reliable multi-target crowd control setup with flicker initiation.' },
      { name: 'Minotaur', role: 'Tank', tier: 'Tier 1', reason: 'Airborne crowd control combined with sustain and defensive buffs.' },
      { name: 'Khufra', role: 'Tank', tier: 'Tier 2', reason: 'Effective counter to dash-heavy enemy compositions.' }
    ],
    Support: [
      { name: 'Mathilda', role: 'Support', tier: 'Tier 1', reason: 'Provides team mobility repositioning and proactive shielding.' },
      { name: 'Angela', role: 'Support', tier: 'Tier 1', reason: 'Global shield support enabling hyper-carries to dive confidently.' },
      { name: 'Faramis', role: 'Support', tier: 'Tier 1', reason: 'Grants temporary second health pool in decisive 5v5 teamfights.' }
    ],
    Fighter: [
      { name: 'Yu Zhong', role: 'Fighter', tier: 'Tier 1', reason: 'Dragon form bypasses enemy frontline to target backline damage dealers.' },
      { name: 'Terizla', role: 'Fighter', tier: 'Tier 1', reason: 'High passive damage reduction and wide-area lockdown.' },
      { name: 'Chou', role: 'Fighter', tier: 'Tier 2', reason: 'Reliable single-target isolation kick and CC immunity.' }
    ]
  };

  const pool = metaDatabase[primaryRole] || metaDatabase['Assassin'];
  metaHeroRecommendations.push(...pool);

  return {
    primaryRole,
    strengths,
    weaknesses,
    tips,
    metaHeroRecommendations
  };
}
