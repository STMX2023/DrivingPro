// Trips Page Module for DrivingPro
// Contains all trips page content and functionality

class TripsPage {
    constructor() {
        this.content = this.getTripsPageHTML();
        this.activeTrip = null;
        this.tripHistory = [];
    }

    getTripsPageHTML() {
        return `
            <div class="card-grid">
                <div class="card">
                    <div class="card-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12,6 12,12 16,14"/>
                        </svg>
                    </div>
                    <h3 class="card-title">Active Trip</h3>
                    <p class="card-description">Downtown to Airport • $24.50 estimated</p>
                    <div class="card-badge">In Progress</div>
                </div>
                
                <div class="card">
                    <div class="card-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                            <polyline points="7.5,4.21 12,6.81 16.5,4.21"/>
                            <polyline points="7.5,19.79 7.5,14.6 3,12"/>
                            <polyline points="21,12 16.5,14.6 16.5,19.79"/>
                        </svg>
                    </div>
                    <h3 class="card-title">Trip History</h3>
                    <p class="card-description">View completed rides and passenger ratings</p>
                    <div class="card-badge">47 trips</div>
                </div>
            </div>
        `;
    }

    render() {
        return this.content;
    }

    // Initialize any trips page specific functionality
    initialize() {
        // Add any trips page specific event listeners or setup here
        this.setupTripInteractions();
        this.loadTripData();
    }

    setupTripInteractions() {
        // Add hover effects or click handlers specific to trips page cards
        const cards = document.querySelectorAll('#practice .card');
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Handle trips page card clicks
                const cardTitle = card.querySelector('.card-title').textContent;
                console.log(`Trips page card clicked: ${cardTitle}`);
                
                // Add specific navigation or actions based on card type
                switch(cardTitle) {
                    case 'Active Trip':
                        this.showActiveTripDetails();
                        break;
                    case 'Trip History':
                        this.showTripHistory();
                        break;
                }
                
                // Add visual feedback
                this.addTripCardFeedback(card);
            });
        });
    }

    addTripCardFeedback(card) {
        // Add a pulse effect for trip-specific interactions
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = 'scale(1)';
        }, 150);
        
        // Add haptic feedback if available
        if (navigator.vibrate) {
            navigator.vibrate(25);
        }
    }

    showActiveTripDetails() {
        // Could show detailed trip information modal or navigate to trip view
        console.log('Showing active trip details...');
        
        // Example: Update the active trip card with real-time data
        this.updateActiveTripStatus();
    }

    showTripHistory() {
        // Could navigate to a detailed trip history view
        console.log('Showing trip history...');
        
        // Example: Could switch to a more detailed trips view or modal
        this.loadTripHistoryData();
    }

    updateActiveTripStatus() {
        // Simulate updating active trip status
        const activeTripCard = document.querySelector('#practice .card .card-title');
        if (activeTripCard && activeTripCard.textContent === 'Active Trip') {
            const descriptionEl = activeTripCard.parentElement.querySelector('.card-description');
            const badgeEl = activeTripCard.parentElement.querySelector('.card-badge');
            
            // Example of dynamic updates
            if (descriptionEl) {
                const currentTime = new Date().toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
                descriptionEl.textContent = `Downtown to Airport • $24.50 estimated • ${currentTime}`;
            }
        }
    }

    loadTripData() {
        // Load or refresh trip-related data
        console.log('Loading trip data...');
        
        // Example: Could fetch from API or local storage
        this.activeTrip = {
            id: 'trip_001',
            destination: 'Airport',
            estimatedFare: 24.50,
            status: 'in_progress',
            startTime: new Date()
        };
        
        this.tripHistory = [
            { id: 'trip_047', fare: 18.75, rating: 5, date: '2023-06-13' },
            { id: 'trip_046', fare: 32.20, rating: 4, date: '2023-06-12' }
            // ... more trips
        ];
    }

    loadTripHistoryData() {
        // Simulate loading detailed trip history
        console.log('Loading detailed trip history...', this.tripHistory);
        
        // Could implement pagination, filtering, etc.
        return this.tripHistory;
    }

    // Method to update trip counts and stats
    updateTripStats() {
        const tripHistoryCard = document.querySelector('#practice .card:nth-child(2)');
        if (tripHistoryCard) {
            const badgeEl = tripHistoryCard.querySelector('.card-badge');
            if (badgeEl) {
                const tripCount = this.tripHistory.length + 1; // +1 for active trip
                badgeEl.textContent = `${tripCount} trips`;
            }
        }
    }

    // Get current trip data for use by other modules
    getTripData() {
        return {
            activeTrip: this.activeTrip,
            tripHistory: this.tripHistory,
            totalTrips: this.tripHistory.length + (this.activeTrip ? 1 : 0)
        };
    }

    // Clean up when switching away from trips page
    cleanup() {
        // Remove any trips page specific event listeners if needed
        console.log('Cleaning up trips page...');
    }
}

// Export for use in the main application
window.TripsPage = TripsPage; 