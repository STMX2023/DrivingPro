class SideMenu {
    constructor() {
        this.isOpen = false;
        this.drawer = null;
        this.overlay = null;
        this.hamburgerBtn = null;
        this.init();
    }

    init() {
        this.createMenuStructure();
        this.setupEventListeners();
        console.log('Side menu initialized');
    }

    createMenuStructure() {
        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'menu-overlay';
        
        // Create drawer
        this.drawer = document.createElement('div');
        this.drawer.className = 'side-drawer';
        
        // Create menu header
        const menuHeader = document.createElement('div');
        menuHeader.className = 'menu-header';
        menuHeader.innerHTML = `
            <h2 class="menu-title">Menu</h2>
            <button class="menu-close-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        `;

        // Create menu items
        const menuItems = document.createElement('div');
        menuItems.className = 'menu-items';
        
        const items = [
            {
                icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9,22 9,12 15,12 15,22"/>
                      </svg>`,
                title: 'Home',
                description: 'Dashboard and overview',
                tabId: 'home'
            },
            {
                icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10V6c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v4l-2.5 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2"/>
                        <circle cx="7" cy="17" r="2"/>
                        <circle cx="17" cy="17" r="2"/>
                      </svg>`,
                title: 'Trips',
                description: 'Trip history and analytics',
                tabId: 'practice'
            },
            {
                icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="1" x2="12" y2="23"/>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                      </svg>`,
                title: 'Earnings',
                description: 'Income and statistics',
                tabId: 'stats'
            },
            {
                icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m15.5-6.5l-4.24 4.24M7.76 7.76L3.52 3.52m12.96 12.96l4.24 4.24M7.76 16.24l-4.24 4.24"/>
                      </svg>`,
                title: 'Settings',
                description: 'Profile and preferences',
                tabId: 'profile'
            }
        ];

        items.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            menuItem.setAttribute('data-tab', item.tabId);
            menuItem.innerHTML = `
                <div class="menu-item-icon">
                    ${item.icon}
                </div>
                <div class="menu-item-content">
                    <h3 class="menu-item-title">${item.title}</h3>
                    <p class="menu-item-description">${item.description}</p>
                </div>
                <div class="menu-item-arrow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9,18 15,12 9,6"/>
                    </svg>
                </div>
            `;
            menuItems.appendChild(menuItem);
        });

        // Assemble drawer
        this.drawer.appendChild(menuHeader);
        this.drawer.appendChild(menuItems);

        // Add to DOM
        document.body.appendChild(this.overlay);
        document.body.appendChild(this.drawer);
    }

    setupEventListeners() {
        // Get hamburger button
        this.hamburgerBtn = document.querySelector('.hamburger-menu');
        
        if (this.hamburgerBtn) {
            this.hamburgerBtn.addEventListener('click', () => this.toggleMenu());
        }

        // Close button
        const closeBtn = this.drawer.querySelector('.menu-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeMenu());
        }

        // Overlay click to close
        this.overlay.addEventListener('click', () => this.closeMenu());

        // Menu item clicks
        const menuItems = this.drawer.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => this.handleMenuItemClick(e));
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.isOpen = true;
        this.overlay.classList.add('active');
        this.drawer.classList.add('active');
        document.body.classList.add('menu-open');
        
        // Update active menu item to match current tab
        const currentTab = this.getCurrentActiveTab();
        this.updateActiveMenuItem(currentTab);
        
        // Add haptic feedback if available
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        console.log('Menu opened');
    }

    closeMenu() {
        this.isOpen = false;
        this.overlay.classList.remove('active');
        this.drawer.classList.remove('active');
        document.body.classList.remove('menu-open');
        
        console.log('Menu closed');
    }

    handleMenuItemClick(event) {
        const menuItem = event.currentTarget;
        const title = menuItem.querySelector('.menu-item-title').textContent;
        const tabId = menuItem.getAttribute('data-tab');
        
        // Add immediate click animation for instant feedback
        menuItem.style.transform = 'scale(0.95)';
        setTimeout(() => {
            menuItem.style.transform = '';
        }, 100);

        // Add haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(30);
        }

        console.log(`Menu item clicked: ${title} (${tabId})`);
        
        // Close menu immediately for instant response
        this.closeMenu();
        
        // Switch to the selected tab using the main app's method
        if (window.drivingProApp && tabId) {
            window.drivingProApp.switchTab(tabId);
        }
    }

    // Public method to programmatically control menu
    setMenuState(isOpen) {
        if (isOpen) {
            this.openMenu();
        } else {
            this.closeMenu();
        }
    }

    // Get current menu state
    getMenuState() {
        return this.isOpen;
    }

    // Update active menu item based on current tab
    updateActiveMenuItem(activeTabId) {
        const menuItems = this.drawer.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            const tabId = item.getAttribute('data-tab');
            if (tabId === activeTabId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Get current active tab from the main app
    getCurrentActiveTab() {
        if (window.drivingProApp) {
            return window.drivingProApp.currentTab || 'home';
        }
        return 'home';
    }
}

// Export for use in main app
window.SideMenu = SideMenu; 