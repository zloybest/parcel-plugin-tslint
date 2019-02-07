const logger = require('@parcel/logger');



module.exports = function(bundler) {
  bundler.addAssetType('ts', require.resolve('./src/TslintAsset.js'));

  bundler.on('bundled', (mainBundle) => {
    const results = getResults(mainBundle.entryAsset.depAssets);
    logger.write(results.join('\n'));
  });
}

function getResults(depAssetsMap) {
  let results = [];
  depAssetsMap.forEach((value, key) => {
    if(value.cacheData.tslintResult) {
      results.push(value.cacheData.tslintResult);
    }
    results = results.concat(getResults(value.depAssets));
  });
  return results;
}
