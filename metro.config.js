 const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Firebase compatibility fixes for Expo SDK 53
config.resolver.sourceExts.push('cjs');
config.resolver.unstable_enablePackageExports = false;

module.exports = config;   