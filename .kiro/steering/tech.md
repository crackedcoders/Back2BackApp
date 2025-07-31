# Technology Stack

## Framework & Runtime
- **React Native 0.80.2** - Cross-platform mobile development
- **React 19.1.0** - UI library
- **TypeScript 5.0.4** - Type safety and development experience
- **Node.js >=18** - Runtime requirement

## Navigation & UI
- **React Navigation v7** - Stack and bottom tab navigation
- **react-native-gesture-handler** - Touch gesture handling
- **react-native-safe-area-context** - Safe area management
- **react-native-screens** - Native screen optimization
- **react-native-vector-icons** - Icon library (Feather, MaterialCommunityIcons)
- **react-native-svg** - SVG support

## Development Tools
- **ESLint** - Code linting with @react-native config
- **Prettier** - Code formatting (single quotes, trailing commas, arrow parens avoid)
- **Jest** - Testing framework
- **Metro** - JavaScript bundler
- **Babel** - JavaScript transpilation

## Build System
- **Android**: Gradle-based build system
- **iOS**: Xcode with CocoaPods dependency management

## Common Commands

### Development
```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS (requires CocoaPods setup)
bundle install          # First time only
bundle exec pod install  # Install/update iOS dependencies
npm run ios
```

### Code Quality
```bash
# Lint code
npm run lint

# Run tests
npm test
```

### iOS Setup
```bash
# Install Ruby dependencies (first time)
bundle install

# Install/update CocoaPods dependencies
cd ios && bundle exec pod install && cd ..
```

## Architecture Notes
- Uses TypeScript with React Native's default config
- Follows React Navigation v7 patterns for navigation
- Implements custom theme system with centralized colors, typography, and spacing
- Component-based architecture with barrel exports