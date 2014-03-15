urltree
=======

Named URL data structure with support for URL building.

Install
-------

```bash
$ npm install urltree
```

Example
-------

```javascript
var urltree = require('urltree');

var urls = urltree({
  'user': '/user/:id',
  'file.download': '/product/:product/download/:file'
});

urls.user.toString()
'/user/:id'

urls.file.download.toString()
'/product/:product/download/:file'

urls.file.download.build({product: 123, file: 'specs.pdf'})
'/product/123/download/specs.pdf'
```

Express
-------

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

Express + Handlebars
--------------------

```javascript
var express = require('express');
var hbs = require('hbs');
var urltree = require('urltree');

// Setup express.
var app = express();

// Create URLs. Usually best to place this in another module.
var urls = urltree({
  'user': '/user/:id'
});

// Setup handlebars. If you're not using `hbs`, the important part is just
// registering the helper like below.
var engine = hbs.create();
engine.registerHelper('route', urls.handlebarsHelper);
app.engine('hbs', engine.__express);
app.set('views', '/path/to/views/');

// Send URLs to `res.locals` so they're accesible in templates.
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
