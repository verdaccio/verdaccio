const namespace = Object.create(null);

exports.addItem = function(name, value) {
  namespace[name] = value;
}

exports.getItem = function(name) {
  console.log("get-item", name, namespace);
  if (!(name in namespace)) {
    throw new Error("The item ".concat(name, " does exist in the namespace"));
  }

  return namespace[name];
}
