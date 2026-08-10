/**
 * MLBB Profile Analyzer - 6-Axis Performance Radar Chart (Clean Dashboard Theme)
 */

let radarChartInstance = null;

export function renderRadarChart(canvasId, radarData, playerName = 'Player') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  if (radarChartInstance) {
    radarChartInstance.destroy();
  }

  const labels = [
    'Combat (KDA)',
    'Push (Turret)',
    'Farming (GPM)',
    'Survivability',
    'Team Fight',
    'Versatility'
  ];

  const dataValues = [
    radarData.combat || 50,
    radarData.push || 50,
    radarData.farming || 50,
    radarData.survivability || 50,
    radarData.teamfight || 50,
    radarData.versatility || 50
  ];

  // Clean, non-neon, non-gradient radar chart
  radarChartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: labels,
      datasets: [
        {
          label: `${playerName} Performance`,
          data: dataValues,
          backgroundColor: 'rgba(59, 130, 246, 0.15)',
          borderColor: '#3B82F6',
          borderWidth: 2,
          pointBackgroundColor: '#3B82F6',
          pointBorderColor: '#151923',
          pointHoverBackgroundColor: '#FFFFFF',
          pointHoverBorderColor: '#3B82F6',
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBorderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 800,
        easing: 'easeOutQuart'
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: '#1B202C',
          titleColor: '#FFFFFF',
          bodyColor: '#8E9BAE',
          borderColor: '#202634',
          borderWidth: 1,
          padding: 10,
          displayColors: false,
          callbacks: {
            label: function (context) {
              return `Rating: ${context.raw} / 100`;
            }
          }
        }
      },
      scales: {
        r: {
          angleLines: {
            color: '#202634',
            lineWidth: 1
          },
          grid: {
            color: '#202634',
            circular: false,
            lineWidth: 1
          },
          pointLabels: {
            color: '#8E9BAE',
            font: {
              family: "'Inter', sans-serif",
              size: 11.5,
              weight: '500'
            },
            backdropColor: 'transparent'
          },
          ticks: {
            display: false,
            stepSize: 20
          },
          suggestedMin: 0,
          suggestedMax: 100
        }
      }
    }
  });

  return radarChartInstance;
}

export function calculateCombatPower(radarData) {
  const values = [
    radarData.combat * 0.25,
    radarData.farming * 0.20,
    radarData.push * 0.15,
    radarData.teamfight * 0.20,
    radarData.survivability * 0.10,
    radarData.versatility * 0.10
  ];
  const total = values.reduce((a, b) => a + b, 0);
  return Math.round(total * 10) / 10;
}

export function getLetterGrade(powerScore) {
  if (powerScore >= 94) return { grade: 'Grade S+', color: '#3B82F6', desc: 'Elite Tier' };
  if (powerScore >= 88) return { grade: 'Grade S', color: '#10B981', desc: 'High Tier' };
  if (powerScore >= 80) return { grade: 'Grade A+', color: '#3B82F6', desc: 'Above Average' };
  if (powerScore >= 72) return { grade: 'Grade A', color: '#8E9BAE', desc: 'Competent' };
  if (powerScore >= 60) return { grade: 'Grade B', color: '#F59E0B', desc: 'Average' };
  return { grade: 'Grade C', color: '#EF4444', desc: 'Needs Improvement' };
}
