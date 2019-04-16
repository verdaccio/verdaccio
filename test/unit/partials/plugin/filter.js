class FilterPlugin {
  constructor(config) {
    this._config = config;
  }

  filter_metadata(pkg) {
    return new Promise((resolve) => {
        // We use this to test what happens when a filter rejects
        if(pkg.name === 'trigger-filter-failure') {
          reject(new Error('Example filter failure'));
          return;
        }
        // Example filter that removes a single blocked package
        if (this._config.pkg === pkg.name) {
          // In reality, we also want to remove references in attachments and dist-tags, etc. This is just a POC
          delete pkg.versions[this._config.version];
        }
        resolve(pkg);
      }
    );
  }
}

exports.default = FilterPlugin;
