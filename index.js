var format = require('util').format;
var inherits = require('util').inherits;

var RE_MATCH_PARAM = new RegExp(':[a-z0-9_]+', 'gi');

function Node(name, parent) {
  this.name = name = name || '';
  this.parent = parent;
  this.path = parent && parent.name ? parent.path + '.' + name : name;
  this.nodes = {};
  String.call(this);
}

inherits(Node, String);

Node.prototype.toString = function() {
  return this.route;
};

Node.prototype.get = function(name) {
  return this.nodes[name];
};

Node.prototype.set = function(node) {
  this.nodes[node.name] = node;
  Object.defineProperty(this, node.name, {
    get: this.get.bind(this, node.name)
  });
  return node;
};

Node.prototype.build = function(params) {
  params = params || {};
  var route = this.route;
  return route.replace(RE_MATCH_PARAM, function(name) {
    name = name.slice(1);
    if (params[name] === undefined) {
      throw new Error(format('URL build failed. No param %s (%s)', name, route));
    }
    return params[name];
  });
};

module.exports = function(mapping) {
  var root = new Node();
  Object.getOwnPropertyNames(mapping).forEach(function(path) {
    var node = root;
    path.split('.').forEach(function(name) {
      node = node.get(name) || node.set(new Node(name, node));
    });
    node.route = mapping[path];
  });
  return root;
};
