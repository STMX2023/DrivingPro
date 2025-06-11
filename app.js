// PWA App JavaScript
class DrivingProApp {
    constructor() {
        this.currentTab = 'home';
        this.timeData = {};
        this.timeBasedCards = new Map();
        this.locationData = {};
        this.locationWatchId = null;
        this.currentTheme = 'light';
        this.init();
    }

    init() {
        this.initializeThemeSystem();
        this.initializeTimeSystem();
        this.initializeLocationSystem();
        this.setupEventListeners();
        this.setupPWA();
        this.animateCards();
    }

    // ===== TIME SYSTEM =====
    async initializeTimeSystem() {
        await this.getUserLocationTime();
        this.setupTimeBasedCards();
        this.startTimeUpdates();
        this.updateDynamicContent();
    }

    async getUserLocationTime() {
        try {
            // Get user's timezone automatically
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const now = new Date();
            
            this.timeData = {
                timezone: timezone,
                currentTime: now,
                hour: now.getHours(),
                minute: now.getMinutes(),
                dayOfWeek: now.getDay(), // 0 = Sunday, 1 = Monday, etc.
                dayName: now.toLocaleDateString('en-US', { weekday: 'long' }),
                date: now.getDate(),
                month: now.getMonth() + 1,
                year: now.getFullYear(),
                monthName: now.toLocaleDateString('en-US', { month: 'long' }),
                formattedDate: now.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                }),
                formattedTime: now.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                }),
                timeOfDay: this.getTimeOfDay(now.getHours()),
                isWeekend: now.getDay() === 0 || now.getDay() === 6,
                isBusinessHours: now.getHours() >= 6 && now.getHours() <= 22
            };

            console.log('Time System Initialized:', this.timeData);
            
        } catch (error) {
            console.error('Error getting user location time:', error);
            // Fallback to basic time
            this.timeData = {
                timezone: 'UTC',
                currentTime: new Date(),
                hour: new Date().getHours(),
                timeOfDay: this.getTimeOfDay(new Date().getHours())
            };
        }
    }

    getTimeOfDay(hour) {
        if (hour >= 5 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 17) return 'afternoon';
        if (hour >= 17 && hour < 21) return 'evening';
        return 'night';
    }

    setupTimeBasedCards() {
        // Define time-sensitive cards and their visibility rules
        this.timeBasedCards.set('morning-boost', {
            timeRange: { start: 6, end: 10 },
            weekdays: [1, 2, 3, 4, 5], // Monday to Friday
            title: '🌅 Morning Rush Boost',
            description: 'Peak demand time! Higher surge rates expected in business districts.',
            badge: 'Hot Zones',
            cardType: 'dynamic'
        });

        this.timeBasedCards.set('lunch-peak', {
            timeRange: { start: 11, end: 14 },
            weekdays: [1, 2, 3, 4, 5],
            title: '🍽️ Lunch Peak Hours',
            description: 'Restaurant and office areas showing high demand.',
            badge: 'Lunch Rush',
            cardType: 'dynamic'
        });

        this.timeBasedCards.set('evening-surge', {
            timeRange: { start: 17, end: 20 },
            weekdays: [1, 2, 3, 4, 5],
            title: '🌆 Evening Commute',
            description: 'Premium rates active near transit hubs and residential areas.',
            badge: 'Prime Time',
            cardType: 'dynamic'
        });

        this.timeBasedCards.set('weekend-leisure', {
            timeRange: { start: 10, end: 23 },
            weekdays: [0, 6], // Weekend
            title: '🎉 Weekend Hotspots',
            description: 'Entertainment districts and shopping centers have increased activity.',
            badge: 'Weekend Boost',
            cardType: 'dynamic'
        });

        this.timeBasedCards.set('late-night', {
            timeRange: { start: 22, end: 5 },
            weekdays: [0, 1, 2, 3, 4, 5, 6],
            title: '🌙 Night Shift Premium',
            description: 'Airport runs and late-night venues offer bonus rates.',
            badge: 'Night Premium',
            cardType: 'dynamic'
        });
    }

    startTimeUpdates() {
        // Update time every minute
        setInterval(() => {
            this.getUserLocationTime().then(() => {
                this.updateDynamicContent();
                this.updateTimeBasedCards();
            });
        }, 60000); // 60 seconds

        // Initial update
        this.updateTimeBasedCards();
    }

    updateDynamicContent() {
        // Update any time-sensitive text content
        this.updateGreeting();
        this.updateDateDisplay();
        this.updateEarningsBasedOnTime();
    }

    updateGreeting() {
        const headerTitle = document.querySelector('.header-title');
        if (headerTitle) {
            let greeting = '';
            switch(this.timeData.timeOfDay) {
                case 'morning':
                    greeting = 'Good Morning';
                    break;
                case 'afternoon':
                    greeting = 'Good Afternoon';
                    break;
                case 'evening':
                    greeting = 'Good Evening';
                    break;
                case 'night':
                    greeting = 'Good Night';
                    break;
            }
            // You can optionally change the header or add a subtitle
            // headerTitle.textContent = `${greeting} - DrivingPro`;
        }
    }

    updateDateDisplay() {
        // Add current date/time info to cards if needed
        const profileCard = document.querySelector('.profile-card .card-description');
        if (profileCard) {
            profileCard.textContent = `Active since ${this.timeData.formattedDate}`;
        }
    }

    updateEarningsBasedOnTime() {
        // Update earnings display based on time of day
        const earningsCard = document.querySelector('.stats-card .stats-number');
        if (earningsCard && earningsCard.textContent.includes('$247')) {
            // Simulate dynamic earnings based on time
            let baseEarnings = 247;
            if (this.timeData.timeOfDay === 'morning') baseEarnings += 23;
            if (this.timeData.timeOfDay === 'evening') baseEarnings += 45;
            if (this.timeData.isWeekend) baseEarnings += 67;
            
            earningsCard.textContent = `$${baseEarnings}.${Math.floor(Math.random() * 99).toString().padStart(2, '0')}`;
        }
    }

    updateTimeBasedCards() {
        const currentHour = this.timeData.hour;
        const currentDay = this.timeData.dayOfWeek;

        // Check which time-based cards should be visible
        for (const [cardId, cardConfig] of this.timeBasedCards) {
            const shouldShow = this.shouldShowTimeBasedCard(cardConfig, currentHour, currentDay);
            
            if (shouldShow) {
                this.showTimeBasedCard(cardId, cardConfig);
            } else {
                this.hideTimeBasedCard(cardId);
            }
        }
    }

    shouldShowTimeBasedCard(cardConfig, currentHour, currentDay) {
        // Check if current time is within the card's time range
        const { start, end } = cardConfig.timeRange;
        const timeMatch = (start <= end) 
            ? currentHour >= start && currentHour < end
            : currentHour >= start || currentHour < end; // For ranges that cross midnight

        // Check if current day is in the card's weekdays
        const dayMatch = cardConfig.weekdays.includes(currentDay);

        return timeMatch && dayMatch;
    }

    showTimeBasedCard(cardId, cardConfig) {
        // Check if card already exists
        let existingCard = document.getElementById(`time-card-${cardId}`);
        
        if (!existingCard) {
            // Create new time-based card
            const cardHTML = `
                <div class="card" id="time-card-${cardId}">
                    <div class="card-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12,6 12,12 16,14"/>
                        </svg>
                    </div>
                    <h3 class="card-title">${cardConfig.title}</h3>
                    <p class="card-description">${cardConfig.description}</p>
                    <div class="card-badge">${cardConfig.badge}</div>
                </div>
            `;

            // Insert into home card grid (first position)
            const homeCardGrid = document.querySelector('#home .card-grid');
            if (homeCardGrid) {
                homeCardGrid.insertAdjacentHTML('afterbegin', cardHTML);
                
                // Animate the new card
                const newCard = document.getElementById(`time-card-${cardId}`);
                newCard.style.opacity = '0';
                newCard.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    newCard.classList.add('slide-up');
                    newCard.style.opacity = '1';
                    newCard.style.transform = 'translateY(0)';
                }, 100);
            }
        }
    }

    hideTimeBasedCard(cardId) {
        const card = document.getElementById(`time-card-${cardId}`);
        if (card) {
            // Animate out
            card.style.opacity = '0';
            card.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                card.remove();
            }, 300);
        }
    }

    // Public method to get current time data
    getTimeData() {
        return this.timeData;
    }

    // Public method to manually refresh time
    async refreshTime() {
        await this.getUserLocationTime();
        this.updateDynamicContent();
        this.updateTimeBasedCards();
        return this.timeData;
    }

    // ===== LOCATION SYSTEM =====
    async initializeLocationSystem() {
        this.setupLocationDisplay();
        await this.requestLocationPermission();
        this.startLocationTracking();
    }

    setupLocationDisplay() {
        const locationText = document.getElementById('locationText');
        if (locationText) {
            locationText.textContent = 'Obtendo...';
        }
    }

    async requestLocationPermission() {
        if (!navigator.geolocation) {
            this.updateLocationDisplay('GPS não disponível');
            console.error('Geolocation not supported');
            return false;
        }

        try {
            // Check current permission state
            const permission = await navigator.permissions.query({name: 'geolocation'});
            
            if (permission.state === 'granted') {
                console.log('Location permission already granted');
                return true;
            } else if (permission.state === 'prompt') {
                console.log('Will prompt for location permission');
                return true;
            } else {
                this.updateLocationDisplay('Permissão negada');
                console.log('Location permission denied');
                return false;
            }
        } catch (error) {
            console.log('Permission API not supported, will try direct access');
            return true;
        }
    }

    startLocationTracking() {
        if (!navigator.geolocation) {
            this.updateLocationDisplay('GPS não suportado');
            return;
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000 // 1 minute cache
        };

        // Get initial position
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.handleLocationSuccess(position);
                this.startLocationWatch(options);
            },
            (error) => {
                this.handleLocationError(error);
            },
            options
        );
    }

    startLocationWatch(options) {
        // Watch position changes every minute
        this.locationWatchId = navigator.geolocation.watchPosition(
            (position) => {
                this.handleLocationSuccess(position);
            },
            (error) => {
                this.handleLocationError(error);
            },
            options
        );

        console.log('Location tracking started with watchId:', this.locationWatchId);
    }

    handleLocationSuccess(position) {
        const { latitude, longitude, accuracy } = position.coords;
        const timestamp = new Date(position.timestamp);

        this.locationData = {
            latitude: latitude,
            longitude: longitude,
            accuracy: Math.round(accuracy),
            timestamp: timestamp,
            formattedCoords: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            lastUpdate: timestamp.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })
        };

        this.updateLocationDisplay();
        
        console.log('Location updated:', this.locationData);
    }

    handleLocationError(error) {
        let errorMessage = 'Erro GPS';
        
        switch(error.code) {
            case error.PERMISSION_DENIED:
                errorMessage = 'Permissão negada';
                console.error('Location permission denied by user');
                break;
            case error.POSITION_UNAVAILABLE:
                errorMessage = 'GPS indisponível';
                console.error('Location information unavailable');
                break;
            case error.TIMEOUT:
                errorMessage = 'Timeout GPS';
                console.error('Location request timeout');
                break;
            default:
                errorMessage = 'Erro desconhecido';
                console.error('Unknown location error');
                break;
        }

        this.updateLocationDisplay(errorMessage);
    }

    updateLocationDisplay(errorMessage = null) {
        const locationText = document.getElementById('locationText');
        if (!locationText) return;

        if (errorMessage) {
            locationText.textContent = errorMessage;
            locationText.style.color = 'var(--danger)';
        } else if (this.locationData.formattedCoords) {
            locationText.textContent = this.locationData.formattedCoords;
            locationText.style.color = 'var(--text-secondary)';
            locationText.title = `Precisão: ${this.locationData.accuracy}m - Última atualização: ${this.locationData.lastUpdate}`;
        }
    }

    // Stop location tracking (for cleanup)
    stopLocationTracking() {
        if (this.locationWatchId !== null) {
            navigator.geolocation.clearWatch(this.locationWatchId);
            this.locationWatchId = null;
            console.log('Location tracking stopped');
        }
    }

    // Public method to get current location data
    getLocationData() {
        return this.locationData;
    }

    // Public method to manually refresh location
    refreshLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => this.handleLocationSuccess(position),
                (error) => this.handleLocationError(error),
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0 // Force fresh location
                }
            );
        }
    }

    // ===== THEME SYSTEM =====
    initializeThemeSystem() {
        this.loadSavedTheme();
        this.setupThemeListeners();
        this.updateThemeButtons();
    }

    loadSavedTheme() {
        // Get saved theme from localStorage or default to 'light'
        const savedTheme = localStorage.getItem('drivingpro-theme') || 'light';
        this.currentTheme = savedTheme;
        this.applyTheme(savedTheme);
    }

    setupThemeListeners() {
        const themeButtons = document.querySelectorAll('.theme-btn');
        themeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const theme = button.dataset.theme;
                this.setTheme(theme);
            });
        });

        // Listen for system theme changes when in auto mode
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', () => {
                if (this.currentTheme === 'auto') {
                    this.applyTheme('auto');
                }
            });
        }
    }

    setTheme(theme) {
        this.currentTheme = theme;
        this.applyTheme(theme);
        this.saveTheme(theme);
        this.updateThemeButtons();
        
        // Haptic feedback
        this.hapticFeedback('light');
        
        console.log(`Theme changed to: ${theme}`);
    }

    applyTheme(theme) {
        const documentElement = document.documentElement;
        
        // Remove existing theme attributes
        documentElement.removeAttribute('data-theme');
        
        switch (theme) {
            case 'light':
                // Light theme is default, no attribute needed
                break;
            case 'dark':
                documentElement.setAttribute('data-theme', 'dark');
                break;
            case 'auto':
                // Let CSS media queries handle auto theme
                // The CSS will automatically apply dark theme if system prefers dark
                break;
        }
    }

    saveTheme(theme) {
        localStorage.setItem('drivingpro-theme', theme);
    }

    updateThemeButtons() {
        const themeButtons = document.querySelectorAll('.theme-btn');
        themeButtons.forEach(button => {
            const buttonTheme = button.dataset.theme;
            if (buttonTheme === this.currentTheme) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    // Public method to get current theme
    getCurrentTheme() {
        return this.currentTheme;
    }

    // Public method to check if dark mode is active
    isDarkMode() {
        if (this.currentTheme === 'dark') {
            return true;
        } else if (this.currentTheme === 'auto') {
            return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    }

    // Public method to get effective theme (resolves 'auto' to 'light' or 'dark')
    getEffectiveTheme() {
        if (this.currentTheme === 'auto') {
            return this.isDarkMode() ? 'dark' : 'light';
        }
        return this.currentTheme;
    }

    setupEventListeners() {
        // Tab navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                this.switchTab(item.dataset.tab);
            });
        });

        // Card interactions
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                this.handleCardClick(card, e);
            });
        });

        // Header button
        const headerBtn = document.querySelector('.header-btn');
        if (headerBtn) {
            headerBtn.addEventListener('click', (e) => {
                this.handleHeaderAction(e);
            });
        }

        // Add touch feedback
        this.addTouchFeedback();
    }

    switchTab(tabName) {
        if (this.currentTab === tabName) return;

        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        this.currentTab = tabName;
        
        // Animate new content
        this.animateCards();
        
        // Add haptic feedback (if supported)
        this.hapticFeedback('light');
    }

    handleCardClick(card, event) {
        // Add bounce animation
        card.classList.add('bounce-in');
        
        // Remove animation class after completion
        setTimeout(() => {
            card.classList.remove('bounce-in');
        }, 600);

        // Haptic feedback for card interaction
        this.hapticFeedback('medium');

        // Here you would typically navigate to a detailed view
        console.log('Card clicked:', card);
    }

    handleHeaderAction(event) {
        // Add rotation animation to settings icon
        const icon = event.currentTarget.querySelector('svg');
        icon.style.transform = 'rotate(180deg)';
        
        setTimeout(() => {
            icon.style.transform = 'rotate(0deg)';
        }, 300);

        // Haptic feedback
        this.hapticFeedback('light');
        
        console.log('Header action clicked');
    }

    animateCards() {
        const cards = document.querySelectorAll('.content-section.active .card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.classList.add('slide-up');
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    addTouchFeedback() {
        const interactiveElements = document.querySelectorAll('.card, .nav-item, .header-btn');
        
        interactiveElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.style.transform = element.style.transform + ' scale(0.95)';
            });
            
            element.addEventListener('touchend', () => {
                setTimeout(() => {
                    element.style.transform = element.style.transform.replace(' scale(0.95)', '');
                }, 100);
            });
        });
    }

    hapticFeedback(type = 'light') {
        if ('vibrate' in navigator) {
            switch(type) {
                case 'light':
                    navigator.vibrate(10);
                    break;
                case 'medium':
                    navigator.vibrate(20);
                    break;
                case 'heavy':
                    navigator.vibrate(50);
                    break;
            }
        }
    }

    setupPWA() {
        // Register service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js?v=1.4.0')
                .then(registration => {
                    console.log('SW registered successfully');
                    // Force update if there's a waiting service worker
                    if (registration.waiting) {
                        registration.waiting.postMessage({command: 'skipWaiting'});
                    }
                })
                .catch(error => {
                    console.log('SW registration failed');
                });
        }

        // Handle install prompt
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            this.showInstallBanner();
        });

        // Handle app installed
        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            this.hideInstallBanner();
        });
    }

    showInstallBanner() {
        // Create install banner (you can customize this)
        const banner = document.createElement('div');
        banner.className = 'install-banner';
        banner.innerHTML = `
            <div class="install-content">
                <span>Install DrivingPro for the best experience</span>
                <button class="install-btn">Install</button>
            </div>
        `;
        
        // Add banner styles
        const style = document.createElement('style');
        style.textContent = `
            .install-banner {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: var(--primary-color);
                color: white;
                padding: 12px 16px;
                z-index: 1000;
                transform: translateY(-100%);
                transition: transform 0.3s ease;
            }
            .install-banner.show {
                transform: translateY(0);
            }
            .install-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                max-width: 428px;
                margin: 0 auto;
            }
            .install-btn {
                background: rgba(255,255,255,0.2);
                border: 1px solid rgba(255,255,255,0.3);
                color: white;
                padding: 6px 12px;
                border-radius: 16px;
                font-size: 14px;
                font-weight: 600;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(banner);
        
        setTimeout(() => banner.classList.add('show'), 100);
        
        // Handle install button click
        banner.querySelector('.install-btn').addEventListener('click', () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                    }
                    deferredPrompt = null;
                });
            }
            this.hideInstallBanner();
        });

        this.installBanner = banner;
    }

    hideInstallBanner() {
        if (this.installBanner) {
            this.installBanner.classList.remove('show');
            setTimeout(() => {
                this.installBanner.remove();
            }, 300);
        }
    }

    // Utility methods for future features
    showNotification(message, type = 'info') {
        // Implementation for in-app notifications
        console.log(`${type}: ${message}`);
    }

    updateBadge(tabName, count) {
        // Update tab badges with counts
        const tab = document.querySelector(`[data-tab="${tabName}"]`);
        if (tab && count > 0) {
            let badge = tab.querySelector('.tab-badge');
            if (!badge) {
                badge = document.createElement('div');
                badge.className = 'tab-badge';
                tab.appendChild(badge);
            }
            badge.textContent = count;
        }
    }
}

// Initialize app when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    window.drivingProApp = new DrivingProApp();
});

// Handle online/offline status
window.addEventListener('online', () => {
    document.body.classList.remove('offline');
    window.drivingProApp?.showNotification('Connection restored', 'success');
});

window.addEventListener('offline', () => {
    document.body.classList.add('offline');
    window.drivingProApp?.showNotification('Working offline', 'warning');
});

// Prevent zoom on double tap (iOS Safari)
let lastTouchEnd = 0;
document.addEventListener('touchend', (event) => {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Handle orientation changes
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 100);
}); 