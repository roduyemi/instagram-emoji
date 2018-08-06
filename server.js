const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const cartogram = require('./dataviz');
const index = require('./index.js');

app.use(express.static(__dirname));

app.get('/', (request, response) => {
  // index.getEmojiCount()
  // .then((count) => {
  //   console.log('count ', count);
  //   response.send(count);
    response.send(cartogram);
    // response.sendFile(path.join(__dirname, './index.html'));
  // });
});

// app.get('/', (request, response) => {
//   response.send(dataviz);
// });

app.get('/cartogram', (request, response) => {

  console.log('------calling cartogram------');

  index.getEmojiCount()
  .then(count => {
    response.send(count);
  });
  // response.send([breakingStoriesRes, breakingNews])
  // .catch((err) => {
  //   response.status(500).send({ error: err.message });
  // });

});

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${port}`);
});