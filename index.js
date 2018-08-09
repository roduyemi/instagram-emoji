const axios = require('axios');
const cron = require('node-cron');

function getEmojiCount() {
  const url = 'https://f7n9ynzq3g.execute-api.eu-west-1.amazonaws.com/prod';
  const data = axios.get(url)
  .then(response =>  {
    const data = response.data.body;
    // console.log(response.data.body);
    return data;
  })
  .catch(error => {
    console.log(error);
  });
  return new Promise((resolve, reject) => {
    data ? resolve(data) : reject('no data');
  });
}

module.exports = {
  getEmojiCount
}
    




