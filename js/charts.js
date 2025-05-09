/**
 * Charts for Baltimore/DC Trip Website Voting System
 * Created: May 2025
 * 
 * This file implements the visualization of voting results using Chart.js
 */

// Chart objects to store references for updating
let diningChart = null;
let shoppingChart = null;
let casinoChart = null;

// Color palette for charts
const chartColors = [
    '#3498db', // Blue
    '#e74c3c', // Red
    '#2ecc71', // Green
    '#f39c12', // Orange
    '#9b59b6', // Purple
    '#1abc9c', // Teal
    '#34495e', // Dark Blue
    '#d35400', // Dark Orange
    '#27ae60', // Dark Green
    '#8e44ad', // Dark Purple
    '#2980b9', // Medium Blue
    '#c0392b', // Dark Red
    '#16a085', // Medium Teal
    '#f1c40f', // Yellow
    '#7f8c8d', // Gray
    '#3498db', // Blue (repeat for more items)
    '#e74c3c'  // Red (repeat for more items)
];

/**
 * Initialize all charts
 */
function initCharts() {
    // Only initialize if voting system is ready
    if (!window.votingSystem) {
        return;
    }
    // Initialize dining chart
    initDiningChart();
    // Initialize shopping chart
    initShoppingChart();
    // Initialize casino chart
    initCasinoChart();
    console.log('Charts initialized');
}

/**
 * Initialize the dining chart
 */
function initDiningChart() {
    const ctx = document.getElementById('dining-chart');
    if (!ctx) return;
    
    // Destroy previous chart if it exists
    if (diningChart) {
        diningChart.destroy();
        diningChart = null;
    }
    
    // Get dining votes
    const diningVotes = window.votingSystem.getVotesByCategory('dining');
    
    // Prepare data for chart
    const chartData = prepareChartData(diningVotes, 'dining');
    
    // Create chart
    diningChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'Votes',
                data: chartData.data,
                backgroundColor: chartColors.slice(0, chartData.labels.length),
                borderColor: chartColors.slice(0, chartData.labels.length),
                borderWidth: 1
            }]
        },
        options: getChartOptions('Dining Votes')
    });
}

/**
 * Initialize the shopping chart
 */
function initShoppingChart() {
    const ctx = document.getElementById('shopping-chart');
    if (!ctx) return;
    
    // Destroy previous chart if it exists
    if (shoppingChart) {
        shoppingChart.destroy();
        shoppingChart = null;
    }
    
    // Get shopping votes
    const shoppingVotes = window.votingSystem.getVotesByCategory('shopping');
    
    // Prepare data for chart
    const chartData = prepareChartData(shoppingVotes, 'shopping');
    
    // Create chart
    shoppingChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: chartData.labels,
            datasets: [{
                data: chartData.data,
                backgroundColor: chartColors.slice(0, chartData.labels.length),
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: getChartOptions('Shopping Votes', 'pie')
    });
}

/**
 * Initialize the casino chart
 */
function initCasinoChart() {
    const ctx = document.getElementById('casino-chart');
    if (!ctx) return;
    
    // Destroy previous chart if it exists
    if (casinoChart) {
        casinoChart.destroy();
        casinoChart = null;
    }
    
    // Get casino votes
    const casinoVotes = window.votingSystem.getVotesByCategory('casino');
    
    // Prepare data for chart
    const chartData = prepareChartData(casinoVotes, 'casino');
    
    // Create chart
    casinoChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: chartData.labels,
            datasets: [{
                data: chartData.data,
                backgroundColor: chartColors.slice(0, chartData.labels.length),
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: getChartOptions('Casino Votes', 'doughnut')
    });
}

/**
 * Prepare data for charts
 * @param {Object} votes - Object with attraction IDs as keys and vote counts as values
 * @param {string} category - Category of attractions
 * @returns {Object} - Object with labels and data arrays for chart
 */
function prepareChartData(votes, category) {
    // Get attractions data
    const attractions = getAttractionsData();
    if (!attractions) {
        return { labels: [], data: [] };
    }
    
    // Get attractions for this category
    let categoryAttractions = [];
    if (category === 'dining') {
        categoryAttractions = attractions.dining_options || [];
    } else if (category === 'shopping') {
        categoryAttractions = attractions.shopping_locations || [];
    } else if (category === 'casino') {
        categoryAttractions = attractions.casino_attractions || [];
    }
    
    // Prepare data arrays
    const labels = [];
    const data = [];
    
    // Add attractions with votes
    Object.keys(votes).forEach(attractionId => {
        const attraction = categoryAttractions.find(a => a.id === attractionId);
        if (attraction) {
            labels.push(attraction.name);
            data.push(votes[attractionId]);
        }
    });
    
    // If no votes yet, show all attractions with 0 votes
    if (labels.length === 0) {
        categoryAttractions.forEach(attraction => {
            labels.push(attraction.name);
            data.push(0);
        });
    }
    
    return { labels, data };
}

/**
 * Get chart options based on chart type
 * @param {string} title - Chart title
 * @param {string} type - Chart type (bar, pie, doughnut)
 * @returns {Object} - Chart options
 */
function getChartOptions(title, type = 'bar') {
    const baseOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: type !== 'bar',
                position: 'bottom',
                labels: {
                    font: {
                        family: "'Open Sans', sans-serif",
                        size: 12
                    },
                    color: '#333'
                }
            },
            title: {
                display: false,
                text: title,
                font: {
                    family: "'Open Sans', sans-serif",
                    size: 16,
                    weight: 'bold'
                },
                color: '#333'
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                        const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                        return `${label}: ${value} votes (${percentage}%)`;
                    }
                }
            }
        }
    };
    
    // Add specific options based on chart type
    if (type === 'bar') {
        return {
            ...baseOptions,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0,
                        font: {
                            family: "'Open Sans', sans-serif"
                        }
                    },
                    title: {
                        display: true,
                        text: 'Number of Votes',
                        font: {
                            family: "'Open Sans', sans-serif",
                            size: 14
                        }
                    }
                },
                x: {
                    ticks: {
                        font: {
                            family: "'Open Sans', sans-serif"
                        }
                    }
                }
            }
        };
    }
    
    return baseOptions;
}

/**
 * Get attractions data from the global variable or fetch from JSON
 * @returns {Object|null} - Attractions data object or null if not available
 */
function getAttractionsData() {
    // Try to get from global variable first (if already loaded by content.js)
    if (window.attractionsData) {
        return window.attractionsData;
    }
    
    // Otherwise return null (charts will be updated later when data is available)
    return null;
}

/**
 * Refresh all charts with the latest voting data
 */
function refreshCharts() {
    // Update dining chart
    if (diningChart) {
        const diningVotes = window.votingSystem.getVotesByCategory('dining');
        const diningChartData = prepareChartData(diningVotes, 'dining');
        
        diningChart.data.labels = diningChartData.labels;
        diningChart.data.datasets[0].data = diningChartData.data;
        diningChart.data.datasets[0].backgroundColor = chartColors.slice(0, diningChartData.labels.length);
        diningChart.data.datasets[0].borderColor = chartColors.slice(0, diningChartData.labels.length);
        diningChart.update();
    }
    
    // Update shopping chart
    if (shoppingChart) {
        const shoppingVotes = window.votingSystem.getVotesByCategory('shopping');
        const shoppingChartData = prepareChartData(shoppingVotes, 'shopping');
        
        shoppingChart.data.labels = shoppingChartData.labels;
        shoppingChart.data.datasets[0].data = shoppingChartData.data;
        shoppingChart.data.datasets[0].backgroundColor = chartColors.slice(0, shoppingChartData.labels.length);
        shoppingChart.update();
    }
    
    // Update casino chart
    if (casinoChart) {
        const casinoVotes = window.votingSystem.getVotesByCategory('casino');
        const casinoChartData = prepareChartData(casinoVotes, 'casino');
        
        casinoChart.data.labels = casinoChartData.labels;
        casinoChart.data.datasets[0].data = casinoChartData.data;
        casinoChart.data.datasets[0].backgroundColor = chartColors.slice(0, casinoChartData.labels.length);
        casinoChart.update();
    }
}

// Make functions available globally
window.initCharts = initCharts;
window.refreshCharts = refreshCharts;