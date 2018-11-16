module.exports = function(bundler) {
  bundler.addAssetType('ts', require.resolve('./src/TslintAsset.js'));
}
