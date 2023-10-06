const isProduction = process.env.NODE_ENV === "production";
const plugins = [
  require('postcss-import'),
  require('postcss-preset-env')({}),
];

module.exports = {
  map: isProduction ? false : { annotation: true, inline: false },
  plugins 
}
