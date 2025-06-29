// Home Page Module for DrivingPro
// Contains all home page content and functionality

class HomePage {
    constructor() {
        this.content = this.getHomePageHTML();
    }

    getHomePageHTML() {
        return `
            <div class="card-grid">
                <div class="card">
                    <div class="card-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10V6c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v4l-2.5 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2"/>
                            <circle cx="7" cy="17" r="2"/>
                            <circle cx="17" cy="17" r="2"/>
                        </svg>
                    </div>
                    <h3 class="card-title">Trip Analytics</h3>
                    <p class="card-description">Track your rides, earnings, and performance metrics in real-time</p>
                    <div class="card-badge">Live Data</div>
                </div>
                
                <div class="card">
                    <div class="card-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                        </svg>
                    </div>
                    <h3 class="card-title">Smart Navigation</h3>
                    <p class="card-description">AI-powered route optimization with real-time traffic and surge zones</p>
                    <div class="card-badge">Real-time</div>
                </div>
                
                <div class="card">
                    <div class="card-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 6v6l4 2"/>
                            <path d="M16 8a6 6 0 0 1-8 5.7"/>
                        </svg>
                    </div>
                    <h3 class="card-title">Earnings Dashboard</h3>
                    <p class="card-description">Comprehensive earnings analysis with trip breakdown and tips tracking</p>
                    <div class="card-badge">$247 Today</div>
                </div>
                
                <div class="card">
                    <div class="card-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                    </div>
                    <h3 class="card-title">Performance Hub</h3>
                    <p class="card-description">Rating insights, passenger feedback, and personalized improvement tips</p>
                    <div class="card-badge">4.9 Rating</div>
                </div>
            </div>
        `;
    }

    render() {
        return this.content;
    }

    // Initialize any home page specific functionality
    initialize() {
        // Add any home page specific event listeners or setup here
        this.setupCardInteractions();
    }

    setupCardInteractions() {
        // Add hover effects or click handlers specific to home page cards
        const cards = document.querySelectorAll('#home .card');
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Handle home page card clicks
                const cardTitle = card.querySelector('.card-title').textContent;
                console.log(`Home page card clicked: ${cardTitle}`);
                
                // Add specific navigation or actions based on card type
                switch(cardTitle) {
                    case 'Trip Analytics':
                        // Could navigate to detailed analytics
                        break;
                    case 'Smart Navigation':
                        // Could open navigation view
                        break;
                    case 'Earnings Dashboard':
                        // Could switch to earnings tab
                        if (window.drivingProApp) {
                            window.drivingProApp.switchTab('stats');
                        }
                        break;
                    case 'Performance Hub':
                        // Could open performance details
                        break;
                }
            });
        });
    }

    // Clean up when switching away from home page
    cleanup() {
        // Remove any home page specific event listeners if needed
    }
}

// Export for use in the main application
window.HomePage = HomePage; 