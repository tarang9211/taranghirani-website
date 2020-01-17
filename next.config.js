const withCSS = require('@zeit/next-css');
const withImages = require('next-images');
const path = require('path');

module.exports = withCSS(
  withImages({
    exclude: path.resolve(__dirname, 'assets/svgs'),
    webpack: (config, options) => {
      config.module.rules.push({
        test: /\.md/,
        use: 'raw-loader'
      })
      return config;
    }
  })
);