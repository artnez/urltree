[![Build Status](https://travis-ci.org/artnez/urltree.svg?branch=master)](http://travis-ci.org/artnez/urltree)

urltree
=======

Named URL data structure with support for URL building.

Install
-------

```bash
$ npm install urltree
```

Define URLs
-----------

```javascript
var urltree = require('urltree');

var urls = urltree({
  'user': '/user/:id',
  'file.download': '/product/:product/download/:file',
  'repo.commit.ref': '/repo/commit/:ref'
});

urls.user.toString();
'/user/:id'

urls.file.download.toString();
'/product/:product/download/:file'

urls.repo.commit.ref.toString();
'/repo/commit/:ref'
```

Build URLs
----------

```javascript
urls.user.build({id: 123});
'/user/123'

urls.user.build()
// Error: URL build failed. No param id (/user/:id)

urls.file.download.build({product: 'acme', file: 'logo.jpg'});
'/product/acme/download/logo.jpg'

urls.repo.commit.ref.build({ref: 'HEAD^'});
'/repo/commit/HEAD^'

urls.repo.commit.ref.build({ref: 'HEAD^'}, true);
'/repo/commit/HEAD%5E'
```

Express 3
---------

```javascript
var express = require('express');
var urltree = require('urltree');

var urls = urltree({
  'user': '/user/:id'
});

var app = express();

app.get(urls.user, function(req, res) {
  res.send(urls.user.build({id: 123}));
});
```

Express 4
---------

```javascript
// ...

app.route(urls.user).get(function(req, res) {
  res.send(urls.user.build({id: 123}));
});
```

Express + Handlebars
--------------------

```javascript
var express = require('express');
var hbs = require('hbs');
var urltree = require('urltree');

var app = express();

var urls = urltree({
  'user': '/user/:id'
});

var engine = hbs.create();
engine.registerHelper('route', urls.handlebarsHelper);
app.engine('hbs', engine.__express);
app.set('views', '/path/to/views/');

app.use(function(req, res, next) {
  res.locals.urls = urls;
  next();
});

app.get(urls.user, function(req, res) {
  res.render('user');
});
```

```html
{{route urls.user id=123}}
```

License
-------

MIT
