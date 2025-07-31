# Project Structure

## Root Level
- `App.tsx` - Main application entry point with providers and navigation setup
- `index.js` - React Native app registration
- Configuration files: `package.json`, `tsconfig.json`, `babel.config.js`, `metro.config.js`
- Code quality: `.eslintrc.js`, `.prettierrc.js`

## Source Code (`src/`)

### Components (`src/components/`)
Reusable UI components with barrel exports via `index.ts`:
- `Button.tsx` - Primary button component
- `Card.tsx` - Container component for content sections
- `IconButton.tsx` - Button with icon support

### Navigation (`src/navigation/`)
React Navigation setup and type definitions:
- `AppNavigator.tsx` - Main stack navigator (Welcome → Main → ClassDetail)
- `TabNavigator.tsx` - Bottom tab navigation for main app sections
- `types.ts` - TypeScript navigation parameter definitions

### Screens (`src/screens/`)
Full-screen components for each app section:
- `WelcomeScreen.tsx` - Onboarding/landing screen
- `HomeScreen.tsx` - Main dashboard with greetings, streaks, announcements
- `ClassesScreen.tsx` - Class listing and booking
- `ClassDetailScreen.tsx` - Individual class information
- `DoorScreen.tsx` - Digital door unlock functionality
- `ProgressScreen.tsx` - Workout tracking and statistics
- `ProfileScreen.tsx` - User account management

### Theme (`src/theme/`)
Centralized design system with barrel exports:
- `index.ts` - Main theme object combining all design tokens
- `colors.ts` - Color palette (dark theme with red accents)
- `typography.ts` - Font sizes, weights, and text styles
- `spacing.ts` - Consistent spacing values

## Platform-Specific

### Android (`android/`)
- Gradle build configuration
- Native Android app structure
- Debug keystore and ProGuard rules

### iOS (`ios/`)
- Xcode project and workspace files
- CocoaPods dependency management (`Podfile`, `Podfile.lock`)
- Native iOS app bundle and assets
- Swift app delegate

## Architecture Patterns

### File Organization
- Barrel exports (`index.ts`) for clean imports
- Feature-based grouping (components, screens, navigation)
- Centralized theme system
- TypeScript throughout for type safety

### Naming Conventions
- PascalCase for components and screens
- camelCase for utilities and functions
- Descriptive file names matching component names
- Consistent folder structure across features

### Import Structure
```typescript
// External libraries first
import React from 'react';
import { View } from 'react-native';

// Internal imports
import { theme } from '../theme';
import { Button } from '../components';
```