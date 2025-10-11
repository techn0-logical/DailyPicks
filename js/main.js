// DailyPicks JavaScript - Data Loading and Display

// Global variables to store data
let teamsData = {};
let yesterdayData = {};
let todayData = {};
let tomorrowData = {};
let performanceData = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    try {
        // Load all data files
        await loadAllData();
        
        // Update header with current information
        updateHeader();
        
        // Populate all sections
        populateYesterdaySection();
        populateTodaySection();
        populateTomorrowSection();
        populatePerformanceSection();
        
        console.log('DailyPicks loaded successfully!');
    } catch (error) {
        console.error('Error initializing app:', error);
        showErrorMessage('Failed to load data. Please try refreshing the page.');
    }
}

// Load all JSON data files
async function loadAllData() {
    try {
        // Load teams data (JavaScript file)
        if (typeof MLB_TEAMS !== 'undefined') {
            teamsData = MLB_TEAMS;
        }
        
        // Load JSON data files
        const [yesterday, today, tomorrow, performance] = await Promise.all([
            fetch('data/yesterday.json').then(response => response.json()),
            fetch('data/today.json').then(response => response.json()),
            fetch('data/tomorrow.json').then(response => response.json()),
            fetch('data/performance.json').then(response => response.json())
        ]);
        
        yesterdayData = yesterday;
        todayData = today;
        tomorrowData = tomorrow;
        performanceData = performance;
        
    } catch (error) {
        console.error('Error loading data:', error);
        throw error;
    }
}

// Update header with current date and last updated info
function updateHeader() {
    const currentDate = document.getElementById('current-date');
    const lastUpdated = document.getElementById('last-updated');
    
    if (currentDate) {
        const today = new Date();
        currentDate.textContent = today.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    if (lastUpdated && performanceData.model_stats) {
        const updateTime = new Date(performanceData.model_stats.last_updated);
        lastUpdated.textContent = `Last updated: ${updateTime.toLocaleDateString()} ${updateTime.toLocaleTimeString()}`;
    }
}

// Populate Yesterday's Results section
function populateYesterdaySection() {
    const summaryDiv = document.getElementById('yesterday-summary');
    const gamesDiv = document.getElementById('yesterday-games');
    
    if (!summaryDiv || !gamesDiv || !yesterdayData) return;
    
    // Create summary
    const summary = yesterdayData.summary;
    summaryDiv.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-card__value">${summary.total_games}</div>
                <div class="stat-card__label">Total Games</div>
            </div>
            <div class="stat-card">
                <div class="stat-card__value">${summary.correct_predictions}</div>
                <div class="stat-card__label">Correct Predictions</div>
            </div>
            <div class="stat-card">
                <div class="stat-card__value">${summary.accuracy}%</div>
                <div class="stat-card__label">Accuracy</div>
            </div>
        </div>
        ${summary.notable_outcomes.length > 0 ? `
        <div style="margin-top: 1rem;">
            <h4>Notable Outcomes:</h4>
            <ul>
                ${summary.notable_outcomes.map(outcome => `<li>${outcome}</li>`).join('')}
            </ul>
        </div>
        ` : ''}
    `;
    
    // Create game cards
    gamesDiv.innerHTML = yesterdayData.games.map(game => createYesterdayGameCard(game)).join('');
}

// Populate Today's Games section
function populateTodaySection() {
    const summaryDiv = document.getElementById('today-summary');
    const gamesDiv = document.getElementById('today-games');
    
    if (!summaryDiv || !gamesDiv || !todayData) return;
    
    // Create summary
    const summary = todayData.summary;
    summaryDiv.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-card__value">${summary.total_games}</div>
                <div class="stat-card__label">Games Today</div>
            </div>
            <div class="stat-card">
                <div class="stat-card__value">${summary.avg_confidence}%</div>
                <div class="stat-card__label">Avg Confidence</div>
            </div>
            <div class="stat-card">
                <div class="stat-card__value">${summary.top_picks.length}</div>
                <div class="stat-card__label">Top Picks</div>
            </div>
        </div>
        ${summary.top_picks.length > 0 ? `
        <div style="margin-top: 1rem;">
            <h4>Today's Top Pick:</h4>
            <p><strong>${getTeamName(summary.top_picks[0].pick)}</strong> - ${summary.top_picks[0].confidence}% confidence</p>
            <p><em>${summary.top_picks[0].reasoning}</em></p>
        </div>
        ` : ''}
    `;
    
    // Create game cards
    gamesDiv.innerHTML = todayData.games.map(game => createTodayGameCard(game)).join('');
}

// Populate Tomorrow's Preview section
function populateTomorrowSection() {
    const summaryDiv = document.getElementById('tomorrow-summary');
    const gamesDiv = document.getElementById('tomorrow-games');
    
    if (!summaryDiv || !gamesDiv || !tomorrowData) return;
    
    // Create summary
    const summary = tomorrowData.summary;
    summaryDiv.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-card__value">${summary.total_games}</div>
                <div class="stat-card__label">Games Tomorrow</div>
            </div>
            <div class="stat-card">
                <div class="stat-card__value">${summary.games_to_watch}</div>
                <div class="stat-card__label">Games to Watch</div>
            </div>
            <div class="stat-card">
                <div class="stat-card__value">${summary.early_favorites.length}</div>
                <div class="stat-card__label">Early Favorites</div>
            </div>
        </div>
        <div style="margin-top: 1rem;">
            <h4>Early Favorites:</h4>
            <p>${summary.early_favorites.map(team => getTeamName(team)).join(', ')}</p>
        </div>
    `;
    
    // Create game cards
    gamesDiv.innerHTML = tomorrowData.games.map(game => createTomorrowGameCard(game)).join('');
}

// Populate Performance section
function populatePerformanceSection() {
    const performanceDiv = document.getElementById('performance-stats');
    
    if (!performanceDiv || !performanceData) return;
    
    const modelStats = performanceData.model_stats;
    const recentPerf = performanceData.recent_performance;
    
    performanceDiv.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card" style="border-left: 4px solid #2563eb;">
                <div class="stat-card__value">${modelStats.overall_accuracy}%</div>
                <div class="stat-card__label">Overall Accuracy</div>
                <div class="stat-card__sublabel">${modelStats.total_predictions} total predictions</div>
            </div>
            <div class="stat-card" style="border-left: 4px solid #059669;">
                <div class="stat-card__value">${modelStats.correct_predictions}</div>
                <div class="stat-card__label">Correct Predictions</div>
                <div class="stat-card__sublabel">Out of ${modelStats.total_predictions}</div>
            </div>
            <div class="stat-card" style="border-left: 4px solid #d97706;">
                <div class="stat-card__value">${recentPerf.last_7_days.accuracy}%</div>
                <div class="stat-card__label">Last 7 Days</div>
                <div class="stat-card__sublabel">${recentPerf.last_7_days.predictions} predictions</div>
            </div>
            <div class="stat-card" style="border-left: 4px solid #0284c7;">
                <div class="stat-card__value">${recentPerf.last_30_days.accuracy}%</div>
                <div class="stat-card__label">Last 30 Days</div>
                <div class="stat-card__sublabel">${recentPerf.last_30_days.predictions} predictions</div>
            </div>
        </div>
        
        <div style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h4 style="margin-bottom: 1rem; color: #0f172a; font-size: 1.125rem;">📊 Confidence Bracket Performance</h4>
            <div class="stats-grid">
                ${Object.entries(modelStats.confidence_brackets).map(([bracket, data]) => {
                    const color = data.accuracy >= 80 ? '#059669' : data.accuracy >= 70 ? '#d97706' : '#dc2626';
                    return `
                        <div class="stat-card" style="border-left: 4px solid ${color}; background: white;">
                            <div class="stat-card__value">${data.accuracy}%</div>
                            <div class="stat-card__label">${bracket} Confidence</div>
                            <div class="stat-card__sublabel">${data.predictions} predictions</div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
        
        <div style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 0.75rem; border: 1px solid #3b82f6;">
            <h4 style="margin-bottom: 1rem; color: #1e40af; font-size: 1.125rem;">🧠 Model Insights & Performance Notes</h4>
            <ul style="list-style: none; padding: 0; margin: 0;">
                ${performanceData.model_insights.map(insight => `
                    <li style="margin-bottom: 0.75rem; padding: 0.75rem; background: white; border-radius: 0.5rem; border-left: 4px solid #3b82f6; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                        <span style="color: #1e40af; font-weight: 600;">💡</span> ${insight}
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
}

// Create game card for yesterday's results
function createYesterdayGameCard(game) {
    const homeTeam = getTeamName(game.home_team);
    const awayTeam = getTeamName(game.away_team);
    const predictedWinner = getTeamName(game.predicted_winner);
    const actualWinner = getTeamName(game.actual_winner);
    const isCorrect = game.result === 'correct';
    const homeTeamColors = getTeamColors(game.home_team);
    const awayTeamColors = getTeamColors(game.away_team);
    
    return `
        <div class="game-card" style="border-left: 4px solid ${isCorrect ? '#059669' : '#dc2626'}">
            <div class="game-card__header">
                <span class="game-card__time">Final</span>
                <span class="badge ${isCorrect ? 'badge--success' : 'badge--danger'}">
                    ${isCorrect ? 'Correct' : 'Incorrect'}
                </span>
            </div>
            <div class="game-card__matchup">
                <span style="color: ${awayTeamColors.primary}">${awayTeam}</span> @ <span style="color: ${homeTeamColors.primary}">${homeTeam}</span>
            </div>
            <div class="game-card__prediction">
                <div>
                    <strong>Predicted:</strong> ${predictedWinner}<br>
                    <small>Score: ${game.predicted_score.join('-')}</small>
                </div>
                <div class="game-card__confidence">${game.confidence}%</div>
            </div>
            <div class="game-card__prediction">
                <div>
                    <strong>Actual:</strong> ${actualWinner}<br>
                    <small>Score: ${game.actual_score.join('-')}</small>
                </div>
                <div style="font-size: 0.875rem; color: #64748b; text-align: right;">
                    ${isCorrect ? '+1 Point' : '0 Points'}
                </div>
            </div>
            ${game.key_factors && game.key_factors.length > 0 ? `
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e2e8f0;">
                    <strong style="color: #475569;">Key Factors:</strong>
                    <ul style="margin: 0.5rem 0; padding-left: 1rem; font-size: 0.875rem; color: #64748b;">
                        ${game.key_factors.map(factor => `<li>${factor}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
    `;
}

// Create game card for today's games
function createTodayGameCard(game) {
    const homeTeam = getTeamName(game.home_team);
    const awayTeam = getTeamName(game.away_team);
    const predictedWinner = getTeamName(game.predicted_winner);
    const homeTeamColors = getTeamColors(game.home_team);
    const awayTeamColors = getTeamColors(game.away_team);
    const confidenceLevel = getConfidenceLevel(game.confidence);
    
    return `
        <div class="game-card ${game.recommendation === 'Strong Pick' ? 'game-card--featured' : ''}" data-confidence="${game.confidence}">
            <div class="game-card__header">
                <span class="game-card__time">
                    🕑 ${game.game_time}
                </span>
                <span class="badge ${getBadgeClass(game.recommendation)}">
                    ${game.recommendation}
                </span>
            </div>
            <div class="game-card__matchup">
                <span style="color: ${awayTeamColors.primary}; font-weight: 700;">${awayTeam}</span> 
                <span style="color: #64748b;">@</span> 
                <span style="color: ${homeTeamColors.primary}; font-weight: 700;">${homeTeam}</span>
            </div>
            <div class="game-card__prediction">
                <div>
                    <strong style="color: #0f172a;">Pick:</strong> 
                    <span style="color: ${game.predicted_winner === game.home_team ? homeTeamColors.primary : awayTeamColors.primary}; font-weight: 700;">
                        ${predictedWinner}
                    </span>
                </div>
                <div class="game-card__confidence">${game.confidence}%</div>
            </div>
            <div class="confidence-bar">
                <div class="confidence-bar__fill" style="width: ${game.confidence}%"></div>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; font-size: 0.875rem;">
                <div style="color: #64748b;">
                    <strong>Win Probability:</strong> ${Math.round(game.win_probability * 100)}%
                </div>
                <div style="color: #64748b;">
                    <strong>Predicted Score:</strong> ${game.predicted_score.join('-')}
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                <span style="font-size: 0.75rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Confidence Level:</span>
                <span class="badge badge--${confidenceLevel.type}" style="font-size: 0.625rem;">${confidenceLevel.label}</span>
            </div>
            ${game.key_factors && game.key_factors.length > 0 ? `
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e2e8f0;">
                    <strong style="color: #475569; font-size: 0.875rem;">Key Factors:</strong>
                    <ul style="margin: 0.5rem 0; padding-left: 1rem; font-size: 0.875rem; color: #64748b;">
                        ${game.key_factors.slice(0, 3).map(factor => `<li>${factor}</li>`).join('')}
                        ${game.key_factors.length > 3 ? `<li style="color: #9ca3af;">+${game.key_factors.length - 3} more factors</li>` : ''}
                    </ul>
                </div>
            ` : ''}
        </div>
    `;
}

// Create game card for tomorrow's preview
function createTomorrowGameCard(game) {
    const homeTeam = getTeamName(game.home_team);
    const awayTeam = getTeamName(game.away_team);
    const earlyPick = getTeamName(game.early_prediction);
    
    return `
        <div class="game-card">
            <div class="game-card__header">
                <span class="game-card__time">${game.game_time}</span>
                <span class="badge badge--info">Preview</span>
            </div>
            <div class="game-card__matchup">
                ${awayTeam} @ ${homeTeam}
            </div>
            <div class="game-card__prediction">
                <span>Early Pick: ${earlyPick}</span>
                <span class="game-card__confidence">${game.preliminary_confidence}%</span>
            </div>
            <div style="margin-top: 0.5rem; font-size: 0.875rem; color: #4a5568;">
                ${game.key_matchup}
            </div>
            ${game.factors_to_monitor && game.factors_to_monitor.length > 0 ? `
                <div style="margin-top: 1rem;">
                    <strong>Factors to Monitor:</strong>
                    <ul style="margin: 0.5rem 0; padding-left: 1rem; font-size: 0.875rem;">
                        ${game.factors_to_monitor.map(factor => `<li>${factor}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
    `;
}

// Helper functions
function getTeamName(teamCode) {
    if (teamsData[teamCode]) {
        return teamsData[teamCode].name;
    }
    return teamCode; // Fallback to code if team not found
}

function getTeamColors(teamCode) {
    if (teamsData[teamCode] && teamsData[teamCode].colors) {
        return teamsData[teamCode].colors;
    }
    return { primary: '#64748b', secondary: '#94a3b8' }; // Fallback colors
}

function getConfidenceLevel(confidence) {
    if (confidence >= 90) {
        return { type: 'success', label: 'Very High' };
    } else if (confidence >= 80) {
        return { type: 'success', label: 'High' };
    } else if (confidence >= 70) {
        return { type: 'warning', label: 'Moderate' };
    } else if (confidence >= 60) {
        return { type: 'warning', label: 'Low' };
    } else {
        return { type: 'danger', label: 'Very Low' };
    }
}

function getBadgeClass(recommendation) {
    switch (recommendation) {
        case 'Strong Pick':
            return 'badge--success';
        case 'Moderate Pick':
            return 'badge--warning';
        case 'Weak Pick':
            return 'badge--danger';
        default:
            return 'badge--info';
    }
}

function showErrorMessage(message) {
    const main = document.querySelector('.main .container');
    if (main) {
        main.innerHTML = `
            <div style="text-align: center; padding: 3rem; background: linear-gradient(135deg, #fecaca 0%, #fed7d7 100%); border: 2px solid #ef4444; border-radius: 1rem; color: #991b1b; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
                <h3 style="margin-bottom: 1rem; font-size: 1.5rem;">⚠️ Error Loading DailyPicks</h3>
                <p style="font-size: 1.125rem;">${message}</p>
                <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: #dc2626; color: white; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer;">Retry</button>
            </div>
        `;
    }
}