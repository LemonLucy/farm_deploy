const path = require('path');
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // 기존 alias 설정 유지 및 app 폴더 추가
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    app: path.resolve(__dirname, 'app'), // 절대 경로로 설정
  };

  // Webpack 디버깅을 위한 설정
  console.log('Webpack config alias:', config.resolve.alias);

  return config;
};
