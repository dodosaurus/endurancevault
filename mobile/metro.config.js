const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add this to reduce file watching
config.watchFolders = [];
config.resolver.platforms = ['ios', 'android', 'web'];

module.exports = config;