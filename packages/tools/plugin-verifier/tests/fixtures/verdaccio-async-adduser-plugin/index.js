module.exports = () => ({
  authenticate(user, password, cb) {
    cb(null, false);
  },
  async adduser() {
    throw new Error('Verification must not invoke registration');
  },
});
