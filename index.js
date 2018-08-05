const axios = require('axios');

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