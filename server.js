const express = require('express');
const app = express();
const port = 3000;
const cartogram = require('./dataviz');
const index = require('./index.js');

app.use(express.static(__dirname));

app.get('/', (request, response) => {
  response.send(cartogram);
});

app.get('/cartogram', (request, response) => {

  console.log('-----getting emoji count-----');

  index.getEmojiCount()
  .then(count => {
    response.send(count);
  })
  .catch((err) => {
    response.status(500).send({ error: err.message });
  });

});

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${port}`);
});