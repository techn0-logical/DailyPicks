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
    
    // Create summary with celebration for perfect days
    const summary = yesterdayData.summary;
    const isPerfectDay = summary.accuracy === 100.0;
    
    summaryDiv.innerHTML = `
        ${isPerfectDay ? `
            <div style="text-align: center; padding: 1rem; background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); border: 2px solid #22c55e; border-radius: 0.75rem; margin-bottom: 1.5rem;">
                <h3 style="color: #166534; margin: 0; font-size: 1.25rem;">🎉 PERFECT DAY! 🏆</h3>
                <p style="color: #166534; margin: 0.5rem 0 0 0; font-weight: 600;">100% Accuracy Achievement Unlocked!</p>
            </div>
        ` : ''}
        
        <div class="stats-grid">
            <div class="stat-card" style="border-left: 4px solid ${isPerfectDay ? '#22c55e' : '#2563eb'};">
                <div class="stat-card__value">${summary.total_games}</div>
                <div class="stat-card__label">Total Games</div>
            </div>
            <div class="stat-card" style="border-left: 4px solid #059669;">
                <div class="stat-card__value">${summary.correct_predictions}</div>
                <div class="stat-card__label">Correct Predictions</div>
            </div>
            <div class="stat-card" style="border-left: 4px solid ${isPerfectDay ? '#22c55e' : summary.accuracy >= 75 ? '#059669' : summary.accuracy >= 60 ? '#d97706' : '#dc2626'};">
                <div class="stat-card__value">${summary.accuracy}%</div>
                <div class="stat-card__label">Daily Accuracy</div>
            </div>
        </div>
        
        ${summary.notable_outcomes.length > 0 ? `
        <div style="margin-top: 1.5rem; padding: 1rem; background: linear-gradient(135deg, #1e293b 0%, #334155 100%); border-radius: 0.75rem; border: 1px solid #374151;">
            <h4 style="color: #f8fafc; margin-bottom: 0.75rem; font-size: 1rem;">📈 Notable Outcomes:</h4>
            <ul style="margin: 0; padding-left: 1.25rem; color: #cbd5e1;">
                ${summary.notable_outcomes.map(outcome => `<li style="margin-bottom: 0.5rem;">${outcome}</li>`).join('')}
            </ul>
        </div>
        ` : ''}
        
        ${yesterdayData.celebration_message ? `
        <div style="margin-top: 1.5rem; padding: 1rem; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 0.75rem; border: 1px solid #3b82f6; text-align: center;">
            <p style="color: #1e40af; margin: 0; font-weight: 600; font-style: italic;">${yesterdayData.celebration_message}</p>
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
    
    // Create summary with pending game status
    const summary = todayData.summary;
    const hasPendingGames = summary.pending_games > 0;
    
    summaryDiv.innerHTML = `
        ${hasPendingGames ? `
            <div style="text-align: center; padding: 1rem; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; border-radius: 0.75rem; margin-bottom: 1.5rem;">
                <h3 style="color: #92400e; margin: 0; font-size: 1.25rem;">⏳ PREDICTIONS ACTIVE</h3>
                <p style="color: #92400e; margin: 0.5rem 0 0 0; font-weight: 600;">${summary.status}</p>
            </div>
        ` : ''}
        
        <div class="stats-grid">
            <div class="stat-card" style="border-left: 4px solid #2563eb;">
                <div class="stat-card__value">${summary.total_games}</div>
                <div class="stat-card__label">Total Predictions</div>
                <div class="stat-card__sublabel">Made Today</div>
            </div>
            
            ${summary.pending_games !== undefined ? `
                <div class="stat-card" style="border-left: 4px solid #f59e0b;">
                    <div class="stat-card__value">${summary.pending_games}</div>
                    <div class="stat-card__label">Pending Games</div>
                    <div class="stat-card__sublabel">⏳ Awaiting Results</div>
                </div>
            ` : ''}
            
            ${summary.completed_games !== undefined ? `
                <div class="stat-card" style="border-left: 4px solid #059669;">
                    <div class="stat-card__value">${summary.completed_games}</div>
                    <div class="stat-card__label">Completed Games</div>
                    <div class="stat-card__sublabel">Results Available</div>
                </div>
            ` : ''}
            
            <div class="stat-card" style="border-left: 4px solid #7c3aed;">
                <div class="stat-card__value">${summary.avg_confidence}%</div>
                <div class="stat-card__label">Avg Confidence</div>
                <div class="stat-card__sublabel">${getConfidenceLevel(summary.avg_confidence).label}</div>
            </div>
        </div>
        
        ${summary.top_picks && summary.top_picks.length > 0 ? `
        <div style="margin-top: 1.5rem; padding: 1rem; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 0.75rem; border: 1px solid #3b82f6;">
            <h4 style="color: #1e40af; margin-bottom: 0.75rem; font-size: 1rem;">🎯 Today's Featured Pick:</h4>
            <div style="color: #1e40af;">
                <strong>${getTeamName(summary.top_picks[0].pick)}</strong> - ${summary.top_picks[0].confidence}% confidence
                <br><em style="color: #64748b; font-size: 0.875rem;">${summary.top_picks[0].reasoning}</em>
            </div>
        </div>
        ` : ''}
        
        ${todayData.prediction_notes && todayData.prediction_notes.length > 0 ? `
        <div style="margin-top: 1.5rem; padding: 1rem; background: linear-gradient(135deg, #1e293b 0%, #334155 100%); border-radius: 0.75rem; border: 1px solid #374151;">
            <h4 style="color: #f8fafc; margin-bottom: 0.75rem; font-size: 1rem;">📊 Prediction Analysis:</h4>
            <ul style="margin: 0; padding-left: 1.25rem; color: #cbd5e1;">
                ${todayData.prediction_notes.map(note => `<li style="margin-bottom: 0.5rem;">${note}</li>`).join('')}
            </ul>
        </div>
        ` : ''}
        
        ${todayData.pending_message ? `
        <div style="margin-top: 1.5rem; padding: 1rem; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 0.75rem; border: 1px solid #0284c7; text-align: center;">
            <p style="color: #0c4a6e; margin: 0; font-weight: 600; font-style: italic;">${todayData.pending_message}</p>
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
    let summaryHtml = `
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

    // If detailed playoff prediction summary exists, show a special card at the top
    if (tomorrowData.detailed_prediction_summary) {
        const d = tomorrowData.detailed_prediction_summary;
        summaryHtml += `
        <div style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 0.75rem; border: 2px solid #0284c7; box-shadow: 0 4px 12px rgba(2,132,199,0.08);">
            <h3 style="color: #0f172a; font-size: 1.25rem; margin-bottom: 0.5rem;">🎯 ${d.title || 'Detailed Prediction Summary'}</h3>
            <div style="margin-bottom: 0.75rem; color: #1e40af; font-weight: 600;">
                <span>🏟️ <strong>Game:</strong> ${d.game_details.matchup}</span><br>
                <span>📅 <strong>Date:</strong> ${d.game_details.date}</span><br>
                <span>🌍 <strong>Venue:</strong> ${d.game_details.venue}</span><br>
                <span>🎮 <strong>Type:</strong> ${d.game_details.game_type}</span>
            </div>
            <div style="margin-bottom: 0.75rem;">
                <span>🏆 <strong>Predicted Winner:</strong> ${d.prediction_results.predicted_winner}</span><br>
                <span>💡 <strong>Win Probability:</strong> ${d.prediction_results.win_probability}</span><br>
                <span>💡 <strong>Confidence Level:</strong> ${d.prediction_results.confidence_level}</span><br>
                <span>🤖 <strong>Model Used:</strong> ${d.prediction_results.model_used}</span>
            </div>
            <div style="margin-bottom: 0.75rem;">
                <span>📊 <strong>Assessment:</strong> ${d.game_analysis.assessment}</span>
                <ul style="margin: 0.5rem 0 0 1.25rem; color: #475569;">
                    ${d.game_analysis.details.map(line => `<li>${line}</li>`).join('')}
                </ul>
            </div>
            <div style="margin-bottom: 0.75rem;">
                <span>🏠 <strong>Home Field Factor:</strong></span>
                <ul style="margin: 0.5rem 0 0 1.25rem; color: #475569;">
                    ${d.home_field_factor.map(line => `<li>${line}</li>`).join('')}
                </ul>
            </div>
            <div style="margin-bottom: 0.75rem;">
                <span>🔍 <strong>Why Low Confidence?</strong></span>
                <ul style="margin: 0.5rem 0 0 1.25rem; color: #92400e;">
                    ${d.why_low_confidence.map(line => `<li>${line}</li>`).join('')}
                </ul>
            </div>
            <div>
                <span>💡 <strong>Key Insights:</strong></span>
                <ul style="margin: 0.5rem 0 0 1.25rem; color: #166534;">
                    ${d.key_insights.map(line => `<li>${line}</li>`).join('')}
                </ul>
            </div>
        </div>
        `;
    }

    summaryDiv.innerHTML = summaryHtml;

    // Create game cards
    gamesDiv.innerHTML = tomorrowData.games.map(game => createTomorrowGameCard(game)).join('');
}

// Populate Performance section
function populatePerformanceSection() {
    const performanceDiv = document.getElementById('performance-stats');
    
    if (!performanceDiv || !performanceData) return;
    
    const modelStats = performanceData.model_stats;
    const recentPerf = performanceData.recent_performance;
    const seasonal = performanceData.seasonal_breakdown;
    const insights = performanceData.key_insights;
    
    performanceDiv.innerHTML = `
        ${modelStats.data_status === 'cleaned' ? `
            <div style="text-align: center; padding: 1rem; background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); border: 2px solid #22c55e; border-radius: 0.75rem; margin-bottom: 1.5rem;">
                <h3 style="color: #166534; margin: 0; font-size: 1.125rem;">📊 CLEAN PERFORMANCE METRICS</h3>
                <p style="color: #166534; margin: 0.5rem 0 0 0; font-weight: 600;">Post-Cleanup: ${modelStats.total_predictions} Valid Predictions</p>
            </div>
        ` : ''}
        
        <div class="stats-grid">
            <div class="stat-card" style="border-left: 4px solid #2563eb;">
                <div class="stat-card__value">${modelStats.overall_accuracy}%</div>
                <div class="stat-card__label">Overall Accuracy</div>
                <div class="stat-card__sublabel">${modelStats.total_predictions} total predictions</div>
            </div>
            <div class="stat-card" style="border-left: 4px solid #059669;">
                <div class="stat-card__value">+${modelStats.vs_industry}%</div>
                <div class="stat-card__label">vs Industry</div>
                <div class="stat-card__sublabel">Industry: ${modelStats.industry_standard}%</div>
            </div>
            <div class="stat-card" style="border-left: 4px solid ${recentPerf.last_5_days?.status === 'COLD STREAK' ? '#dc2626' : '#d97706'};">
                <div class="stat-card__value">${recentPerf.last_5_days?.accuracy || recentPerf.last_10_days?.accuracy || 'N/A'}%</div>
                <div class="stat-card__label">Recent Performance</div>
                <div class="stat-card__sublabel">${recentPerf.last_5_days?.status || recentPerf.last_10_days?.status || 'N/A'}</div>
            </div>
            <div class="stat-card" style="border-left: 4px solid #7c3aed;">
                <div class="stat-card__value">${modelStats.completed_games || modelStats.correct_predictions}</div>
                <div class="stat-card__label">Completed Games</div>
                <div class="stat-card__sublabel">${modelStats.pending_games ? modelStats.pending_games + ' pending' : 'Total tracked'}</div>
            </div>
        </div>
        
        <div style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, #1e293b 0%, #334155 100%); border-radius: 0.75rem; border: 1px solid #374151;">
            <h4 style="margin-bottom: 1rem; color: #f8fafc; font-size: 1.125rem;">📊 Confidence Level Breakdown</h4>
            <div class="stats-grid">
                ${Object.entries(modelStats.confidence_brackets).map(([bracket, data]) => {
                    let color = '#dc2626';
                    if (data.accuracy === 100) color = '#22c55e';
                    else if (data.accuracy >= 70) color = '#059669';
                    else if (data.accuracy >= 55) color = '#d97706';
                    
                    return `
                        <div class="stat-card" style="border-left: 4px solid ${color}; background: #1e293b;">
                            <div class="stat-card__value">${data.accuracy}%</div>
                            <div class="stat-card__label">${bracket}</div>
                            <div class="stat-card__sublabel">${data.record || data.predictions + ' predictions'}</div>
                            ${data.status ? `<div style="font-size: 0.75rem; color: ${color}; font-weight: 600; margin-top: 0.25rem;">${data.status}</div>` : ''}
                        </div>
                    `;
                }).join('')}
            </div>
            ${Object.values(modelStats.confidence_brackets).some(d => d.accuracy === 100) ? `
                <div style="margin-top: 1rem; padding: 0.75rem; background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); border-radius: 0.5rem; border: 1px solid #22c55e; text-align: center;">
                    <span style="color: #166534; font-weight: 700;">🎯 Key Finding: Your high-confidence picks are perfect - trust them!</span>
                </div>
            ` : ''}
        </div>
        
        ${seasonal ? `
        <div style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 0.75rem; border: 1px solid #f59e0b;">
            <h4 style="margin-bottom: 1rem; color: #92400e; font-size: 1.125rem;">🏆 Playoff vs Regular Season</h4>
            <div class="stats-grid">
                <div class="stat-card" style="border-left: 4px solid #059669; background: #1e293b;">
                    <div class="stat-card__value">${seasonal.september_regular.accuracy}%</div>
                    <div class="stat-card__label">September</div>
                    <div class="stat-card__sublabel">${seasonal.september_regular.record} (Regular Season)</div>
                </div>
                <div class="stat-card" style="border-left: 4px solid #d97706; background: #1e293b;">
                    <div class="stat-card__value">${seasonal.october_playoffs.accuracy}%</div>
                    <div class="stat-card__label">October</div>
                    <div class="stat-card__sublabel">${seasonal.october_playoffs.record} (Playoffs)</div>
                </div>
            </div>
            <div style="margin-top: 1rem; padding: 0.75rem; background: #1e293b; border-radius: 0.5rem; border: 1px solid #f59e0b; text-align: center;">
                <span style="color: #92400e; font-weight: 600;">📉 Playoff Impact: ${seasonal.playoff_impact}% decline</span><br>
                <span style="color: #92400e; font-size: 0.875rem;">${seasonal.playoff_note}</span>
            </div>
        </div>
        ` : ''}
        
        ${insights ? `
        <div style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 0.75rem; border: 1px solid #3b82f6;">
            <h4 style="margin-bottom: 1rem; color: #1e40af; font-size: 1.125rem;">💡 Key Insights</h4>
            
            <div style="margin-bottom: 1.5rem;">
                <h5 style="color: #166534; margin-bottom: 0.5rem;">🎯 Strengths:</h5>
                <ul style="margin: 0; padding-left: 1.25rem; color: #166534;">
                    ${insights.strengths.map(strength => `<li style="margin-bottom: 0.25rem;">${strength}</li>`).join('')}
                </ul>
            </div>
            
            <div style="margin-bottom: 1.5rem;">
                <h5 style="color: #dc2626; margin-bottom: 0.5rem;">⚠️ Areas to Watch:</h5>
                <ul style="margin: 0; padding-left: 1.25rem; color: #dc2626;">
                    ${insights.areas_to_watch.map(area => `<li style="margin-bottom: 0.25rem;">${area}</li>`).join('')}
                </ul>
            </div>
            
            <div>
                <h5 style="color: #1e40af; margin-bottom: 0.5rem;">🎯 Strategic Takeaways:</h5>
                <ul style="margin: 0; padding-left: 1.25rem; color: #1e40af;">
                    ${insights.strategic_takeaways.map(takeaway => `<li style="margin-bottom: 0.25rem;">${takeaway}</li>`).join('')}
                </ul>
            </div>
        </div>
        ` : ''}
        
        <div style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 0.75rem; border: 1px solid #3b82f6;">
            <h4 style="margin-bottom: 1rem; color: #1e40af; font-size: 1.125rem;">🧠 Model Insights & Performance Notes</h4>
            <ul style="list-style: none; padding: 0; margin: 0;">
                ${performanceData.model_insights.map(insight => `
                    <li style="margin-bottom: 0.75rem; padding: 0.75rem; background: #1e293b; border-radius: 0.5rem; border-left: 4px solid #3b82f6; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);">
                        ${insight}
                    </li>
                `).join('')}
            </ul>
        </div>
        
        ${performanceData.bottom_line ? `
        <div style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 0.75rem; border: 2px solid #22c55e; text-align: center;">
            <h4 style="color: #166534; margin-bottom: 0.75rem; font-size: 1.125rem;">📈 Bottom Line</h4>
            <p style="color: #166534; margin: 0; font-weight: 600; font-style: italic;">${performanceData.bottom_line}</p>
        </div>
        ` : ''}
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
    const confidenceLevel = getConfidenceLevel(game.confidence);
    
    return `
        <div class="game-card" style="border-left: 6px solid ${isCorrect ? '#22c55e' : '#dc2626'}; ${isCorrect ? 'background: linear-gradient(135deg, #1e293b 0%, #1f2937 100%);' : 'background: linear-gradient(135deg, #1e293b 0%, #374151 100%);'}">
            <div class="game-card__header">
                <span class="game-card__time">🏁 Final Game</span>
                <span class="badge ${isCorrect ? 'badge--success' : 'badge--danger'}">
                    ${isCorrect ? '✅ Correct' : '❌ Incorrect'}
                </span>
            </div>
            
            <div class="game-card__matchup">
                <span style="color: #f8fafc; font-weight: 700; display: inline-flex; align-items: center; text-shadow: 0 0 8px rgba(248, 250, 252, 0.6), 0 0 16px rgba(248, 250, 252, 0.4);">${getTeamNameWithLogo(game.away_team, '24px', true)}</span> 
                <span style="color: #cbd5e1; margin: 0 0.5rem; text-shadow: 0 0 4px rgba(203, 213, 225, 0.5);">@</span> 
                <span style="color: #f8fafc; font-weight: 700; display: inline-flex; align-items: center; text-shadow: 0 0 8px rgba(248, 250, 252, 0.6), 0 0 16px rgba(248, 250, 252, 0.4);">${getTeamNameWithLogo(game.home_team, '24px', true)}</span>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0;">
                <div class="game-card__prediction" style="background: linear-gradient(135deg, #334155 0%, #475569 100%); border: 2px solid #60a5fa; box-shadow: 0 4px 8px rgba(96, 165, 250, 0.2);">
                    <div>
                        <strong style="color: #60a5fa;">🎯 Predicted:</strong><br>
                        <span style="color: #f8fafc; font-weight: 700; display: inline-flex; align-items: center;">
                            ${getTeamNameWithLogo(game.predicted_winner, '20px', true)}
                        </span>
                    </div>
                </div>
                
                <div class="game-card__prediction" style="background: linear-gradient(135deg, #334155 0%, #475569 100%); border: 2px solid ${isCorrect ? '#22c55e' : '#ef4444'}; box-shadow: 0 4px 8px rgba(${isCorrect ? '34, 197, 94' : '239, 68, 68'}, 0.2);">
                    <div>
                        <strong style="color: ${isCorrect ? '#22c55e' : '#ef4444'};">🏁 Actual:</strong><br>
                        <span style="color: #f8fafc; font-weight: 700; display: inline-flex; align-items: center;">
                            ${getTeamNameWithLogo(game.actual_winner, '20px', true)}
                        </span><br>
                        <small style="color: #cbd5e1;">Score: ${game.actual_score.join('-')}</small>
                    </div>
                </div>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin: 1rem 0; padding: 0.75rem; background: #334155; border-radius: 0.5rem; border: 1px solid #475569;">
                <div>
                    <span style="font-size: 0.875rem; color: #64748b;">Confidence:</span>
                    <span style="font-weight: 700; color: #0f172a; margin-left: 0.5rem;">${game.confidence}%</span>
                    <span class="badge badge--${confidenceLevel.type}" style="margin-left: 0.5rem; font-size: 0.625rem;">${confidenceLevel.label}</span>
                </div>
            </div>
            
            ${game.notes ? `
                <div style="margin-bottom: 1rem; padding: 0.75rem; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 0.5rem; border: 1px solid #f59e0b;">
                    <span style="font-size: 0.75rem; color: #92400e; font-weight: 600;">💡 Analysis:</span>
                    <p style="font-size: 0.875rem; color: #92400e; margin: 0.25rem 0 0 0; font-style: italic;">${game.notes}</p>
                </div>
            ` : ''}
            
            ${game.game_details ? `
                <div style="margin-bottom: 1rem; padding: 1rem; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 0.5rem; border: 1px solid #0284c7;">
                    <h4 style="color: #0c4a6e; margin-bottom: 0.75rem; font-size: 1rem;">🏟️ Game Details</h4>
                    <div style="margin-bottom: 0.75rem;">
                        <strong style="color: #0c4a6e;">Game ${game.game_number || game.id}:</strong> ${game.game_details.matchup}<br>
                        <strong style="color: #0c4a6e;">Final:</strong> ${game.game_details.final_score}
                    </div>
                    
                    ${game.game_details.game_highlights ? `
                        <div style="margin-bottom: 0.75rem;">
                            <strong style="color: #0c4a6e;">Game Highlights:</strong>
                            <ul style="margin: 0.25rem 0 0 1rem; color: #0369a1; font-size: 0.875rem;">
                                <li>Duration: ${game.game_details.game_highlights.duration}</li>
                                <li>Total Pitches: ${game.game_details.game_highlights.total_pitches}</li>
                                <li>Pitchers Used: ${game.game_details.game_highlights.pitchers_used}</li>
                                <li>Different Batters: ${game.game_details.game_highlights.different_batters}</li>
                                <li>Winner: ${game.game_details.game_highlights.winner}</li>
                            </ul>
                        </div>
                    ` : ''}
                    
                    ${game.game_details.scoring_timeline ? `
                        <div style="margin-bottom: 0.75rem;">
                            <strong style="color: #0c4a6e;">Scoring Timeline:</strong>
                            <ul style="margin: 0.25rem 0 0 1rem; color: #0369a1; font-size: 0.875rem;">
                                ${game.game_details.scoring_timeline.map(event => `<li style="margin-bottom: 0.25rem;">${event}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    ${game.game_details.key_stats ? `
                        <div>
                            <strong style="color: #0c4a6e;">Key Stats:</strong>
                            <ul style="margin: 0.25rem 0 0 1rem; color: #0369a1; font-size: 0.875rem;">
                                ${game.game_details.key_stats.map(stat => `<li style="margin-bottom: 0.25rem;">${stat}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            ` : ''}
            
            ${game.key_factors && game.key_factors.length > 0 ? `
                <div style="padding-top: 1rem; border-top: 1px solid #e2e8f0;">
                    <strong style="color: #475569; font-size: 0.875rem;">📊 Key Factors:</strong>
                    <ul style="margin: 0.5rem 0 0 0; padding-left: 1rem; font-size: 0.875rem; color: #64748b;">
                        ${game.key_factors.map(factor => `<li style="margin-bottom: 0.25rem;">${factor}</li>`).join('')}
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
    const isPending = game.status === 'pending' || game.game_status?.includes('PENDING');
    
    return `
        <div class="game-card ${game.recommendation === 'Strong Pick' ? 'game-card--featured' : ''}" 
             data-confidence="${game.confidence}" 
             style="${isPending ? 'border-left: 6px solid #f59e0b; background: linear-gradient(135deg, #1e293b 0%, #374151 100%);' : ''}">
            
            <div class="game-card__header">
                <span class="game-card__time">
                    ${isPending ? '⏳ ' + (game.game_status || 'PENDING') : '� ' + (game.game_time || 'TBD')}
                </span>
                <span class="badge ${isPending ? 'badge--warning' : getBadgeClass(game.recommendation)}">
                    ${isPending ? '⏳ Pending' : game.recommendation}
                </span>
            </div>
            
            <div class="game-card__matchup">
                <span style="color: ${awayTeamColors.primary}; font-weight: 700; display: inline-flex; align-items: center;">${getTeamNameWithLogo(game.away_team, '24px')}</span> 
                <span style="color: #64748b; margin: 0 0.5rem;">@</span> 
                <span style="color: ${homeTeamColors.primary}; font-weight: 700; display: inline-flex; align-items: center;">${getTeamNameWithLogo(game.home_team, '24px')}</span>
            </div>
            
            <div class="game-card__prediction" style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%);">
                <div>
                    <strong style="color: #0f172a;">🎯 Predicted Winner:</strong><br>
                    <span style="color: ${game.predicted_winner === game.home_team ? homeTeamColors.primary : awayTeamColors.primary}; font-weight: 700; font-size: 1.125rem; display: inline-flex; align-items: center;">
                        ${getTeamNameWithLogo(game.predicted_winner, '20px')}
                    </span>
                </div>
                <div class="game-card__confidence">${game.confidence}%</div>
            </div>
            
            <div class="confidence-bar">
                <div class="confidence-bar__fill" style="width: ${game.confidence}%"></div>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin: 1rem 0; font-size: 0.875rem;">
                <div style="color: #64748b;">
                    <strong>Win Probability:</strong> ${Math.round(game.win_probability * 100)}%
                </div>
                <div style="color: #64748b;">
                    <strong>Confidence Level:</strong> 
                    <span class="badge badge--${confidenceLevel.type}" style="margin-left: 0.25rem; font-size: 0.625rem;">${confidenceLevel.label}</span>
                </div>
            </div>
            
            ${game.model_used ? `
                <div style="margin-bottom: 1rem; padding: 0.75rem; background: #eff6ff; border-radius: 0.5rem; border: 1px solid #3b82f6;">
                    <span style="font-size: 0.75rem; color: #1e40af; font-weight: 600;">🤖 Model:</span>
                    <span style="font-size: 0.875rem; color: #1e40af; margin-left: 0.5rem;">${game.model_used}</span>
                    ${game.prediction_time ? `<br><span style="font-size: 0.75rem; color: #64748b;">⏰ Made: ${game.prediction_time}</span>` : ''}
                </div>
            ` : ''}
            
            ${isPending && game.actual_result ? `
                <div style="margin-bottom: 1rem; padding: 0.75rem; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 0.5rem; border: 1px solid #f59e0b;">
                    <span style="font-size: 0.75rem; color: #92400e; font-weight: 600;">📊 Current Status:</span>
                    <p style="font-size: 0.875rem; color: #92400e; margin: 0.25rem 0 0 0; font-weight: 600;">${game.actual_result}</p>
                </div>
            ` : ''}
            
            ${game.analysis ? `
                <div style="margin-bottom: 1rem; padding: 0.75rem; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 0.5rem; border: 1px solid #22c55e;">
                    <span style="font-size: 0.75rem; color: #166534; font-weight: 600;">💡 Analysis:</span>
                    <p style="font-size: 0.875rem; color: #166534; margin: 0.25rem 0 0 0; font-style: italic;">${game.analysis}</p>
                </div>
            ` : ''}
            
            ${game.key_factors && game.key_factors.length > 0 ? `
                <div style="padding-top: 1rem; border-top: 1px solid #e2e8f0;">
                    <strong style="color: #475569; font-size: 0.875rem;">🔍 Key Factors:</strong>
                    <ul style="margin: 0.5rem 0 0 0; padding-left: 1rem; font-size: 0.875rem; color: #64748b;">
                        ${game.key_factors.map(factor => `<li style="margin-bottom: 0.25rem;">${factor}</li>`).join('')}
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
    // Playoff/game_type detection
    const isPlayoff = game.game_type && game.game_type.toLowerCase().includes('playoff');
    const predictedWinner = getTeamName(game.predicted_winner || game.early_prediction);
    const confidence = game.confidence !== undefined ? game.confidence : game.preliminary_confidence;
    const winProb = game.win_probability !== undefined ? `${(game.win_probability * 100).toFixed(1)}%` : (confidence ? `${confidence}%` : '');
    const model = game.model_used || '';
    const analysis = game.analysis || game.key_matchup || '';
    return `
        <div class="game-card${isPlayoff ? ' game-card--featured' : ''}">
            <div class="game-card__header">
                <span class="game-card__time">${game.game_time || 'TBD'}</span>
                <span class="badge badge--${isPlayoff ? 'warning' : 'info'}">${isPlayoff ? 'Playoff' : 'Preview'}</span>
            </div>
            <div class="game-card__matchup">
                <span style="color: ${getTeamColors(game.away_team).primary}; font-weight: 700; display: inline-flex; align-items: center;">${getTeamNameWithLogo(game.away_team, '24px')}</span> 
                <span style="color: #64748b; margin: 0 0.5rem;">@</span> 
                <span style="color: ${getTeamColors(game.home_team).primary}; font-weight: 700; display: inline-flex; align-items: center;">${getTeamNameWithLogo(game.home_team, '24px')}</span>
            </div>
            <div class="game-card__prediction">
                <span style="display: inline-flex; align-items: center;">Predicted Winner: ${getTeamNameWithLogo(game.predicted_winner || game.early_prediction, '20px')}</span>
                <span class="game-card__confidence">${confidence ? confidence + '%' : ''}</span>
            </div>
            <div style="margin-top: 0.5rem; font-size: 0.875rem; color: #4a5568;">
                ${analysis}
            </div>
            ${winProb ? `<div style="margin-top: 0.5rem; font-size: 0.875rem; color: #0284c7;"><strong>Win Probability:</strong> ${winProb}</div>` : ''}
            ${model ? `<div style="margin-top: 0.5rem; font-size: 0.875rem; color: #1e40af;"><strong>Model:</strong> ${model}</div>` : ''}
            ${game.confidence_level ? `<div style="margin-top: 0.5rem; font-size: 0.875rem; color: #92400e;"><strong>Confidence Level:</strong> ${game.confidence_level}</div>` : ''}
            ${game.home_field_factor ? `<div style="margin-top: 0.5rem; font-size: 0.875rem; color: #166534;"><strong>Home Field Factor:</strong> ${game.home_field_factor}</div>` : ''}
            ${game.why_low_confidence && Array.isArray(game.why_low_confidence) ? `<div style="margin-top: 0.5rem; color: #92400e;"><strong>Why Low Confidence?</strong><ul style="margin: 0.25rem 0 0 1rem;">${game.why_low_confidence.map(f => `<li>${f}</li>`).join('')}</ul></div>` : ''}
            ${game.key_insights && Array.isArray(game.key_insights) ? `<div style="margin-top: 0.5rem; color: #166534;"><strong>Key Insights:</strong><ul style="margin: 0.25rem 0 0 1rem;">${game.key_insights.map(f => `<li>${f}</li>`).join('')}</ul></div>` : ''}
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

function getTeamLogo(teamCode) {
    if (teamsData[teamCode] && teamsData[teamCode].logo) {
        return teamsData[teamCode].logo;
    }
    return null; // No logo available
}

function getTeamNameWithLogo(teamCode, size = '20px', isLightVersion = false) {
    const teamName = getTeamName(teamCode);
    const teamLogo = getTeamLogo(teamCode);
    
    if (teamLogo) {
        const lightStyle = isLightVersion ? 'opacity: 1.0; filter: brightness(1.6) saturate(1.1) contrast(1.3) drop-shadow(0 0 8px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 16px rgba(255, 255, 255, 0.3));' : '';
        return `<img src="${teamLogo}" alt="${teamName}" style="width: ${size}; height: ${size}; vertical-align: middle; margin-right: 0.5rem; object-fit: contain; ${lightStyle}"/>${teamName}`;
    }
    return teamName;
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
        return { type: 'warning', label: 'Low' };
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