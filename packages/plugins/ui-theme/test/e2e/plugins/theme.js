const path = require('path');

module.exports = () => {
  console.log('loading local theme');
  return path.join(__dirname, '../../../', 'static');
};
