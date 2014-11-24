var util = require('util');

var extend = util._extend;
var format = util.format;
var inherits = util.inherits;
var parser = require('url');

var RE_MATCH_PARAM = new RegExp(':[a-z0-9_]+', 'gi');

function getRouteParam(route, params, name) {
  name = name.slice(1); // drop leading ":"
  var value = params[name];
  if (value === undefined) {
    throw new Error(format('URL build failed. No param %s (%s)', name, route));
  }
  delete params[name];
  return value;
}

function addToQueryString(url, params) {
  if (!params) return url;

  var keys = Object.keys(params);
  if (!keys.length) return url;

  var obj = parser.parse(url, true);
  obj.query = obj.query || {};
  extend(obj.query, params);

  // Force use of .query property when formatting. See:
  // http://nodejs.org/api/url.html#url_url_format_urlobj
  delete obj.search;

  return parser.format(obj);
}

function Node(name, parent) {
  this.$name = name = name || '';
  this.$parent = parent;
  this.$path = parent && parent.$name ? parent.$path + '.' + name : name;
  this.$nodes = {};
  this.$route = '';
  String.call(this);
}

inherits(Node, String);

Node.prototype.toString = function() {
  return this.$route;
};

Node.prototype.valueOf = function() {
  return this.toString();
};

Node.prototype.$get = function(name) {
  return this.$nodes[name];
};

Node.prototype.$set = function(node) {
  var name = node.$name;
  if (this[name] !== undefined && this[name] instanceof Node) {
    throw new Error('Node name ' + name + ' already in use');
  }

  this.$nodes[name] = node;
  Object.defineProperty(this, name, {
    get: this.$get.bind(this, name)
  });
  return node;
};

Node.prototype.build = function(params, encode) {
  var sub = getRouteParam.bind(null, this.$route, params || {});
  var url = this.$route.replace(RE_MATCH_PARAM, sub);
  url = addToQueryString(url, params);
  return encode ? encodeURI(url) : url;
};

Node.prototype.handlebars = function(engine) {
  engine.registerHelper('route', function(url, options) {
    return url.build((options || {}).hash || {}, true);
  });
};

module.exports = function(mapping) {
  var root = new Node();
  Object.getOwnPropertyNames(mapping).forEach(function(path) {
    var node = root;
    path.split('.').forEach(function(name) {
      node = node.$get(name) || node.$set(new Node(name, node));
    });
    node.$route = mapping[path];
  });
  return root;
};
