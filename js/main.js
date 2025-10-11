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
            <div class="stat-card">
                <div class="stat-card__value">${modelStats.overall_accuracy}%</div>
                <div class="stat-card__label">Overall Accuracy</div>
            </div>
            <div class="stat-card">
                <div class="stat-card__value">${modelStats.total_predictions}</div>
                <div class="stat-card__label">Total Predictions</div>
            </div>
            <div class="stat-card">
                <div class="stat-card__value">${recentPerf.last_7_days.accuracy}%</div>
                <div class="stat-card__label">Last 7 Days</div>
            </div>
            <div class="stat-card">
                <div class="stat-card__value">${recentPerf.last_30_days.accuracy}%</div>
                <div class="stat-card__label">Last 30 Days</div>
            </div>
        </div>
        
        <div style="margin-top: 2rem;">
            <h4>Confidence Bracket Performance:</h4>
            <div class="stats-grid">
                ${Object.entries(modelStats.confidence_brackets).map(([bracket, data]) => `
                    <div class="stat-card">
                        <div class="stat-card__value">${data.accuracy}%</div>
                        <div class="stat-card__label">${bracket} Confidence</div>
                        <div style="font-size: 0.75rem; color: #718096;">${data.predictions} predictions</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div style="margin-top: 2rem;">
            <h4>Model Insights:</h4>
            <ul>
                ${performanceData.model_insights.map(insight => `<li>${insight}</li>`).join('')}
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
    
    return `
        <div class="game-card">
            <div class="game-card__header">
                <span class="game-card__time">Final</span>
                <span class="badge ${isCorrect ? 'badge--success' : 'badge--danger'}">
                    ${isCorrect ? 'Correct' : 'Incorrect'}
                </span>
            </div>
            <div class="game-card__matchup">
                ${awayTeam} @ ${homeTeam}
            </div>
            <div class="game-card__prediction">
                <span>Predicted: ${predictedWinner}</span>
                <span>Score: ${game.predicted_score.join('-')}</span>
            </div>
            <div class="game-card__prediction">
                <span>Actual: ${actualWinner}</span>
                <span>Score: ${game.actual_score.join('-')}</span>
            </div>
            <div style="margin-top: 0.5rem; font-size: 0.875rem; color: #4a5568;">
                Confidence: ${game.confidence}%
            </div>
        </div>
    `;
}

// Create game card for today's games
function createTodayGameCard(game) {
    const homeTeam = getTeamName(game.home_team);
    const awayTeam = getTeamName(game.away_team);
    const predictedWinner = getTeamName(game.predicted_winner);
    
    return `
        <div class="game-card ${game.recommendation === 'Strong Pick' ? 'game-card--featured' : ''}">
            <div class="game-card__header">
                <span class="game-card__time">${game.game_time}</span>
                <span class="badge ${getBadgeClass(game.recommendation)}">${game.recommendation}</span>
            </div>
            <div class="game-card__matchup">
                ${awayTeam} @ ${homeTeam}
            </div>
            <div class="game-card__prediction">
                <span>Pick: <strong>${predictedWinner}</strong></span>
                <span class="game-card__confidence">${game.confidence}%</span>
            </div>
            <div class="confidence-bar">
                <div class="confidence-bar__fill" style="width: ${game.confidence}%"></div>
            </div>
            <div style="margin-top: 0.5rem; font-size: 0.875rem; color: #4a5568;">
                Win Probability: ${Math.round(game.win_probability * 100)}%
            </div>
            <div style="margin-top: 0.5rem; font-size: 0.875rem; color: #4a5568;">
                Predicted Score: ${game.predicted_score.join('-')}
            </div>
            ${game.key_factors && game.key_factors.length > 0 ? `
                <div style="margin-top: 1rem;">
                    <strong>Key Factors:</strong>
                    <ul style="margin: 0.5rem 0; padding-left: 1rem; font-size: 0.875rem;">
                        ${game.key_factors.map(factor => `<li>${factor}</li>`).join('')}
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
            <div style="text-align: center; padding: 2rem; background: #fed7d7; border: 1px solid #fc8181; border-radius: 0.5rem; color: #742a2a;">
                <h3>Error Loading DailyPicks</h3>
                <p>${message}</p>
            </div>
        `;
    }
}