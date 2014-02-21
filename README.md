urltree
=======

Named URL data structure with support for URL building

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
var urltree = require('urltree');

var urls = urltree({
  'user': '/user/:id'
});

app.get(urls.user, function(req, res) {
  res.send(urls.user.build({id: 123}));
});
```

License
-------

MIT
