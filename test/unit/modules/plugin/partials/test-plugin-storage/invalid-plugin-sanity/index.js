function ValidVerdaccioPlugin() {
  return {
    // not valid method
    // eslint-disable-next-line  @typescript-eslint/no-empty-function
    authenticate__: function(){}
  }
}

module.exports = ValidVerdaccioPlugin;
