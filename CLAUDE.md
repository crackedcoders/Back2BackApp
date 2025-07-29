# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm start` or `yarn start` - Start Metro bundler (required before running apps)
- `npm run ios` or `yarn ios` - Run iOS app in simulator
- `npm run android` or `yarn android` - Run Android app in emulator
- `npx react-native run-ios --device "DeviceName"` - Run on specific iOS device
- `npx react-native run-android --deviceId=DEVICE_ID` - Run on specific Android device

### Code Quality
- `npm run lint` or `yarn lint` - Run ESLint to check code quality
- `npm test` or `yarn test` - Run Jest unit tests
- `npm test -- --watch` - Run tests in watch mode
- `npm test -- __tests__/specific-test.tsx` - Run a specific test file

### iOS-specific
- `cd ios && pod install` - Install iOS dependencies (required after adding native dependencies)
- `cd ios && xed .` - Open iOS project in Xcode

### Android-specific
- `cd android && ./gradlew clean` - Clean Android build
- `npx react-native doctor` - Diagnose environment setup issues

## Architecture

This is a React Native application using TypeScript. The codebase follows standard React Native conventions:

- **Entry Point**: `index.js` registers the main App component from `App.tsx`
- **Platform Code**: 
  - `/android/` - Android native code, gradle configuration
  - `/ios/` - iOS native code, CocoaPods configuration
- **JavaScript/TypeScript Code**: Root directory contains all JS/TS code
- **Tests**: `__tests__/` directory contains Jest tests
- **Source Code Structure**:
  - `/src/theme/` - Design system (colors, typography, spacing)
  - `/src/components/` - Reusable UI components
  - `/src/screens/` - Screen components for each navigation route
  - `/src/navigation/` - React Navigation setup with bottom tabs

## Key Configurations

- **TypeScript**: Configured with `@react-native/typescript-config` base
- **Code Style**: 
  - ESLint with `@react-native` preset
  - Prettier with single quotes, trailing commas, arrow parens avoid
- **Metro Bundler**: Default React Native configuration in `metro.config.js`
- **Node Version**: Requires Node.js >= 18

## Development Notes

- Always run `npm start` before launching the app on iOS or Android
- After adding native dependencies, rebuild: iOS requires `pod install`, Android requires rebuild
- The app currently uses React 19.1.0 and React Native 0.80.2