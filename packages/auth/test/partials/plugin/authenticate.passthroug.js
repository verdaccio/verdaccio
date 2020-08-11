
module.exports = function ( ) {
  return {
    authenticate( user, pass, callback ) {
      /* user and pass are used here to forward errors
      and success types respectively for testing purposes */
      callback(user, pass);
    }
  };
};
