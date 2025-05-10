/**
 * Content JavaScript file for Baltimore/DC Trip Website
 * Created: May 2025
 * 
 * This file handles loading and displaying attraction data
 */

// Global variable to store attractions data
window.attractionsData = null;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load attractions data
    loadAttractions();
});

/**
 * Load attractions data from JSON file
 */
async function loadAttractions() {
    try {
        const response = await fetch('./data/attractions.json');
        if (!response.ok) {
            throw new Error('Failed to load attractions data');
        }
        
        const data = await response.json();
        
        // Store data in global variable for access by other scripts
        window.attractionsData = data;
        
        // Process and display the data
        displayDiningOptions(data.dining_options);
        displayShoppingLocations(data.shopping_locations);
        displayCasinoAttractions(data.casino_attractions);
        
        // Initialize filter buttons
        initializeFilters();
        
        console.log('Attractions data loaded successfully');
        
        if (typeof initVotingSystem === 'function') {
            initVotingSystem();
        }
    } catch (error) {
        console.error('Error loading attractions data:', error);
        displayErrorMessage('Failed to load attractions data. Please try again later.');
    }
}

/**
 * Display dining options in the dining section
 * @param {Array} diningOptions - Array of dining options
 */
function displayDiningOptions(diningOptions) {
    const container = document.getElementById('dining-cards');
    if (!container) return;
    
    container.innerHTML = '';
    
    diningOptions.forEach(option => {
        // Extract price category ($$, $$$)
        const priceCategory = option.price;
        
        const card = createCard(
            option.name,
            option.category,
            option.price,
            option.rating,
            option.description,
            option.image_path,
            option.id,
            option.website,
            option.address,
            option.good_for,
            priceCategory
        );
        
        container.appendChild(card);
    });
}

/**
 * Display shopping locations in the shopping section
 * @param {Array} shoppingLocations - Array of shopping locations
 */
function displayShoppingLocations(shoppingLocations) {
    const container = document.getElementById('shopping-cards');
    if (!container) return;
    
    container.innerHTML = '';
    
    shoppingLocations.forEach(location => {
        const card = createCard(
            location.name,
            location.category,
            location.price,
            location.rating,
            location.description,
            location.image_path,
            location.id,
            location.website,
            location.address,
            location.good_for
        );
        
        container.appendChild(card);
    });
}

/**
 * Display casino attractions in the casinos section
 * @param {Array} casinoAttractions - Array of casino attractions
 */
function displayCasinoAttractions(casinoAttractions) {
    const container = document.getElementById('casino-cards');
    if (!container) return;
    
    container.innerHTML = '';
    
    casinoAttractions.forEach(casino => {
        const card = createCard(
            casino.name,
            casino.category,
            casino.price,
            casino.rating,
            casino.description,
            casino.image_path,
            casino.id,
            casino.website,
            casino.address,
            casino.good_for
        );
        
        container.appendChild(card);
    });
}

/**
 * Create a card element for an attraction
 * @param {string} name - Name of the attraction
 * @param {string} category - Category of the attraction
 * @param {string} price - Price range of the attraction
 * @param {string} rating - Rating of the attraction
 * @param {string} description - Description of the attraction
 * @param {string} imagePath - Path to the image of the attraction
 * @param {string} id - ID of the attraction
 * @param {string} website - Website of the attraction
 * @param {string} address - Address of the attraction
 * @param {string} goodFor - What the attraction is good for
 * @param {string} priceCategory - Price category for filtering ($$, $$$)
 * @returns {HTMLElement} - Card element
 */
function createCard(name, category, price, rating, description, imagePath, id, website, address, goodFor, priceCategory) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = id;
    card.dataset.category = category.toLowerCase().split(',')[0].trim();
    
    if (priceCategory) {
        card.dataset.price = priceCategory;
    }
    
    // Create card HTML structure
    card.innerHTML = `
        <div class="card-img">
            <img src="${imagePath}" alt="${name}">
        </div>
        <div class="card-content">
            <h3 class="card-title">${name}</h3>
            <div class="card-category">${category}</div>
            <div class="card-price">${price}</div>
            <div class="card-rating">${formatRating(rating)}</div>
            <p class="card-description">${description}</p>
            <div class="card-details">
                <p><strong>Address:</strong> ${address}</p>
                <p><strong>Good for:</strong> ${goodFor}</p>
            </div>
            <div class="card-actions">
                <a href="${website}" class="btn btn-outline" target="_blank">Visit Website</a>
            </div>
        </div>
    `;
    
    return card;
}

/**
 * Format rating to display stars
 * @param {string} rating - Rating string from JSON
 * @returns {string} - Formatted rating with stars
 */
function formatRating(rating) {
    // Extract numeric rating if available
    const numericMatch = rating.match(/(\d+\.\d+)\/5/);
    if (!numericMatch) return rating;
    
    const numericRating = parseFloat(numericMatch[1]);
    let stars = '';
    
    // Generate stars based on rating
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(numericRating)) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= numericRating) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    
    return `${stars} <span>(${rating})</span>`;
}

/**
 * Initialize filter buttons
 */
function initializeFilters() {
    // Price filters for dining
    const priceFilters = document.getElementById('price-filters');
    if (priceFilters) {
        const buttons = priceFilters.querySelectorAll('.filter-btn');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.dataset.filter;
                filterByPrice(filter);
            });
        });
    }
    
    // Category filters for each section
    const sections = ['dining', 'shopping', 'casino'];
    sections.forEach(section => {
        const filterContainer = document.getElementById(`${section}-filters`);
        if (filterContainer) {
            const buttons = filterContainer.querySelectorAll('.filter-btn');
            buttons.forEach(button => {
                button.addEventListener('click', function() {
                    const filter = this.dataset.filter;
                    filterByCategory(filter, `${section}-cards`);
                });
            });
        }
    });
}

/**
 * Display error message on the page
 * @param {string} message - Error message to display
 */
function displayErrorMessage(message) {
    const sections = ['dining-cards', 'shopping-cards', 'casino-cards'];
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>${message}</p>
                </div>
            `;
        }
    });
}