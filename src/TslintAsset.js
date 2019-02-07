const fs = require('fs');
const tslint = require('tslint');
const logger = require('@parcel/logger');
const stripJsonComments = require('strip-json-comments');
const TypeScriptAsset = require('parcel-bundler/src/assets/TypeScriptAsset');

let tslintConfig;
let formatter = 'prose';

class TslintAsset extends TypeScriptAsset {

  async postProcess(generated) {
    // `isWarmUp=true` means that Parcel is currently in the "warm up" phase: assets are being processed by the main
    // process first, but will be processed AGAIN by the farm of worker processes a second time once they finish
    // starting. Parcel works this way because, during startup, the main process can often process assets before the
    // worker processes since they take time to start up. In effect: the very first bundle can be completed faster
    // if it's all done on the main thread (vs. waiting on the workers).
    if(this.options.isWarmUp || process.env.DISABLE_PARCEL_TSLINT_PLUGIN) {
      return generated;
    }

    if(!tslintConfig) {

      tslintConfig = tslint.Configuration.findConfiguration(null, this.name);
      if(!tslintConfig.path) {
        // If the 'path' property is undefined it means tslint.json couldn't be found and tslint won't work.
        // Specifically, it will log "No valid rules have been specified for TypeScript files" on every attempt lint
        // a file. Because of this, logic exists below to skip the linting attempt if tslint.json couldn't be found.
        // We will display a one-time, "persistent" warning message in this scenario.
        logger.write('⚠️  Disabling tslint; unable to find tslint.json.', true);
        return generated;
      }

      try {
        // Parse tslint.json to check for custom settings (e.g., "linterOptions.formatter").
        const tsconfigStr = fs.readFileSync(tslintConfig.path, 'utf8');
        const tsconfigObj = JSON.parse(stripJsonComments(tsconfigStr));
        if(tsconfigObj && tsconfigObj.linterOptions && tsconfigObj.linterOptions.formatter) {
          formatter = tsconfigObj.linterOptions.formatter;
        }
      }
      catch(error) {
        logger.write(`⚠️  Failed to parse tslint.json. Error: ${error}`, true);
      }
    }

    if(tslintConfig.path) {
      logger.progress(`tslinting ${this.relativeName}...`);
      const linter = new tslint.Linter({ fix: false, formatter });
      linter.lint(this.relativeName, this.contents, tslintConfig.results);
      const result = linter.getResult();

      // This code (i.e., linting and collecting the results) will normally be run by a worker process. The code that
      // displays the linting results (`../index.js`) is normally run by a separate process, however. Parcel will copy
      // _some_ data between the processes, however, including the `cacheData` property of asset classes.
      if(result.errorCount > 0) {
        this.cacheData.tslintResult = result.output;
      }
      else {
        this.cacheData.tslintResult = null;
      }
    }

    return generated;
  }
}

module.exports = TslintAsset;
