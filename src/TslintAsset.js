const fs = require('fs');
const tslint = require('tslint');
const logger = require('parcel-bundler/src/Logger');
const stripJsonComments = require('strip-json-comments');
const TypeScriptAsset = require('parcel-bundler/src/assets/TypeScriptAsset');

let tslintConfig;
let formatter = 'prose';

class TslintAsset extends TypeScriptAsset {
  async load() {
    let fileContents = await super.load();

    if(!tslintConfig) {

      tslintConfig = tslint.Configuration.findConfiguration(null, this.name);
      if(!tslintConfig.path) {
        // If the 'path' property is undefined it means tslint.json couldn't be found and tslint won't work.
        // Specifically, it will log "No valid rules have been specified for TypeScript files" on every attempt lint
        // a file. Because of this, logic exists below to skip the linting attempt if tslint.json couldn't be found.
        // We will display a one-time, "persistent" warning message in this scenario.
        logger.write('⚠️  Disabling tslint; unable to find tslint.json.', true);
        return fileContents;
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
      const linter = new tslint.Linter({ fix: false, formatter });
      linter.lint(this.relativeName, fileContents, tslintConfig.results);
      logger.write(linter.getResult().output, true);
    }

    return fileContents;
  }
}

module.exports = TslintAsset;
