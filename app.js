// PWA App JavaScript
class DrivingProApp {
    constructor() {
        this.currentTab = 'home';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupPWA();
        this.animateCards();
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
            navigator.serviceWorker.register('./sw.js')
                .then(registration => {
                    console.log('SW registered successfully');
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