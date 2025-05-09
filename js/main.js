/**
 * Main JavaScript file for Baltimore/DC Trip Website
 * Created: May 2025
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the website
    initWebsite();
});

/**
 * Initialize all website functionality
 */
function initWebsite() {
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize navigation
    initNavigation();
    
    // Initialize content loading
    loadContent();
}

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            
            // Change menu icon based on state
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                if (nav.classList.contains('active')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!nav.contains(event.target) && !mobileMenuBtn.contains(event.target) && nav.classList.contains('active')) {
                nav.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
            }
        });
    }
}

/**
 * Initialize navigation functionality
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('nav ul li a');
    
    // Add click event to each navigation link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            navLinks.forEach(item => item.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // If it's a section link on the same page
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Smooth scroll to section
                    window.scrollTo({
                        top: targetSection.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
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
                }
            }
        });
    });
    
    // Set active nav item based on scroll position
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        // Get all sections
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(item => item.classList.remove('active'));
                
                // Add active class to corresponding nav item
                const activeLink = document.querySelector(`nav ul li a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    });
}

/**
 * Load content from attractions.json
 */
function loadContent() {
    // This function will be called by content.js
    // It's defined here to ensure it's available when content.js loads
}

/**
 * Filter attractions by category
 * @param {string} category - Category to filter by
 * @param {string} containerId - ID of the container to update
 */
function filterByCategory(category, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const items = container.querySelectorAll('.card');
    
    items.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
    
    // Update active filter button
    const filterBtns = document.querySelectorAll(`#${containerId}-filters .filter-btn`);
    filterBtns.forEach(btn => {
        if (btn.dataset.filter === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

/**
 * Filter restaurants by price
 * @param {string} price - Price range to filter by
 */
function filterByPrice(price) {
    const container = document.getElementById('dining-cards');
    if (!container) return;
    
    const items = container.querySelectorAll('.card');
    
    items.forEach(item => {
        if (price === 'all' || item.dataset.price === price) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
    
    // Update active filter button
    const filterBtns = document.querySelectorAll('#price-filters .filter-btn');
    filterBtns.forEach(btn => {
        if (btn.dataset.filter === price) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

/**
 * Show details modal for an attraction
 * @param {string} id - ID of the attraction
 */
function showDetails(id) {
    // This will be implemented in the next phase with the voting system
    console.log(`Show details for attraction: ${id}`);
}