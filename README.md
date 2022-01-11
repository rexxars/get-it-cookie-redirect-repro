# get-it redirect cookie behavior

1. `git clone ...`
1. `npm install`
1. `npm start`
1. Observe node.js do HTTP requests with correct behavior (no cookie on redirect)
1. Open http://localhost:3000 in browser
1. Click "Set/check cookie" (server sets cookie for browser)
1. Click individual buttons
1. Observe expected behavior
  - Browser treats same host, different ports as "same site" and includes cookie
  - Browser treats different host as "not same site", does not include cookie
  - Manually specifying `cookie` in request headers object is not allowed by XHR
