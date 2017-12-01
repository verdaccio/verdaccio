/**
 * Storage mock
 */

const store = {};

const storage = {
  setItem: (key, value) => {
    store[key] = value;
    return store;
  },
  getItem: key => {
    return store[key];
  }
};

export default storage;
