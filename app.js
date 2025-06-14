// DrivingPro PWA Application
// Enhanced iOS-style interface with dynamic theming
//
// Weather Feature: Configured with HG Weather API
// API Documentation: https://console.hgbrasil.com/documentation/weather
// Current status: Using real weather data with automatic location detection
class DrivingProApp {
    constructor() {
        this.currentTab = 'home';
        this.timeData = {};
        this.timeBasedCards = new Map();
        this.locationData = {};
        this.locationWatchId = null;
        this.currentTheme = 'light';
        this.weatherData = {};
        this.weatherApiKey = 'e65d53c6'; // HG Weather API key
        this.homePage = null; // Will be initialized when needed
        this.tripsPage = null; // Will be initialized when needed
        this.earningsPage = null; // Will be initialized when needed
        this.settingsPage = null; // Will be initialized when needed
        
        // Swipe navigation properties
        this.swipeData = {
            startX: 0,
            startY: 0,
            endX: 0,
            endY: 0,
            startTime: 0,
            endTime: 0,
            isSwipeInProgress: false,
            minSwipeDistance: 50,
            maxSwipeTime: 300,
            swipeThreshold: 100
        };
        
        // Define page order for navigation
        this.pageOrder = ['home', 'practice', 'stats', 'profile'];
        
        // Performance optimization flag
        this.isSwipeNavigation = false;
        
        this.init();
    }

    async init() {
        this.initializeThemeSystem();
        await this.initializeTimeSystem();
        
        // Initialize location first, then weather
        await this.initializeLocationSystem();
        await this.initializeWeatherSystem();
        
        // Load home page content on startup since it's the default tab
        this.loadHomePage();
        
        this.setupEventListeners();
        this.setupPWA();
        this.animateCards();
        
        // Refresh auto theme after time data is loaded
        if (this.currentTheme === 'auto') {
            this.applyTheme('auto');
            this.updateThemeColor('auto');
        }
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
                this.updateAutoThemeBasedOnTime();
            });
        }, 60000); // 60 seconds

        // Initial update
        this.updateTimeBasedCards();
        this.updateAutoThemeBasedOnTime();
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
        console.log('Initializing location system...');
        this.setupLocationDisplay();
        
        try {
            await this.requestLocationPermission();
            await this.startLocationTracking();
            console.log('Location system initialized successfully');
        } catch (error) {
            console.log('Location permission denied or error:', error);
            // Continue without location - API will use IP-based location
        }
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

    async startLocationTracking() {
        if (!navigator.geolocation) {
            this.updateLocationDisplay('GPS não suportado');
            return;
        }

        return new Promise((resolve, reject) => {
            const options = {
                enableHighAccuracy: true,
                timeout: 8000,
                maximumAge: 60000 // 1 minute cache
            };

            // Get initial position
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.handleLocationSuccess(position);
                    this.startLocationWatch(options);
                    resolve(position);
                },
                (error) => {
                    this.handleLocationError(error);
                    // Don't reject - weather system can work without location
                    resolve(null);
                },
                options
            );

            // Fallback timeout - proceed after 3 seconds if no location
            setTimeout(() => {
                console.log('Location timeout - proceeding without location');
                resolve(null);
            }, 3000);
        });
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

    // ===== WEATHER SYSTEM =====
    async initializeWeatherSystem() {
        console.log('Initializing weather system...');
        this.setupWeatherDisplay();
        
        // Try to load real weather data with API key
        try {
            await this.loadWeatherData();
            console.log('Real weather data loaded successfully');
        } catch (error) {
            console.error('Weather system initialization failed, using demo data:', error);
            this.loadDemoWeatherData();
        }
        
        this.startWeatherUpdates();
    }

    setupWeatherDisplay() {
        // Weather display will be handled by HTML structure
        console.log('Weather display setup complete');
    }

    async loadWeatherData() {
        try {
            // Try to get user's location first
            let url = '';
            
            if (this.locationData && this.locationData.latitude && this.locationData.longitude) {
                // Use geolocation data
                console.log('Using geolocation for weather data...');
                if (this.weatherApiKey) {
                    const fields = 'only_results,temp,city_name,forecast,max,min,date,weekday,condition_slug,description';
                    url = `https://api.hgbrasil.com/weather?format=json-cors&key=${this.weatherApiKey}&fields=${fields}&lat=${this.locationData.latitude}&lon=${this.locationData.longitude}`;
                } else {
                    url = `https://api.hgbrasil.com/weather?format=json-cors&lat=${this.locationData.latitude}&lon=${this.locationData.longitude}`;
                }
            } else {
                // Fallback to IP-based location
                console.log('Using IP-based location for weather data...');
                if (this.weatherApiKey) {
                    const fields = 'only_results,temp,city_name,forecast,max,min,date,weekday,condition_slug,description';
                    url = `https://api.hgbrasil.com/weather?format=json-cors&key=${this.weatherApiKey}&fields=${fields}&user_ip=remote`;
                } else {
                    url = `https://api.hgbrasil.com/weather?format=json-cors&user_ip=remote`;
                }
            }
            
            console.log('Fetching weather data from:', url);
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Weather data received:', data);
            
            // According to HG Weather API documentation, data is inside 'results' object
            const results = data.results || data;
            
            if (!results) {
                throw new Error('No weather data in API response');
            }
            
            // Process current weather and forecast for 7 days total (today + 6 future days)
            this.weatherData = {
                current: {
                    temp: results.temp,
                    max: results.max, // Today's max temperature
                    min: results.min, // Today's min temperature
                    city: results.city_name || results.city,
                    condition: results.condition_slug,
                    description: results.description,
                    date: new Date().toLocaleDateString('pt-BR', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'short' 
                    })
                },
                // Include today + next 6 days for a total of 7 days
                forecast: results.forecast ? results.forecast.slice(0, 6) : [], // Next 6 days after today
                lastUpdate: new Date()
            };
            
            console.log('Processed weather data:', this.weatherData);
            this.updateWeatherDisplay();
            
        } catch (error) {
            console.error('Weather data fetch failed:', error);
            console.log('Showing demo weather data...');
            this.loadDemoWeatherData();
        }
    }

    updateWeatherDisplay() {
        console.log('Updating weather display...');
        this.clearLoadingStates();
        this.updateCurrentWeatherIcon();
        this.updateForecastIcons();
        this.autoAdjustWeatherGap();
    }

    clearLoadingStates() {
        // Remove any loading elements
        const loadingElements = document.querySelectorAll('.weather-loading');
        loadingElements.forEach(el => el.remove());
        console.log('Cleared loading states');
    }

    updateCurrentWeatherIcon() {
        const currentWeatherEl = document.getElementById('currentWeatherIcon');
        if (!currentWeatherEl || !this.weatherData.current) {
            console.log('No current weather element or current data found');
            return;
        }
        
        console.log('Updating current weather icon with data:', this.weatherData.current);
        
        const { condition, description, temp, max, min } = this.weatherData.current;
        const iconUrl = this.getWeatherIconUrl(condition);
        const fallbackIconUrl = 'https://assets.hgbrasil.com/weather/icons/conditions/clear_day.svg';
        
        // Always show both max and min, fallback to temp if missing
        const maxToShow = (max !== undefined && max !== null) ? max : temp;
        const minToShow = (min !== undefined && min !== null) ? min : temp;
        
        currentWeatherEl.innerHTML = `
            <img src="${iconUrl}" alt="${description}" class="weather-icon" onerror="this.src='${fallbackIconUrl}'" />
            <div class="weather-temps">
                <div class="weather-temp max-temp">${maxToShow}°</div>
                <div class="weather-temp min-temp">${minToShow}°</div>
            </div>
        `;
        
        console.log('Current weather icon updated successfully');
    }

    updateForecastIcons() {
        const forecastEl = document.getElementById('forecastIcons');
        if (!forecastEl || !this.weatherData.forecast) {
            console.log('No forecast element or forecast data found');
            return;
        }
        
        console.log('Updating forecast icons with data:', this.weatherData.forecast);
        
        const fallbackIconUrl = 'https://assets.hgbrasil.com/weather/icons/conditions/clear_day.svg';
        
        const forecastHtml = this.weatherData.forecast.map((day, index) => {
            // Get icon URL from HG Brasil API
            const iconUrl = this.getWeatherIconUrl(day.condition || day.condition_slug || 'clear_day');
            
            // Get both max and min temperatures
            const maxTemp = day.max || day.temp || Math.floor(Math.random() * 10) + 20;
            const minTemp = day.min || Math.floor(Math.random() * 8) + 10;
            
            return `
                <div class="weather-day forecast-day" title="${day.description || 'Previsão'} - ${maxTemp}°/${minTemp}°">
                    <img src="${iconUrl}" alt="${day.description || 'Previsão'}" class="weather-icon" onerror="this.src='${fallbackIconUrl}'" />
                    <div class="weather-temps">
                        <div class="weather-temp max-temp">${maxTemp}°</div>
                        <div class="weather-temp min-temp">${minTemp}°</div>
                    </div>
                </div>
            `;
        }).join('');
        
        forecastEl.innerHTML = forecastHtml;
        console.log('Forecast icons updated successfully');
    }

    getWeatherIconUrl(condition) {
        // Map API condition codes to HG Brasil icon URLs
        const baseUrl = 'https://assets.hgbrasil.com/weather/icons/conditions/';
        
        const conditionMap = {
            // Clear conditions
            'clear_day': 'clear_day',
            'clear_night': 'clear_night',
            'clear': 'clear_day',
            'sunny': 'clear_day',
            
            // Cloudy conditions
            'cloud': 'cloud',
            'clouds': 'cloud',
            'cloudly_day': 'cloudly_day',
            'cloudly_night': 'cloudly_night',
            'partly_cloudy': 'cloudly_day',
            'cloudy': 'cloud',
            
            // Rain conditions
            'rain': 'rain',
            'raining': 'rain',
            'drizzle': 'drizzle',
            'light_rain': 'drizzle',
            'heavy_rain': 'rain',
            
            // Storm conditions
            'storm': 'storm',
            'thunderstorm': 'storm',
            'lightning': 'storm',
            
            // Other conditions
            'snow': 'snow',
            'snowing': 'snow',
            'fog': 'fog',
            'foggy': 'fog',
            'mist': 'mist',
            'misty': 'mist',
            'hail': 'hail',
            'wind': 'wind',
            'windy': 'wind',
            
            // None conditions
            'none_day': 'none_day',
            'none_night': 'none_night',
            'none': 'none_day'
        };
        
        // Check if condition exists in our mapping
        const mappedCondition = conditionMap[condition.toLowerCase()];
        if (mappedCondition) {
            console.log(`Mapped condition '${condition}' to '${mappedCondition}'`);
            return `${baseUrl}${mappedCondition}.svg`;
        }
        
        // If not found, try to intelligently guess based on keywords
        const lowerCondition = condition.toLowerCase();
        let fallbackCondition = 'clear_day';
        
        if (lowerCondition.includes('rain') || lowerCondition.includes('chuva')) {
            fallbackCondition = lowerCondition.includes('light') || lowerCondition.includes('leve') ? 'drizzle' : 'rain';
        } else if (lowerCondition.includes('storm') || lowerCondition.includes('tempestade')) {
            fallbackCondition = 'storm';
        } else if (lowerCondition.includes('cloud') || lowerCondition.includes('nuvem')) {
            fallbackCondition = 'cloud';
        } else if (lowerCondition.includes('clear') || lowerCondition.includes('limpo') || lowerCondition.includes('sol')) {
            fallbackCondition = 'clear_day';
        } else if (lowerCondition.includes('snow') || lowerCondition.includes('neve')) {
            fallbackCondition = 'snow';
        } else if (lowerCondition.includes('fog') || lowerCondition.includes('neblina')) {
            fallbackCondition = 'fog';
        }
        
        console.warn(`Unknown weather condition '${condition}', falling back to ${fallbackCondition}`);
        return `${baseUrl}${fallbackCondition}.svg`;
    }

    getDayInitial(weekday) {
        const dayMap = {
            'Domingo': 'D',
            'Segunda': 'S', 
            'Terça': 'T',
            'Quarta': 'Q',
            'Quinta': 'Q',
            'Sexta': 'S',
            'Sábado': 'S',
            'Dom': 'D',
            'Seg': 'S',
            'Ter': 'T', 
            'Qua': 'Q',
            'Qui': 'Q',
            'Sex': 'S',
            'Sáb': 'S'
        };
        
        return dayMap[weekday] || weekday.charAt(0).toUpperCase();
    }

    handleWeatherError() {
        console.log('Handling weather error, loading demo data...');
        this.loadDemoWeatherData();
    }

    startWeatherUpdates() {
        // Update weather every 8 hours
        setInterval(async () => {
            try {
                await this.loadWeatherData();
                console.log('Weather data refreshed automatically');
            } catch (error) {
                console.error('Automatic weather refresh failed:', error);
            }
        }, 8 * 60 * 60 * 1000); // 8 hours
        
        console.log('Weather update interval started (8 hour intervals)');
    }

    // Public method to manually refresh weather
    async refreshWeather() {
        console.log('Manual weather refresh requested');
        return await this.loadWeatherData();
    }

    // Load demo weather data for testing/demo purposes
    loadDemoWeatherData() {
        console.log('Loading demo weather data...');
        
        // Create realistic demo data
        const demoConditions = ['clear_day', 'cloud', 'rain', 'cloudly_day', 'cloudly_night', 'storm'];
        const demoTemp = Math.floor(Math.random() * 15) + 15; // 15-30°C
        
        this.weatherData = {
            current: {
                temp: demoTemp,
                max: demoTemp + Math.floor(Math.random() * 5) + 2, // Max temp higher than current
                min: demoTemp - Math.floor(Math.random() * 5) - 2, // Min temp lower than current
                city: 'São Paulo',
                condition: 'clear_day',
                description: 'Ensolarado',
                date: new Date().toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'short' 
                })
            },
            forecast: Array.from({length: 6}, (_, i) => {
                const futureDate = new Date();
                futureDate.setDate(futureDate.getDate() + i + 1);
                
                return {
                    condition: demoConditions[Math.floor(Math.random() * demoConditions.length)],
                    description: 'Previsão',
                    date: futureDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                    weekday: futureDate.toLocaleDateString('pt-BR', { weekday: 'short' }),
                    max: Math.floor(Math.random() * 10) + 20,
                    min: Math.floor(Math.random() * 10) + 10
                };
            }),
            lastUpdate: new Date(),
            isDemo: true
        };
        
        console.log('Demo weather data loaded:', this.weatherData);
        this.updateWeatherDisplay();
    }

    // Public method to get current weather data
    getWeatherData() {
        return this.weatherData;
    }

    // ===== THEME SYSTEM =====
    initializeThemeSystem() {
        this.loadSavedTheme();
        this.setupThemeListeners();
        this.updateThemeButtons();
    }

    loadSavedTheme() {
        // Get saved theme from localStorage or default to 'dark'
        const savedTheme = localStorage.getItem('drivingpro-theme') || 'dark';
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

        // Listen for system theme changes when in auto mode (as fallback)
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', () => {
                // Only use system preference if time data isn't available
                if (this.currentTheme === 'auto' && (!this.timeData || this.timeData.hour === undefined)) {
                    this.applyTheme('auto');
                    this.updateThemeColor('auto');
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
        
        // Update theme color meta tag to match background
        this.updateThemeColor(theme);
        
        switch (theme) {
            case 'light':
                // Light theme is default, no attribute needed
                break;
            case 'dark':
                documentElement.setAttribute('data-theme', 'dark');
                break;
            case 'auto':
                // Use app's time-of-day detection for auto theme
                const shouldUseDarkTheme = this.shouldUseDarkThemeBasedOnTime();
                if (shouldUseDarkTheme) {
                    documentElement.setAttribute('data-theme', 'dark');
                }
                console.log(`Auto theme: ${shouldUseDarkTheme ? 'dark' : 'light'} (time: ${this.timeData?.timeOfDay || 'unknown'})`);
                break;
        }
    }

    updateThemeColor(theme) {
        const themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (!themeColorMeta) return;
        
        let backgroundColor;
        
        if (theme === 'dark') {
            backgroundColor = '#121212'; // Dark mode background
        } else if (theme === 'light') {
            backgroundColor = '#ffffff'; // Light mode background
        } else if (theme === 'auto') {
            // Use app's time-of-day detection instead of system preference
            const shouldUseDarkTheme = this.shouldUseDarkThemeBasedOnTime();
            backgroundColor = shouldUseDarkTheme ? '#121212' : '#ffffff';
        }
        
        themeColorMeta.setAttribute('content', backgroundColor);
        console.log(`Theme color updated to: ${backgroundColor}`);
    }

    shouldUseDarkThemeBasedOnTime() {
        // If time data isn't available yet, fall back to system preference
        if (!this.timeData || this.timeData.hour === undefined) {
            return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        
        // Use app's time-of-day logic
        // Dark theme during evening (17:00-21:00) and night (21:00-6:00)
        // Light theme during morning (6:00-12:00) and afternoon (12:00-17:00)
        const hour = this.timeData.hour;
        const timeOfDay = this.timeData.timeOfDay;
        
        // Dark theme for evening and night
        if (timeOfDay === 'evening' || timeOfDay === 'night') {
            return true;
        }
        
        // Light theme for morning and afternoon
        if (timeOfDay === 'morning' || timeOfDay === 'afternoon') {
            return false;
        }
        
        // Fallback based on hour if timeOfDay is not available
        // Dark theme: 17:00 (5 PM) to 6:59 AM
        return hour >= 17 || hour < 7;
    }

    updateAutoThemeBasedOnTime() {
        // Only update if currently in auto mode
        if (this.currentTheme === 'auto') {
            this.applyTheme('auto');
            this.updateThemeColor('auto');
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
            return this.shouldUseDarkThemeBasedOnTime();
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
        // Card interactions
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                this.handleCardClick(card, e);
            });
        });

        // Update App Card - Special handler
        const updateCard = document.getElementById('updateAppCard');
        if (updateCard) {
            updateCard.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent default card click
                this.handleAppUpdate();
            });
        }

        // Header button
        const headerBtn = document.querySelector('.header-btn');
        if (headerBtn) {
            headerBtn.addEventListener('click', (e) => {
                this.handleHeaderAction(e);
            });
        }

        // Add touch feedback
        this.addTouchFeedback();
        
        // Setup swipe navigation
        this.setupSwipeNavigation();

        // Adjust weather spacing on viewport changes
        window.addEventListener('resize', () => this.autoAdjustWeatherGap());
    }

    switchTab(tabName) {
        if (this.currentTab === tabName) return;

        // Handle special cases for modular content loading
        if (tabName === 'home') {
            this.loadHomePage();
        } else if (tabName === 'practice') {
            this.loadTripsPage();
        } else if (tabName === 'stats') {
            this.loadEarningsPage();
        } else if (tabName === 'profile') {
            this.loadSettingsPage();
        }

        // Update content
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        this.currentTab = tabName;
        
        // Only animate if NOT a swipe navigation (for performance)
        if (!this.isSwipeNavigation) {
            this.animateCards();
        } else {
            // Fast fade-in for swipe navigation
            this.quickFadeInCards();
        }
        
        // Add haptic feedback (if supported)
        this.hapticFeedback('light');
        
        // Reset swipe flag
        this.isSwipeNavigation = false;
    }

    loadHomePage() {
        const homeSection = document.getElementById('home');
        if (homeSection && window.HomePage) {
            // Initialize home page if not already done
            if (!this.homePage) {
                this.homePage = new window.HomePage();
            }
            
            // Clear existing content and load new modular content
            homeSection.innerHTML = this.homePage.render();
            
            // Initialize home page functionality
            const delay = this.isSwipeNavigation ? 0 : 100; // No delay for swipe
            setTimeout(() => {
                this.homePage.initialize();
            }, delay);
        }
    }

    loadTripsPage() {
        const tripsSection = document.getElementById('practice');
        if (tripsSection && window.TripsPage) {
            // Initialize trips page if not already done
            if (!this.tripsPage) {
                this.tripsPage = new window.TripsPage();
            }
            
            // Clear existing content and load new modular content
            tripsSection.innerHTML = this.tripsPage.render();
            
            // Initialize trips page functionality
            const delay = this.isSwipeNavigation ? 0 : 100; // No delay for swipe
            setTimeout(() => {
                this.tripsPage.initialize();
            }, delay);
        }
    }

    loadEarningsPage() {
        const earningsSection = document.getElementById('stats');
        if (earningsSection && window.EarningsPage) {
            // Initialize earnings page if not already done
            if (!this.earningsPage) {
                this.earningsPage = new window.EarningsPage();
            }
            
            // Clear existing content and load new modular content
            earningsSection.innerHTML = this.earningsPage.render();
            
            // Initialize earnings page functionality
            const delay = this.isSwipeNavigation ? 0 : 100; // No delay for swipe
            setTimeout(() => {
                this.earningsPage.initialize();
            }, delay);
        }
    }

    loadSettingsPage() {
        const settingsSection = document.getElementById('profile');
        if (settingsSection && window.SettingsPage) {
            // Initialize settings page if not already done
            if (!this.settingsPage) {
                this.settingsPage = new window.SettingsPage();
            }
            
            // Clear existing content and load new modular content
            settingsSection.innerHTML = this.settingsPage.render();
            
            // Initialize settings page functionality
            const delay = this.isSwipeNavigation ? 0 : 100; // No delay for swipe
            setTimeout(() => {
                this.settingsPage.initialize();
            }, delay);
        }
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

    quickFadeInCards() {
        // Fast animation for swipe navigation - no staggered delays
        const cards = document.querySelectorAll('.content-section.active .card');
        cards.forEach((card) => {
            card.style.transition = 'opacity 0.2s ease';
            card.style.opacity = '0';
            
            // Use requestAnimationFrame for smoother performance
            requestAnimationFrame(() => {
                card.style.opacity = '1';
            });
        });
        
        // Clean up transition after animation
        setTimeout(() => {
            cards.forEach(card => {
                card.style.transition = '';
            });
        }, 200);
    }

    addTouchFeedback() {
        const interactiveElements = document.querySelectorAll('.card, .header-btn');
        
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

    // ===== APP UPDATE SYSTEM =====
    async handleAppUpdate() {
        const updateCard = document.getElementById('updateAppCard');
        const updateBadge = document.querySelector('.update-badge');
        const cardTitle = updateCard.querySelector('.card-title');
        const cardDescription = updateCard.querySelector('.card-description');
        const cardIcon = updateCard.querySelector('.card-icon svg');
        
        try {
            // Update UI to show loading state
            this.setUpdateCardState('loading', cardTitle, cardDescription, updateBadge, cardIcon);
            
            // Step 1: Clear all caches
            await this.clearAllCaches();
            
            // Step 2: Unregister and re-register service worker
            await this.refreshServiceWorker();
            
            // Step 3: Show success state
            this.setUpdateCardState('success', cardTitle, cardDescription, updateBadge, cardIcon);
            
            // Step 4: Force refresh after delay
            setTimeout(() => {
                window.location.reload(true);
            }, 2000);
            
        } catch (error) {
            console.error('App update failed:', error);
            this.setUpdateCardState('error', cardTitle, cardDescription, updateBadge, cardIcon);
            
            // Reset to normal state after delay
            setTimeout(() => {
                this.setUpdateCardState('normal', cardTitle, cardDescription, updateBadge, cardIcon);
            }, 3000);
        }
    }

    async clearAllCaches() {
        console.log('Clearing all caches...');
        
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            console.log('Found caches:', cacheNames);
            
            await Promise.all(
                cacheNames.map(cacheName => {
                    console.log('Deleting cache:', cacheName);
                    return caches.delete(cacheName);
                })
            );
            
            console.log('All caches cleared');
        }
        
        // Also clear localStorage if needed
        try {
            // Preserve theme setting
            const savedTheme = localStorage.getItem('drivingpro-theme');
            localStorage.clear();
            if (savedTheme) {
                localStorage.setItem('drivingpro-theme', savedTheme);
            }
        } catch (error) {
            console.warn('Could not clear localStorage:', error);
        }
    }

    async refreshServiceWorker() {
        console.log('Refreshing service worker...');
        
        if ('serviceWorker' in navigator) {
            try {
                // Get current registration
                const registration = await navigator.serviceWorker.getRegistration();
                
                if (registration) {
                    // Unregister current service worker
                    await registration.unregister();
                    console.log('Service worker unregistered');
                }
                
                // Wait a bit for cleanup
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Re-register service worker
                const newRegistration = await navigator.serviceWorker.register('./sw.js?v=' + Date.now(), {
                    scope: './'
                });
                
                console.log('Service worker re-registered:', newRegistration);
                
                // Wait for the new service worker to install and activate
                if (newRegistration.installing) {
                    await new Promise(resolve => {
                        newRegistration.installing.addEventListener('statechange', (e) => {
                            if (e.target.state === 'activated') {
                                resolve();
                            }
                        });
                    });
                }
                
            } catch (error) {
                console.error('Service worker refresh failed:', error);
                throw error;
            }
        }
    }

    setUpdateCardState(state, titleEl, descEl, badgeEl, iconEl) {
        const states = {
            normal: {
                title: 'Update App',
                description: 'Clear cache and refresh to get the latest features and fixes',
                badge: 'v1.6.3',
                badgeClass: 'update-badge',
                iconRotation: '0deg',
                cardClass: 'update-card'
            },
            loading: {
                title: 'Updating...',
                description: 'Clearing cache and downloading latest version',
                badge: 'Updating',
                badgeClass: 'update-badge loading',
                iconRotation: '360deg',
                cardClass: 'update-card loading'
            },
            success: {
                title: 'Update Complete!',
                description: 'App will reload in a moment with the latest version',
                badge: 'Success',
                badgeClass: 'update-badge success',
                iconRotation: '0deg',
                cardClass: 'update-card success'
            },
            error: {
                title: 'Update Failed',
                description: 'Something went wrong. Please try again or refresh manually',
                badge: 'Error',
                badgeClass: 'update-badge error',
                iconRotation: '0deg',
                cardClass: 'update-card error'
            }
        };
        
        const config = states[state];
        if (config) {
            titleEl.textContent = config.title;
            descEl.textContent = config.description;
            badgeEl.textContent = config.badge;
            badgeEl.className = config.badgeClass;
            iconEl.style.transform = `rotate(${config.iconRotation})`;
            iconEl.style.transition = state === 'loading' ? 'transform 1s linear infinite' : 'transform 0.3s ease';
            
            // Update card class
            const updateCard = document.getElementById('updateAppCard');
            updateCard.className = config.cardClass;
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

    setupSwipeNavigation() {
        const mainContent = document.querySelector('.main-content');
        if (!mainContent) return;

        // Touch start event
        mainContent.addEventListener('touchstart', (e) => {
            this.handleTouchStart(e);
        }, { passive: false });

        // Touch move event
        mainContent.addEventListener('touchmove', (e) => {
            this.handleTouchMove(e);
        }, { passive: false });

        // Touch end event
        mainContent.addEventListener('touchend', (e) => {
            this.handleTouchEnd(e);
        }, { passive: false });

        console.log('✅ Swipe navigation enabled');
    }

    handleTouchStart(e) {
        // Only handle single touches
        if (e.touches.length !== 1) return;

        const touch = e.touches[0];
        this.swipeData.startX = touch.clientX;
        this.swipeData.startY = touch.clientY;
        this.swipeData.startTime = Date.now();
        this.swipeData.isSwipeInProgress = true;

        // Visual feedback - slight dim
        const activeSection = document.querySelector('.content-section.active');
        if (activeSection) {
            activeSection.style.transition = 'opacity 0.1s ease';
            activeSection.style.opacity = '0.95';
        }
    }

    handleTouchMove(e) {
        if (!this.swipeData.isSwipeInProgress || e.touches.length !== 1) return;

        const touch = e.touches[0];
        this.swipeData.endX = touch.clientX;
        this.swipeData.endY = touch.clientY;

        const deltaX = this.swipeData.endX - this.swipeData.startX;
        const deltaY = this.swipeData.endY - this.swipeData.startY;

        // Check if this is a horizontal swipe (not vertical scroll)
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 20) {
            // Prevent vertical scrolling during horizontal swipe
            e.preventDefault();

            // Visual feedback during swipe
            const activeSection = document.querySelector('.content-section.active');
            if (activeSection && Math.abs(deltaX) > 30) {
                const opacity = Math.max(0.7, 1 - Math.abs(deltaX) / 200);
                activeSection.style.opacity = opacity.toString();
            }
        }
    }

    handleTouchEnd(e) {
        if (!this.swipeData.isSwipeInProgress) return;

        this.swipeData.endTime = Date.now();
        this.swipeData.isSwipeInProgress = false;

        // Reset visual feedback
        const activeSection = document.querySelector('.content-section.active');
        if (activeSection) {
            activeSection.style.transition = '';
            activeSection.style.opacity = '';
        }

        this.analyzeSwipeGesture();
    }

    analyzeSwipeGesture() {
        const deltaX = this.swipeData.endX - this.swipeData.startX;
        const deltaY = this.swipeData.endY - this.swipeData.startY;
        const deltaTime = this.swipeData.endTime - this.swipeData.startTime;

        // Check if this qualifies as a valid swipe
        const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
        const isValidDistance = Math.abs(deltaX) >= this.swipeData.minSwipeDistance;
        const isValidSpeed = deltaTime <= this.swipeData.maxSwipeTime;
        const isSignificantSwipe = Math.abs(deltaX) >= this.swipeData.swipeThreshold;

        if (isHorizontalSwipe && isValidDistance && (isValidSpeed || isSignificantSwipe)) {
            const direction = deltaX > 0 ? 'right' : 'left';
            this.handleSwipeNavigation(direction);
        }
    }

    handleSwipeNavigation(direction) {
        const currentIndex = this.pageOrder.indexOf(this.currentTab);
        let targetIndex = currentIndex;

        if (direction === 'right' && currentIndex > 0) {
            // Swipe right = go to previous page
            targetIndex = currentIndex - 1;
        } else if (direction === 'left' && currentIndex < this.pageOrder.length - 1) {
            // Swipe left = go to next page
            targetIndex = currentIndex + 1;
        }

        if (targetIndex !== currentIndex) {
            const targetTab = this.pageOrder[targetIndex];
            
            // Set performance flag for faster navigation
            this.isSwipeNavigation = true;
            
            // Add haptic feedback for successful swipe
            this.hapticFeedback('medium');
            
            // Minimal swipe animation for instant response
            this.animateSwipeTransition(direction);
            
            // Navigate to target page immediately (reduced delay)
            setTimeout(() => {
                this.switchTab(targetTab);
                
                // Update drawer menu active state if drawer is visible
                if (window.sideMenuInstance) {
                    window.sideMenuInstance.updateActiveMenuItem(targetTab);
                }
            }, 50); // Reduced from 150ms to 50ms

            console.log(`🔄 Swipe ${direction}: ${this.currentTab} → ${targetTab}`);
        } else {
            // Edge of navigation - bounce feedback
            this.animateBounceEdge(direction);
            this.hapticFeedback('light');
        }
    }

    animateSwipeTransition(direction) {
        const activeSection = document.querySelector('.content-section.active');
        if (!activeSection) return;

        const translateX = direction === 'left' ? '-5px' : '5px'; // Reduced movement
        
        activeSection.style.transition = 'transform 0.1s ease-out'; // Faster transition
        activeSection.style.transform = `translateX(${translateX})`;
        
        setTimeout(() => {
            activeSection.style.transform = '';
            setTimeout(() => {
                activeSection.style.transition = '';
            }, 100); // Faster cleanup
        }, 100); // Faster reset
    }

    animateBounceEdge(direction) {
        const activeSection = document.querySelector('.content-section.active');
        if (!activeSection) return;

        const translateX = direction === 'left' ? '-3px' : '3px'; // Reduced movement
        
        activeSection.style.transition = 'transform 0.08s ease-out'; // Even faster
        activeSection.style.transform = `translateX(${translateX})`;
        
        setTimeout(() => {
            activeSection.style.transform = '';
            setTimeout(() => {
                activeSection.style.transition = '';
            }, 80); // Faster cleanup
        }, 80); // Faster reset
    }

    // Get current page info for debugging/display
    getCurrentPageInfo() {
        const currentIndex = this.pageOrder.indexOf(this.currentTab);
        const pageTitles = {
            'home': 'Home',
            'practice': 'Trips', 
            'stats': 'Earnings',
            'profile': 'Settings'
        };
        
        return {
            currentPage: this.currentTab,
            currentTitle: pageTitles[this.currentTab],
            currentIndex: currentIndex,
            totalPages: this.pageOrder.length,
            canSwipeLeft: currentIndex < this.pageOrder.length - 1,
            canSwipeRight: currentIndex > 0
        };
    }

    /**
     * Dynamically scales the gap between weather items so they all stay visible
     * inside the header area without overlapping the minimum hamburger gap.
     * Formula: gap = max(1px, floor((headerWidth - minGap - totalIconWidth) / (n-1)))
     * If the available space is still too small the variable is set to 1px and
     * horizontal scrolling will do the rest.
     */
    autoAdjustWeatherGap() {
        const headerEl = document.querySelector('.header');
        const timeline = document.getElementById('weatherTimeline');
        if (!headerEl || !timeline) return;

        const items = timeline.querySelectorAll('.weather-day');
        if (items.length < 2) return; // nothing to space

        const root = document.documentElement;
        const styles = getComputedStyle(root);

        const minGap = parseFloat(styles.getPropertyValue('--header-min-gap')) || 0;
        const headerWidth = headerEl.clientWidth;

        // Assume all items have the same width (includes icon + padding)
        const itemWidth = items[0].getBoundingClientRect().width;
        const totalItemsWidth = itemWidth * items.length;

        let gap = Math.floor((headerWidth - minGap - totalItemsWidth) / (items.length - 1));

        if (gap < 1) gap = 1; // keep at least 1px so flex-gap stays valid

        root.style.setProperty('--weather-gap', `${gap}px`);
    }
}

// Initialize app when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    window.drivingProApp = new DrivingProApp();
    
    // Initialize side menu
    if (window.SideMenu) {
        window.sideMenu = new SideMenu();
    }
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