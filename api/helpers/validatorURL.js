const fetch = require('node-fetch');

module.exports = async function isRedirectURLExists(url) {
    const data = await fetch(url);
    const body = data[Reflect.ownKeys(data)[3]];
  
    if(body.status === 404) return false;
  
    return true;
}