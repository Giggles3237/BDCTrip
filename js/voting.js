/**
 * Voting System for Baltimore/DC Trip Website
 * Created: May 2025
 * 
 * This file implements an interactive voting system for 7 participants
 * to vote on their preferred attractions in each category.
 */

// Constants for voting limits per category
const VOTING_LIMITS = {
    dining: 3,
    shopping: 2,
    casino: 1
};

// Participant names (for the 7 participants)
const PARTICIPANTS = [
    "Participant 1",
    "Participant 2",
    "Participant 3",
    "Participant 4",
    "Participant 5",
    "Participant 6",
    "Participant 7"
];

// Current active participant
let currentParticipant = null;

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
        
        <div class="participant-selection">
            <h3>Select Your Name</h3>
            <div class="participant-buttons" id="participant-buttons">
                ${PARTICIPANTS.map((name, index) => 
                    `<button class="participant-btn" data-participant="${index}">${name}</button>`
                ).join('')}
            </div>
        </div>
        
        <div class="voting-status" id="voting-status">
            <p>Please select your name to start voting.</p>
        </div>
        
        <div id="voting-summary"></div>
    `;
    
    // Add event listeners to participant buttons
    const participantButtons = document.querySelectorAll('.participant-btn');
    participantButtons.forEach(button => {
        button.addEventListener('click', function() {
            const participantIndex = this.dataset.participant;
            selectParticipant(participantIndex);
        });
    });
}

/**
 * Select a participant and update the UI
 * @param {string} participantIndex - Index of the selected participant
 */
function selectParticipant(participantIndex) {
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
    
    // Update voting status
    updateVotingStatus();
    
    // Update voting buttons on cards
    updateVotingButtonsState();
    
    updateVotingSummary();
    
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
    const votes = getParticipantVotes(currentParticipant);
    
    // Count votes by category
    const diningVotes = votes.filter(vote => vote.startsWith('D')).length;
    const shoppingVotes = votes.filter(vote => vote.startsWith('S')).length;
    const casinoVotes = votes.filter(vote => vote.startsWith('C')).length;
    
    // Create status message
    votingStatus.innerHTML = `
        <h3>Hello, ${participantName}!</h3>
        <p>Your voting status:</p>
        <ul>
            <li>Dining: ${diningVotes}/${VOTING_LIMITS.dining} votes used</li>
            <li>Shopping: ${shoppingVotes}/${VOTING_LIMITS.shopping} votes used</li>
            <li>Casino: ${casinoVotes}/${VOTING_LIMITS.casino} votes used</li>
        </ul>
    `;
    
    // If they've used all their votes, add a message
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
 * Update the state of all voting buttons based on current participant's votes
 */
function updateVotingButtonsState() {
    if (currentParticipant === null) return;
    
    const voteButtons = document.querySelectorAll('.btn-vote');
    const participantVotes = getParticipantVotes(currentParticipant);
    
    voteButtons.forEach(button => {
        const attractionId = button.dataset.id;
        const category = button.dataset.category;
        
        // Check if participant has already voted for this attraction
        const hasVoted = participantVotes.includes(attractionId);
        
        // Check if participant has reached voting limit for this category
        const categoryVotes = participantVotes.filter(vote => {
            // Match first letter of ID with category (D for dining, S for shopping, C for casino)
            const voteCategory = vote.charAt(0);
            return (category === 'dining' && voteCategory === 'D') || 
                   (category === 'shopping' && voteCategory === 'S') || 
                   (category === 'casino' && voteCategory === 'C');
        }).length;
        
        const reachedLimit = categoryVotes >= VOTING_LIMITS[category];
        
        // Update button state
        if (hasVoted) {
            button.classList.add('voted');
            button.innerHTML = '<i class="fas fa-check"></i> Voted';
        } else {
            button.classList.remove('voted');
            button.innerHTML = '<i class="fas fa-thumbs-up"></i> Vote';
            
            // Disable if reached limit
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
 * Toggle a vote for an attraction
 * @param {string} attractionId - ID of the attraction
 * @param {string} category - Category of the attraction
 */
function toggleVote(attractionId, category) {
    if (currentParticipant === null) {
        alert('Please select your name before voting.');
        return;
    }
    
    const participantVotes = getParticipantVotes(currentParticipant);
    const hasVoted = participantVotes.includes(attractionId);
    
    if (hasVoted) {
        // Remove vote
        removeVote(currentParticipant, attractionId);
    } else {
        // Check if participant has reached voting limit for this category
        const categoryVotes = participantVotes.filter(vote => {
            // Match first letter of ID with category (D for dining, S for shopping, C for casino)
            const voteCategory = vote.charAt(0);
            return (category === 'dining' && voteCategory === 'D') || 
                   (category === 'shopping' && voteCategory === 'S') || 
                   (category === 'casino' && voteCategory === 'C');
        }).length;
        
        if (categoryVotes >= VOTING_LIMITS[category]) {
            alert(`You've already used all your ${category} votes (${VOTING_LIMITS[category]} maximum).`);
            return;
        }
        
        // Add vote
        addVote(currentParticipant, attractionId);
    }
    
    // Update UI
    updateVotingStatus();
    updateVotingButtonsState();
    updateVotingSummary();
    
    // Update charts
    updateCharts();
}

/**
 * Get votes for a participant from localStorage
 * @param {number} participantIndex - Index of the participant
 * @returns {Array} - Array of attraction IDs the participant has voted for
 */
function getParticipantVotes(participantIndex) {
    const votesKey = `participant_${participantIndex}_votes`;
    const votesJson = localStorage.getItem(votesKey);
    
    if (votesJson) {
        return JSON.parse(votesJson);
    }
    
    return [];
}

/**
 * Add a vote for a participant
 * @param {number} participantIndex - Index of the participant
 * @param {string} attractionId - ID of the attraction
 */
function addVote(participantIndex, attractionId) {
    const votes = getParticipantVotes(participantIndex);
    
    // Check if already voted
    if (votes.includes(attractionId)) {
        return;
    }
    
    // Add vote
    votes.push(attractionId);
    
    // Save to localStorage
    const votesKey = `participant_${participantIndex}_votes`;
    localStorage.setItem(votesKey, JSON.stringify(votes));
    
    console.log(`Added vote for ${attractionId} by ${PARTICIPANTS[participantIndex]}`);
}

/**
 * Remove a vote for a participant
 * @param {number} participantIndex - Index of the participant
 * @param {string} attractionId - ID of the attraction
 */
function removeVote(participantIndex, attractionId) {
    const votes = getParticipantVotes(participantIndex);
    
    // Remove vote
    const updatedVotes = votes.filter(id => id !== attractionId);
    
    // Save to localStorage
    const votesKey = `participant_${participantIndex}_votes`;
    localStorage.setItem(votesKey, JSON.stringify(updatedVotes));
    
    console.log(`Removed vote for ${attractionId} by ${PARTICIPANTS[participantIndex]}`);
}

/**
 * Get all votes for all attractions
 * @returns {Object} - Object with attraction IDs as keys and vote counts as values
 */
function getAllVotes() {
    const allVotes = {};
    
    // Loop through all participants
    for (let i = 0; i < PARTICIPANTS.length; i++) {
        const participantVotes = getParticipantVotes(i);
        
        // Count votes for each attraction
        participantVotes.forEach(attractionId => {
            if (allVotes[attractionId]) {
                allVotes[attractionId]++;
            } else {
                allVotes[attractionId] = 1;
            }
        });
    }
    
    return allVotes;
}

/**
 * Get votes by category
 * @param {string} category - Category to filter by (dining, shopping, casino)
 * @returns {Object} - Object with attraction IDs as keys and vote counts as values
 */
function getVotesByCategory(category) {
    const allVotes = getAllVotes();
    const categoryVotes = {};
    
    // Filter by category based on ID prefix
    Object.keys(allVotes).forEach(attractionId => {
        const prefix = attractionId.charAt(0);
        
        if ((category === 'dining' && prefix === 'D') || 
            (category === 'shopping' && prefix === 'S') || 
            (category === 'casino' && prefix === 'C')) {
            categoryVotes[attractionId] = allVotes[attractionId];
        }
    });
    
    return categoryVotes;
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