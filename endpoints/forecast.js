const request = require("request-promise");

const { API_KEY } = process.env;
const API_URL = `https://api.darksky.net/forecast/${API_KEY}`;

const cache = {};

let { CORS_WHITELIST } = process.env;
if (CORS_WHITELIST) {
  CORS_WHITELIST = CORS_WHITELIST.replace(/ /g, "").split(",");
}

let { CACHE_TIMEOUT } = process.env;
if (!CACHE_TIMEOUT) {
  CACHE_TIMEOUT = 0;
} else {
  CACHE_TIMEOUT = parseInt(CACHE_TIMEOUT, 10);
}

const getResponseHeaders = request => {
  const headers = {
    "content-type": "application/json"
  };
  const { origin } = request.headers;
  if (origin && (!CORS_WHITELIST || CORS_WHITELIST.includes(origin))) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
};

exports.handler = (event, context, callback) => {
  const qs = event.queryStringParameters;
  const { lat, lon } = qs;
  if (!lat || !lon) {
    callback("You must provide a latitude and longitude");
    return;
  }

  const now = Math.round(new Date().getTime() / 1000);

  if (CACHE_TIMEOUT > 0) {
    // see if we already have in the cache and the cache is < 1 hour old
    const cachedItem = cache[`${lat},${lon}`];
    if (!!cachedItem && now - cachedItem.time < CACHE_TIMEOUT) {
      // console.log(`returning cached weather data for ${lat},${lon}`);
      callback(null, {
        body: JSON.stringify(cachedItem.response),
        statusCode: 200,
        headers: getResponseHeaders(event)
      });
      return;
    }
  }
  // console.log(`fetching latest weather data for ${lat},${lon}`);

  const url = `${API_URL}/${lat},${lon}`;
  // Remove lat and lon parameters, they go in the URL
  delete qs.lat;
  delete qs.lon;

  const options = {
    qs,
    json: true
  };
  request(url, options)
    .then(response => {
      // cache response
      cache[`${lat},${lon}`] = {
        time: now,
        response: response
      };

      callback(null, {
        body: JSON.stringify(response),
        statusCode: 200,
        headers: getResponseHeaders(event)
      });
    })
    .catch(error => {
      callback(error);
    });
};
