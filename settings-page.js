// Settings Page Module for DrivingPro
// Contains all settings page content and functionality

class SettingsPage {
    constructor() {
        this.content = this.getSettingsPageHTML();
        this.userProfile = {};
        this.preferences = {};
        this.vehicleInfo = {};
    }

    getSettingsPageHTML() {
        return `
            <div class="card-grid">
                <div class="card profile-card">
                    <div class="profile-avatar">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>
                    </div>
                    <h3 class="card-title">John Doe</h3>
                    <p class="card-description">Professional Uber Driver</p>
                    <div class="card-badge">Gold Status</div>
                </div>
                
                <div class="card theme-card">
                    <div class="card-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="5"/>
                            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                        </svg>
                    </div>
                    <h3 class="card-title">Theme Selection</h3>
                    <p class="card-description">Choose your preferred app appearance</p>
                    <div class="theme-switcher">
                        <button class="theme-btn" data-theme="light">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="5"/>
                                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                            </svg>
                            Light
                        </button>
                        <button class="theme-btn active" data-theme="dark">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                            </svg>
                            Dark
                        </button>
                        <button class="theme-btn" data-theme="auto">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                                <path d="M8 21h8M12 17v4"/>
                            </svg>
                            Auto
                        </button>
                    </div>
                </div>
                
                <div class="card update-card" id="updateAppCard">
                    <div class="card-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 4v6h6"/>
                            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                            <path d="M16 12l-4-4-4 4"/>
                            <path d="M12 16V8"/>
                        </svg>
                    </div>
                    <h3 class="card-title">Update App</h3>
                    <p class="card-description">Clear cache and refresh to get the latest features and fixes</p>
                    <div class="card-badge update-badge">v1.6.3</div>
                </div>
                
                <div class="card">
                    <div class="card-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                    </div>
                    <h3 class="card-title">Driver Settings</h3>
                    <p class="card-description">Vehicle info, preferences, and account settings</p>
                </div>
            </div>
        `;
    }

    render() {
        return this.content;
    }

    // Initialize any settings page specific functionality
    initialize() {
        // Add any settings page specific event listeners or setup here
        this.setupSettingsInteractions();
        this.loadUserProfile();
        this.initializeThemeSystem();
        this.setupUpdateCard();
    }

    setupSettingsInteractions() {
        // Add hover effects or click handlers specific to settings page cards
        const cards = document.querySelectorAll('#profile .card');
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Handle settings page card clicks
                const cardTitle = card.querySelector('.card-title').textContent;
                console.log(`Settings card clicked: ${cardTitle}`);
                
                // Add specific navigation or actions based on card type
                switch(cardTitle) {
                    case 'John Doe':
                        this.showProfileEditor();
                        break;
                    case 'Theme Selection':
                        // Theme switching is handled by existing theme system
                        break;
                    case 'Update App':
                        this.handleAppUpdate();
                        break;
                    case 'Driver Settings':
                        this.showDriverSettings();
                        break;
                }
                
                // Add visual feedback (except for theme card which has its own)
                if (!card.classList.contains('theme-card')) {
                    this.addSettingsCardFeedback(card);
                }
            });
        });
    }

    addSettingsCardFeedback(card) {
        // Add a specialized settings interaction effect
        card.style.transform = 'scale(0.97)';
        card.style.filter = 'brightness(1.05)';
        
        setTimeout(() => {
            card.style.transform = 'scale(1)';
            card.style.filter = '';
        }, 180);
        
        // Add haptic feedback if available
        if (navigator.vibrate) {
            navigator.vibrate(20);
        }
    }

    showProfileEditor() {
        console.log('Opening profile editor...');
        // Could show modal with editable profile fields
        this.editProfile();
    }

    editProfile() {
        // Example: Could implement inline editing or modal
        const profileCard = document.querySelector('#profile .profile-card');
        if (profileCard) {
            // Add editing state
            profileCard.style.border = '2px solid var(--primary)';
            profileCard.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.3)';
            
            setTimeout(() => {
                profileCard.style.border = '';
                profileCard.style.boxShadow = '';
            }, 2000);
        }
    }

    handleAppUpdate() {
        console.log('Handling app update...');
        // Integrate with existing update functionality from main app
        if (window.drivingProApp && window.drivingProApp.handleAppUpdate) {
            window.drivingProApp.handleAppUpdate();
        } else {
            this.performAppUpdate();
        }
    }

    performAppUpdate() {
        const updateCard = document.querySelector('#profile #updateAppCard');
        if (updateCard) {
            const titleEl = updateCard.querySelector('.card-title');
            const descEl = updateCard.querySelector('.card-description');
            const badgeEl = updateCard.querySelector('.card-badge');
            
            // Show update in progress
            titleEl.textContent = 'Updating...';
            descEl.textContent = 'Clearing cache and refreshing application';
            badgeEl.textContent = 'In Progress';
            badgeEl.style.background = '#f59e0b';
            
            // Simulate update process
            setTimeout(() => {
                titleEl.textContent = 'Update Complete';
                descEl.textContent = 'App has been updated to the latest version';
                badgeEl.textContent = 'v1.6.4';
                badgeEl.style.background = '#10b981';
                
                setTimeout(() => {
                    // Reset to original state
                    titleEl.textContent = 'Update App';
                    descEl.textContent = 'Clear cache and refresh to get the latest features and fixes';
                    badgeEl.textContent = 'v1.6.4';
                    badgeEl.style.background = '';
                }, 3000);
            }, 2000);
        }
    }

    showDriverSettings() {
        console.log('Opening driver settings...');
        // Could show detailed vehicle and preferences settings
        this.loadDriverPreferences();
    }

    loadUserProfile() {
        // Load user profile data
        console.log('Loading user profile...');
        
        this.userProfile = {
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1 (555) 123-4567',
            status: 'Gold Status',
            memberSince: '2022-03-15',
            totalTrips: 1247,
            rating: 4.9,
            vehicle: {
                make: 'Toyota',
                model: 'Camry',
                year: 2021,
                color: 'Silver',
                licensePlate: 'ABC123'
            }
        };
    }

    initializeThemeSystem() {
        // Initialize theme switching functionality
        console.log('Initializing theme system...');
        
        // Connect with main app's theme system
        if (window.drivingProApp) {
            this.setupThemeButtons();
        }
    }

    setupThemeButtons() {
        const themeButtons = document.querySelectorAll('#profile .theme-btn');
        themeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click event
                const theme = button.getAttribute('data-theme');
                
                // Use main app's theme system
                if (window.drivingProApp && window.drivingProApp.setTheme) {
                    window.drivingProApp.setTheme(theme);
                }
                
                // Update button states
                this.updateThemeButtonStates(theme);
                
                // Add visual feedback
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = '';
                }, 150);
            });
        });
    }

    updateThemeButtonStates(activeTheme) {
        const themeButtons = document.querySelectorAll('#profile .theme-btn');
        themeButtons.forEach(button => {
            const buttonTheme = button.getAttribute('data-theme');
            if (buttonTheme === activeTheme) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    setupUpdateCard() {
        // Setup update card specific functionality
        const updateCard = document.querySelector('#profile #updateAppCard');
        if (updateCard) {
            // Add special hover effect for update card
            updateCard.addEventListener('mouseenter', () => {
                updateCard.style.transform = 'translateY(-2px)';
                updateCard.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
            });
            
            updateCard.addEventListener('mouseleave', () => {
                updateCard.style.transform = '';
                updateCard.style.boxShadow = '';
            });
        }
    }

    loadDriverPreferences() {
        // Load driver-specific preferences
        console.log('Loading driver preferences...');
        
        this.preferences = {
            notifications: {
                newTripRequests: true,
                earnings: true,
                ratingUpdates: false,
                promotions: true
            },
            driving: {
                acceptanceRadius: 5, // miles
                maxTripDistance: 45, // miles
                preferredTripTypes: ['UberX', 'UberXL'],
                avoidTolls: false,
                avoidHighways: false
            },
            app: {
                darkMode: 'auto',
                language: 'en',
                units: 'imperial',
                soundEnabled: true,
                hapticFeedback: true
            }
        };
    }

    // Get current settings data for use by other modules
    getSettingsData() {
        return {
            userProfile: this.userProfile,
            preferences: this.preferences,
            vehicleInfo: this.vehicleInfo,
            lastUpdated: new Date()
        };
    }

    // Update user profile
    updateProfile(profileData) {
        this.userProfile = { ...this.userProfile, ...profileData };
        this.refreshProfileDisplay();
        console.log('Profile updated:', this.userProfile);
    }

    refreshProfileDisplay() {
        // Update the profile card with new data
        const profileCard = document.querySelector('#profile .profile-card');
        if (profileCard && this.userProfile) {
            const titleEl = profileCard.querySelector('.card-title');
            const descEl = profileCard.querySelector('.card-description');
            const badgeEl = profileCard.querySelector('.card-badge');
            
            if (titleEl) titleEl.textContent = this.userProfile.name;
            if (descEl) descEl.textContent = 'Professional Uber Driver';
            if (badgeEl) badgeEl.textContent = this.userProfile.status;
        }
    }

    // Save preferences
    savePreferences(newPreferences) {
        this.preferences = { ...this.preferences, ...newPreferences };
        localStorage.setItem('drivingProPreferences', JSON.stringify(this.preferences));
        console.log('Preferences saved:', this.preferences);
    }

    // Load preferences from storage
    loadPreferencesFromStorage() {
        const saved = localStorage.getItem('drivingProPreferences');
        if (saved) {
            this.preferences = { ...this.preferences, ...JSON.parse(saved) };
        }
    }

    // Clean up when switching away from settings page
    cleanup() {
        // Remove any settings page specific event listeners if needed
        console.log('Cleaning up settings page...');
    }
}

// Export for use in the main application
window.SettingsPage = SettingsPage; 