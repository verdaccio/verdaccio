var Server = require('./lib/server')

module.exports = function() {
  var server = new Server('http://localhost:55551/')

  describe('adduser', function() {
    var user = String(Math.random())
    var pass = String(Math.random())
    before(function () {
      return server.auth(user, pass)
               .status(201)
               .body_ok(/user .* created/)
    })

    it('creating new user', function(){})

    it('should log in', function () {
      return server.auth(user, pass)
               .status(201)
               .body_ok(/you are authenticated as/)
    })

    it('should not register more users', function () {
      return server.auth(String(Math.random()), String(Math.random()))
               .status(409)
               .body_error(/maximum amount of users reached/)
    })
  })
}
