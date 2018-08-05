const axios = require('axios');
const cron = require('node-cron');

/**
 * This cron job is scheduled to call the emojiCount API
 * every hour, on the hour
 */
cron.schedule('0 * * * *', () => {
  console.log('getting emoji count');
  getEmojiCount();
});

getEmojiCount = () => {
  // https://f7n9ynzq3g.execute-api.eu-west-1.amazonaws.com/prod
  const url = 'https://f7n9ynzq3g.execute-api.eu-west-1.amazonaws.com/prod';

  axios.get(url)
  .then(response =>  {
    const data = response.data.body;
    Object.keys(data).forEach(key => {
      console.log('key : ' + key + ', value: ' + JSON.stringify(data[key]));
    });
  })
  .catch(error => {
    console.log(error);
  });
}

