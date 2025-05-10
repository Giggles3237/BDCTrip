/**
 * Voting System for Baltimore/DC Trip Website
 * Created: May 2025
 * 
 * This file implements an interactive voting system for 7 participants
 * to vote on their preferred attractions in each category.
 */

const API_URL = 'https://bdctripbackend-52c6ab7d2006.herokuapp.com';

// Constants for voting limits per category
const VOTING_LIMITS = {
    dining: 3,
    shopping: 2,
    casino: 1
};

// Participant names (for the 7 participants)
const PARTICIPANTS = [
    "Muffin",
    "Princess",
    "Gigi",
    "Aunt Robin",
    "Dawn",
    "The Driver",
    "Last Minute Guest?"
];

// Current active participant
let currentParticipant = null;

// Store votes in memory after fetching from backend
let backendVotes = [];

/**
 * Initialize the voting system
 */
function initVotingSystem() {
    // Create the voting interface
    createVotingInterface();
    
    // Add voting buttons to attraction cards
    addVotingButtonsToCards();
    
    // Ensure Chart.js is loaded, then initialize charts
    if (typeof Chart === 'undefined') {
        // Chart.js not loaded, load it and then init charts
        if (!window._chartJsLoading) {
            window._chartJsLoading = true;
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = function() {
                if (typeof initCharts === 'function') {
                    initCharts();
                }
            };
            document.head.appendChild(script);
        }
    } else {
        if (typeof initCharts === 'function') {
            initCharts();
        }
    }
    
    console.log('Voting system initialized');
}

/**
 * Create the voting interface in the voting section
 */
function createVotingInterface() {
    const votingContainer = document.querySelector('.voting-container');
    if (!votingContainer) return;
    
    // Clear the placeholder content
    votingContainer.innerHTML = `
        <h2>Vote for Your Favorites</h2>
        <p>Help plan our itinerary by voting for your preferred attractions!</p>
        <div class="voting-status" id="voting-status">
            <p>Please select your name to start voting.</p>
        </div>
        <div id="voting-summary"></div>
    `;

    // Render participant buttons in both top and voting sections
    renderParticipantButtons();
}

function renderParticipantButtons() {
    // Render in the voting section (if present)
    const votingSection = document.querySelector('.voting-container .participant-selection');
    if (votingSection) {
        votingSection.innerHTML = `
            <h3>Select Your Name</h3>
            <div class="participant-buttons" id="participant-buttons">
                ${PARTICIPANTS.map((name, index) => 
                    `<button class="participant-btn" data-participant="${index}">${name}</button>`
                ).join('')}
            </div>
        `;
    }
    // Render at the top of the page
    const topButtonsDiv = document.getElementById('participant-buttons-top');
    if (topButtonsDiv) {
        topButtonsDiv.innerHTML = PARTICIPANTS.map((name, index) => 
            `<button class="participant-btn" data-participant="${index}">${name}</button>`
        ).join('');
    }
    // Add event listeners to all participant buttons
    document.querySelectorAll('.participant-btn').forEach(button => {
        button.addEventListener('click', async function() {
            const participantIndex = this.dataset.participant;
            await selectParticipant(participantIndex);
        });
    });
}

/**
 * Select a participant and update the UI
 * @param {string} participantIndex - Index of the selected participant
 */
async function selectParticipant(participantIndex) {
    currentParticipant = parseInt(participantIndex);
    
    // Update UI to show selected participant
    const participantButtons = document.querySelectorAll('.participant-btn');
    participantButtons.forEach((button, index) => {
        if (index === currentParticipant) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Fetch latest votes and update UI
    await fetchBackendVotes();
    
    console.log(`Selected participant: ${PARTICIPANTS[currentParticipant]}`);
}

/**
 * Update the voting status display
 */
function updateVotingStatus() {
    if (currentParticipant === null) return;
    const votingStatus = document.getElementById('voting-status');
    if (!votingStatus) return;
    const participantName = PARTICIPANTS[currentParticipant];
    // Use deduplicated votes
    const votes = getParticipantVotes(currentParticipant);
    const diningVotes = votes.filter(vote => vote.category === 'dining').length;
    const shoppingVotes = votes.filter(vote => vote.category === 'shopping').length;
    const casinoVotes = votes.filter(vote => vote.category === 'casino').length;
    votingStatus.innerHTML = `
        <h3>Hello, ${participantName}!</h3>
        <p>Your voting status:</p>
        <ul>
            <li>Dining: ${diningVotes}/${VOTING_LIMITS.dining} votes used</li>
            <li>Shopping: ${shoppingVotes}/${VOTING_LIMITS.shopping} votes used</li>
            <li>Casino: ${casinoVotes}/${VOTING_LIMITS.casino} votes used</li>
        </ul>
    `;
    if (diningVotes >= VOTING_LIMITS.dining && 
        shoppingVotes >= VOTING_LIMITS.shopping && 
        casinoVotes >= VOTING_LIMITS.casino) {
        votingStatus.innerHTML += `
            <p class="all-votes-used">You've used all your votes!</p>
        `;
    }
}

/**
 * Add voting buttons to all attraction cards
 */
function addVotingButtonsToCards() {
    // Add voting buttons to dining cards
    const diningCards = document.querySelectorAll('#dining-cards .card');
    diningCards.forEach(card => {
        addVotingButtonToCard(card, 'dining');
    });
    
    // Add voting buttons to shopping cards
    const shoppingCards = document.querySelectorAll('#shopping-cards .card');
    shoppingCards.forEach(card => {
        addVotingButtonToCard(card, 'shopping');
    });
    
    // Add voting buttons to casino cards
    const casinoCards = document.querySelectorAll('#casino-cards .card');
    casinoCards.forEach(card => {
        addVotingButtonToCard(card, 'casino');
    });
}

/**
 * Add a voting button to a single card
 * @param {HTMLElement} card - The card element
 * @param {string} category - Category of the attraction
 */
function addVotingButtonToCard(card, category) {
    const attractionId = card.dataset.id;
    if (!attractionId) return;
    
    const cardActions = card.querySelector('.card-actions');
    if (!cardActions) return;
    
    // Create vote button
    const voteButton = document.createElement('button');
    voteButton.className = 'btn btn-vote';
    voteButton.dataset.id = attractionId;
    voteButton.dataset.category = category;
    voteButton.innerHTML = '<i class="fas fa-thumbs-up"></i> Vote';
    
    // Add click event
    voteButton.addEventListener('click', function() {
        toggleVote(attractionId, category);
    });
    
    // Add to card
    cardActions.appendChild(voteButton);
}

/**
 * Helper to fetch all votes from backend
 */
async function fetchBackendVotes() {
    try {
        const response = await fetch(`${API_URL}/votes/raw`);
        backendVotes = await response.json();
    } catch (err) {
        backendVotes = [];
        console.error('Failed to fetch votes from backend:', err);
    }
    // Update the UI after fetching votes
    updateVotingSummary();
    if (currentParticipant !== null) {
        updateVotingStatus();
        updateVotingButtonsState();
    }
}

/**
 * Helper to get votes for a participant from backendVotes
 * @param {number} participantIndex - Index of the participant
 * @returns {Array} - Array of vote objects the participant has voted for
 */
function getParticipantVotes(participantIndex) {
    if (!backendVotes) return [];
    const participantName = PARTICIPANTS[participantIndex];
    const seen = new Set();
    return backendVotes
        .filter(v => v.participant === participantName)
        .filter(v => {
            const key = v.attraction_id + '|' + v.category;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
}

/**
 * Helper to get all votes for all attractions from backendVotes
 * @returns {Object} - Object with attraction IDs as keys and vote counts as values
 */
function getAllVotes() {
    const allVotes = {};
    backendVotes.forEach(vote => {
        if (allVotes[vote.attraction_id]) {
            allVotes[vote.attraction_id]++;
        } else {
            allVotes[vote.attraction_id] = 1;
        }
    });
    return allVotes;
}

/**
 * Helper to get votes by category from backendVotes
 * @param {string} category - Category to filter by (dining, shopping, casino)
 * @returns {Object} - Object with attraction IDs as keys and vote counts as values
 */
function getVotesByCategory(category) {
    const categoryVotes = {};
    backendVotes.forEach(vote => {
        if (vote.category === category) {
            if (categoryVotes[vote.attraction_id]) {
                categoryVotes[vote.attraction_id]++;
            } else {
                categoryVotes[vote.attraction_id] = 1;
            }
        }
    });
    return categoryVotes;
}

/**
 * Add a vote for a participant (send to backend)
 * @param {number} participantIndex - Index of the participant
 * @param {string} attractionId - ID of the attraction
 * @param {string} category - Category of the attraction
 */
async function addVote(participantIndex, attractionId, category) {
    const participantName = PARTICIPANTS[participantIndex];
    try {
        await fetch(`${API_URL}/vote`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ participant: participantName, attractionId, category })
        });
        await fetchBackendVotes();
    } catch (err) {
        alert('Failed to submit vote. Please try again.');
        console.error(err);
    }
}

/**
 * Remove a vote for a participant (send DELETE request to backend)
 * @param {number} participantIndex - Index of the participant
 * @param {string} attractionId - ID of the attraction
 * @param {string} category - Category of the attraction
 */
async function removeVote(participantIndex, attractionId, category) {
    const participantName = PARTICIPANTS[participantIndex];
    try {
        await fetch(`${API_URL}/vote`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ participant: participantName, attractionId, category })
        });
    } catch (err) {
        alert('Failed to remove vote. Please try again.');
        console.error(err);
    }
}

/**
 * Update voting buttons state (must be async to wait for backend votes)
 */
function updateVotingButtonsState() {
    if (currentParticipant === null) return;
    const voteButtons = document.querySelectorAll('.btn-vote');
    // Use deduplicated votes
    const participantVotes = getParticipantVotes(currentParticipant);
    voteButtons.forEach(button => {
        const attractionId = button.dataset.id;
        const category = button.dataset.category;
        // Check if participant has already voted for this attraction in this category
        const hasVoted = participantVotes.some(vote => vote.attraction_id === attractionId && vote.category === category);
        // Count votes for this category
        const categoryVotes = participantVotes.filter(vote => vote.category === category).length;
        const reachedLimit = categoryVotes >= VOTING_LIMITS[category];
        if (hasVoted) {
            button.classList.add('voted');
            button.innerHTML = '<i class="fas fa-check"></i> Voted';
        } else {
            button.classList.remove('voted');
            button.innerHTML = '<i class="fas fa-thumbs-up"></i> Vote';
            if (reachedLimit) {
                button.disabled = true;
                button.title = `You've used all your ${category} votes`;
            } else {
                button.disabled = false;
                button.title = '';
            }
        }
    });
}

/**
 * Toggle a vote for an attraction (async)
 * @param {string} attractionId - ID of the attraction
 * @param {string} category - Category of the attraction
 */
async function toggleVote(attractionId, category) {
    if (currentParticipant === null) {
        alert('Please select your name before voting.');
        return;
    }
    const participantVotes = getParticipantVotes(currentParticipant);
    const hasVoted = participantVotes.some(vote => vote.attraction_id === attractionId && vote.category === category);
    if (hasVoted) {
        // Remove vote (send DELETE request)
        await removeVote(currentParticipant, attractionId, category);
        await fetchBackendVotes();
    } else {
        // No vote limit check!
        await addVote(currentParticipant, attractionId, category);
        await fetchBackendVotes();
    }
    updateCharts();
}

/**
 * Update the charts with the latest voting data
 * This function is a placeholder that will be implemented in charts.js
 */
function updateCharts() {
    // This will be implemented in charts.js
    if (typeof refreshCharts === 'function') {
        refreshCharts();
    }
}

// Add this function after updateVotingStatus
function updateVotingSummary() {
    const summaryDiv = document.getElementById('voting-summary');
    if (!summaryDiv || !window.votingSystem || !window.attractionsData) return;

    // Helper to get top N voted attractions for a category
    function getTopVoted(category, count = 3) {
        const votes = window.votingSystem.getVotesByCategory(category);
        let items = [];
        if (category === 'dining') items = window.attractionsData.dining_options;
        if (category === 'shopping') items = window.attractionsData.shopping_locations;
        if (category === 'casino') items = window.attractionsData.casino_attractions;
        // Attach vote count
        items = items.map(item => ({...item, votes: votes[item.id] || 0}));
        // Sort by votes desc, then name
        items.sort((a, b) => b.votes - a.votes || a.name.localeCompare(b.name));
        // Only show those with at least 1 vote, or top N
        return items.filter(i => i.votes > 0).slice(0, count);
    }

    const topDining = getTopVoted('dining');
    const topShopping = getTopVoted('shopping', 2);
    const topCasino = getTopVoted('casino', 1);

    let html = '<h3>Current Voting Summary</h3>';
    html += '<ul>';
    html += '<li><strong>Dining:</strong> ' + (topDining.length ? topDining.map(i => `${i.name} (${i.votes})`).join(', ') : 'No votes yet') + '</li>';
    html += '<li><strong>Shopping:</strong> ' + (topShopping.length ? topShopping.map(i => `${i.name} (${i.votes})`).join(', ') : 'No votes yet') + '</li>';
    html += '<li><strong>Casino:</strong> ' + (topCasino.length ? topCasino.map(i => `${i.name} (${i.votes})`).join(', ') : 'No votes yet') + '</li>';
    html += '</ul>';

    summaryDiv.innerHTML = html;
}

// Export functions for use in other files
window.votingSystem = {
    getVotesByCategory,
    getAllVotes,
    PARTICIPANTS,
    VOTING_LIMITS
};

// On page load, fetch backend votes
window.addEventListener('DOMContentLoaded', fetchBackendVotes);