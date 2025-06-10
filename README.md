# DrivingPro PWA

A sleek, iOS-style Progressive Web App for driving test preparation and practice.

## Features

- 🎨 **Sleek iOS Design**: Beautiful, native iOS-style interface
- 📱 **PWA Ready**: Installable on mobile devices and works offline
- 🗂️ **Card-Based UI**: Clean, organized card layout for easy navigation
- 🎯 **4 Main Sections**: Home, Practice, Stats, and Profile
- 🔄 **Smooth Animations**: Fluid transitions and interactions
- 🌓 **Dark Mode Support**: Automatic dark/light mode detection
- 📶 **Offline Support**: Works without internet connection
- 🔔 **Push Notifications**: Ready for future notification features

## Getting Started

1. Clone or download this repository
2. Serve the files using a local server (required for PWA features)

### Using Python (recommended)
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

### Using Node.js
```bash
# Install serve globally
npm install -g serve

# Serve the current directory
serve -p 8000
```

### Using PHP
```bash
php -S localhost:8000
```

3. Open your browser and navigate to `http://localhost:8000`
4. On mobile devices, you can install the app by tapping "Add to Home Screen"

## Browser Support

- ✅ **Chrome/Chromium** (Android & Desktop)
- ✅ **Safari** (iOS & macOS)
- ✅ **Firefox** (Android & Desktop)
- ✅ **Edge** (Windows & macOS)

## PWA Features

- **Installable**: Can be installed on mobile home screen
- **Offline Ready**: Cached content works without internet
- **App-like Experience**: Full-screen, native-like interface
- **Fast Loading**: Service worker caching for quick load times

## File Structure

```
DrivingPro/
├── index.html          # Main HTML file
├── styles.css          # iOS-style CSS
├── app.js             # JavaScript functionality
├── manifest.json      # PWA manifest
├── sw.js             # Service worker
├── icons/            # App icons (to be added)
├── screenshots/      # App screenshots (to be added)
└── README.md         # This file
```

## Development

To customize the app:

1. **Colors**: Modify CSS custom properties in `styles.css`
2. **Content**: Update cards and sections in `index.html`
3. **Functionality**: Add features in `app.js`
4. **PWA Settings**: Configure `manifest.json`

## Adding Icons

Place your app icons in the `icons/` directory with these sizes:
- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512 pixels
- Apple touch icon: 180x180 pixels

## Future Features

- User authentication
- Progress tracking with backend
- Push notifications
- Background sync
- Share functionality
- Advanced testing features

## License

MIT License - feel free to use and modify as needed. 