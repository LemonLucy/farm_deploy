const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// EXPO_ROUTER_APP_ROOT 하드코딩
process.env.EXPO_ROUTER_APP_ROOT = './app';

config.resolver.assetExts.push('cjs');

config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

module.exports = config;
