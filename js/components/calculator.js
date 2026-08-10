/**
 * MLBB Profile Analyzer - Win Rate & Rank Goal Calculator
 */

export function calculateWinRateGoal(totalMatches, currentWinRate, targetWinRate) {
  const matches = parseInt(totalMatches, 10);
  const currentWR = parseFloat(currentWinRate);
  const targetWR = parseFloat(targetWinRate);

  if (isNaN(matches) || isNaN(currentWR) || isNaN(targetWR) || matches <= 0) {
    return {
      valid: false,
      message: 'Please enter valid numerical inputs.'
    };
  }

  if (targetWR >= 100) {
    return {
      valid: false,
      message: '100% win rate is mathematically impossible once a match is lost.'
    };
  }

  if (targetWR <= currentWR) {
    return {
      valid: false,
      alreadyAchieved: true,
      message: `Your target (${targetWR}%) is already lower than or equal to your current win rate (${currentWR}%).`
    };
  }

  const currentWins = Math.round(matches * (currentWR / 100));
  const t = targetWR / 100;

  // Formula for consecutive 100% wins:
  // (currentWins + x) / (matches + x) = t
  // x = (t * matches - currentWins) / (1 - t)
  const consecutiveWinsNeeded = Math.ceil((t * matches - currentWins) / (1 - t));

  // Scenario 1: Playing at 70% win rate
  let matchesAt70 = null;
  if (0.70 > t) {
    matchesAt70 = Math.ceil((t * matches - currentWins) / (0.70 - t));
  }

  // Scenario 2: Playing at 80% win rate
  let matchesAt80 = null;
  if (0.80 > t) {
    matchesAt80 = Math.ceil((t * matches - currentWins) / (0.80 - t));
  }

  return {
    valid: true,
    alreadyAchieved: false,
    matches,
    currentWR,
    targetWR,
    currentWins,
    currentLosses: matches - currentWins,
    consecutiveWinsNeeded: Math.max(1, consecutiveWinsNeeded),
    newTotalMatches: matches + consecutiveWinsNeeded,
    matchesAt70,
    matchesAt80
  };
}

export function simulateUpcomingMatches(matches, currentWR, upcomingWins, upcomingLosses) {
  const total = parseInt(matches, 10);
  const wr = parseFloat(currentWR);
  const wins = parseInt(upcomingWins, 10) || 0;
  const losses = parseInt(upcomingLosses, 10) || 0;

  const initialWins = Math.round(total * (wr / 100));
  const newTotal = total + wins + losses;
  const newWins = initialWins + wins;
  const newWR = newTotal > 0 ? (newWins / newTotal) * 100 : 0;
  const diff = newWR - wr;

  return {
    newTotal,
    newWins,
    newWR: Math.round(newWR * 100) / 100,
    diff: Math.round(diff * 100) / 100
  };
}
