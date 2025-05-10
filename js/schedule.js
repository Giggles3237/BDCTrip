/**
 * Schedule/Calendar System for Baltimore/DC Trip Website
 * Created: May 2025
 * 
 * This file implements an interactive schedule/calendar for the trip
 * that integrates with the voting system to populate time slots.
 */

// Trip dates
const TRIP_DATES = [
    new Date(2025, 5, 16), // June 16, 2025
    new Date(2025, 5, 17), // June 17, 2025
    new Date(2025, 5, 18)  // June 18, 2025
];

// Time slots for each day
const TIME_SLOTS = {
    morning: {
        label: "Morning",
        timeRange: "8:00 AM - 12:00 PM"
    },
    afternoon: {
        label: "Afternoon",
        timeRange: "12:00 PM - 5:00 PM"
    },
    evening: {
        label: "Evening",
        timeRange: "5:00 PM - 10:00 PM"
    }
};

// Schedule data structure
let scheduleData = {
    // Format: [date string]: { morning: { id, name, category }, afternoon: {...}, evening: {...} }
};

// Initialize the schedule system when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the schedule system after content and voting are loaded
    setTimeout(initScheduleSystem, 800);
});

/**
 * Initialize the schedule system
 */
function initScheduleSystem() {
    // Create the schedule interface
    createScheduleInterface();
    
    // Load any saved schedule data
    loadScheduleData();
    
    // Add navigation to the header
    addScheduleNavigation();
    
    console.log('Schedule system initialized');
}

/**
 * Add schedule navigation link to the header
 */
function addScheduleNavigation() {
    const navList = document.querySelector('nav ul');
    if (!navList) return;
    
    // Create new list item for schedule
    const scheduleNavItem = document.createElement('li');
    const scheduleNavLink = document.createElement('a');
    scheduleNavLink.href = '#schedule';
    scheduleNavLink.textContent = 'Schedule';
    scheduleNavItem.appendChild(scheduleNavLink);
    
    // Add to navigation
    navList.appendChild(scheduleNavItem);
    
    // Add click event
    scheduleNavLink.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all links
        const navLinks = document.querySelectorAll('nav ul li a');
        navLinks.forEach(item => item.classList.remove('active'));
        
        // Add active class to this link
        this.classList.add('active');
        
        // Scroll to schedule section
        const scheduleSection = document.querySelector('#schedule');
        if (scheduleSection) {
            window.scrollTo({
                top: scheduleSection.offsetTop - 80,
                behavior: 'smooth'
            });
        }
        
        // Close mobile menu if open
        const nav = document.querySelector('nav');
        if (nav && nav.classList.contains('active')) {
            nav.classList.remove('active');
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-bars';
            }
        }
    });
}

/**
 * Create the schedule interface in the main content area
 */
function createScheduleInterface() {
    // Create schedule section if it doesn't exist
    let scheduleSection = document.querySelector('#schedule');
    if (!scheduleSection) {
        scheduleSection = document.createElement('section');
        scheduleSection.id = 'schedule';
        scheduleSection.className = 'schedule-section';
        
        // Add it after the voting section
        const votingSection = document.querySelector('#voting');
        if (votingSection && votingSection.parentNode) {
            votingSection.parentNode.insertBefore(scheduleSection, votingSection.nextSibling);
        } else {
            // If voting section not found, add to main
            const main = document.querySelector('main');
            if (main) {
                main.appendChild(scheduleSection);
            }
        }
    }
    
    // Create schedule content
    scheduleSection.innerHTML = `
        <div class="container schedule-container">
            <div class="section-title">
                <h2>Trip Schedule</h2>
            </div>
            
            <div class="trip-details">
                <div class="trip-detail">
                    <i class="fas fa-calendar-alt"></i>
                    <span>June 16-18, 2025</span>
                </div>
                <div class="trip-detail">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>Baltimore/DC Area</span>
                </div>
                <div class="trip-detail">
                    <i class="fas fa-users"></i>
                    <span>7 Participants</span>
                </div>
            </div>
            
            <div class="schedule-tabs">
                <div class="schedule-tab active" data-date="2025-06-16">June 16</div>
                <div class="schedule-tab" data-date="2025-06-17">June 17</div>
                <div class="schedule-tab" data-date="2025-06-18">June 18</div>
            </div>
            
            <div class="schedule-content">
                <div class="schedule-day active" id="schedule-2025-06-16">
                    <h3>Monday, June 16, 2025</h3>
                    <div class="time-slots">
                        <div class="time-slot" data-date="2025-06-16" data-slot="morning">
                            <div class="time-slot-header">
                                <h4>Morning</h4>
                                <span class="time-range">8:00 AM - 12:00 PM</span>
                            </div>
                            <div class="time-slot-content empty">
                                <p>No activity scheduled yet</p>
                                <button class="btn btn-schedule">Add Activity</button>
                            </div>
                        </div>
                        
                        <div class="time-slot" data-date="2025-06-16" data-slot="afternoon">
                            <div class="time-slot-header">
                                <h4>Afternoon</h4>
                                <span class="time-range">12:00 PM - 5:00 PM</span>
                            </div>
                            <div class="time-slot-content empty">
                                <p>No activity scheduled yet</p>
                                <button class="btn btn-schedule">Add Activity</button>
                            </div>
                        </div>
                        
                        <div class="time-slot" data-date="2025-06-16" data-slot="evening">
                            <div class="time-slot-header">
                                <h4>Evening</h4>
                                <span class="time-range">5:00 PM - 10:00 PM</span>
                            </div>
                            <div class="time-slot-content empty">
                                <p>No activity scheduled yet</p>
                                <button class="btn btn-schedule">Add Activity</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="schedule-day" id="schedule-2025-06-17">
                    <h3>Tuesday, June 17, 2025</h3>
                    <div class="time-slots">
                        <div class="time-slot" data-date="2025-06-17" data-slot="morning">
                            <div class="time-slot-header">
                                <h4>Morning</h4>
                                <span class="time-range">8:00 AM - 12:00 PM</span>
                            </div>
                            <div class="time-slot-content empty">
                                <p>No activity scheduled yet</p>
                                <button class="btn btn-schedule">Add Activity</button>
                            </div>
                        </div>
                        
                        <div class="time-slot" data-date="2025-06-17" data-slot="afternoon">
                            <div class="time-slot-header">
                                <h4>Afternoon</h4>
                                <span class="time-range">12:00 PM - 5:00 PM</span>
                            </div>
                            <div class="time-slot-content empty">
                                <p>No activity scheduled yet</p>
                                <button class="btn btn-schedule">Add Activity</button>
                            </div>
                        </div>
                        
                        <div class="time-slot" data-date="2025-06-17" data-slot="evening">
                            <div class="time-slot-header">
                                <h4>Evening</h4>
                                <span class="time-range">5:00 PM - 10:00 PM</span>
                            </div>
                            <div class="time-slot-content empty">
                                <p>No activity scheduled yet</p>
                                <button class="btn btn-schedule">Add Activity</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="schedule-day" id="schedule-2025-06-18">
                    <h3>Wednesday, June 18, 2025</h3>
                    <div class="time-slots">
                        <div class="time-slot" data-date="2025-06-18" data-slot="morning">
                            <div class="time-slot-header">
                                <h4>Morning</h4>
                                <span class="time-range">8:00 AM - 12:00 PM</span>
                            </div>
                            <div class="time-slot-content empty">
                                <p>No activity scheduled yet</p>
                                <button class="btn btn-schedule">Add Activity</button>
                            </div>
                        </div>
                        
                        <div class="time-slot" data-date="2025-06-18" data-slot="afternoon">
                            <div class="time-slot-header">
                                <h4>Afternoon</h4>
                                <span class="time-range">12:00 PM - 5:00 PM</span>
                            </div>
                            <div class="time-slot-content empty">
                                <p>No activity scheduled yet</p>
                                <button class="btn btn-schedule">Add Activity</button>
                            </div>
                        </div>
                        
                        <div class="time-slot" data-date="2025-06-18" data-slot="evening">
                            <div class="time-slot-header">
                                <h4>Evening</h4>
                                <span class="time-range">5:00 PM - 10:00 PM</span>
                            </div>
                            <div class="time-slot-content empty">
                                <p>No activity scheduled yet</p>
                                <button class="btn btn-schedule">Add Activity</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="schedule-actions">
                <button id="auto-schedule-btn" class="btn">Auto-Schedule Based on Votes</button>
                <button id="clear-schedule-btn" class="btn btn-outline">Clear Schedule</button>
            </div>
            
            <div class="schedule-help">
                <h4>How to Use the Schedule</h4>
                <ul>
                    <li>Click "Add Activity" to manually add an attraction to a time slot</li>
                    <li>Use "Auto-Schedule" to automatically populate the schedule based on voting results</li>
                    <li>Click on a scheduled activity to edit or remove it</li>
                    <li>Switch between days using the tabs above</li>
                </ul>
            </div>
        </div>
        
        <!-- Activity Selection Modal -->
        <div id="activity-modal" class="modal">
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3>Select an Activity</h3>
                
                <div class="modal-tabs">
                    <div class="modal-tab active" data-category="dining">Dining</div>
                    <div class="modal-tab" data-category="shopping">Shopping</div>
                    <div class="modal-tab" data-category="casino">Casino</div>
                </div>
                
                <div class="modal-body">
                    <div class="modal-category active" id="modal-dining">
                        <div class="activity-list" id="dining-activity-list">
                            <!-- Dining activities will be loaded here -->
                            <p class="loading-activities">Loading dining options...</p>
                        </div>
                    </div>
                    
                    <div class="modal-category" id="modal-shopping">
                        <div class="activity-list" id="shopping-activity-list">
                            <!-- Shopping activities will be loaded here -->
                            <p class="loading-activities">Loading shopping options...</p>
                        </div>
                    </div>
                    
                    <div class="modal-category" id="modal-casino">
                        <div class="activity-list" id="casino-activity-list">
                            <!-- Casino activities will be loaded here -->
                            <p class="loading-activities">Loading casino options...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Initialize schedule tabs
    initScheduleTabs();
    
    // Initialize activity modal
    initActivityModal();
    
    // Initialize schedule buttons
    initScheduleButtons();
}

/**
 * Initialize schedule tabs
 */
function initScheduleTabs() {
    const tabs = document.querySelectorAll('.schedule-tab');
    const days = document.querySelectorAll('.schedule-day');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and days
            tabs.forEach(t => t.classList.remove('active'));
            days.forEach(d => d.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding day
            const dateId = this.dataset.date;
            const day = document.getElementById(`schedule-${dateId}`);
            if (day) {
                day.classList.add('active');
            }
        });
    });
}

/**
 * Initialize activity modal
 */
function initActivityModal() {
    const modal = document.getElementById('activity-modal');
    if (!modal) return;
    
    // Close button
    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    // Close when clicking outside the modal
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Modal tabs
    const modalTabs = modal.querySelectorAll('.modal-tab');
    const modalCategories = modal.querySelectorAll('.modal-category');
    
    modalTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and categories
            modalTabs.forEach(t => t.classList.remove('active'));
            modalCategories.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding category
            const category = this.dataset.category;
            const categoryEl = document.getElementById(`modal-${category}`);
            if (categoryEl) {
                categoryEl.classList.add('active');
            }
        });
    });
    
    // Load activities into modal
    loadActivitiesIntoModal();
}

/**
 * Load activities into the modal
 */
function loadActivitiesIntoModal() {
    // Check if attractions data is available
    if (!window.attractionsData) {
        setTimeout(loadActivitiesIntoModal, 500);
        return;
    }
    
    // Load dining options
    const diningList = document.getElementById('dining-activity-list');
    if (diningList && window.attractionsData.dining_options) {
        diningList.innerHTML = '';
        
        window.attractionsData.dining_options.forEach(option => {
            const activityItem = createActivityItem(option);
            diningList.appendChild(activityItem);
        });
    }
    
    // Load shopping options
    const shoppingList = document.getElementById('shopping-activity-list');
    if (shoppingList && window.attractionsData.shopping_locations) {
        shoppingList.innerHTML = '';
        
        window.attractionsData.shopping_locations.forEach(location => {
            const activityItem = createActivityItem(location);
            shoppingList.appendChild(activityItem);
        });
    }
    
    // Load casino options
    const casinoList = document.getElementById('casino-activity-list');
    if (casinoList && window.attractionsData.casino_attractions) {
        casinoList.innerHTML = '';
        
        window.attractionsData.casino_attractions.forEach(casino => {
            const activityItem = createActivityItem(casino);
            casinoList.appendChild(activityItem);
        });
    }
}

/**
 * Create an activity item for the modal
 * @param {Object} activity - Activity data
 * @returns {HTMLElement} - Activity item element
 */
function createActivityItem(activity) {
    const item = document.createElement('div');
    item.className = 'activity-item';
    item.dataset.id = activity.id;
    
    // Get vote count for this activity
    let voteCount = 0;
    if (window.votingSystem && window.votingSystem.getAllVotes) {
        const allVotes = window.votingSystem.getAllVotes();
        voteCount = allVotes[activity.id] || 0;
    }
    
    // Create item HTML
    item.innerHTML = `
        <div class="activity-img">
            <img src="${activity.image_path}" alt="${activity.name}">
        </div>
        <div class="activity-info">
            <h4>${activity.name}</h4>
            <p class="activity-category">${activity.category}</p>
            <p class="activity-price">${activity.price}</p>
            <p class="activity-votes"><i class="fas fa-thumbs-up"></i> ${voteCount} votes</p>
        </div>
    `;
    
    // Add click event to select this activity
    item.addEventListener('click', function() {
        // Get current target time slot
        const targetSlot = document.querySelector('.time-slot.selecting');
        if (targetSlot) {
            // Add activity to the time slot
            addActivityToTimeSlot(targetSlot, activity);
            
            // Close modal
            const modal = document.getElementById('activity-modal');
            if (modal) {
                modal.style.display = 'none';
            }
            
            // Remove selecting class
            targetSlot.classList.remove('selecting');
        }
    });
    
    return item;
}

/**
 * Initialize schedule buttons
 */
function initScheduleButtons() {
    // Add activity buttons
    const addButtons = document.querySelectorAll('.btn-schedule');
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get parent time slot
            const timeSlot = this.closest('.time-slot');
            if (!timeSlot) return;
            
            // Mark this slot as the target for selection
            timeSlot.classList.add('selecting');
            
            // Show activity selection modal
            const modal = document.getElementById('activity-modal');
            if (modal) {
                modal.style.display = 'block';
            }
        });
    });
    
    // Auto-schedule button
    const autoScheduleBtn = document.getElementById('auto-schedule-btn');
    if (autoScheduleBtn) {
        autoScheduleBtn.addEventListener('click', autoScheduleActivities);
    }
    
    // Clear schedule button
    const clearScheduleBtn = document.getElementById('clear-schedule-btn');
    if (clearScheduleBtn) {
        clearScheduleBtn.addEventListener('click', clearSchedule);
    }
}

/**
 * Add an activity to a time slot
 * @param {HTMLElement} timeSlot - Time slot element
 * @param {Object} activity - Activity data
 */
function addActivityToTimeSlot(timeSlot, activity) {
    // Get date and slot from the time slot
    const date = timeSlot.dataset.date;
    const slot = timeSlot.dataset.slot;
    
    // Update schedule data
    if (!scheduleData[date]) {
        scheduleData[date] = {};
    }
    
    scheduleData[date][slot] = {
        id: activity.id,
        name: activity.name,
        category: activity.category,
        image: activity.image_path
    };
    
    // Save schedule data
    saveScheduleData();
    
    // Update time slot content
    const slotContent = timeSlot.querySelector('.time-slot-content');
    if (slotContent) {
        slotContent.classList.remove('empty');
        slotContent.innerHTML = `
            <div class="scheduled-activity" data-id="${activity.id}">
                <div class="activity-img">
                    <img src="${activity.image_path}" alt="${activity.name}">
                </div>
                <div class="activity-info">
                    <h4>${activity.name}</h4>
                    <p class="activity-category">${activity.category}</p>
                </div>
                <button class="btn-remove-activity" title="Remove Activity">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Add remove button event
        const removeBtn = slotContent.querySelector('.btn-remove-activity');
        if (removeBtn) {
            removeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                removeActivityFromTimeSlot(timeSlot);
            });
        }
    }
}

/**
 * Remove an activity from a time slot
 * @param {HTMLElement} timeSlot - Time slot element
 */
function removeActivityFromTimeSlot(timeSlot) {
    // Get date and slot from the time slot
    const date = timeSlot.dataset.date;
    const slot = timeSlot.dataset.slot;
    
    // Update schedule data
    if (scheduleData[date] && scheduleData[date][slot]) {
        delete scheduleData[date][slot];
        
        // Clean up empty dates
        if (Object.keys(scheduleData[date]).length === 0) {
            delete scheduleData[date];
        }
    }
    
    // Save schedule data
    saveScheduleData();
    
    // Update time slot content
    const slotContent = timeSlot.querySelector('.time-slot-content');
    if (slotContent) {
        slotContent.classList.add('empty');
        slotContent.innerHTML = `
            <p>No activity scheduled yet</p>
            <button class="btn btn-schedule">Add Activity</button>
        `;
        
        // Re-initialize the add button
        const addButton = slotContent.querySelector('.btn-schedule');
        if (addButton) {
            addButton.addEventListener('click', function() {
                // Mark this slot as the target for selection
                timeSlot.classList.add('selecting');
                
                // Show activity selection modal
                const modal = document.getElementById('activity-modal');
                if (modal) {
                    modal.style.display = 'block';
                }
            });
        }
    }
}

/**
 * Auto-schedule activities based on voting results
 */
function autoScheduleActivities() {
    // Check if voting system is available
    if (!window.votingSystem || !window.attractionsData) {
        alert('Voting data is not available yet. Please try again later.');
        return;
    }
    
    // Confirm with user
    if (!confirm('This will replace your current schedule with activities based on voting results. Continue?')) {
        return;
    }
    
    // Clear current schedule
    clearSchedule(false);
    
    // Get votes by category
    const diningVotes = window.votingSystem.getVotesByCategory('dining');
    const shoppingVotes = window.votingSystem.getVotesByCategory('shopping');
    const casinoVotes = window.votingSystem.getVotesByCategory('casino');
    
    // Sort activities by votes
    const sortedDining = sortActivitiesByVotes(diningVotes, window.attractionsData.dining_options);
    const sortedShopping = sortActivitiesByVotes(shoppingVotes, window.attractionsData.shopping_locations);
    const sortedCasino = sortActivitiesByVotes(casinoVotes, window.attractionsData.casino_attractions);
    
    // Create a simple schedule based on votes
    // Day 1: Morning - Shopping, Afternoon - Shopping, Evening - Dining
    // Day 2: Morning - Dining, Afternoon - Casino, Evening - Dining
    // Day 3: Morning - Dining, Afternoon - Shopping, Evening - Dining
    
    // Initialize schedule data
    scheduleData = {
        '2025-06-16': {},
        '2025-06-17': {},
        '2025-06-18': {}
    };
    
    // Day 1
    if (sortedShopping[0]) {
        scheduleData['2025-06-16'].morning = {
            id: sortedShopping[0].id,
            name: sortedShopping[0].name,
            category: sortedShopping[0].category,
            image: sortedShopping[0].image_path
        };
    }
    
    if (sortedShopping[1]) {
        scheduleData['2025-06-16'].afternoon = {
            id: sortedShopping[1].id,
            name: sortedShopping[1].name,
            category: sortedShopping[1].category,
            image: sortedShopping[1].image_path
        };
    }
    
    if (sortedDining[0]) {
        scheduleData['2025-06-16'].evening = {
            id: sortedDining[0].id,
            name: sortedDining[0].name,
            category: sortedDining[0].category,
            image: sortedDining[0].image_path
        };
    }
    
    // Day 2
    if (sortedDining[1]) {
        scheduleData['2025-06-17'].morning = {
            id: sortedDining[1].id,
            name: sortedDining[1].name,
            category: sortedDining[1].category,
            image: sortedDining[1].image_path
        };
    }
    
    if (sortedCasino[0]) {
        scheduleData['2025-06-17'].afternoon = {
            id: sortedCasino[0].id,
            name: sortedCasino[0].name,
            category: sortedCasino[0].category,
            image: sortedCasino[0].image_path
        };
    }
    
    if (sortedDining[2]) {
        scheduleData['2025-06-17'].evening = {
            id: sortedDining[2].id,
            name: sortedDining[2].name,
            category: sortedDining[2].category,
            image: sortedDining[2].image_path
        };
    }
    
    // Day 3
    if (sortedDining[3]) {
        scheduleData['2025-06-18'].morning = {
            id: sortedDining[3].id,
            name: sortedDining[3].name,
            category: sortedDining[3].category,
            image: sortedDining[3].image_path
        };
    }
    
    if (sortedShopping[2]) {
        scheduleData['2025-06-18'].afternoon = {
            id: sortedShopping[2].id,
            name: sortedShopping[2].name,
            category: sortedShopping[2].category,
            image: sortedShopping[2].image_path
        };
    }
    
    if (sortedDining[4]) {
        scheduleData['2025-06-18'].evening = {
            id: sortedDining[4].id,
            name: sortedDining[4].name,
            category: sortedDining[4].category,
            image: sortedDining[4].image_path
        };
    }
    
    // Save schedule data
    saveScheduleData();
    
    // Update UI
    updateScheduleUI();
    
    alert('Schedule has been automatically created based on voting results!');
}

/**
 * Sort activities by votes
 * @param {Object} votes - Object with attraction IDs as keys and vote counts as values
 * @param {Array} activities - Array of activity objects
 * @returns {Array} - Sorted array of activities
 */
function sortActivitiesByVotes(votes, activities) {
    // Create array with vote counts
    const activitiesWithVotes = activities.map(activity => {
        return {
            ...activity,
            votes: votes[activity.id] || 0
        };
    });
    
    // Sort by votes (descending)
    return activitiesWithVotes.sort((a, b) => b.votes - a.votes);
}

/**
 * Clear the schedule
 * @param {boolean} confirm - Whether to confirm with the user
 */
function clearSchedule(confirm = true) {
    // Confirm with user
    if (confirm && !window.confirm('Are you sure you want to clear the entire schedule?')) {
        return;
    }
    
    // Clear schedule data
    scheduleData = {};
    
    // Save empty schedule
    saveScheduleData();
    
    // Reset UI
    const timeSlots = document.querySelectorAll('.time-slot');
    timeSlots.forEach(slot => {
        const slotContent = slot.querySelector('.time-slot-content');
        if (slotContent) {
            slotContent.classList.add('empty');
            slotContent.innerHTML = `
                <p>No activity scheduled yet</p>
                <button class="btn btn-schedule">Add Activity</button>
            `;
        }
    });
    
    // Re-initialize buttons
    initScheduleButtons();
}

/**
 * Save schedule data to localStorage
 */
function saveScheduleData() {
    localStorage.setItem('trip_schedule', JSON.stringify(scheduleData));
}

/**
 * Load schedule data from localStorage
 */
function loadScheduleData() {
    const savedData = localStorage.getItem('trip_schedule');
    if (savedData) {
        try {
            scheduleData = JSON.parse(savedData);
            updateScheduleUI();
        } catch (error) {
            console.error('Error loading schedule data:', error);
        }
    }
}

/**
 * Update the schedule UI based on the current schedule data
 */
function updateScheduleUI() {
    // Loop through all time slots
    const timeSlots = document.querySelectorAll('.time-slot');
    timeSlots.forEach(slot => {
        const date = slot.dataset.date;
        const slotTime = slot.dataset.slot;
        
        // Check if there's an activity scheduled for this slot
        if (scheduleData[date] && scheduleData[date][slotTime]) {
            const activity = scheduleData[date][slotTime];
            
            // Update time slot content
            const slotContent = slot.querySelector('.time-slot-content');
            if (slotContent) {
                slotContent.classList.remove('empty');
                slotContent.innerHTML = `
                    <div class="scheduled-activity" data-id="${activity.id}">
                        <div class="activity-img">
                            <img src="${activity.image}" alt="${activity.name}">
                        </div>
                        <div class="activity-info">
                            <h4>${activity.name}</h4>
                            <p class="activity-category">${activity.category}</p>
                        </div>
                        <button class="btn-remove-activity" title="Remove Activity">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
                
                // Add remove button event
                const removeBtn = slotContent.querySelector('.btn-remove-activity');
                if (removeBtn) {
                    removeBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        removeActivityFromTimeSlot(slot);
                    });
                }
            }
        }
    });
}

// Make functions available globally
window.scheduleSystem = {
    scheduleData,
    updateScheduleUI,
    autoScheduleActivities,
    clearSchedule
};