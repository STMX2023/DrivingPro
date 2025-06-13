// Earnings Page Module for DrivingPro
// Contains all earnings page content and functionality

class EarningsPage {
    constructor() {
        this.content = this.getEarningsPageHTML();
        this.earningsData = {};
        this.updateInterval = null;
    }

    getEarningsPageHTML() {
        return `
            <div class="card-grid">
                <div class="card stats-card">
                    <div class="stats-number">$247.50</div>
                    <p class="stats-label">Today's Earnings</p>
                </div>
                
                <div class="card stats-card">
                    <div class="stats-number">$1,890</div>
                    <p class="stats-label">This Week</p>
                </div>
                
                <div class="card stats-card">
                    <div class="stats-number">4.9★</div>
                    <p class="stats-label">Driver Rating</p>
                </div>
                
                <div class="card stats-card">
                    <div class="stats-number">12</div>
                    <p class="stats-label">Trips Today</p>
                </div>
            </div>
        `;
    }

    render() {
        return this.content;
    }

    // Initialize any earnings page specific functionality
    initialize() {
        // Add any earnings page specific event listeners or setup here
        this.setupEarningsInteractions();
        this.loadEarningsData();
        this.startEarningsUpdates();
    }

    setupEarningsInteractions() {
        // Add hover effects or click handlers specific to earnings page cards
        const cards = document.querySelectorAll('#stats .card');
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Handle earnings page card clicks
                const statsLabel = card.querySelector('.stats-label').textContent;
                console.log(`Earnings card clicked: ${statsLabel}`);
                
                // Add specific navigation or actions based on card type
                switch(statsLabel) {
                    case "Today's Earnings":
                        this.showTodayBreakdown();
                        break;
                    case 'This Week':
                        this.showWeeklyBreakdown();
                        break;
                    case 'Driver Rating':
                        this.showRatingDetails();
                        break;
                    case 'Trips Today':
                        this.showTripDetails();
                        break;
                }
                
                // Add visual feedback
                this.addEarningsCardFeedback(card);
            });
        });
    }

    addEarningsCardFeedback(card) {
        // Add a specialized bounce effect for earnings cards
        card.style.transform = 'scale(0.96)';
        card.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
        
        setTimeout(() => {
            card.style.transform = 'scale(1)';
            card.style.boxShadow = '';
        }, 200);
        
        // Add haptic feedback if available
        if (navigator.vibrate) {
            navigator.vibrate(30);
        }
    }

    showTodayBreakdown() {
        console.log('Showing today\'s earnings breakdown...');
        // Could show detailed breakdown: base fare, tips, bonuses, etc.
        this.updateTodayDetails();
    }

    showWeeklyBreakdown() {
        console.log('Showing weekly earnings breakdown...');
        // Could show daily breakdown for the week
        this.updateWeeklyChart();
    }

    showRatingDetails() {
        console.log('Showing rating details...');
        // Could show rating history, feedback, improvement tips
        this.updateRatingInsights();
    }

    showTripDetails() {
        console.log('Showing trip details...');
        // Could switch to trips view or show trip statistics
        if (window.drivingProApp) {
            window.drivingProApp.switchTab('practice');
        }
    }

    loadEarningsData() {
        // Load or refresh earnings-related data
        console.log('Loading earnings data...');
        
        // Example: Could fetch from API or local storage
        this.earningsData = {
            today: {
                total: 247.50,
                baseFare: 180.25,
                tips: 45.75,
                bonuses: 21.50,
                trips: 12
            },
            week: {
                total: 1890.00,
                days: [
                    { day: 'Mon', amount: 285.50 },
                    { day: 'Tue', amount: 310.75 },
                    { day: 'Wed', amount: 245.00 },
                    { day: 'Thu', amount: 290.25 },
                    { day: 'Fri', amount: 355.50 },
                    { day: 'Sat', amount: 155.50 },
                    { day: 'Sun', amount: 247.50 }
                ]
            },
            rating: {
                current: 4.9,
                totalRatings: 1247,
                fiveStars: 1156,
                fourStars: 78,
                threeStars: 11,
                twoStars: 2,
                oneStars: 0
            }
        };
    }

    startEarningsUpdates() {
        // Update earnings every 30 seconds (simulating real-time updates)
        this.updateInterval = setInterval(() => {
            this.updateEarningsDisplay();
        }, 30000);
    }

    updateEarningsDisplay() {
        // Update the earnings numbers with current data
        const todayCard = document.querySelector('#stats .card:nth-child(1) .stats-number');
        const weekCard = document.querySelector('#stats .card:nth-child(2) .stats-number');
        const ratingCard = document.querySelector('#stats .card:nth-child(3) .stats-number');
        const tripsCard = document.querySelector('#stats .card:nth-child(4) .stats-number');

        if (todayCard && this.earningsData.today) {
            // Add a small random increment to simulate real-time updates
            const increment = Math.random() * 5; // Random amount up to $5
            this.earningsData.today.total += increment;
            todayCard.textContent = `$${this.earningsData.today.total.toFixed(2)}`;
            
            // Add a brief highlight effect for updates
            this.highlightUpdate(todayCard);
        }

        if (tripsCard && this.earningsData.today) {
            tripsCard.textContent = this.earningsData.today.trips.toString();
        }
    }

    highlightUpdate(element) {
        // Add a brief green highlight to show the number updated
        element.style.color = '#10b981';
        element.style.transform = 'scale(1.05)';
        
        setTimeout(() => {
            element.style.color = '';
            element.style.transform = '';
        }, 1000);
    }

    updateTodayDetails() {
        // Example of updating today's breakdown
        const todayCard = document.querySelector('#stats .card:nth-child(1)');
        if (todayCard && this.earningsData.today) {
            // Could add more detailed breakdown to the card
            console.log('Today breakdown:', this.earningsData.today);
        }
    }

    updateWeeklyChart() {
        // Example of showing weekly data
        console.log('Weekly breakdown:', this.earningsData.week);
        // Could implement a mini chart or detailed view
    }

    updateRatingInsights() {
        // Example of showing rating details
        console.log('Rating insights:', this.earningsData.rating);
        // Could show rating distribution, recent feedback, etc.
    }

    // Get current earnings data for use by other modules
    getEarningsData() {
        return {
            ...this.earningsData,
            lastUpdated: new Date()
        };
    }

    // Method to manually refresh earnings data
    refreshEarnings() {
        this.loadEarningsData();
        this.updateEarningsDisplay();
        console.log('Earnings data refreshed');
    }

    // Clean up when switching away from earnings page
    cleanup() {
        // Clear the update interval to prevent memory leaks
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        console.log('Cleaning up earnings page...');
    }
}

// Export for use in the main application
window.EarningsPage = EarningsPage; 