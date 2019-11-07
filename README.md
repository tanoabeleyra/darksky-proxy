# darksky-proxy

> A serverless proxy for Dark Sky API

## Motivation

If you try to use the [Dark Sky API](https://darksky.net/dev) from a web browser you'll get an error, `"No 'Access-Control-Allow-Origin' header is present on the requested resource"`.
That's because Dark Sky don't allow cross-origin requests to avoid clients exposing their API keys.

You can read more about it in the [official FAQ](https://darksky.net/dev/docs/faq#cross-origin).

## Solution

To make requests to the Dark Sky API from a web browser (client) we can use a proxy (server). The client makes requests to the proxy (which allows CORS) and the proxy resends these requests to the Dark Sky API, adding the API key to the request.
When the API answers the request made by the proxy, the proxy resends the API response to the client.

**This proxy can be hosted for free using [Netlify Functions](https://www.netlify.com/docs/functions/) with one click on the following button.**

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/tanoabeleyra/darksky-proxy)

## Caching

To increase performance and prevent unnecessary duplicate calls to the Dark Sky APIs, the proxy allows caching with a timeout. When the timeout (in seconds) is reached for a particular lat/lon, updated data will be retrieved from Dark Sky.

To enable this feature, specify a CACHE_TIMEOUT > 0 seconds.
