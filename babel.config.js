module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // plugins: ['react-native-reanimated/plugin'], // add extras under presets if you need them
  };
};
