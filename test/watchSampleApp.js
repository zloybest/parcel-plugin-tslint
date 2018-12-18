const Path = require('path');
const Bundler = require('parcel-bundler');

const registerTslintPluginWith = require('../index');

let bundler = new Bundler(
  Path.join(__dirname, 'sample_app/index.html'),
  {
    outDir: Path.join(__dirname, 'sample_app/dist'),
    watch: true,
    hmr: false,

    // Disable caching, per Parcel's recommendations when developing plugins:
    // https://github.com/parcel-bundler/parcel/wiki/Contributing
    cache: false
  }
);

registerTslintPluginWith(bundler);

bundler.serve();
