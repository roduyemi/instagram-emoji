const axios = require('axios');
const cron = require('node-cron');
const dataviz = require('./dataviz');

/**
 * This cron job is scheduled to call the emojiCount API
 * every hour, on the hour
 */

  // run();
  function getEmojiCount() {
    // https://f7n9ynzq3g.execute-api.eu-west-1.amazonaws.com/prod
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

  async function run() {
  // cron.schedule('0 * * * *', () => {
    console.log('getting emoji count');
    await getEmojiCount()
    .then(data => {
      dataviz.cartogram(data);
    });
  // });
  }
  
  module.exports = {
    run,
    getEmojiCount
  }
    




